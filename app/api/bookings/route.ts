import { NextResponse } from "next/server";

import { getSessionUser } from "@/lib/auth";
import { getSql, hasDatabaseUrl } from "@/lib/db";
import { getReserveListingById } from "@/lib/reserves";
import { reserveBookingSchema } from "@/lib/validators";

export async function POST(request: Request) {
  if (!hasDatabaseUrl()) {
    return NextResponse.json(
      { message: "DATABASE_URL is missing. Add your Neon connection string before using live bookings." },
      { status: 503 },
    );
  }

  const json = await request.json();
  const parsed = reserveBookingSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ message: "Please provide valid booking details." }, { status: 400 });
  }

  const booking = parsed.data;
  const listing = await getReserveListingById(booking.listingId);

  if (!listing) {
    return NextResponse.json({ message: "Selected reserve could not be found." }, { status: 404 });
  }

  if (listing.status === "unavailable") {
    return NextResponse.json(
      { message: `${listing.title} is currently unavailable.` },
      { status: 409 },
    );
  }

  const sql = getSql();
  const sessionUser = await getSessionUser();

  await sql`
    INSERT INTO reserve_bookings (
      user_id,
      listing_id,
      full_name,
      email,
      phone,
      guests,
      start_date,
      end_date,
      notes
    ) VALUES (
      ${sessionUser?.id ?? null},
      ${booking.listingId},
      ${booking.fullName},
      ${booking.email},
      ${booking.phone},
      ${booking.guests},
      ${booking.startDate},
      ${booking.endDate},
      ${booking.notes}
    )
  `;

  return NextResponse.json({ ok: true, message: `Booking request sent for ${listing.title}.` });
}
