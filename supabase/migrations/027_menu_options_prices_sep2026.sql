-- Menu updates: sweet roll one flavour, veggie bento sides, Amaebi,
-- miso spicy +$1, Inari vegetarian, sashimi price bumps. Safe to re-run.

-- 1) Japanese sweet roll: choose one flavour (not 2 with quantity)
UPDATE menu_items
SET description = '2 pcs — Choose one flavour (Chocolate, Milk, or Strawberry)'
WHERE id = CAST('a1000001-0000-0000-0000-00000000005d' AS uuid);

-- 2) Veggie bento: 4 side choices
INSERT INTO menu_options (id, name, price_modifier, sort_order) VALUES
  (CAST('33333333-3333-3333-3333-333333333605' AS uuid), 'Maki (6 cucumber-avocado)', 0, 34),
  (CAST('33333333-3333-3333-3333-333333333606' AS uuid), 'Vegetable Tempura', 0, 35)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price_modifier = EXCLUDED.price_modifier,
  sort_order = EXCLUDED.sort_order;

UPDATE menu_items
SET description = 'Rice, grilled veggie, orange, agedashi tofu. Choose one side: Maki (6 cucumber-avocado), Vegetable Tempura, Vegetable gyoza, or vegetable spring roll'
WHERE id = CAST('a1000001-0000-0000-0000-000000000025' AS uuid);

DELETE FROM menu_item_options
WHERE menu_item_id = CAST('a1000001-0000-0000-0000-000000000025' AS uuid);

INSERT INTO menu_item_options (menu_item_id, menu_option_id) VALUES
  (CAST('a1000001-0000-0000-0000-000000000025' AS uuid), CAST('33333333-3333-3333-3333-333333333605' AS uuid)),
  (CAST('a1000001-0000-0000-0000-000000000025' AS uuid), CAST('33333333-3333-3333-3333-333333333606' AS uuid)),
  (CAST('a1000001-0000-0000-0000-000000000025' AS uuid), CAST('33333333-3333-3333-3333-333333333603' AS uuid)),
  (CAST('a1000001-0000-0000-0000-000000000025' AS uuid), CAST('33333333-3333-3333-3333-333333333604' AS uuid))
ON CONFLICT DO NOTHING;

-- 3) Amaebi: $6 nigiri / $8 sashimi (+$2)
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order) VALUES
  (CAST('a1000001-0000-0000-0000-000000000062' AS uuid), CAST('c1000001-0000-0000-0000-000000000001' AS uuid), 'AMAEBI', 'Sweet Shrimp', 6, true, false, 2)
ON CONFLICT (id) DO UPDATE SET
  category_id = EXCLUDED.category_id,
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  is_available = EXCLUDED.is_available,
  has_roll_options = EXCLUDED.has_roll_options,
  sort_order = EXCLUDED.sort_order;

UPDATE menu_items SET sort_order = 3 WHERE id = CAST('a1000001-0000-0000-0000-000000000018' AS uuid);
UPDATE menu_items SET sort_order = 4 WHERE id = CAST('a1000001-0000-0000-0000-000000000019' AS uuid);
UPDATE menu_items SET sort_order = 5 WHERE id = CAST('a1000001-0000-0000-0000-00000000001a' AS uuid);
UPDATE menu_items SET sort_order = 6 WHERE id = CAST('a1000001-0000-0000-0000-000000000002' AS uuid);
UPDATE menu_items SET sort_order = 7 WHERE id = CAST('a1000001-0000-0000-0000-00000000001b' AS uuid);
UPDATE menu_items SET sort_order = 8 WHERE id = CAST('a1000001-0000-0000-0000-00000000001c' AS uuid);
UPDATE menu_items SET sort_order = 9 WHERE id = CAST('a1000001-0000-0000-0000-00000000001d' AS uuid);
UPDATE menu_items SET sort_order = 10 WHERE id = CAST('a1000001-0000-0000-0000-00000000001e' AS uuid);
UPDATE menu_items SET sort_order = 11 WHERE id = CAST('a1000001-0000-0000-0000-00000000001f' AS uuid);
UPDATE menu_items SET sort_order = 12 WHERE id = CAST('a1000001-0000-0000-0000-000000000003' AS uuid);
UPDATE menu_items SET sort_order = 13 WHERE id = CAST('a1000001-0000-0000-0000-000000000020' AS uuid);
UPDATE menu_items SET sort_order = 14 WHERE id = CAST('a1000001-0000-0000-0000-000000000021' AS uuid);
UPDATE menu_items SET sort_order = 15 WHERE id = CAST('a1000001-0000-0000-0000-000000000022' AS uuid);
UPDATE menu_items SET sort_order = 16 WHERE id = CAST('a1000001-0000-0000-0000-000000000023' AS uuid);
UPDATE menu_items SET sort_order = 17 WHERE id = CAST('a1000001-0000-0000-0000-000000000024' AS uuid);

