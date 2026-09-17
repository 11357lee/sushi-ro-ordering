-- ============================================================
-- PASTE THIS FILE ONLY (version single-line-v4-skip-missing)
-- If your editor shows indented lines like "    price = 0,"
-- you still have the OLD broken SQL - delete it all first.
-- Confirm: every UPDATE/INSERT is ONE long line ending in ;
-- ============================================================

INSERT INTO labels (id, name, slug) VALUES ('22222222-2222-2222-2222-222222222205'::uuid, 'Raw', 'raw') ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;

UPDATE menu_items SET name = 'SPICY MAKI', description = '6 pcs - Choose Salmon, Red Tuna, or Scallop', price = 0, is_available = true, has_roll_options = false WHERE id = 'a1000001-0000-0000-0000-00000000000e'::uuid;
UPDATE menu_items SET name = 'SPICY MAKI (GF)', description = '6 pcs - Choose Salmon, Red Tuna, or Scallop', price = 0, is_available = true, has_roll_options = false WHERE id = 'a2000001-0000-0000-0000-000000000002'::uuid;

-- Recover if a prior partial paste ran UPDATE ... SET is_available = false without WHERE
UPDATE menu_items SET is_available = true;
UPDATE menu_items SET is_available = false WHERE id = 'a1000001-0000-0000-0000-00000000004b'::uuid;
UPDATE menu_items SET is_available = false WHERE id = 'a1000001-0000-0000-0000-00000000005a'::uuid;
UPDATE menu_items SET is_available = false WHERE id = 'a2000001-0000-0000-0000-00000000001c'::uuid;
UPDATE menu_items SET is_available = false WHERE id = 'a2000001-0000-0000-0000-000000000031'::uuid;
UPDATE menu_items SET is_available = false WHERE id = 'a1000001-0000-0000-0000-00000000000a'::uuid;
UPDATE menu_items SET is_available = false WHERE id = 'a1000001-0000-0000-0000-000000000042'::uuid;
UPDATE menu_items SET is_available = false WHERE id = 'a1000001-0000-0000-0000-000000000043'::uuid;

INSERT INTO menu_options (id, name, price_modifier, sort_order) VALUES ('33333333-3333-3333-3333-333333333729'::uuid, 'Chicken', 0, 68) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price_modifier = EXCLUDED.price_modifier, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_options (id, name, price_modifier, sort_order) VALUES ('33333333-3333-3333-3333-333333333730'::uuid, 'Beef', 0, 69) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price_modifier = EXCLUDED.price_modifier, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_options (id, name, price_modifier, sort_order) VALUES ('33333333-3333-3333-3333-333333333755'::uuid, 'Salmon', 9, 75) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price_modifier = EXCLUDED.price_modifier, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_options (id, name, price_modifier, sort_order) VALUES ('33333333-3333-3333-3333-333333333756'::uuid, 'Red Tuna', 9.5, 76) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price_modifier = EXCLUDED.price_modifier, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_options (id, name, price_modifier, sort_order) VALUES ('33333333-3333-3333-3333-333333333757'::uuid, 'Scallop', 9.5, 77) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price_modifier = EXCLUDED.price_modifier, sort_order = EXCLUDED.sort_order;

DELETE FROM menu_item_options WHERE menu_item_id = 'a1000001-0000-0000-0000-000000000035'::uuid;
INSERT INTO menu_item_options (menu_item_id, menu_option_id) SELECT m.id, o.id FROM menu_items m JOIN menu_options o ON o.id = '33333333-3333-3333-3333-333333333725'::uuid WHERE m.id = 'a1000001-0000-0000-0000-000000000035'::uuid ON CONFLICT DO NOTHING;
INSERT INTO menu_item_options (menu_item_id, menu_option_id) SELECT m.id, o.id FROM menu_items m JOIN menu_options o ON o.id = '33333333-3333-3333-3333-333333333729'::uuid WHERE m.id = 'a1000001-0000-0000-0000-000000000035'::uuid ON CONFLICT DO NOTHING;
UPDATE menu_items SET description = 'With spicy sauce. Choose pork or chicken' WHERE id = 'a1000001-0000-0000-0000-000000000035'::uuid;

