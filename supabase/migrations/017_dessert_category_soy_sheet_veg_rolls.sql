-- Split Dessert from Drinks/Extra, remove legacy Sushi Pizza category,
-- and attach Replace with Soy Sheet to vegetable rolls (not Inari).
-- Clear SQL editor, copy from RAW GitHub, then Run. Safe to re-run.

-- 1) Recreate Dessert category (deleted in 005 when merged into drinks)
INSERT INTO categories (id, section_id, name, slug, sort_order, description)
VALUES (
  CAST('c1000001-0000-0000-0000-00000000000c' AS uuid),
  CAST('11111111-1111-1111-1111-111111111101' AS uuid),
  'Dessert',
  'dessert',
  9,
  'House desserts and sweet finishes.'
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  sort_order = EXCLUDED.sort_order,
  description = EXCLUDED.description,
  section_id = EXCLUDED.section_id;

UPDATE categories
SET sort_order = 10
WHERE id = CAST('c1000001-0000-0000-0000-00000000000b' AS uuid);

UPDATE menu_items
SET category_id = CAST('c1000001-0000-0000-0000-00000000000c' AS uuid), sort_order = 1
WHERE id = CAST('a1000001-0000-0000-0000-000000000017' AS uuid);

UPDATE menu_items
SET category_id = CAST('c1000001-0000-0000-0000-00000000000c' AS uuid), sort_order = 2
WHERE id = CAST('a1000001-0000-0000-0000-000000000058' AS uuid);

UPDATE menu_items
SET
  category_id = CAST('c1000001-0000-0000-0000-00000000000c' AS uuid),
  sort_order = 3,
  description = '2 pcs - Choose exactly 2 flavours (Chocolate, Milk, Strawberry). Duplicates allowed'
WHERE id = CAST('a1000001-0000-0000-0000-00000000005d' AS uuid);

UPDATE menu_items
SET sort_order = 1
WHERE id = CAST('a1000001-0000-0000-0000-00000000005b' AS uuid);

UPDATE menu_items
SET sort_order = 2
WHERE id = CAST('a1000001-0000-0000-0000-00000000005c' AS uuid);

-- 2) Ensure soy sheet option exists
INSERT INTO menu_options (id, name, price_modifier, sort_order)
VALUES (CAST('33333333-3333-3333-3333-333333333302' AS uuid), 'Replace with Soy Sheet', 1, 2)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price_modifier = EXCLUDED.price_modifier,
  sort_order = EXCLUDED.sort_order;