INSERT INTO menu_item_options (menu_item_id, menu_option_id) VALUES
  (CAST('a1000001-0000-0000-0000-000000000062' AS uuid), CAST('33333333-3333-3333-3333-333333333401' AS uuid)),
  (CAST('a1000001-0000-0000-0000-000000000062' AS uuid), CAST('33333333-3333-3333-3333-333333333402' AS uuid))
ON CONFLICT DO NOTHING;

INSERT INTO menu_item_labels (menu_item_id, label_id)
SELECT CAST('a1000001-0000-0000-0000-000000000062' AS uuid), l.id
FROM labels l WHERE l.slug = 'raw'
ON CONFLICT DO NOTHING;

-- 4) Miso soup spicy +$1 (keep edamame spicy at +$1.50)
INSERT INTO menu_options (id, name, price_modifier, sort_order) VALUES
  (CAST('33333333-3333-3333-3333-333333333304' AS uuid), 'Spicy', 1, 4)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price_modifier = EXCLUDED.price_modifier,
  sort_order = EXCLUDED.sort_order;

DELETE FROM menu_item_options
WHERE menu_item_id = CAST('a1000001-0000-0000-0000-00000000000b' AS uuid)
  AND menu_option_id = CAST('33333333-3333-3333-3333-333333333303' AS uuid);

INSERT INTO menu_item_options (menu_item_id, menu_option_id) VALUES
  (CAST('a1000001-0000-0000-0000-00000000000b' AS uuid), CAST('33333333-3333-3333-3333-333333333304' AS uuid))
ON CONFLICT DO NOTHING;

UPDATE menu_items
SET description = 'Seaweed, tofu and green onion. Spicy available +$1'
WHERE id = CAST('a1000001-0000-0000-0000-00000000000b' AS uuid);

-- 5) Inari vegetarian label
INSERT INTO menu_item_labels (menu_item_id, label_id)
SELECT CAST('a1000001-0000-0000-0000-00000000002f' AS uuid), l.id
FROM labels l WHERE l.slug = 'vegetarian'
ON CONFLICT DO NOTHING;

-- 6) Sashimi price bumps
-- Albacore sashimi $11 (+$3.50): move from shared +$3 to +$3.50 option
DELETE FROM menu_item_options
WHERE menu_item_id = CAST('a1000001-0000-0000-0000-00000000001e' AS uuid)
  AND menu_option_id = CAST('33333333-3333-3333-3333-333333333405' AS uuid);

INSERT INTO menu_item_options (menu_item_id, menu_option_id) VALUES
  (CAST('a1000001-0000-0000-0000-00000000001e' AS uuid), CAST('33333333-3333-3333-3333-333333333407' AS uuid))
ON CONFLICT DO NOTHING;

-- Hotate / Maguro / Hamachi sashimi $11.50 (+$4)
INSERT INTO menu_options (id, name, price_modifier, sort_order) VALUES
  (CAST('33333333-3333-3333-3333-333333333428' AS uuid), '3 pcs Sashimi', 4, 11)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price_modifier = EXCLUDED.price_modifier,
  sort_order = EXCLUDED.sort_order;

DELETE FROM menu_item_options
WHERE menu_item_id IN (
  CAST('a1000001-0000-0000-0000-00000000001f' AS uuid),
  CAST('a1000001-0000-0000-0000-000000000003' AS uuid),
  CAST('a1000001-0000-0000-0000-000000000021' AS uuid)
)
AND menu_option_id = CAST('33333333-3333-3333-3333-333333333407' AS uuid);

INSERT INTO menu_item_options (menu_item_id, menu_option_id) VALUES
  (CAST('a1000001-0000-0000-0000-00000000001f' AS uuid), CAST('33333333-3333-3333-3333-333333333428' AS uuid)),
  (CAST('a1000001-0000-0000-0000-000000000003' AS uuid), CAST('33333333-3333-3333-3333-333333333428' AS uuid)),
  (CAST('a1000001-0000-0000-0000-000000000021' AS uuid), CAST('33333333-3333-3333-3333-333333333428' AS uuid))
ON CONFLICT DO NOTHING;

-- GF sashimi modifiers: Albacore +3.5, Hotate/Maguro/Hamachi +4
UPDATE menu_options SET price_modifier = 3.5
WHERE id = CAST('33333333-3333-3333-3333-333333333424' AS uuid);
UPDATE menu_options SET price_modifier = 4
WHERE id IN (
  CAST('33333333-3333-3333-3333-333333333425' AS uuid),
  CAST('33333333-3333-3333-3333-333333333426' AS uuid),
  CAST('33333333-3333-3333-3333-333333333427' AS uuid)
);