INSERT INTO menu_item_options (menu_item_id, menu_option_id) SELECT m.id, o.id FROM menu_items m JOIN menu_options o ON o.id = '33333333-3333-3333-3333-333333333730'::uuid WHERE m.id = 'a1000001-0000-0000-0000-000000000036'::uuid ON CONFLICT DO NOTHING;
UPDATE menu_items SET description = '5 pcs - Choose pork, beef, or veggie' WHERE id = 'a1000001-0000-0000-0000-000000000036'::uuid;

DELETE FROM menu_item_options WHERE menu_item_id = 'a1000001-0000-0000-0000-00000000000e'::uuid AND menu_option_id IN (SELECT id FROM menu_options WHERE name IN ('Deep-fried', 'Replace with Soy Sheet', 'Spicy'));
DELETE FROM menu_item_options WHERE menu_item_id = 'a2000001-0000-0000-0000-000000000002'::uuid AND menu_option_id IN (SELECT id FROM menu_options WHERE name IN ('Deep-fried', 'Replace with Soy Sheet', 'Spicy'));
INSERT INTO menu_item_options (menu_item_id, menu_option_id) SELECT m.id, o.id FROM menu_items m JOIN menu_options o ON o.id = '33333333-3333-3333-3333-333333333755'::uuid WHERE m.id = 'a1000001-0000-0000-0000-00000000000e'::uuid ON CONFLICT DO NOTHING;
INSERT INTO menu_item_options (menu_item_id, menu_option_id) SELECT m.id, o.id FROM menu_items m JOIN menu_options o ON o.id = '33333333-3333-3333-3333-333333333756'::uuid WHERE m.id = 'a1000001-0000-0000-0000-00000000000e'::uuid ON CONFLICT DO NOTHING;
INSERT INTO menu_item_options (menu_item_id, menu_option_id) SELECT m.id, o.id FROM menu_items m JOIN menu_options o ON o.id = '33333333-3333-3333-3333-333333333757'::uuid WHERE m.id = 'a1000001-0000-0000-0000-00000000000e'::uuid ON CONFLICT DO NOTHING;
INSERT INTO menu_item_options (menu_item_id, menu_option_id) SELECT m.id, o.id FROM menu_items m JOIN menu_options o ON o.id = '33333333-3333-3333-3333-333333333755'::uuid WHERE m.id = 'a2000001-0000-0000-0000-000000000002'::uuid ON CONFLICT DO NOTHING;
INSERT INTO menu_item_options (menu_item_id, menu_option_id) SELECT m.id, o.id FROM menu_items m JOIN menu_options o ON o.id = '33333333-3333-3333-3333-333333333756'::uuid WHERE m.id = 'a2000001-0000-0000-0000-000000000002'::uuid ON CONFLICT DO NOTHING;
INSERT INTO menu_item_options (menu_item_id, menu_option_id) SELECT m.id, o.id FROM menu_items m JOIN menu_options o ON o.id = '33333333-3333-3333-3333-333333333757'::uuid WHERE m.id = 'a2000001-0000-0000-0000-000000000002'::uuid ON CONFLICT DO NOTHING;

INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order) VALUES ('a2000001-0000-0000-0000-000000000032'::uuid, 'c2000001-0000-0000-0000-000000000007'::uuid, 'EXTRA SPICY MAYO (GF)', NULL, 1, true, false, 2) ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;

INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT m.id, l.id FROM menu_items m JOIN labels l ON l.slug = 'raw' WHERE m.id = 'a1000001-0000-0000-0000-00000000003a'::uuid ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT m.id, l.id FROM menu_items m JOIN labels l ON l.slug = 'raw' WHERE m.id = 'a1000001-0000-0000-0000-00000000003b'::uuid ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT m.id, l.id FROM menu_items m JOIN labels l ON l.slug = 'raw' WHERE m.id = 'a1000001-0000-0000-0000-000000000034'::uuid ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT m.id, l.id FROM menu_items m JOIN labels l ON l.slug = 'raw' WHERE m.id = 'a1000001-0000-0000-0000-000000000030'::uuid ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT m.id, l.id FROM menu_items m JOIN labels l ON l.slug = 'raw' WHERE m.id = 'a1000001-0000-0000-0000-000000000018'::uuid ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT m.id, l.id FROM menu_items m JOIN labels l ON l.slug = 'raw' WHERE m.id = 'a1000001-0000-0000-0000-000000000002'::uuid ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT m.id, l.id FROM menu_items m JOIN labels l ON l.slug = 'raw' WHERE m.id = 'a1000001-0000-0000-0000-00000000001b'::uuid ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT m.id, l.id FROM menu_items m JOIN labels l ON l.slug = 'raw' WHERE m.id = 'a1000001-0000-0000-0000-00000000001d'::uuid ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT m.id, l.id FROM menu_items m JOIN labels l ON l.slug = 'raw' WHERE m.id = 'a1000001-0000-0000-0000-00000000001e'::uuid ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT m.id, l.id FROM menu_items m JOIN labels l ON l.slug = 'raw' WHERE m.id = 'a1000001-0000-0000-0000-00000000001f'::uuid ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT m.id, l.id FROM menu_items m JOIN labels l ON l.slug = 'raw' WHERE m.id = 'a1000001-0000-0000-0000-000000000003'::uuid ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT m.id, l.id FROM menu_items m JOIN labels l ON l.slug = 'raw' WHERE m.id = 'a1000001-0000-0000-0000-000000000021'::uuid ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT m.id, l.id FROM menu_items m JOIN labels l ON l.slug = 'raw' WHERE m.id = 'a1000001-0000-0000-0000-000000000022'::uuid ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT m.id, l.id FROM menu_items m JOIN labels l ON l.slug = 'raw' WHERE m.id = 'a1000001-0000-0000-0000-000000000023'::uuid ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT m.id, l.id FROM menu_items m JOIN labels l ON l.slug = 'raw' WHERE m.id = 'a1000001-0000-0000-0000-000000000024'::uuid ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT m.id, l.id FROM menu_items m JOIN labels l ON l.slug = 'raw' WHERE m.id = 'a1000001-0000-0000-0000-000000000044'::uuid ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT m.id, l.id FROM menu_items m JOIN labels l ON l.slug = 'raw' WHERE m.id = 'a1000001-0000-0000-0000-000000000059'::uuid ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT m.id, l.id FROM menu_items m JOIN labels l ON l.slug = 'raw' WHERE m.id = 'a1000001-0000-0000-0000-000000000047'::uuid ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT m.id, l.id FROM menu_items m JOIN labels l ON l.slug = 'raw' WHERE m.id = 'a1000001-0000-0000-0000-000000000046'::uuid ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT m.id, l.id FROM menu_items m JOIN labels l ON l.slug = 'raw' WHERE m.id = 'a1000001-0000-0000-0000-00000000000e'::uuid ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT m.id, l.id FROM menu_items m JOIN labels l ON l.slug = 'raw' WHERE m.id = 'a1000001-0000-0000-0000-000000000048'::uuid ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT m.id, l.id FROM menu_items m JOIN labels l ON l.slug = 'raw' WHERE m.id = 'a1000001-0000-0000-0000-000000000010'::uuid ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT m.id, l.id FROM menu_items m JOIN labels l ON l.slug = 'raw' WHERE m.id = 'a1000001-0000-0000-0000-00000000004c'::uuid ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT m.id, l.id FROM menu_items m JOIN labels l ON l.slug = 'raw' WHERE m.id = 'a1000001-0000-0000-0000-00000000004d'::uuid ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT m.id, l.id FROM menu_items m JOIN labels l ON l.slug = 'raw' WHERE m.id = 'a1000001-0000-0000-0000-00000000004e'::uuid ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT m.id, l.id FROM menu_items m JOIN labels l ON l.slug = 'raw' WHERE m.id = 'a1000001-0000-0000-0000-00000000004f'::uuid ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT m.id, l.id FROM menu_items m JOIN labels l ON l.slug = 'raw' WHERE m.id = 'a1000001-0000-0000-0000-000000000012'::uuid ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT m.id, l.id FROM menu_items m JOIN labels l ON l.slug = 'raw' WHERE m.id = 'a1000001-0000-0000-0000-000000000050'::uuid ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT m.id, l.id FROM menu_items m JOIN labels l ON l.slug = 'raw' WHERE m.id = 'a1000001-0000-0000-0000-000000000051'::uuid ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT m.id, l.id FROM menu_items m JOIN labels l ON l.slug = 'raw' WHERE m.id = 'a1000001-0000-0000-0000-000000000052'::uuid ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT m.id, l.id FROM menu_items m JOIN labels l ON l.slug = 'raw' WHERE m.id = 'a1000001-0000-0000-0000-000000000013'::uuid ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT m.id, l.id FROM menu_items m JOIN labels l ON l.slug = 'raw' WHERE m.id = 'a1000001-0000-0000-0000-000000000053'::uuid ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT m.id, l.id FROM menu_items m JOIN labels l ON l.slug = 'raw' WHERE m.id = 'a1000001-0000-0000-0000-000000000054'::uuid ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT m.id, l.id FROM menu_items m JOIN labels l ON l.slug = 'raw' WHERE m.id = 'a1000001-0000-0000-0000-000000000014'::uuid ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT m.id, l.id FROM menu_items m JOIN labels l ON l.slug = 'raw' WHERE m.id = 'a1000001-0000-0000-0000-000000000055'::uuid ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT m.id, l.id FROM menu_items m JOIN labels l ON l.slug = 'raw' WHERE m.id = 'a1000001-0000-0000-0000-000000000056'::uuid ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT m.id, l.id FROM menu_items m JOIN labels l ON l.slug = 'raw' WHERE m.id = 'a1000001-0000-0000-0000-000000000041'::uuid ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT m.id, l.id FROM menu_items m JOIN labels l ON l.slug = 'raw' WHERE m.id = 'a2000001-0000-0000-0000-000000000025'::uuid ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT m.id, l.id FROM menu_items m JOIN labels l ON l.slug = 'raw' WHERE m.id = 'a2000001-0000-0000-0000-000000000026'::uuid ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT m.id, l.id FROM menu_items m JOIN labels l ON l.slug = 'raw' WHERE m.id = 'a2000001-0000-0000-0000-000000000009'::uuid ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT m.id, l.id FROM menu_items m JOIN labels l ON l.slug = 'raw' WHERE m.id = 'a2000001-0000-0000-0000-00000000000c'::uuid ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT m.id, l.id FROM menu_items m JOIN labels l ON l.slug = 'raw' WHERE m.id = 'a2000001-0000-0000-0000-00000000000d'::uuid ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT m.id, l.id FROM menu_items m JOIN labels l ON l.slug = 'raw' WHERE m.id = 'a2000001-0000-0000-0000-00000000000f'::uuid ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT m.id, l.id FROM menu_items m JOIN labels l ON l.slug = 'raw' WHERE m.id = 'a2000001-0000-0000-0000-000000000010'::uuid ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT m.id, l.id FROM menu_items m JOIN labels l ON l.slug = 'raw' WHERE m.id = 'a2000001-0000-0000-0000-000000000011'::uuid ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT m.id, l.id FROM menu_items m JOIN labels l ON l.slug = 'raw' WHERE m.id = 'a2000001-0000-0000-0000-000000000012'::uuid ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT m.id, l.id FROM menu_items m JOIN labels l ON l.slug = 'raw' WHERE m.id = 'a2000001-0000-0000-0000-000000000013'::uuid ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT m.id, l.id FROM menu_items m JOIN labels l ON l.slug = 'raw' WHERE m.id = 'a2000001-0000-0000-0000-000000000001'::uuid ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT m.id, l.id FROM menu_items m JOIN labels l ON l.slug = 'raw' WHERE m.id = 'a2000001-0000-0000-0000-000000000030'::uuid ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT m.id, l.id FROM menu_items m JOIN labels l ON l.slug = 'raw' WHERE m.id = 'a2000001-0000-0000-0000-000000000019'::uuid ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT m.id, l.id FROM menu_items m JOIN labels l ON l.slug = 'raw' WHERE m.id = 'a2000001-0000-0000-0000-000000000018'::uuid ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT m.id, l.id FROM menu_items m JOIN labels l ON l.slug = 'raw' WHERE m.id = 'a2000001-0000-0000-0000-000000000002'::uuid ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT m.id, l.id FROM menu_items m JOIN labels l ON l.slug = 'raw' WHERE m.id = 'a2000001-0000-0000-0000-00000000001a'::uuid ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT m.id, l.id FROM menu_items m JOIN labels l ON l.slug = 'raw' WHERE m.id = 'a2000001-0000-0000-0000-000000000005'::uuid ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT m.id, l.id FROM menu_items m JOIN labels l ON l.slug = 'raw' WHERE m.id = 'a2000001-0000-0000-0000-000000000006'::uuid ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT m.id, l.id FROM menu_items m JOIN labels l ON l.slug = 'raw' WHERE m.id = 'a2000001-0000-0000-0000-000000000028'::uuid ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT m.id, l.id FROM menu_items m JOIN labels l ON l.slug = 'raw' WHERE m.id = 'a2000001-0000-0000-0000-000000000029'::uuid ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT m.id, l.id FROM menu_items m JOIN labels l ON l.slug = 'raw' WHERE m.id = 'a2000001-0000-0000-0000-00000000002a'::uuid ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT m.id, l.id FROM menu_items m JOIN labels l ON l.slug = 'raw' WHERE m.id = 'a2000001-0000-0000-0000-000000000007'::uuid ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT m.id, l.id FROM menu_items m JOIN labels l ON l.slug = 'raw' WHERE m.id = 'a2000001-0000-0000-0000-00000000002c'::uuid ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT m.id, l.id FROM menu_items m JOIN labels l ON l.slug = 'raw' WHERE m.id = 'a2000001-0000-0000-0000-00000000002d'::uuid ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT m.id, l.id FROM menu_items m JOIN labels l ON l.slug = 'raw' WHERE m.id = 'a2000001-0000-0000-0000-00000000002e'::uuid ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT m.id, l.id FROM menu_items m JOIN labels l ON l.slug = 'raw' WHERE m.id = 'a2000001-0000-0000-0000-00000000002f'::uuid ON CONFLICT DO NOTHING;

INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT m.id, l.id FROM menu_items m JOIN labels l ON l.slug = 'vegetarian' WHERE m.id = 'a1000001-0000-0000-0000-00000000000b'::uuid ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT m.id, l.id FROM menu_items m JOIN labels l ON l.slug = 'vegetarian' WHERE m.id = 'a1000001-0000-0000-0000-00000000003e'::uuid ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT m.id, l.id FROM menu_items m JOIN labels l ON l.slug = 'vegetarian' WHERE m.id = 'a1000001-0000-0000-0000-000000000008'::uuid ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT m.id, l.id FROM menu_items m JOIN labels l ON l.slug = 'vegetarian' WHERE m.id = 'a1000001-0000-0000-0000-00000000003d'::uuid ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT m.id, l.id FROM menu_items m JOIN labels l ON l.slug = 'vegetarian' WHERE m.id = 'a1000001-0000-0000-0000-000000000031'::uuid ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT m.id, l.id FROM menu_items m JOIN labels l ON l.slug = 'vegetarian' WHERE m.id = 'a1000001-0000-0000-0000-00000000000c'::uuid ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT m.id, l.id FROM menu_items m JOIN labels l ON l.slug = 'vegetarian' WHERE m.id = 'a1000001-0000-0000-0000-000000000032'::uuid ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT m.id, l.id FROM menu_items m JOIN labels l ON l.slug = 'vegetarian' WHERE m.id = 'a1000001-0000-0000-0000-000000000033'::uuid ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT m.id, l.id FROM menu_items m JOIN labels l ON l.slug = 'vegetarian' WHERE m.id = 'a1000001-0000-0000-0000-000000000004'::uuid ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT m.id, l.id FROM menu_items m JOIN labels l ON l.slug = 'vegetarian' WHERE m.id = 'a1000001-0000-0000-0000-000000000005'::uuid ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT m.id, l.id FROM menu_items m JOIN labels l ON l.slug = 'vegetarian' WHERE m.id = 'a1000001-0000-0000-0000-000000000029'::uuid ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT m.id, l.id FROM menu_items m JOIN labels l ON l.slug = 'vegetarian' WHERE m.id = 'a1000001-0000-0000-0000-00000000002a'::uuid ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT m.id, l.id FROM menu_items m JOIN labels l ON l.slug = 'vegetarian' WHERE m.id = 'a1000001-0000-0000-0000-00000000002b'::uuid ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT m.id, l.id FROM menu_items m JOIN labels l ON l.slug = 'vegetarian' WHERE m.id = 'a1000001-0000-0000-0000-00000000002c'::uuid ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT m.id, l.id FROM menu_items m JOIN labels l ON l.slug = 'vegetarian' WHERE m.id = 'a1000001-0000-0000-0000-00000000002d'::uuid ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT m.id, l.id FROM menu_items m JOIN labels l ON l.slug = 'vegetarian' WHERE m.id = 'a1000001-0000-0000-0000-00000000002e'::uuid ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT m.id, l.id FROM menu_items m JOIN labels l ON l.slug = 'vegetarian' WHERE m.id = 'a1000001-0000-0000-0000-000000000006'::uuid ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT m.id, l.id FROM menu_items m JOIN labels l ON l.slug = 'vegetarian' WHERE m.id = 'a1000001-0000-0000-0000-000000000025'::uuid ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT m.id, l.id FROM menu_items m JOIN labels l ON l.slug = 'vegetarian' WHERE m.id = 'a1000001-0000-0000-0000-000000000057'::uuid ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT m.id, l.id FROM menu_items m JOIN labels l ON l.slug = 'vegetarian' WHERE m.id = 'a2000001-0000-0000-0000-000000000027'::uuid ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT m.id, l.id FROM menu_items m JOIN labels l ON l.slug = 'vegetarian' WHERE m.id = 'a2000001-0000-0000-0000-000000000003'::uuid ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT m.id, l.id FROM menu_items m JOIN labels l ON l.slug = 'vegetarian' WHERE m.id = 'a2000001-0000-0000-0000-00000000001d'::uuid ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT m.id, l.id FROM menu_items m JOIN labels l ON l.slug = 'vegetarian' WHERE m.id = 'a2000001-0000-0000-0000-00000000001e'::uuid ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT m.id, l.id FROM menu_items m JOIN labels l ON l.slug = 'vegetarian' WHERE m.id = 'a2000001-0000-0000-0000-00000000001f'::uuid ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT m.id, l.id FROM menu_items m JOIN labels l ON l.slug = 'vegetarian' WHERE m.id = 'a2000001-0000-0000-0000-000000000020'::uuid ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT m.id, l.id FROM menu_items m JOIN labels l ON l.slug = 'vegetarian' WHERE m.id = 'a2000001-0000-0000-0000-000000000021'::uuid ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT m.id, l.id FROM menu_items m JOIN labels l ON l.slug = 'vegetarian' WHERE m.id = 'a2000001-0000-0000-0000-000000000022'::uuid ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT m.id, l.id FROM menu_items m JOIN labels l ON l.slug = 'vegetarian' WHERE m.id = 'a2000001-0000-0000-0000-000000000023'::uuid ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT m.id, l.id FROM menu_items m JOIN labels l ON l.slug = 'vegetarian' WHERE m.id = 'a2000001-0000-0000-0000-000000000024'::uuid ON CONFLICT DO NOTHING;
