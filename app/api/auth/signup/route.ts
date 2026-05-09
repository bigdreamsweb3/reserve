import { hash } from "bcryptjs";
import { NextResponse } from "next/server";

import { createSession, getUserByEmail } from "@/lib/auth";
import { getSql, hasDatabaseUrl } from "@/lib/db";
import { signUpSchema } from "@/lib/validators";

export async function POST(request: Request) {
  if (!hasDatabaseUrl()) {
    return NextResponse.json(
      { message: "DATABASE_URL is missing. Connect Neon before creating accounts." },
      { status: 503 },
    );
  }

  const json = await request.json();
  const parsed = signUpSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ message: "Please provide valid sign up details." }, { status: 400 });
  }

  const existingUser = await getUserByEmail(parsed.data.email);

  if (existingUser) {
    return NextResponse.json({ message: "An account already exists with that email." }, { status: 409 });
  }

  const sql = getSql();
  const passwordHash = await hash(parsed.data.password, 10);

  const rows = await sql`
    INSERT INTO users (
      full_name,
      email,
      password_hash,
      role,
      updated_at
    ) VALUES (
      ${parsed.data.fullName},
      ${parsed.data.email},
      ${passwordHash},
      'user',
      NOW()
    )
    RETURNING id, full_name, email, role
  `;

  const user = rows[0];

  await createSession({
    id: String(user.id),
    email: String(user.email),
    fullName: String(user.full_name),
    role: user.role as "user" | "admin",
  });

  return NextResponse.json({ ok: true });
}
