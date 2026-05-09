import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

import { getSql, hasDatabaseUrl } from "@/lib/db";

const SESSION_COOKIE = "reserve_session";

export type SessionUser = {
  id: string;
  email: string;
  fullName: string;
  role: "user" | "admin";
};

function getSecret() {
  const secret = process.env.AUTH_SECRET;

  if (!secret) {
    throw new Error("AUTH_SECRET is not configured.");
  }

  return new TextEncoder().encode(secret);
}

export async function createSession(user: SessionUser) {
  const token = await new SignJWT(user)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, getSecret());

    return {
      id: String(payload.id),
      email: String(payload.email),
      fullName: String(payload.fullName),
      role: payload.role as SessionUser["role"],
    };
  } catch {
    return null;
  }
}

export async function getUserByEmail(email: string) {
  if (!hasDatabaseUrl()) {
    return null;
  }

  const sql = getSql();
  const rows = await sql`
    SELECT id, full_name, email, password_hash, role
    FROM users
    WHERE email = ${email}
    LIMIT 1
  `;

  return rows[0] ?? null;
}

export async function getUserById(id: string) {
  if (!hasDatabaseUrl()) {
    return null;
  }

  const sql = getSql();
  const rows = await sql`
    SELECT id, full_name, email, role
    FROM users
    WHERE id = ${id}
    LIMIT 1
  `;

  return rows[0] ?? null;
}
