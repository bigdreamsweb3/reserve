CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reservation_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  guest_count INTEGER NOT NULL CHECK (guest_count > 0),
  reservation_date TIMESTAMPTZ NOT NULL,
  occasion TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reserve_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('apartment', 'meal')),
  location TEXT NOT NULL,
  short_description TEXT NOT NULL,
  description TEXT NOT NULL,
  price_ngn INTEGER NOT NULL CHECK (price_ngn >= 0),
  billing_period TEXT NOT NULL,
  capacity INTEGER NOT NULL CHECK (capacity > 0),
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'limited', 'booked', 'unavailable')),
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  image_tone TEXT NOT NULL DEFAULT 'dish-tone-night',
  image_url TEXT,
  amenities TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  meal_category TEXT,
  meal_package TEXT,
  gallery_urls TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  meal_addons JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reserve_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  listing_id UUID NOT NULL REFERENCES reserve_listings(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  guests INTEGER NOT NULL CHECK (guests > 0),
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  notes TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  meal_order_payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DELETE FROM reserve_bookings
WHERE listing_id IN (
  SELECT id FROM reserve_listings WHERE type NOT IN ('apartment', 'meal')
);

DELETE FROM reserve_listings
WHERE type NOT IN ('apartment', 'meal');

ALTER TABLE reserve_listings DROP CONSTRAINT IF EXISTS reserve_listings_type_check;

ALTER TABLE reserve_listings
ADD CONSTRAINT reserve_listings_type_check
CHECK (type IN ('apartment', 'meal'));
