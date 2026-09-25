-- Soy sheet on all rolls; GF Amaebi nigiri/sashimi. Safe to re-run.

-- 1) Attach Replace with Soy Sheet to every roll that allows roll options
INSERT INTO menu_item_options (menu_item_id, menu_option_id)
SELECT mi.id, CAST('33333333-3333-3333-3333-333333333302' AS uuid)
FROM menu_items mi
WHERE mi.has_roll_options = true
ON CONFLICT DO NOTHING;

-- Spicy maki + caterpillar (rolls that were missing soy / roll options)
UPDATE menu_items
SET has_roll_options = true
WHERE id IN (
  CAST('a1000001-0000-0000-0000-00000000003a' AS uuid),
  CAST('a2000001-0000-0000-0000-000000000025' AS uuid)
);

INSERT INTO menu_item_options (menu_item_id, menu_option_id) VALUES
  (CAST('a1000001-0000-0000-0000-00000000000e' AS uuid), CAST('33333333-3333-3333-3333-333333333302' AS uuid)),
  (CAST('a2000001-0000-0000-0000-000000000002' AS uuid), CAST('33333333-3333-3333-3333-333333333302' AS uuid)),
  (CAST('a1000001-0000-0000-0000-00000000003a' AS uuid), CAST('33333333-3333-3333-3333-333333333302' AS uuid)),
  (CAST('a2000001-0000-0000-0000-000000000025' AS uuid), CAST('33333333-3333-3333-3333-333333333302' AS uuid))
ON CONFLICT DO NOTHING;

-- Keep Inari without soy sheet
DELETE FROM menu_item_options
WHERE menu_item_id = CAST('a1000001-0000-0000-0000-00000000002f' AS uuid)
  AND menu_option_id = CAST('33333333-3333-3333-3333-333333333302' AS uuid);

-- 2) GF Amaebi: $6 nigiri / $8 sashimi (+$2)
INSERT INTO menu_options (id, name, price_modifier, sort_order) VALUES
  (CAST('33333333-3333-3333-3333-33333333342a' AS uuid), '2 pcs Nigiri', 0, 10),
  (CAST('33333333-3333-3333-3333-33333333342b' AS uuid), '3 pcs Sashimi', 2, 11)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price_modifier = EXCLUDED.price_modifier,
  sort_order = EXCLUDED.sort_order;

INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order) VALUES
  (CAST('a2000001-0000-0000-0000-000000000014' AS uuid), CAST('c2000001-0000-0000-0000-000000000006' AS uuid), 'AMAEBI (GF)', 'Sweet Shrimp', 6, true, false, 2)
ON CONFLICT (id) DO UPDATE SET
  category_id = EXCLUDED.category_id,
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  is_available = EXCLUDED.is_available,
  has_roll_options = EXCLUDED.has_roll_options,
  sort_order = EXCLUDED.sort_order;

UPDATE menu_items SET sort_order = 3 WHERE id = CAST('a2000001-0000-0000-0000-000000000009' AS uuid);
UPDATE menu_items SET sort_order = 4 WHERE id = CAST('a2000001-0000-0000-0000-00000000000a' AS uuid);
UPDATE menu_items SET sort_order = 5 WHERE id = CAST('a2000001-0000-0000-0000-00000000000b' AS uuid);
UPDATE menu_items SET sort_order = 6 WHERE id = CAST('a2000001-0000-0000-0000-00000000000c' AS uuid);
UPDATE menu_items SET sort_order = 7 WHERE id = CAST('a2000001-0000-0000-0000-00000000000d' AS uuid);
UPDATE menu_items SET sort_order = 8 WHERE id = CAST('a2000001-0000-0000-0000-00000000000e' AS uuid);
UPDATE menu_items SET sort_order = 9 WHERE id = CAST('a2000001-0000-0000-0000-00000000000f' AS uuid);
UPDATE menu_items SET sort_order = 10 WHERE id = CAST('a2000001-0000-0000-0000-000000000010' AS uuid);
UPDATE menu_items SET sort_order = 11 WHERE id = CAST('a2000001-0000-0000-0000-000000000011' AS uuid);
UPDATE menu_items SET sort_order = 12 WHERE id = CAST('a2000001-0000-0000-0000-000000000012' AS uuid);
UPDATE menu_items SET sort_order = 13 WHERE id = CAST('a2000001-0000-0000-0000-000000000013' AS uuid);

INSERT INTO menu_item_options (menu_item_id, menu_option_id) VALUES
  (CAST('a2000001-0000-0000-0000-000000000014' AS uuid), CAST('33333333-3333-3333-3333-33333333342a' AS uuid)),
  (CAST('a2000001-0000-0000-0000-000000000014' AS uuid), CAST('33333333-3333-3333-3333-33333333342b' AS uuid))
ON CONFLICT DO NOTHING;

INSERT INTO menu_item_labels (menu_item_id, label_id)
SELECT CAST('a2000001-0000-0000-0000-000000000014' AS uuid), l.id
FROM labels l WHERE l.slug = 'raw'
ON CONFLICT DO NOTHING;
