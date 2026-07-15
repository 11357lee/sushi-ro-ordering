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

DO $$
DECLARE
  main_section_id UUID := '11111111-1111-1111-1111-111111111101';
  drinks_extra_id UUID;
BEGIN
  SELECT id INTO drinks_extra_id
  FROM categories
  WHERE section_id = main_section_id AND slug = 'drinks-extra'
  LIMIT 1;

  IF drinks_extra_id IS NULL THEN
    SELECT id INTO drinks_extra_id
    FROM categories
    WHERE section_id = main_section_id AND slug IN ('dessert', 'drinks', 'drink', 'extra', 'extras')
    ORDER BY sort_order
    LIMIT 1;

    IF drinks_extra_id IS NOT NULL THEN
      UPDATE categories
      SET name = 'Drinks/Extra', slug = 'drinks-extra'
      WHERE id = drinks_extra_id;
    END IF;
  END IF;

  IF drinks_extra_id IS NOT NULL THEN
    UPDATE menu_items
    SET category_id = drinks_extra_id
    WHERE category_id IN (
      SELECT id
      FROM categories
      WHERE section_id = main_section_id
        AND slug IN ('dessert', 'drinks', 'drink', 'extra', 'extras')
        AND id <> drinks_extra_id
    );

    DELETE FROM categories
    WHERE section_id = main_section_id
      AND slug IN ('dessert', 'drinks', 'drink', 'extra', 'extras')
      AND id <> drinks_extra_id;
  END IF;
END $$;

DELETE FROM categories
WHERE id IN (
  'c1000001-0000-0000-0000-000000000005',
  'c1000001-0000-0000-0000-00000000000c'
);
