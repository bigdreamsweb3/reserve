import { NextResponse } from "next/server";

import { getSql, hasDatabaseUrl } from "@/lib/db";
import { newsletterSchema } from "@/lib/validators";

export async function POST(request: Request) {
  if (!hasDatabaseUrl()) {
    return NextResponse.json(
      {
        message: "DATABASE_URL is missing. Add your Neon connection string before enabling the guest list.",
      },
      { status: 503 },
    );
  }

  const json = await request.json();
  const parsed = newsletterSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  const sql = getSql();

  await sql`
    INSERT INTO newsletter_subscribers (email)
    VALUES (${parsed.data.email})
    ON CONFLICT (email) DO NOTHING
  `;

  return NextResponse.json({ ok: true });
}
