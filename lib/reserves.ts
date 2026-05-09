import { getSql, hasDatabaseUrl } from "@/lib/db";

export type ReserveType = "apartment" | "meal";

export type ReserveListing = {
  id: string;
  slug: string;
  title: string;
  type: ReserveType;
  location: string;
  shortDescription: string;
  description: string;
  priceNgn: number;
  billingPeriod: string;
  capacity: number;
  status: "available" | "limited" | "booked" | "unavailable";
  featured: boolean;
  imageTone: string;
  imageUrl: string | null;
  amenities: string[];
};

export type ReserveBooking = {
  id: string;
  listingId: string;
  fullName: string;
  email: string;
  phone: string;
  guests: number;
  startDate: string;
  endDate: string | null;
  notes: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  createdAt: string;
  listingTitle: string;
  listingType: ReserveType;
};

export const sampleListings: ReserveListing[] = [
  {
    id: "sample-apartment-skyline",
    slug: "skyline-one-bedroom",
    title: "Skyline One Bedroom",
    type: "apartment",
    location: "Awka Book Foundation, Anambra State, Nigeria",
    shortDescription: "Serviced one-bedroom apartment with warm interiors and guest support.",
    description:
      "Designed for longer stays and premium comfort, this apartment gives guests a calm residential feel within the Reserve building.",
    priceNgn: 280000,
    billingPeriod: "night",
    capacity: 3,
    status: "available",
    featured: true,
    imageTone: "dish-tone-herb",
    imageUrl: null,
    amenities: ["Full kitchen", "Housekeeping", "24/7 power", "Parking"],
  },
  {
    id: "sample-apartment-courtyard",
    slug: "courtyard-two-bedroom",
    title: "Courtyard Two Bedroom",
    type: "apartment",
    location: "Awka Book Foundation, Anambra State, Nigeria",
    shortDescription: "A larger serviced apartment for families, groups, and extended stays.",
    description:
      "A spacious two-bedroom apartment inside Reserve with lounge space, privacy, and hospitality support close to the restaurant.",
    priceNgn: 420000,
    billingPeriod: "night",
    capacity: 5,
    status: "available",
    featured: true,
    imageTone: "dish-tone-smoke",
    imageUrl: null,
    amenities: ["Two bedrooms", "Dining area", "Fast Wi-Fi", "Laundry access"],
  },
  {
    id: "sample-meal-fried-rice",
    slug: "reserve-fried-rice",
    title: "Reserve Fried Rice",
    type: "meal",
    location: "Reserve Restaurant",
    shortDescription: "Fresh fried rice prepared for individual orders, dine-in service, or restaurant pickup.",
    description:
      "A full fried rice plate from the Reserve kitchen, suitable for lunch, dinner, and quick food orders placed directly from the menu.",
    priceNgn: 12000,
    billingPeriod: "plate",
    capacity: 1,
    status: "available",
    featured: true,
    imageTone: "dish-tone-fire",
    imageUrl: null,
    amenities: ["Chicken option", "Plantain add-on", "Restaurant pickup", "Freshly prepared"],
  },
  {
    id: "sample-meal-indomie",
    slug: "reserve-special-indomie",
    title: "Reserve Special Indomie",
    type: "meal",
    location: "Reserve Restaurant",
    shortDescription: "Signature noodles prepared with protein options and house seasoning.",
    description:
      "Reserve Special Indomie is made for fast, satisfying meal orders with richer flavor, protein add-ons, and a restaurant-style finish.",
    priceNgn: 9000,
    billingPeriod: "bowl",
    capacity: 1,
    status: "available",
    featured: false,
    imageTone: "dish-tone-citrus",
    imageUrl: null,
    amenities: ["Egg option", "Chicken option", "Quick prep", "Pickup available"],
  },
  {
    id: "sample-meal-egusi",
    slug: "reserve-egusi-soup",
    title: "Reserve Egusi Soup",
    type: "meal",
    location: "Reserve Restaurant",
    shortDescription: "Classic egusi soup served hot with well-prepared sides.",
    description:
      "A rich egusi soup from the Reserve kitchen, prepared for guests who want a proper Nigerian meal with carefully balanced flavor and texture.",
    priceNgn: 15000,
    billingPeriod: "bowl",
    capacity: 1,
    status: "available",
    featured: false,
    imageTone: "dish-tone-board",
    imageUrl: null,
    amenities: ["Swallow options", "Protein add-on", "Freshly made", "Restaurant service"],
  },
  {
    id: "sample-meal-coke",
    slug: "reserve-coke",
    title: "Coke",
    type: "meal",
    location: "Reserve Restaurant",
    shortDescription: "Cold bottled drink available with food orders or on its own.",
    description:
      "A chilled Coke from the Reserve restaurant menu, available as a standalone drink or alongside any meal order.",
    priceNgn: 1500,
    billingPeriod: "bottle",
    capacity: 1,
    status: "available",
    featured: false,
    imageTone: "dish-tone-night",
    imageUrl: null,
    amenities: ["Cold serve", "Pairs with meals", "Pickup available", "Dine-in ready"],
  },
];

export function formatNaira(value: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);
}

