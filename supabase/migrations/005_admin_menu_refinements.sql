-- Admin/menu refinements for daily operations.

ALTER TABLE orders ADD COLUMN IF NOT EXISTS status_reason TEXT;

ALTER TABLE restaurant_settings
  ADD COLUMN IF NOT EXISTS special_closed_dates JSONB NOT NULL DEFAULT '[]'::jsonb;

-- Merge menu categories.
UPDATE menu_items
SET category_id = 'c1000001-0000-0000-0000-000000000003'
WHERE category_id = 'c1000001-0000-0000-0000-000000000005';

UPDATE menu_items
SET category_id = 'c1000001-0000-0000-0000-000000000008'
WHERE category_id = 'c1000001-0000-0000-0000-00000000000c';

UPDATE categories
SET name = 'Appetizer/Salad', slug = 'appetizer-salad', description = 'Starters, soups, and salads to enjoy before or with your meal.'
WHERE id = 'c1000001-0000-0000-0000-000000000003';

UPDATE categories
SET name = 'Moriawase/Tray', slug = 'moriawase-tray', description = 'Chef-selected assortments and shareable trays for groups.'
WHERE id = 'c1000001-0000-0000-0000-000000000008';

UPDATE categories
SET name = 'Drinks/Extra', slug = 'drinks-extra'
WHERE slug IN ('dessert', 'drinks', 'drink', 'extra', 'extras');

DELETE FROM categories
WHERE id IN (
  'c1000001-0000-0000-0000-000000000005',
  'c1000001-0000-0000-0000-00000000000c'
);
