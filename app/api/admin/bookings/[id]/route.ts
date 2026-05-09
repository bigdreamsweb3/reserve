import { NextResponse } from "next/server";

import { isAdminAuthorized } from "@/lib/admin";
import { getSql, hasDatabaseUrl } from "@/lib/db";
import { bookingStatusSchema } from "@/lib/validators";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  if (!(await isAdminAuthorized(request))) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  if (!hasDatabaseUrl()) {
    return NextResponse.json(
      { message: "DATABASE_URL is missing. Connect Neon before managing bookings." },
      { status: 503 },
    );
  }

  const json = await request.json();
  const parsed = bookingStatusSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ message: "Please provide a valid booking status." }, { status: 400 });
  }

  const { id } = await context.params;
  const sql = getSql();

  await sql`
    UPDATE reserve_bookings
    SET status = ${parsed.data.status}
    WHERE id = ${id}
  `;

  return NextResponse.json({ ok: true });
}