function mapListing(row: Record<string, unknown>): ReserveListing {
  return {
    id: String(row.id),
    slug: String(row.slug),
    title: String(row.title),
    type: row.type as ReserveType,
    location: String(row.location),
    shortDescription: String(row.short_description),
    description: String(row.description),
    priceNgn: Number(row.price_ngn),
    billingPeriod: String(row.billing_period),
    capacity: Number(row.capacity),
    status: row.status as ReserveListing["status"],
    featured: Boolean(row.featured),
    imageTone: String(row.image_tone),
    imageUrl: row.image_url ? String(row.image_url) : null,
    amenities: Array.isArray(row.amenities) ? (row.amenities as string[]) : [],
  };
}

function mapBooking(row: Record<string, unknown>): ReserveBooking {
  return {
    id: String(row.id),
    listingId: String(row.listing_id),
    fullName: String(row.full_name),
    email: String(row.email),
    phone: String(row.phone),
    guests: Number(row.guests),
    startDate: String(row.start_date),
    endDate: row.end_date ? String(row.end_date) : null,
    notes: String(row.notes ?? ""),
    status: row.status as ReserveBooking["status"],
    createdAt: String(row.created_at),
    listingTitle: String(row.listing_title),
    listingType: row.listing_type as ReserveType,
  };
}

function isMissingRelationError(error: unknown) {
  return (
    error instanceof Error &&
    (error.message.includes('relation "reserve_listings" does not exist') ||
      error.message.includes('relation "reserve_bookings" does not exist'))
  );
}

function isSupportedType(value: unknown): value is ReserveType {
  return value === "apartment" || value === "meal";
}

export async function listReserveListings() {
  if (!hasDatabaseUrl()) {
    return sampleListings;
  }

  try {
    const sql = getSql();
    const rows = await sql`
      SELECT
        id,
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
        amenities
      FROM reserve_listings
      WHERE type IN ('apartment', 'meal')
      ORDER BY featured DESC, created_at DESC
    `;

    return rows.filter((row) => isSupportedType(row.type)).map((row) => mapListing(row));
  } catch (error) {
    if (isMissingRelationError(error)) {
      return sampleListings;
    }

    throw error;
  }
}

export async function getReserveListingBySlug(slug: string) {
  if (!hasDatabaseUrl()) {
    return sampleListings.find((listing) => listing.slug === slug) ?? null;
  }

  try {
    const sql = getSql();
    const rows = await sql`
      SELECT
        id,
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
        amenities
      FROM reserve_listings
      WHERE slug = ${slug}
        AND type IN ('apartment', 'meal')
      LIMIT 1
    `;

    return rows[0] ? mapListing(rows[0]) : null;
  } catch (error) {
    if (isMissingRelationError(error)) {
      return sampleListings.find((listing) => listing.slug === slug) ?? null;
    }

    throw error;
  }
}

export async function getReserveListingById(id: string) {
  if (!hasDatabaseUrl()) {
    return sampleListings.find((listing) => listing.id === id) ?? null;
  }

  try {
    const sql = getSql();
    const rows = await sql`
      SELECT
        id,
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
        amenities
      FROM reserve_listings
      WHERE id = ${id}
        AND type IN ('apartment', 'meal')
      LIMIT 1
    `;

    return rows[0] ? mapListing(rows[0]) : null;
  } catch (error) {
    if (isMissingRelationError(error)) {
      return sampleListings.find((listing) => listing.id === id) ?? null;
    }

    throw error;
  }
}

export async function listReserveBookings() {
  if (!hasDatabaseUrl()) {
    return [] as ReserveBooking[];
  }

  try {
    const sql = getSql();
    const rows = await sql`
      SELECT
        reserve_bookings.id,
        reserve_bookings.listing_id,
        reserve_bookings.full_name,
        reserve_bookings.email,
        reserve_bookings.phone,
        reserve_bookings.guests,
        reserve_bookings.start_date,
        reserve_bookings.end_date,
        reserve_bookings.notes,
        reserve_bookings.status,
        reserve_bookings.created_at,
        reserve_listings.title AS listing_title,
        reserve_listings.type AS listing_type
      FROM reserve_bookings
      JOIN reserve_listings ON reserve_listings.id = reserve_bookings.listing_id
      WHERE reserve_listings.type IN ('apartment', 'meal')
      ORDER BY reserve_bookings.created_at DESC
    `;

    return rows.filter((row) => isSupportedType(row.listing_type)).map((row) => mapBooking(row));
  } catch (error) {
    if (isMissingRelationError(error)) {
      return [] as ReserveBooking[];
    }

    throw error;
  }
}

export async function listReserveBookingsForUser(userId: string) {
  if (!hasDatabaseUrl()) {
    return [] as ReserveBooking[];
  }

  try {
    const sql = getSql();
    const rows = await sql`
      SELECT
        reserve_bookings.id,
        reserve_bookings.listing_id,
        reserve_bookings.full_name,
        reserve_bookings.email,
        reserve_bookings.phone,
        reserve_bookings.guests,
        reserve_bookings.start_date,
        reserve_bookings.end_date,
        reserve_bookings.notes,
        reserve_bookings.status,
        reserve_bookings.created_at,
        reserve_listings.title AS listing_title,
        reserve_listings.type AS listing_type
      FROM reserve_bookings
      JOIN reserve_listings ON reserve_listings.id = reserve_bookings.listing_id
      WHERE reserve_bookings.user_id = ${userId}
        AND reserve_listings.type IN ('apartment', 'meal')
      ORDER BY reserve_bookings.created_at DESC
    `;

    return rows.filter((row) => isSupportedType(row.listing_type)).map((row) => mapBooking(row));
  } catch (error) {
    if (isMissingRelationError(error)) {
      return [] as ReserveBooking[];
    }

    throw error;
  }
}
