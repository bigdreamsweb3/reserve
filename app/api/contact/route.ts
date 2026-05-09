import { NextResponse } from "next/server";

import { getSql, hasDatabaseUrl } from "@/lib/db";
import { contactSchema } from "@/lib/validators";

export async function POST(request: Request) {
  if (!hasDatabaseUrl()) {
    return NextResponse.json(
      {
        message: "DATABASE_URL is missing. Add your Neon connection string before using contact forms.",
      },
      { status: 503 },
    );
  }

  const json = await request.json();
  const parsed = contactSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Please complete the contact form correctly." },
      { status: 400 },
    );
  }

  const sql = getSql();
  const contact = parsed.data;

  await sql`
    INSERT INTO contact_messages (
      full_name,
      email,
      subject,
      message
    ) VALUES (
      ${contact.fullName},
      ${contact.email},
      ${contact.subject},
      ${contact.message}
    )
  `;

  return NextResponse.json({ ok: true });
}
