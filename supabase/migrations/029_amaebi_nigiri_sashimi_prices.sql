-- Re-apply Amaebi regular + GF ($6 nigiri / $8 sashimi). Safe to re-run.
-- Copy this whole file into Supabase SQL Editor and Run.

-- Shared nigiri option (modifier 0) and Amaebi sashimi (+$2 → $8)
INSERT INTO menu_options (id, name, price_modifier, sort_order) VALUES
  (CAST('33333333-3333-3333-3333-333333333401' AS uuid), '2 pcs Nigiri', 0, 10),
  (CAST('33333333-3333-3333-3333-33333333342c' AS uuid), '3 pcs Sashimi', 2, 11),
  (CAST('33333333-3333-3333-3333-33333333342a' AS uuid), '2 pcs Nigiri', 0, 10),
  (CAST('33333333-3333-3333-3333-33333333342b' AS uuid), '3 pcs Sashimi', 2, 11)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price_modifier = EXCLUDED.price_modifier,
  sort_order = EXCLUDED.sort_order;

-- Regular Amaebi
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order) VALUES
  (CAST('a1000001-0000-0000-0000-000000000062' AS uuid), CAST('c1000001-0000-0000-0000-000000000001' AS uuid), 'AMAEBI', 'Sweet Shrimp', 6, true, false, 2)
ON CONFLICT (id) DO UPDATE SET
  category_id = EXCLUDED.category_id,
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  is_available = true,
  has_roll_options = EXCLUDED.has_roll_options,
  sort_order = EXCLUDED.sort_order;

DELETE FROM menu_item_options
WHERE menu_item_id = CAST('a1000001-0000-0000-0000-000000000062' AS uuid);

INSERT INTO menu_item_options (menu_item_id, menu_option_id) VALUES
  (CAST('a1000001-0000-0000-0000-000000000062' AS uuid), CAST('33333333-3333-3333-3333-333333333401' AS uuid)),
  (CAST('a1000001-0000-0000-0000-000000000062' AS uuid), CAST('33333333-3333-3333-3333-33333333342c' AS uuid))
ON CONFLICT DO NOTHING;

INSERT INTO menu_item_labels (menu_item_id, label_id)
SELECT CAST('a1000001-0000-0000-0000-000000000062' AS uuid), l.id
FROM labels l WHERE l.slug = 'raw'
ON CONFLICT DO NOTHING;

-- GF Amaebi
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order) VALUES
  (CAST('a2000001-0000-0000-0000-000000000014' AS uuid), CAST('c2000001-0000-0000-0000-000000000006' AS uuid), 'AMAEBI (GF)', 'Sweet Shrimp', 6, true, false, 2)
ON CONFLICT (id) DO UPDATE SET
  category_id = EXCLUDED.category_id,
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  is_available = true,
  has_roll_options = EXCLUDED.has_roll_options,
  sort_order = EXCLUDED.sort_order;

DELETE FROM menu_item_options
WHERE menu_item_id = CAST('a2000001-0000-0000-0000-000000000014' AS uuid);

INSERT INTO menu_item_options (menu_item_id, menu_option_id) VALUES
  (CAST('a2000001-0000-0000-0000-000000000014' AS uuid), CAST('33333333-3333-3333-3333-33333333342a' AS uuid)),
  (CAST('a2000001-0000-0000-0000-000000000014' AS uuid), CAST('33333333-3333-3333-3333-33333333342b' AS uuid))
ON CONFLICT DO NOTHING;

INSERT INTO menu_item_labels (menu_item_id, label_id)
SELECT CAST('a2000001-0000-0000-0000-000000000014' AS uuid), l.id
FROM labels l WHERE l.slug = 'raw'
ON CONFLICT DO NOTHING;
