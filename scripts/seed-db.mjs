import { hash } from "bcryptjs";
import { Pool } from "@neondatabase/serverless";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("DATABASE_URL is missing.");
  process.exit(1);
}

const listings = [
  {
    slug: "skyline-one-bedroom",
    title: "Skyline One Bedroom",
    type: "apartment",
    location: "Awka Book Foundation, Anambra State, Nigeria",
    shortDescription: "Serviced apartment with warm interiors, kitchen access, and private living space.",
    description:
      "Designed for longer stays and premium comfort, this apartment gives guests a calmer residential feel within the Reserve building.",
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
    slug: "courtyard-two-bedroom",
    title: "Courtyard Two Bedroom",
    type: "apartment",
    location: "Awka Book Foundation, Anambra State, Nigeria",
    shortDescription: "Spacious serviced apartment with extra room for families and longer stays.",
    description:
      "A two-bedroom Reserve apartment with added space, lounge comfort, and direct access to the wider hospitality service in the building.",
    priceNgn: 420000,
    billingPeriod: "night",
    capacity: 5,
    status: "available",
    featured: true,
    imageTone: "dish-tone-smoke",
    imageUrl: null,
    amenities: ["Two bedrooms", "Dining area", "Laundry access", "Fast Wi-Fi"],
  },
  {
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

const pool = new Pool({ connectionString: databaseUrl });

try {
  await pool.query(`
    DELETE FROM reserve_bookings
    WHERE listing_id IN (
      SELECT id FROM reserve_listings WHERE type NOT IN ('apartment', 'meal')
    )
  `);

  await pool.query(`
    DELETE FROM reserve_listings
    WHERE type NOT IN ('apartment', 'meal')
  `);

  for (const listing of listings) {
    await pool.query(
      `
      INSERT INTO reserve_listings (
        slug, title, type, location, short_description, description, price_ngn,
        billing_period, capacity, status, featured, image_tone, image_url, amenities, updated_at
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,$7,
        $8,$9,$10,$11,$12,$13,$14,NOW()
      )
      ON CONFLICT (slug) DO UPDATE SET
        title = EXCLUDED.title,
        type = EXCLUDED.type,
        location = EXCLUDED.location,
        short_description = EXCLUDED.short_description,
        description = EXCLUDED.description,
        price_ngn = EXCLUDED.price_ngn,
        billing_period = EXCLUDED.billing_period,
        capacity = EXCLUDED.capacity,
        status = EXCLUDED.status,
        featured = EXCLUDED.featured,
        image_tone = EXCLUDED.image_tone,
        image_url = EXCLUDED.image_url,
        amenities = EXCLUDED.amenities,
        updated_at = NOW()
      `,
      [
        listing.slug,
        listing.title,
        listing.type,
        listing.location,
        listing.shortDescription,
        listing.description,
        listing.priceNgn,
        listing.billingPeriod,
        listing.capacity,
        listing.status,
        listing.featured,
        listing.imageTone,
        listing.imageUrl,
        listing.amenities,
      ],
    );
  }

  if (process.env.ADMIN_BOOTSTRAP_EMAIL && process.env.ADMIN_BOOTSTRAP_PASSWORD) {
    const passwordHash = await hash(process.env.ADMIN_BOOTSTRAP_PASSWORD, 10);

    await pool.query(
      `
      INSERT INTO users (full_name, email, password_hash, role, updated_at)
      VALUES ($1, $2, $3, 'admin', NOW())
      ON CONFLICT (email) DO UPDATE SET
        password_hash = EXCLUDED.password_hash,
        role = 'admin',
        updated_at = NOW()
      `,
      ["Reserve Admin", process.env.ADMIN_BOOTSTRAP_EMAIL, passwordHash],
    );
  }

  console.log("Database seeded successfully.");
} finally {
  await pool.end();
}
