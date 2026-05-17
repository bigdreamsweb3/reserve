-- Reserve meal package seed.
-- Run this after db/schema.sql or db/migration_reserve_enhancements.sql.

ALTER TABLE reserve_listings ADD COLUMN IF NOT EXISTS meal_package TEXT;

UPDATE reserve_listings
SET meal_package = NULL,
    meal_category = 'other',
    status = 'unavailable',
    updated_at = NOW()
WHERE slug IN ('reserve-fried-rice', 'reserve-special-indomie', 'reserve-egusi-soup', 'reserve-coke')
  AND type = 'meal';

DO $$
DECLARE
  protein_addons JSONB := '[
    {"label":"Beef","priceNgn":0},
    {"label":"Chicken","priceNgn":0},
    {"label":"Turkey","priceNgn":0},
    {"label":"Snails","priceNgn":0},
    {"label":"Shrimp","priceNgn":0},
    {"label":"Liver","priceNgn":0},
    {"label":"Old Layer Chicken","priceNgn":0},
    {"label":"Catfish","priceNgn":0},
    {"label":"Titus Fish","priceNgn":0},
    {"label":"Crocker Fish","priceNgn":0},
    {"label":"Ice Fish","priceNgn":0},
    {"label":"Cow Tail","priceNgn":0}
  ]'::jsonb;
  row_data RECORD;
