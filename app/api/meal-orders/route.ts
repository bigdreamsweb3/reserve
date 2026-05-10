import { NextResponse } from "next/server";

import { getSessionUser } from "@/lib/auth";
import { getSql, hasDatabaseUrl } from "@/lib/db";
import { formatNaira, getReserveListingById, type MealOrderLinePayload, type MealOrderPayload } from "@/lib/reserves";
import { buildWhatsAppUrl, getPublicOrderWhatsAppDigits } from "@/lib/whatsapp";
import { mealOrderRequestSchema } from "@/lib/validators";

function addonsMatchListing(
  selections: { label: string; priceNgn: number }[],
  allowed: { label: string; priceNgn: number }[],
) {
  if (selections.length === 0) {
    return true;
  }

  if (allowed.length === 0) {
    return false;
  }

  return selections.every((selection) =>
    allowed.some((addon) => addon.label === selection.label && addon.priceNgn === selection.priceNgn),
  );
}

export async function POST(request: Request) {
  if (!hasDatabaseUrl()) {
    return NextResponse.json(
      { message: "DATABASE_URL is missing. Add your Neon connection string before placing orders." },
      { status: 503 },
    );
  }

  const json = await request.json();
  const parsed = mealOrderRequestSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ message: "Please provide a valid meal order." }, { status: 400 });
  }

  const order = parsed.data;
  const lines: MealOrderLinePayload[] = [];
  let subtotalNgn = 0;

  for (const item of order.items) {
    const listing = await getReserveListingById(item.listingId);

    if (!listing || listing.type !== "meal") {
      return NextResponse.json({ message: "One or more menu items are no longer available." }, { status: 400 });
    }

    if (listing.status === "unavailable") {
      return NextResponse.json(
        { message: `${listing.title} is currently unavailable. Remove it from your cart and try again.` },
        { status: 409 },
      );
    }

    const addonSelections = item.addonSelections ?? [];
    if (!addonsMatchListing(addonSelections, listing.mealAddons)) {
      return NextResponse.json(
        { message: `Add-ons for ${listing.title} are invalid or out of date. Refresh the menu and try again.` },
        { status: 400 },
      );
    }

    const addonsTotal = addonSelections.reduce((sum, addon) => sum + addon.priceNgn, 0);
    const lineTotalNgn = (listing.priceNgn + addonsTotal) * item.quantity;
    subtotalNgn += lineTotalNgn;

    lines.push({
      listingId: listing.id,
      title: listing.title,
      slug: listing.slug,
      quantity: item.quantity,
      unitPriceNgn: listing.priceNgn,
      addons: addonSelections,
      lineTotalNgn,
    });
  }

  const payload: MealOrderPayload = { items: lines, subtotalNgn };
  const primaryListingId = lines[0]?.listingId;

  if (!primaryListingId) {
    return NextResponse.json({ message: "Your cart is empty." }, { status: 400 });
  }

  const totalPlates = lines.reduce((sum, line) => sum + line.quantity, 0);
  const sql = getSql();
  const sessionUser = await getSessionUser();

  try {
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
      notes,
      meal_order_payload
    ) VALUES (
      ${sessionUser?.id ?? null},
      ${primaryListingId},
      ${order.fullName},
      ${order.email},
      ${order.phone},
      ${totalPlates},
      ${order.startDate},
      ${order.endDate},
      ${order.notes},
      ${JSON.stringify(payload)}
    )
  `;
  } catch (error) {
    const code = typeof error === "object" && error !== null && "code" in error ? String((error as { code: unknown }).code) : "";
    if (code === "42703") {
      return NextResponse.json(
        {
          message:
            "Database is not ready for meal carts yet. Ask the admin to run db/migration_reserve_enhancements.sql.",
        },
        { status: 503 },
      );
    }
    throw error;
  }

  const waDigits = getPublicOrderWhatsAppDigits();
  let whatsappUrl: string | null = null;

  if (waDigits) {
    const linesText = lines
      .map(
        (line) =>
          `• ${line.quantity}× ${line.title}${line.addons.length ? ` (+ ${line.addons.map((a) => a.label).join(", ")})` : ""} — ${formatNaira(line.lineTotalNgn)}`,
      )
      .join("\n");

    const message = [
      "*Reserve — new meal order*",
      "",
      `Customer: ${order.fullName}`,
      `Phone: ${order.phone}`,
      `Email: ${order.email}`,
      `Requested for: ${new Date(order.startDate).toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short" })}`,
      "",
      linesText,
      "",
      `Subtotal: ${formatNaira(subtotalNgn)}`,
      order.notes ? `\nNotes: ${order.notes}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    whatsappUrl = buildWhatsAppUrl(waDigits, message);
  }

  return NextResponse.json({
    ok: true,
    message: "Your meal order was received. Reserve will confirm shortly.",
    whatsappUrl,
  });
}
