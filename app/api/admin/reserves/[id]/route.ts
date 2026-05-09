import { NextResponse } from "next/server";

import { isAdminAuthorized } from "@/lib/admin";
import { getSql, hasDatabaseUrl } from "@/lib/db";
import { reserveListingSchema } from "@/lib/validators";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  if (!(await isAdminAuthorized(request))) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  if (!hasDatabaseUrl()) {
    return NextResponse.json(
      { message: "DATABASE_URL is missing. Connect Neon before using admin inventory management." },
      { status: 503 },
    );
  }

  const { id } = await context.params;
  const json = await request.json();
  const parsed = reserveListingSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ message: "Please provide valid reserve listing details." }, { status: 400 });
  }

  const listing = parsed.data;
  const normalizedStatus =
    listing.type === "meal" && listing.status !== "unavailable" ? "available" : listing.status;
  const sql = getSql();

  await sql`
    UPDATE reserve_listings
    SET
      slug = ${listing.slug},
      title = ${listing.title},
      type = ${listing.type},
      location = ${listing.location},
      short_description = ${listing.shortDescription},
      description = ${listing.description},
      price_ngn = ${listing.priceNgn},
      billing_period = ${listing.billingPeriod},
      capacity = ${listing.capacity},
      status = ${normalizedStatus},
      featured = ${listing.featured},
      image_tone = ${listing.imageTone},
      image_url = ${listing.imageUrl},
      amenities = ${listing.amenities},
      updated_at = NOW()
    WHERE id = ${id}
  `;

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  if (!(await isAdminAuthorized(request))) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  if (!hasDatabaseUrl()) {
    return NextResponse.json(
      { message: "DATABASE_URL is missing. Connect Neon before using admin inventory management." },
      { status: 503 },
    );
  }

  const { id } = await context.params;
  const sql = getSql();

  await sql`
    DELETE FROM reserve_listings
    WHERE id = ${id}
  `;

  return NextResponse.json({ ok: true });
}
