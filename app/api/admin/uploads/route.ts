import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

import { isAdminAuthorized } from "@/lib/admin";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!(await isAdminAuthorized(request))) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ message: "No file uploaded." }, { status: 400 });
  }

  try {
    const blob = await put(`reserve-listings/${Date.now()}-${file.name}`, file, {
      access: "public",
    });

    return NextResponse.json({ url: blob.url });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to upload image." },
      { status: 500 },
    );
  }
}