BEGIN
  FOR row_data IN
    SELECT * FROM (VALUES
      ('flexi', 'Flexi Meals', 3000, 'White Rice and Stew', 'rice-dishes', 'plate', 'Flexi meal package with 1 meat.'),
      ('flexi', 'Flexi Meals', 3000, 'White Rice and Ofe Akwu', 'rice-dishes', 'plate', 'Flexi meal package with 1 meat.'),
      ('flexi', 'Flexi Meals', 3000, 'Jellof Rice', 'rice-dishes', 'plate', 'Flexi meal package with 1 meat.'),
      ('flexi', 'Flexi Meals', 3000, 'Fried Rice', 'rice-dishes', 'plate', 'Flexi meal package with 1 meat.'),
      ('flexi', 'Flexi Meals', 3000, 'Bitterleaf Soup', 'soups-stews', 'bowl', 'Flexi meal package with 1 meat.'),
      ('flexi', 'Flexi Meals', 3000, 'Egusi Soup', 'soups-stews', 'bowl', 'Flexi meal package with 1 meat.'),
      ('flexi', 'Flexi Meals', 3000, 'Oha Soup', 'soups-stews', 'bowl', 'Flexi meal package with 1 meat.'),
      ('flexi', 'Flexi Meals', 3000, 'Okro Soup', 'soups-stews', 'bowl', 'Flexi meal package with 1 meat.'),
      ('flexi', 'Flexi Meals', 3000, 'Afang Soup', 'soups-stews', 'bowl', 'Flexi meal package with 1 meat.'),
      ('flexi', 'Flexi Meals', 3000, 'Yam and Egg Sauce', 'sides-swallow', 'plate', 'Flexi meal package with 1 meat.'),
      ('flexi', 'Flexi Meals', 3000, 'Peppered Ripe Plaintain', 'sides-swallow', 'plate', 'Flexi meal package with 1 meat.'),
      ('flexi', 'Flexi Meals', 3000, 'Porridge Plantain', 'sides-swallow', 'plate', 'Flexi meal package with 1 meat.'),
      ('flexi', 'Flexi Meals', 3000, 'Porridge Yam', 'sides-swallow', 'plate', 'Flexi meal package with 1 meat.'),
      ('flexi', 'Flexi Meals', 3000, 'Porridge Beans', 'sides-swallow', 'plate', 'Flexi meal package with 1 meat.'),

      ('standard', 'Standard Meals', 5000, 'White Rice and Stew', 'rice-dishes', 'plate', 'Normal plate of food with 2 big meats.'),
      ('standard', 'Standard Meals', 5000, 'White Rice and Ofe Akwu', 'rice-dishes', 'plate', 'Normal plate of food with 2 big meats.'),
      ('standard', 'Standard Meals', 5000, 'White Rice/Bean and Ofada Stew', 'rice-dishes', 'plate', 'Normal plate of food with 2 big meats.'),
      ('standard', 'Standard Meals', 5000, 'Jellof Rice', 'rice-dishes', 'plate', 'Normal plate of food with 2 big meats.'),
      ('standard', 'Standard Meals', 5000, 'Fried Rice', 'rice-dishes', 'plate', 'Normal plate of food with 2 big meats.'),
      ('standard', 'Standard Meals', 5000, 'Bitterleaf Soup', 'soups-stews', 'bowl', 'Normal plate of food with 2 big meats.'),
      ('standard', 'Standard Meals', 5000, 'Egusi Soup', 'soups-stews', 'bowl', 'Normal plate of food with 2 big meats.'),
      ('standard', 'Standard Meals', 5000, 'Oha Soup', 'soups-stews', 'bowl', 'Normal plate of food with 2 big meats.'),
      ('standard', 'Standard Meals', 5000, 'Okro Soup', 'soups-stews', 'bowl', 'Normal plate of food with 2 big meats.'),
      ('standard', 'Standard Meals', 5000, 'Afang Soup', 'soups-stews', 'bowl', 'Normal plate of food with 2 big meats.'),
      ('standard', 'Standard Meals', 5000, 'Yam and Egg Sauce', 'sides-swallow', 'plate', 'Normal plate of food with 2 big meats.'),
      ('standard', 'Standard Meals', 5000, 'Peppered Ripe Plaintain', 'sides-swallow', 'plate', 'Normal plate of food with 2 big meats.'),
      ('standard', 'Standard Meals', 5000, 'Porridge Plantain', 'sides-swallow', 'plate', 'Normal plate of food with 2 big meats.'),
      ('standard', 'Standard Meals', 5000, 'Porridge Yam', 'sides-swallow', 'plate', 'Normal plate of food with 2 big meats.'),
      ('standard', 'Standard Meals', 5000, 'Porridge Beans', 'sides-swallow', 'plate', 'Normal plate of food with 2 big meats.'),

      ('executive', 'Executive Meals', 0, 'White Rice and Stew', 'rice-dishes', 'plate', 'Executive meal package. Price to be confirmed by Reserve.'),
      ('executive', 'Executive Meals', 0, 'White Rice and Ofe Akwu', 'rice-dishes', 'plate', 'Executive meal package. Price to be confirmed by Reserve.'),
      ('executive', 'Executive Meals', 0, 'White Rice/Beans and Ofe Akwu', 'rice-dishes', 'plate', 'Executive meal package. Price to be confirmed by Reserve.'),
      ('executive', 'Executive Meals', 0, 'Jellof Rice', 'rice-dishes', 'plate', 'Executive meal package. Price to be confirmed by Reserve.'),
      ('executive', 'Executive Meals', 0, 'Fried Rice', 'rice-dishes', 'plate', 'Executive meal package. Price to be confirmed by Reserve.'),
      ('executive', 'Executive Meals', 0, 'Native Jellof Rice', 'rice-dishes', 'plate', 'Executive meal package. Price to be confirmed by Reserve.'),
      ('executive', 'Executive Meals', 0, 'Bitterleaf Soup', 'soups-stews', 'bowl', 'Executive meal package. Price to be confirmed by Reserve.'),
      ('executive', 'Executive Meals', 0, 'Egusi Soup', 'soups-stews', 'bowl', 'Executive meal package. Price to be confirmed by Reserve.'),
      ('executive', 'Executive Meals', 0, 'Oha Soup', 'soups-stews', 'bowl', 'Executive meal package. Price to be confirmed by Reserve.'),
      ('executive', 'Executive Meals', 0, 'Okro Soup', 'soups-stews', 'bowl', 'Executive meal package. Price to be confirmed by Reserve.'),
      ('executive', 'Executive Meals', 0, 'Afang Soup', 'soups-stews', 'bowl', 'Executive meal package. Price to be confirmed by Reserve.'),
      ('executive', 'Executive Meals', 0, 'Yam and Egg Sauce', 'sides-swallow', 'plate', 'Executive meal package. Price to be confirmed by Reserve.'),
      ('executive', 'Executive Meals', 0, 'Peppered Ripe Plaintain', 'sides-swallow', 'plate', 'Executive meal package. Price to be confirmed by Reserve.'),
      ('executive', 'Executive Meals', 0, 'Porridge Plantain', 'sides-swallow', 'plate', 'Executive meal package. Price to be confirmed by Reserve.'),
      ('executive', 'Executive Meals', 0, 'Porridge Yam', 'sides-swallow', 'plate', 'Executive meal package. Price to be confirmed by Reserve.')
    ) AS meal_rows(meal_package, package_label, price_ngn, title, meal_category, billing_period, package_note)
  LOOP
    INSERT INTO reserve_listings (
      slug, title, type, location, short_description, description, price_ngn,
      billing_period, capacity, status, featured, image_tone, image_url, amenities,
      meal_category, meal_package, gallery_urls, meal_addons, updated_at
    )
    VALUES (
      regexp_replace(lower(row_data.meal_package || '-meal-' || row_data.title), '[^a-z0-9]+', '-', 'g'),
      row_data.package_label || ' - ' || row_data.title,
      'meal',
      'Reserve Restaurant, Awka Book Foundation, Anambra State, Nigeria',
      row_data.title || ' under the ' || row_data.package_label || ' package.',
      row_data.title || ' prepared by Reserve as part of the ' || row_data.package_label || '. ' || row_data.package_note,
      row_data.price_ngn,
      row_data.billing_period,
      1,
      'available',
      row_data.meal_package IN ('standard', 'executive') AND row_data.title IN ('Fried Rice', 'Egusi Soup'),
      CASE
        WHEN row_data.meal_category = 'rice-dishes' THEN 'dish-tone-fire'
        WHEN row_data.meal_category = 'soups-stews' THEN 'dish-tone-board'
        ELSE 'dish-tone-herb'
      END,
      NULL,
      ARRAY[row_data.package_label, row_data.package_note, 'Protein options available', 'Freshly prepared'],
      row_data.meal_category,
      row_data.meal_package,
      ARRAY[]::TEXT[],
      protein_addons,
      NOW()
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
      meal_category = EXCLUDED.meal_category,
      meal_package = EXCLUDED.meal_package,
      gallery_urls = EXCLUDED.gallery_urls,
      meal_addons = EXCLUDED.meal_addons,
      updated_at = NOW();
  END LOOP;

  FOR row_data IN
    SELECT * FROM (VALUES
      ('Water'),
      ('Tiger Nut'),
      ('Zobo'),
      ('Fresh Fruit drinks'),
      ('Chivita Exotic'),
      ('Chivita Active'),
      ('Hollandia Yogurt'),
      ('Vicsmatic'),
      ('Farouz'),
      ('Fanta'),
      ('Coke'),
      ('Malt')
    ) AS drink_rows(title)
  LOOP
    INSERT INTO reserve_listings (
      slug, title, type, location, short_description, description, price_ngn,
      billing_period, capacity, status, featured, image_tone, image_url, amenities,
      meal_category, meal_package, gallery_urls, meal_addons, updated_at
    )
    VALUES (
      regexp_replace(lower('drink-' || row_data.title), '[^a-z0-9]+', '-', 'g'),
      row_data.title,
      'meal',
      'Reserve Restaurant, Awka Book Foundation, Anambra State, Nigeria',
      row_data.title || ' from the Reserve drinks menu.',
      row_data.title || ' is available from the drinks menu listed by Reserve.',
      0,
      'drink',
      1,
      'available',
      row_data.title IN ('Tiger Nut', 'Zobo', 'Fresh Fruit drinks'),
      'dish-tone-citrus',
      NULL,
      ARRAY['Drink', 'Available with meals', 'Reserve drinks menu'],
      'drinks',
      NULL,
      ARRAY[]::TEXT[],
      '[]'::jsonb,
      NOW()
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
      meal_category = EXCLUDED.meal_category,
      meal_package = EXCLUDED.meal_package,
      gallery_urls = EXCLUDED.gallery_urls,
      meal_addons = EXCLUDED.meal_addons,
      updated_at = NOW();
  END LOOP;
END $$;
