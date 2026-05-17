-- Run against an existing Reserve database (Neon/Postgres) after initial schema.
-- Adds meal categories, per-meal add-ons, apartment galleries, and multi-item meal orders.

ALTER TABLE reserve_listings ADD COLUMN IF NOT EXISTS meal_category TEXT;
ALTER TABLE reserve_listings ADD COLUMN IF NOT EXISTS meal_package TEXT;
ALTER TABLE reserve_listings ADD COLUMN IF NOT EXISTS gallery_urls TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
ALTER TABLE reserve_listings ADD COLUMN IF NOT EXISTS meal_addons JSONB NOT NULL DEFAULT '[]'::jsonb;

ALTER TABLE reserve_listings DROP CONSTRAINT IF EXISTS reserve_listings_status_check;
ALTER TABLE reserve_listings
ADD CONSTRAINT reserve_listings_status_check
CHECK (status IN ('available', 'limited', 'booked', 'unavailable'));

ALTER TABLE reserve_bookings ADD COLUMN IF NOT EXISTS meal_order_payload JSONB;