-- 3) Attach soy sheet to vegetable rolls (regular + GF), excluding Inari
INSERT INTO menu_item_options (menu_item_id, menu_option_id) VALUES (CAST('a1000001-0000-0000-0000-000000000004' AS uuid), CAST('33333333-3333-3333-3333-333333333302' AS uuid)) ON CONFLICT DO NOTHING;
INSERT INTO menu_item_options (menu_item_id, menu_option_id) VALUES (CAST('a1000001-0000-0000-0000-000000000005' AS uuid), CAST('33333333-3333-3333-3333-333333333302' AS uuid)) ON CONFLICT DO NOTHING;
INSERT INTO menu_item_options (menu_item_id, menu_option_id) VALUES (CAST('a1000001-0000-0000-0000-000000000029' AS uuid), CAST('33333333-3333-3333-3333-333333333302' AS uuid)) ON CONFLICT DO NOTHING;
INSERT INTO menu_item_options (menu_item_id, menu_option_id) VALUES (CAST('a1000001-0000-0000-0000-00000000002a' AS uuid), CAST('33333333-3333-3333-3333-333333333302' AS uuid)) ON CONFLICT DO NOTHING;
INSERT INTO menu_item_options (menu_item_id, menu_option_id) VALUES (CAST('a1000001-0000-0000-0000-00000000002b' AS uuid), CAST('33333333-3333-3333-3333-333333333302' AS uuid)) ON CONFLICT DO NOTHING;
INSERT INTO menu_item_options (menu_item_id, menu_option_id) VALUES (CAST('a1000001-0000-0000-0000-00000000002c' AS uuid), CAST('33333333-3333-3333-3333-333333333302' AS uuid)) ON CONFLICT DO NOTHING;
INSERT INTO menu_item_options (menu_item_id, menu_option_id) VALUES (CAST('a1000001-0000-0000-0000-00000000002d' AS uuid), CAST('33333333-3333-3333-3333-333333333302' AS uuid)) ON CONFLICT DO NOTHING;
INSERT INTO menu_item_options (menu_item_id, menu_option_id) VALUES (CAST('a1000001-0000-0000-0000-00000000002e' AS uuid), CAST('33333333-3333-3333-3333-333333333302' AS uuid)) ON CONFLICT DO NOTHING;
INSERT INTO menu_item_options (menu_item_id, menu_option_id) VALUES (CAST('a1000001-0000-0000-0000-000000000006' AS uuid), CAST('33333333-3333-3333-3333-333333333302' AS uuid)) ON CONFLICT DO NOTHING;
INSERT INTO menu_item_options (menu_item_id, menu_option_id) VALUES (CAST('a2000001-0000-0000-0000-000000000003' AS uuid), CAST('33333333-3333-3333-3333-333333333302' AS uuid)) ON CONFLICT DO NOTHING;
INSERT INTO menu_item_options (menu_item_id, menu_option_id) VALUES (CAST('a2000001-0000-0000-0000-00000000001d' AS uuid), CAST('33333333-3333-3333-3333-333333333302' AS uuid)) ON CONFLICT DO NOTHING;
INSERT INTO menu_item_options (menu_item_id, menu_option_id) VALUES (CAST('a2000001-0000-0000-0000-00000000001e' AS uuid), CAST('33333333-3333-3333-3333-333333333302' AS uuid)) ON CONFLICT DO NOTHING;
INSERT INTO menu_item_options (menu_item_id, menu_option_id) VALUES (CAST('a2000001-0000-0000-0000-00000000001f' AS uuid), CAST('33333333-3333-3333-3333-333333333302' AS uuid)) ON CONFLICT DO NOTHING;
INSERT INTO menu_item_options (menu_item_id, menu_option_id) VALUES (CAST('a2000001-0000-0000-0000-000000000020' AS uuid), CAST('33333333-3333-3333-3333-333333333302' AS uuid)) ON CONFLICT DO NOTHING;
INSERT INTO menu_item_options (menu_item_id, menu_option_id) VALUES (CAST('a2000001-0000-0000-0000-000000000021' AS uuid), CAST('33333333-3333-3333-3333-333333333302' AS uuid)) ON CONFLICT DO NOTHING;
INSERT INTO menu_item_options (menu_item_id, menu_option_id) VALUES (CAST('a2000001-0000-0000-0000-000000000022' AS uuid), CAST('33333333-3333-3333-3333-333333333302' AS uuid)) ON CONFLICT DO NOTHING;
INSERT INTO menu_item_options (menu_item_id, menu_option_id) VALUES (CAST('a2000001-0000-0000-0000-000000000023' AS uuid), CAST('33333333-3333-3333-3333-333333333302' AS uuid)) ON CONFLICT DO NOTHING;
INSERT INTO menu_item_options (menu_item_id, menu_option_id) VALUES (CAST('a2000001-0000-0000-0000-000000000024' AS uuid), CAST('33333333-3333-3333-3333-333333333302' AS uuid)) ON CONFLICT DO NOTHING;

-- 4) Remove legacy Sushi Pizza category (items already under Sushi Pizza/Bento Box)
UPDATE menu_items
SET category_id = CAST('c1000001-0000-0000-0000-00000000000a' AS uuid)
WHERE category_id = CAST('c1000001-0000-0000-0000-000000000004' AS uuid);

DELETE FROM categories
WHERE id = CAST('c1000001-0000-0000-0000-000000000004' AS uuid);
