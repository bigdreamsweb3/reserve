import { compare } from "bcryptjs";
import { NextResponse } from "next/server";

import { createSession, getUserByEmail } from "@/lib/auth";
import { loginSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const json = await request.json();
  const parsed = loginSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ message: "Please provide valid login details." }, { status: 400 });
  }

  const user = await getUserByEmail(parsed.data.email);

  if (!user) {
    return NextResponse.json({ message: "No account found with that email." }, { status: 404 });
  }

  const passwordMatches = await compare(parsed.data.password, String(user.password_hash));

  if (!passwordMatches) {
    return NextResponse.json({ message: "Incorrect password." }, { status: 401 });
  }

  await createSession({
    id: String(user.id),
    email: String(user.email),
    fullName: String(user.full_name),
    role: user.role as "user" | "admin",
  });

  return NextResponse.json({ ok: true, role: user.role });
}
