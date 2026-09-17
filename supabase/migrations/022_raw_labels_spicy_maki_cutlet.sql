-- Menu labels (Raw), cutlet/gyoza, merged Spicy Maki, GF spicy mayo.
-- IMPORTANT: Clear SQL editor. Click RAW below, Select All, Copy, Paste ALL, then Run.
-- Every statement is ONE line (Supabase must not split on newlines). Safe to re-run.
-- Raw URL: https://github.com/11357lee/sushi-ro-ordering/raw/cursor/menu-labels-admin-fixes-9070/supabase/migrations/022_raw_labels_spicy_maki_cutlet.sql

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
INSERT INTO menu_item_options (menu_item_id, menu_option_id) VALUES ('a1000001-0000-0000-0000-000000000035'::uuid, '33333333-3333-3333-3333-333333333725'::uuid) ON CONFLICT DO NOTHING;
INSERT INTO menu_item_options (menu_item_id, menu_option_id) VALUES ('a1000001-0000-0000-0000-000000000035'::uuid, '33333333-3333-3333-3333-333333333729'::uuid) ON CONFLICT DO NOTHING;
UPDATE menu_items SET description = 'With spicy sauce. Choose pork or chicken' WHERE id = 'a1000001-0000-0000-0000-000000000035'::uuid;

INSERT INTO menu_item_options (menu_item_id, menu_option_id) VALUES ('a1000001-0000-0000-0000-000000000036'::uuid, '33333333-3333-3333-3333-333333333730'::uuid) ON CONFLICT DO NOTHING;
UPDATE menu_items SET description = '5 pcs - Choose pork, beef, or veggie' WHERE id = 'a1000001-0000-0000-0000-000000000036'::uuid;

DELETE FROM menu_item_options WHERE menu_item_id = 'a1000001-0000-0000-0000-00000000000e'::uuid AND menu_option_id IN (SELECT id FROM menu_options WHERE name IN ('Deep-fried', 'Replace with Soy Sheet', 'Spicy'));
DELETE FROM menu_item_options WHERE menu_item_id = 'a2000001-0000-0000-0000-000000000002'::uuid AND menu_option_id IN (SELECT id FROM menu_options WHERE name IN ('Deep-fried', 'Replace with Soy Sheet', 'Spicy'));
INSERT INTO menu_item_options (menu_item_id, menu_option_id) VALUES ('a1000001-0000-0000-0000-00000000000e'::uuid, '33333333-3333-3333-3333-333333333755'::uuid) ON CONFLICT DO NOTHING;
INSERT INTO menu_item_options (menu_item_id, menu_option_id) VALUES ('a1000001-0000-0000-0000-00000000000e'::uuid, '33333333-3333-3333-3333-333333333756'::uuid) ON CONFLICT DO NOTHING;
INSERT INTO menu_item_options (menu_item_id, menu_option_id) VALUES ('a1000001-0000-0000-0000-00000000000e'::uuid, '33333333-3333-3333-3333-333333333757'::uuid) ON CONFLICT DO NOTHING;
INSERT INTO menu_item_options (menu_item_id, menu_option_id) VALUES ('a2000001-0000-0000-0000-000000000002'::uuid, '33333333-3333-3333-3333-333333333755'::uuid) ON CONFLICT DO NOTHING;
INSERT INTO menu_item_options (menu_item_id, menu_option_id) VALUES ('a2000001-0000-0000-0000-000000000002'::uuid, '33333333-3333-3333-3333-333333333756'::uuid) ON CONFLICT DO NOTHING;
INSERT INTO menu_item_options (menu_item_id, menu_option_id) VALUES ('a2000001-0000-0000-0000-000000000002'::uuid, '33333333-3333-3333-3333-333333333757'::uuid) ON CONFLICT DO NOTHING;

INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order) VALUES ('a2000001-0000-0000-0000-000000000032'::uuid, 'c2000001-0000-0000-0000-000000000007'::uuid, 'EXTRA SPICY MAYO (GF)', NULL, 1, true, false, 2) ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;

INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT 'a1000001-0000-0000-0000-00000000003a'::uuid, id FROM labels WHERE slug = 'raw' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT 'a1000001-0000-0000-0000-00000000003b'::uuid, id FROM labels WHERE slug = 'raw' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT 'a1000001-0000-0000-0000-000000000034'::uuid, id FROM labels WHERE slug = 'raw' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT 'a1000001-0000-0000-0000-000000000030'::uuid, id FROM labels WHERE slug = 'raw' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT 'a1000001-0000-0000-0000-000000000018'::uuid, id FROM labels WHERE slug = 'raw' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT 'a1000001-0000-0000-0000-000000000002'::uuid, id FROM labels WHERE slug = 'raw' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT 'a1000001-0000-0000-0000-00000000001b'::uuid, id FROM labels WHERE slug = 'raw' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT 'a1000001-0000-0000-0000-00000000001d'::uuid, id FROM labels WHERE slug = 'raw' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT 'a1000001-0000-0000-0000-00000000001e'::uuid, id FROM labels WHERE slug = 'raw' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT 'a1000001-0000-0000-0000-00000000001f'::uuid, id FROM labels WHERE slug = 'raw' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT 'a1000001-0000-0000-0000-000000000003'::uuid, id FROM labels WHERE slug = 'raw' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT 'a1000001-0000-0000-0000-000000000021'::uuid, id FROM labels WHERE slug = 'raw' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT 'a1000001-0000-0000-0000-000000000022'::uuid, id FROM labels WHERE slug = 'raw' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT 'a1000001-0000-0000-0000-000000000023'::uuid, id FROM labels WHERE slug = 'raw' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT 'a1000001-0000-0000-0000-000000000024'::uuid, id FROM labels WHERE slug = 'raw' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT 'a1000001-0000-0000-0000-000000000044'::uuid, id FROM labels WHERE slug = 'raw' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT 'a1000001-0000-0000-0000-000000000059'::uuid, id FROM labels WHERE slug = 'raw' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT 'a1000001-0000-0000-0000-000000000047'::uuid, id FROM labels WHERE slug = 'raw' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT 'a1000001-0000-0000-0000-000000000046'::uuid, id FROM labels WHERE slug = 'raw' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT 'a1000001-0000-0000-0000-00000000000e'::uuid, id FROM labels WHERE slug = 'raw' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT 'a1000001-0000-0000-0000-000000000048'::uuid, id FROM labels WHERE slug = 'raw' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT 'a1000001-0000-0000-0000-000000000010'::uuid, id FROM labels WHERE slug = 'raw' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT 'a1000001-0000-0000-0000-00000000004c'::uuid, id FROM labels WHERE slug = 'raw' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT 'a1000001-0000-0000-0000-00000000004d'::uuid, id FROM labels WHERE slug = 'raw' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT 'a1000001-0000-0000-0000-00000000004e'::uuid, id FROM labels WHERE slug = 'raw' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT 'a1000001-0000-0000-0000-00000000004f'::uuid, id FROM labels WHERE slug = 'raw' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT 'a1000001-0000-0000-0000-000000000012'::uuid, id FROM labels WHERE slug = 'raw' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT 'a1000001-0000-0000-0000-000000000050'::uuid, id FROM labels WHERE slug = 'raw' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT 'a1000001-0000-0000-0000-000000000051'::uuid, id FROM labels WHERE slug = 'raw' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT 'a1000001-0000-0000-0000-000000000052'::uuid, id FROM labels WHERE slug = 'raw' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT 'a1000001-0000-0000-0000-000000000013'::uuid, id FROM labels WHERE slug = 'raw' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT 'a1000001-0000-0000-0000-000000000053'::uuid, id FROM labels WHERE slug = 'raw' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT 'a1000001-0000-0000-0000-000000000054'::uuid, id FROM labels WHERE slug = 'raw' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT 'a1000001-0000-0000-0000-000000000014'::uuid, id FROM labels WHERE slug = 'raw' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT 'a1000001-0000-0000-0000-000000000055'::uuid, id FROM labels WHERE slug = 'raw' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT 'a1000001-0000-0000-0000-000000000056'::uuid, id FROM labels WHERE slug = 'raw' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT 'a1000001-0000-0000-0000-000000000041'::uuid, id FROM labels WHERE slug = 'raw' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT 'a2000001-0000-0000-0000-000000000025'::uuid, id FROM labels WHERE slug = 'raw' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT 'a2000001-0000-0000-0000-000000000026'::uuid, id FROM labels WHERE slug = 'raw' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT 'a2000001-0000-0000-0000-000000000009'::uuid, id FROM labels WHERE slug = 'raw' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT 'a2000001-0000-0000-0000-00000000000c'::uuid, id FROM labels WHERE slug = 'raw' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT 'a2000001-0000-0000-0000-00000000000d'::uuid, id FROM labels WHERE slug = 'raw' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT 'a2000001-0000-0000-0000-00000000000f'::uuid, id FROM labels WHERE slug = 'raw' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT 'a2000001-0000-0000-0000-000000000010'::uuid, id FROM labels WHERE slug = 'raw' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT 'a2000001-0000-0000-0000-000000000011'::uuid, id FROM labels WHERE slug = 'raw' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT 'a2000001-0000-0000-0000-000000000012'::uuid, id FROM labels WHERE slug = 'raw' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT 'a2000001-0000-0000-0000-000000000013'::uuid, id FROM labels WHERE slug = 'raw' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT 'a2000001-0000-0000-0000-000000000001'::uuid, id FROM labels WHERE slug = 'raw' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT 'a2000001-0000-0000-0000-000000000030'::uuid, id FROM labels WHERE slug = 'raw' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT 'a2000001-0000-0000-0000-000000000019'::uuid, id FROM labels WHERE slug = 'raw' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT 'a2000001-0000-0000-0000-000000000018'::uuid, id FROM labels WHERE slug = 'raw' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT 'a2000001-0000-0000-0000-000000000002'::uuid, id FROM labels WHERE slug = 'raw' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT 'a2000001-0000-0000-0000-00000000001a'::uuid, id FROM labels WHERE slug = 'raw' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT 'a2000001-0000-0000-0000-000000000005'::uuid, id FROM labels WHERE slug = 'raw' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT 'a2000001-0000-0000-0000-000000000006'::uuid, id FROM labels WHERE slug = 'raw' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT 'a2000001-0000-0000-0000-000000000028'::uuid, id FROM labels WHERE slug = 'raw' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT 'a2000001-0000-0000-0000-000000000029'::uuid, id FROM labels WHERE slug = 'raw' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT 'a2000001-0000-0000-0000-00000000002a'::uuid, id FROM labels WHERE slug = 'raw' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT 'a2000001-0000-0000-0000-000000000007'::uuid, id FROM labels WHERE slug = 'raw' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT 'a2000001-0000-0000-0000-00000000002c'::uuid, id FROM labels WHERE slug = 'raw' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT 'a2000001-0000-0000-0000-00000000002d'::uuid, id FROM labels WHERE slug = 'raw' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT 'a2000001-0000-0000-0000-00000000002e'::uuid, id FROM labels WHERE slug = 'raw' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT 'a2000001-0000-0000-0000-00000000002f'::uuid, id FROM labels WHERE slug = 'raw' ON CONFLICT DO NOTHING;

INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT 'a1000001-0000-0000-0000-00000000000b'::uuid, id FROM labels WHERE slug = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT 'a1000001-0000-0000-0000-00000000003e'::uuid, id FROM labels WHERE slug = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT 'a1000001-0000-0000-0000-000000000008'::uuid, id FROM labels WHERE slug = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT 'a1000001-0000-0000-0000-00000000003d'::uuid, id FROM labels WHERE slug = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT 'a1000001-0000-0000-0000-000000000031'::uuid, id FROM labels WHERE slug = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT 'a1000001-0000-0000-0000-00000000000c'::uuid, id FROM labels WHERE slug = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT 'a1000001-0000-0000-0000-000000000032'::uuid, id FROM labels WHERE slug = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT 'a1000001-0000-0000-0000-000000000033'::uuid, id FROM labels WHERE slug = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT 'a1000001-0000-0000-0000-000000000004'::uuid, id FROM labels WHERE slug = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT 'a1000001-0000-0000-0000-000000000005'::uuid, id FROM labels WHERE slug = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT 'a1000001-0000-0000-0000-000000000029'::uuid, id FROM labels WHERE slug = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT 'a1000001-0000-0000-0000-00000000002a'::uuid, id FROM labels WHERE slug = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT 'a1000001-0000-0000-0000-00000000002b'::uuid, id FROM labels WHERE slug = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT 'a1000001-0000-0000-0000-00000000002c'::uuid, id FROM labels WHERE slug = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT 'a1000001-0000-0000-0000-00000000002d'::uuid, id FROM labels WHERE slug = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT 'a1000001-0000-0000-0000-00000000002e'::uuid, id FROM labels WHERE slug = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT 'a1000001-0000-0000-0000-000000000006'::uuid, id FROM labels WHERE slug = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT 'a1000001-0000-0000-0000-000000000025'::uuid, id FROM labels WHERE slug = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT 'a1000001-0000-0000-0000-000000000057'::uuid, id FROM labels WHERE slug = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT 'a2000001-0000-0000-0000-000000000027'::uuid, id FROM labels WHERE slug = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT 'a2000001-0000-0000-0000-000000000003'::uuid, id FROM labels WHERE slug = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT 'a2000001-0000-0000-0000-00000000001d'::uuid, id FROM labels WHERE slug = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT 'a2000001-0000-0000-0000-00000000001e'::uuid, id FROM labels WHERE slug = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT 'a2000001-0000-0000-0000-00000000001f'::uuid, id FROM labels WHERE slug = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT 'a2000001-0000-0000-0000-000000000020'::uuid, id FROM labels WHERE slug = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT 'a2000001-0000-0000-0000-000000000021'::uuid, id FROM labels WHERE slug = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT 'a2000001-0000-0000-0000-000000000022'::uuid, id FROM labels WHERE slug = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT 'a2000001-0000-0000-0000-000000000023'::uuid, id FROM labels WHERE slug = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_labels (menu_item_id, label_id) SELECT 'a2000001-0000-0000-0000-000000000024'::uuid, id FROM labels WHERE slug = 'vegetarian' ON CONFLICT DO NOTHING;
