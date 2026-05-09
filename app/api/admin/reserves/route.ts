import { NextResponse } from "next/server";

import { isAdminAuthorized } from "@/lib/admin";
import { getSql, hasDatabaseUrl } from "@/lib/db";
import { listReserveListings } from "@/lib/reserves";
import { reserveListingSchema } from "@/lib/validators";

export async function GET(request: Request) {
  if (!(await isAdminAuthorized(request))) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const listings = await listReserveListings();
  return NextResponse.json({ listings });
}

export async function POST(request: Request) {
  if (!(await isAdminAuthorized(request))) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  if (!hasDatabaseUrl()) {
    return NextResponse.json(
      { message: "DATABASE_URL is missing. Connect Neon before using admin inventory management." },
      { status: 503 },
    );
  }

  const json = await request.json();
  const parsed = reserveListingSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ message: "Please provide valid reserve listing details." }, { status: 400 });
  }

  const listing = parsed.data;
  const normalizedStatus =
    listing.type === "meal" && listing.status !== "unavailable" ? "available" : listing.status;
  const sql = getSql();

  const rows = await sql`
    INSERT INTO reserve_listings (
      slug,
      title,
      type,
      location,
      short_description,
      description,
      price_ngn,
      billing_period,
      capacity,
      status,
      featured,
      image_tone,
      image_url,
      amenities,
      updated_at
    ) VALUES (
      ${listing.slug},
      ${listing.title},
      ${listing.type},
      ${listing.location},
      ${listing.shortDescription},
      ${listing.description},
      ${listing.priceNgn},
      ${listing.billingPeriod},
      ${listing.capacity},
      ${normalizedStatus},
      ${listing.featured},
      ${listing.imageTone},
      ${listing.imageUrl},
      ${listing.amenities},
      NOW()
    )
    RETURNING id
  `;

  return NextResponse.json({ ok: true, id: rows[0]?.id });
}
