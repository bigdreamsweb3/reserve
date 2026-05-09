import { NextResponse } from "next/server";

import { getSql, hasDatabaseUrl } from "@/lib/db";
import { reservationSchema } from "@/lib/validators";

export async function POST(request: Request) {
  if (!hasDatabaseUrl()) {
    return NextResponse.json(
      {
        message: "DATABASE_URL is missing. Add your Neon connection string before using reservations.",
      },
      { status: 503 },
    );
  }

  const json = await request.json();
  const parsed = reservationSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Please provide valid reservation details." },
      { status: 400 },
    );
  }

  const sql = getSql();
  const reservation = parsed.data;

  await sql`
    INSERT INTO reservation_requests (
      guest_name,
      email,
      phone,
      guest_count,
      reservation_date,
      occasion,
      notes
    ) VALUES (
      ${reservation.guestName},
      ${reservation.email},
      ${reservation.phone},
      ${reservation.guestCount},
      ${reservation.reservationDate},
      ${reservation.occasion},
      ${reservation.notes}
    )
  `;

  return NextResponse.json({ ok: true });
}
