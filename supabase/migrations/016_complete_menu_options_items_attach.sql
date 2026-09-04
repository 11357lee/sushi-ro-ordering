-- COMPLETE menu seed (replaces running 013/014/015 separately).
-- Clear the Supabase SQL editor completely, then paste THIS WHOLE FILE from the
-- RAW GitHub URL (not chat, not a collapsed preview), then click Run once.
-- Order: 1) menu_options  2) menu_items  3) menu_item_options.
-- Safe to re-run. Fixes FK error when option ids (e.g. ...701) were missing.

INSERT INTO menu_options (id, name, price_modifier, sort_order) VALUES (CAST('33333333-3333-3333-3333-333333333307' AS uuid), 'Replace with Soy Sheet', 2.5, 2) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price_modifier = EXCLUDED.price_modifier, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_options (id, name, price_modifier, sort_order) VALUES (CAST('33333333-3333-3333-3333-333333333701' AS uuid), 'Green (Avocado)', 0, 40) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price_modifier = EXCLUDED.price_modifier, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_options (id, name, price_modifier, sort_order) VALUES (CAST('33333333-3333-3333-3333-333333333702' AS uuid), 'Gold (Salmon)', 1, 41) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price_modifier = EXCLUDED.price_modifier, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_options (id, name, price_modifier, sort_order) VALUES (CAST('33333333-3333-3333-3333-333333333703' AS uuid), 'White (Snapper)', 1, 42) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price_modifier = EXCLUDED.price_modifier, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_options (id, name, price_modifier, sort_order) VALUES (CAST('33333333-3333-3333-3333-333333333704' AS uuid), 'Red (Red Tuna)', 1.5, 43) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price_modifier = EXCLUDED.price_modifier, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_options (id, name, price_modifier, sort_order) VALUES (CAST('33333333-3333-3333-3333-333333333705' AS uuid), 'Rainbow (Assorted fish with fish roe)', 1.5, 44) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price_modifier = EXCLUDED.price_modifier, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_options (id, name, price_modifier, sort_order) VALUES (CAST('33333333-3333-3333-3333-333333333706' AS uuid), 'Black (BBQ Eel)', 2, 45) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price_modifier = EXCLUDED.price_modifier, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_options (id, name, price_modifier, sort_order) VALUES (CAST('33333333-3333-3333-3333-333333333711' AS uuid), 'Shrimp', 0, 50) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price_modifier = EXCLUDED.price_modifier, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_options (id, name, price_modifier, sort_order) VALUES (CAST('33333333-3333-3333-3333-333333333712' AS uuid), 'Snapper', 0, 51) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price_modifier = EXCLUDED.price_modifier, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_options (id, name, price_modifier, sort_order) VALUES (CAST('33333333-3333-3333-3333-333333333713' AS uuid), 'Butter fish', 0, 52) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price_modifier = EXCLUDED.price_modifier, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_options (id, name, price_modifier, sort_order) VALUES (CAST('33333333-3333-3333-3333-333333333721' AS uuid), 'Salmon', 0, 60) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price_modifier = EXCLUDED.price_modifier, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_options (id, name, price_modifier, sort_order) VALUES (CAST('33333333-3333-3333-3333-333333333722' AS uuid), 'White tuna', 0, 61) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price_modifier = EXCLUDED.price_modifier, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_options (id, name, price_modifier, sort_order) VALUES (CAST('33333333-3333-3333-3333-333333333723' AS uuid), 'Tuna', 0, 62) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price_modifier = EXCLUDED.price_modifier, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_options (id, name, price_modifier, sort_order) VALUES (CAST('33333333-3333-3333-3333-333333333724' AS uuid), 'Red Tuna', 1, 63) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price_modifier = EXCLUDED.price_modifier, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_options (id, name, price_modifier, sort_order) VALUES (CAST('33333333-3333-3333-3333-333333333725' AS uuid), 'Pork', 0, 64) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price_modifier = EXCLUDED.price_modifier, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_options (id, name, price_modifier, sort_order) VALUES (CAST('33333333-3333-3333-3333-333333333726' AS uuid), 'Veggie', 0, 65) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price_modifier = EXCLUDED.price_modifier, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_options (id, name, price_modifier, sort_order) VALUES (CAST('33333333-3333-3333-3333-333333333727' AS uuid), 'Salmon', 0, 66) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price_modifier = EXCLUDED.price_modifier, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_options (id, name, price_modifier, sort_order) VALUES (CAST('33333333-3333-3333-3333-333333333728' AS uuid), 'Red Tuna', 1, 67) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price_modifier = EXCLUDED.price_modifier, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_options (id, name, price_modifier, sort_order) VALUES (CAST('33333333-3333-3333-3333-333333333731' AS uuid), 'Veggie - Torched vegetable with Teriyaki sauce', 11, 70) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price_modifier = EXCLUDED.price_modifier, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_options (id, name, price_modifier, sort_order) VALUES (CAST('33333333-3333-3333-3333-333333333732' AS uuid), 'Salmon - Torched salmon with Unagi sauce', 12.5, 71) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price_modifier = EXCLUDED.price_modifier, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_options (id, name, price_modifier, sort_order) VALUES (CAST('33333333-3333-3333-3333-333333333733' AS uuid), 'Tuna - Torched red tuna with Unagi sauce', 13.5, 72) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price_modifier = EXCLUDED.price_modifier, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_options (id, name, price_modifier, sort_order) VALUES (CAST('33333333-3333-3333-3333-333333333734' AS uuid), 'Eel - Avocado, Torched BBQ eel with Unagi sauce', 14, 73) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price_modifier = EXCLUDED.price_modifier, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_options (id, name, price_modifier, sort_order) VALUES (CAST('33333333-3333-3333-3333-333333333741' AS uuid), 'Coke', 0, 80) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price_modifier = EXCLUDED.price_modifier, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_options (id, name, price_modifier, sort_order) VALUES (CAST('33333333-3333-3333-3333-333333333742' AS uuid), 'Diet Coke', 0, 81) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price_modifier = EXCLUDED.price_modifier, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_options (id, name, price_modifier, sort_order) VALUES (CAST('33333333-3333-3333-3333-333333333743' AS uuid), 'Coke Zero', 0, 82) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price_modifier = EXCLUDED.price_modifier, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_options (id, name, price_modifier, sort_order) VALUES (CAST('33333333-3333-3333-3333-333333333744' AS uuid), 'Ginger Ale', 0, 83) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price_modifier = EXCLUDED.price_modifier, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_options (id, name, price_modifier, sort_order) VALUES (CAST('33333333-3333-3333-3333-333333333745' AS uuid), 'Iced Tea', 0, 84) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price_modifier = EXCLUDED.price_modifier, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_options (id, name, price_modifier, sort_order) VALUES (CAST('33333333-3333-3333-3333-333333333746' AS uuid), 'Sprite', 0, 85) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price_modifier = EXCLUDED.price_modifier, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_options (id, name, price_modifier, sort_order) VALUES (CAST('33333333-3333-3333-3333-333333333747' AS uuid), 'Sapporo', 0, 86) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price_modifier = EXCLUDED.price_modifier, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_options (id, name, price_modifier, sort_order) VALUES (CAST('33333333-3333-3333-3333-333333333748' AS uuid), 'Asahi', 0, 87) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price_modifier = EXCLUDED.price_modifier, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_options (id, name, price_modifier, sort_order) VALUES (CAST('33333333-3333-3333-3333-333333333801' AS uuid), 'Chocolate', 0, 90) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price_modifier = EXCLUDED.price_modifier, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_options (id, name, price_modifier, sort_order) VALUES (CAST('33333333-3333-3333-3333-333333333802' AS uuid), 'Milk', 0, 91) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price_modifier = EXCLUDED.price_modifier, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_options (id, name, price_modifier, sort_order) VALUES (CAST('33333333-3333-3333-3333-333333333803' AS uuid), 'Strawberry', 0, 92) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price_modifier = EXCLUDED.price_modifier, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_options (id, name, price_modifier, sort_order) VALUES (CAST('33333333-3333-3333-3333-333333333302' AS uuid), 'Replace with Soy Sheet', 1, 2) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price_modifier = EXCLUDED.price_modifier, sort_order = EXCLUDED.sort_order;


-- Ensure categories used below exist / renamed
UPDATE categories
SET name = 'Sushi Pizza/Bento Box', slug = 'sushi-pizza-bento-box'
WHERE id = CAST('c1000001-0000-0000-0000-00000000000a' AS uuid);

INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order) VALUES
  (CAST('a1000001-0000-0000-0000-000000000044' AS uuid), CAST('c1000001-0000-0000-0000-000000000006' AS uuid), 'SAKE MAKI', '6 pcs - Salmon', 7.5, true, true, 1)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;

INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order) VALUES
  (CAST('a1000001-0000-0000-0000-000000000059' AS uuid), CAST('c1000001-0000-0000-0000-000000000006' AS uuid), 'TEKKA MAKI', '6 pcs - Red Tuna', 8.5, true, true, 2)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;

INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order) VALUES
  (CAST('a1000001-0000-0000-0000-00000000004b' AS uuid), CAST('c1000001-0000-0000-0000-000000000006' AS uuid), 'SPICY TUNA MAKI', '6 pcs - Tuna, tempura bits, spicy mayo, green onion', 9.5, true, true, 12)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;

INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order) VALUES
  (CAST('a1000001-0000-0000-0000-00000000005a' AS uuid), CAST('c1000001-0000-0000-0000-000000000006' AS uuid), 'SPICY SCALLOP MAKI', '6 pcs - Scallop, tempura bits, spicy mayo, green onion', 9.5, true, true, 13)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;

INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order) VALUES
  (CAST('a1000001-0000-0000-0000-000000000045' AS uuid), CAST('c1000001-0000-0000-0000-000000000006' AS uuid), 'BBQ MAKI', '6 pcs - Cucumber, avocado, unagi sauce. Choose salmon or white tuna', 9, true, true, 4)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;

INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order) VALUES
  (CAST('a1000001-0000-0000-0000-000000000046' AS uuid), CAST('c1000001-0000-0000-0000-000000000006' AS uuid), 'ALASKA MAKI', '6 pcs - Cucumber, avocado. Choose salmon or tuna', 9, true, true, 5)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;

INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order) VALUES
  (CAST('a1000001-0000-0000-0000-000000000010' AS uuid), CAST('c1000001-0000-0000-0000-000000000007' AS uuid), 'DRAGON ROLL', '8 pcs - Cucumber, avocado, crab meat, shrimp tempura. Choose topping', 13, true, true, 1)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;

INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order) VALUES
  (CAST('a1000001-0000-0000-0000-00000000004c' AS uuid), CAST('c1000001-0000-0000-0000-000000000007' AS uuid), 'HOUSE ROLL', '8 pcs - Choose shrimp, snapper, or butter fish', 13, true, true, 2)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;

INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order) VALUES
  (CAST('a1000001-0000-0000-0000-00000000003b' AS uuid), CAST('c1000001-0000-0000-0000-000000000003' AS uuid), 'TATAKI', 'Lightly breaded and slightly deep-fried. Choose Salmon or Red Tuna (+$1)', 15.5, true, false, 17)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;

INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order) VALUES
  (CAST('a1000001-0000-0000-0000-000000000036' AS uuid), CAST('c1000001-0000-0000-0000-000000000003' AS uuid), 'GYOZA', '5 pcs - Choose pork or veggie', 7.5, true, false, 11)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;

INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order) VALUES
  (CAST('a1000001-0000-0000-0000-000000000041' AS uuid), CAST('c1000001-0000-0000-0000-00000000000a' AS uuid), 'SUSHI PIZZA', 'Choose one: Veggie $11, Salmon $12.5, Tuna $13.5, Eel $14', 0, true, false, 0)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;

INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order) VALUES
  (CAST('a1000001-0000-0000-0000-00000000005b' AS uuid), CAST('c1000001-0000-0000-0000-00000000000b' AS uuid), 'CANNED POP', 'Choose: Coke, Diet Coke, Coke Zero, Ginger Ale, Iced Tea, or Sprite', 2, true, false, 4)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;

INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order) VALUES
  (CAST('a1000001-0000-0000-0000-00000000005c' AS uuid), CAST('c1000001-0000-0000-0000-00000000000b' AS uuid), 'CANNED 500ML BEER', '5% alcohol - Choose Sapporo or Asahi', 5, true, false, 5)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;

INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order) VALUES
  (CAST('a1000001-0000-0000-0000-00000000005d' AS uuid), CAST('c1000001-0000-0000-0000-00000000000b' AS uuid), 'JAPANESE SWEET ROLL', '2 pcs - Choose up to 2 flavours (Chocolate, Milk, Strawberry). Duplicates allowed', 4.5, true, false, 3)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;

INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order) VALUES
  (CAST('a2000001-0000-0000-0000-000000000001' AS uuid), CAST('c2000001-0000-0000-0000-000000000001' AS uuid), 'SAKE MAKI (GF)', '6 pcs - Salmon', 7.5, true, true, 1)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;

INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order) VALUES
  (CAST('a2000001-0000-0000-0000-000000000030' AS uuid), CAST('c2000001-0000-0000-0000-000000000001' AS uuid), 'TEKKA MAKI (GF)', '6 pcs - Red Tuna', 8.5, true, true, 2)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;

INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order) VALUES
  (CAST('a2000001-0000-0000-0000-00000000001c' AS uuid), CAST('c2000001-0000-0000-0000-000000000001' AS uuid), 'SPICY TUNA MAKI (GF)', '6 pcs - Tuna, avocado, spicy mayo, green onion', 9.5, true, true, 9)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;

INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order) VALUES
  (CAST('a2000001-0000-0000-0000-000000000031' AS uuid), CAST('c2000001-0000-0000-0000-000000000001' AS uuid), 'SPICY SCALLOP MAKI (GF)', '6 pcs - Scallop, avocado, spicy mayo, green onion', 9.5, true, true, 10)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;

INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order) VALUES
  (CAST('a2000001-0000-0000-0000-000000000005' AS uuid), CAST('c2000001-0000-0000-0000-000000000004' AS uuid), 'DRAGON ROLL (GF)', '8 pcs - Cucumber, avocado, shrimp. Choose topping', 14, true, true, 1)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;

UPDATE menu_items SET has_roll_options = false WHERE id = CAST('a1000001-0000-0000-0000-00000000002f' AS uuid);

UPDATE menu_items SET is_available = false
WHERE id IN (
  CAST('a1000001-0000-0000-0000-00000000000a' AS uuid),
  CAST('a1000001-0000-0000-0000-000000000042' AS uuid),
  CAST('a1000001-0000-0000-0000-000000000043' AS uuid)
);


-- Attach options
INSERT INTO menu_item_options (menu_item_id, menu_option_id) VALUES (CAST('a1000001-0000-0000-0000-000000000010' AS uuid), CAST('33333333-3333-3333-3333-333333333701' AS uuid)) ON CONFLICT DO NOTHING;
INSERT INTO menu_item_options (menu_item_id, menu_option_id) VALUES (CAST('a1000001-0000-0000-0000-000000000010' AS uuid), CAST('33333333-3333-3333-3333-333333333702' AS uuid)) ON CONFLICT DO NOTHING;
INSERT INTO menu_item_options (menu_item_id, menu_option_id) VALUES (CAST('a1000001-0000-0000-0000-000000000010' AS uuid), CAST('33333333-3333-3333-3333-333333333703' AS uuid)) ON CONFLICT DO NOTHING;
INSERT INTO menu_item_options (menu_item_id, menu_option_id) VALUES (CAST('a1000001-0000-0000-0000-000000000010' AS uuid), CAST('33333333-3333-3333-3333-333333333704' AS uuid)) ON CONFLICT DO NOTHING;
INSERT INTO menu_item_options (menu_item_id, menu_option_id) VALUES (CAST('a1000001-0000-0000-0000-000000000010' AS uuid), CAST('33333333-3333-3333-3333-333333333705' AS uuid)) ON CONFLICT DO NOTHING;
INSERT INTO menu_item_options (menu_item_id, menu_option_id) VALUES (CAST('a1000001-0000-0000-0000-000000000010' AS uuid), CAST('33333333-3333-3333-3333-333333333706' AS uuid)) ON CONFLICT DO NOTHING;
INSERT INTO menu_item_options (menu_item_id, menu_option_id) VALUES (CAST('a1000001-0000-0000-0000-00000000004c' AS uuid), CAST('33333333-3333-3333-3333-333333333711' AS uuid)) ON CONFLICT DO NOTHING;
INSERT INTO menu_item_options (menu_item_id, menu_option_id) VALUES (CAST('a1000001-0000-0000-0000-00000000004c' AS uuid), CAST('33333333-3333-3333-3333-333333333712' AS uuid)) ON CONFLICT DO NOTHING;
INSERT INTO menu_item_options (menu_item_id, menu_option_id) VALUES (CAST('a1000001-0000-0000-0000-00000000004c' AS uuid), CAST('33333333-3333-3333-3333-333333333713' AS uuid)) ON CONFLICT DO NOTHING;
INSERT INTO menu_item_options (menu_item_id, menu_option_id) VALUES (CAST('a1000001-0000-0000-0000-000000000041' AS uuid), CAST('33333333-3333-3333-3333-333333333731' AS uuid)) ON CONFLICT DO NOTHING;
INSERT INTO menu_item_options (menu_item_id, menu_option_id) VALUES (CAST('a1000001-0000-0000-0000-000000000041' AS uuid), CAST('33333333-3333-3333-3333-333333333732' AS uuid)) ON CONFLICT DO NOTHING;
INSERT INTO menu_item_options (menu_item_id, menu_option_id) VALUES (CAST('a1000001-0000-0000-0000-000000000041' AS uuid), CAST('33333333-3333-3333-3333-333333333733' AS uuid)) ON CONFLICT DO NOTHING;
INSERT INTO menu_item_options (menu_item_id, menu_option_id) VALUES (CAST('a1000001-0000-0000-0000-000000000041' AS uuid), CAST('33333333-3333-3333-3333-333333333734' AS uuid)) ON CONFLICT DO NOTHING;
INSERT INTO menu_item_options (menu_item_id, menu_option_id) VALUES (CAST('a1000001-0000-0000-0000-00000000005b' AS uuid), CAST('33333333-3333-3333-3333-333333333741' AS uuid)) ON CONFLICT DO NOTHING;
INSERT INTO menu_item_options (menu_item_id, menu_option_id) VALUES (CAST('a1000001-0000-0000-0000-00000000005b' AS uuid), CAST('33333333-3333-3333-3333-333333333742' AS uuid)) ON CONFLICT DO NOTHING;
INSERT INTO menu_item_options (menu_item_id, menu_option_id) VALUES (CAST('a1000001-0000-0000-0000-00000000005b' AS uuid), CAST('33333333-3333-3333-3333-333333333743' AS uuid)) ON CONFLICT DO NOTHING;
INSERT INTO menu_item_options (menu_item_id, menu_option_id) VALUES (CAST('a1000001-0000-0000-0000-00000000005b' AS uuid), CAST('33333333-3333-3333-3333-333333333744' AS uuid)) ON CONFLICT DO NOTHING;
INSERT INTO menu_item_options (menu_item_id, menu_option_id) VALUES (CAST('a1000001-0000-0000-0000-00000000005b' AS uuid), CAST('33333333-3333-3333-3333-333333333745' AS uuid)) ON CONFLICT DO NOTHING;
INSERT INTO menu_item_options (menu_item_id, menu_option_id) VALUES (CAST('a1000001-0000-0000-0000-00000000005b' AS uuid), CAST('33333333-3333-3333-3333-333333333746' AS uuid)) ON CONFLICT DO NOTHING;
INSERT INTO menu_item_options (menu_item_id, menu_option_id) VALUES (CAST('a1000001-0000-0000-0000-00000000005c' AS uuid), CAST('33333333-3333-3333-3333-333333333747' AS uuid)) ON CONFLICT DO NOTHING;
INSERT INTO menu_item_options (menu_item_id, menu_option_id) VALUES (CAST('a1000001-0000-0000-0000-00000000005c' AS uuid), CAST('33333333-3333-3333-3333-333333333748' AS uuid)) ON CONFLICT DO NOTHING;
INSERT INTO menu_item_options (menu_item_id, menu_option_id) VALUES (CAST('a1000001-0000-0000-0000-00000000005d' AS uuid), CAST('33333333-3333-3333-3333-333333333801' AS uuid)) ON CONFLICT DO NOTHING;
INSERT INTO menu_item_options (menu_item_id, menu_option_id) VALUES (CAST('a1000001-0000-0000-0000-00000000005d' AS uuid), CAST('33333333-3333-3333-3333-333333333802' AS uuid)) ON CONFLICT DO NOTHING;
INSERT INTO menu_item_options (menu_item_id, menu_option_id) VALUES (CAST('a1000001-0000-0000-0000-00000000005d' AS uuid), CAST('33333333-3333-3333-3333-333333333803' AS uuid)) ON CONFLICT DO NOTHING;
INSERT INTO menu_item_options (menu_item_id, menu_option_id) VALUES (CAST('a1000001-0000-0000-0000-000000000052' AS uuid), CAST('33333333-3333-3333-3333-333333333307' AS uuid)) ON CONFLICT DO NOTHING;
INSERT INTO menu_item_options (menu_item_id, menu_option_id) VALUES (CAST('a1000001-0000-0000-0000-000000000013' AS uuid), CAST('33333333-3333-3333-3333-333333333302' AS uuid)) ON CONFLICT DO NOTHING;
INSERT INTO menu_item_options (menu_item_id, menu_option_id) VALUES (CAST('a1000001-0000-0000-0000-000000000054' AS uuid), CAST('33333333-3333-3333-3333-333333333302' AS uuid)) ON CONFLICT DO NOTHING;
INSERT INTO menu_item_options (menu_item_id, menu_option_id) VALUES (CAST('a1000001-0000-0000-0000-000000000045' AS uuid), CAST('33333333-3333-3333-3333-333333333721' AS uuid)) ON CONFLICT DO NOTHING;
INSERT INTO menu_item_options (menu_item_id, menu_option_id) VALUES (CAST('a1000001-0000-0000-0000-000000000045' AS uuid), CAST('33333333-3333-3333-3333-333333333722' AS uuid)) ON CONFLICT DO NOTHING;
INSERT INTO menu_item_options (menu_item_id, menu_option_id) VALUES (CAST('a1000001-0000-0000-0000-000000000046' AS uuid), CAST('33333333-3333-3333-3333-333333333721' AS uuid)) ON CONFLICT DO NOTHING;
INSERT INTO menu_item_options (menu_item_id, menu_option_id) VALUES (CAST('a1000001-0000-0000-0000-000000000046' AS uuid), CAST('33333333-3333-3333-3333-333333333723' AS uuid)) ON CONFLICT DO NOTHING;
INSERT INTO menu_item_options (menu_item_id, menu_option_id) VALUES (CAST('a1000001-0000-0000-0000-00000000003b' AS uuid), CAST('33333333-3333-3333-3333-333333333727' AS uuid)) ON CONFLICT DO NOTHING;
INSERT INTO menu_item_options (menu_item_id, menu_option_id) VALUES (CAST('a1000001-0000-0000-0000-00000000003b' AS uuid), CAST('33333333-3333-3333-3333-333333333728' AS uuid)) ON CONFLICT DO NOTHING;
INSERT INTO menu_item_options (menu_item_id, menu_option_id) VALUES (CAST('a1000001-0000-0000-0000-000000000036' AS uuid), CAST('33333333-3333-3333-3333-333333333725' AS uuid)) ON CONFLICT DO NOTHING;
INSERT INTO menu_item_options (menu_item_id, menu_option_id) VALUES (CAST('a1000001-0000-0000-0000-000000000036' AS uuid), CAST('33333333-3333-3333-3333-333333333726' AS uuid)) ON CONFLICT DO NOTHING;
INSERT INTO menu_item_options (menu_item_id, menu_option_id) VALUES (CAST('a2000001-0000-0000-0000-000000000005' AS uuid), CAST('33333333-3333-3333-3333-333333333701' AS uuid)) ON CONFLICT DO NOTHING;
INSERT INTO menu_item_options (menu_item_id, menu_option_id) VALUES (CAST('a2000001-0000-0000-0000-000000000005' AS uuid), CAST('33333333-3333-3333-3333-333333333702' AS uuid)) ON CONFLICT DO NOTHING;
INSERT INTO menu_item_options (menu_item_id, menu_option_id) VALUES (CAST('a2000001-0000-0000-0000-000000000005' AS uuid), CAST('33333333-3333-3333-3333-333333333703' AS uuid)) ON CONFLICT DO NOTHING;
INSERT INTO menu_item_options (menu_item_id, menu_option_id) VALUES (CAST('a2000001-0000-0000-0000-000000000005' AS uuid), CAST('33333333-3333-3333-3333-333333333704' AS uuid)) ON CONFLICT DO NOTHING;
INSERT INTO menu_item_options (menu_item_id, menu_option_id) VALUES (CAST('a2000001-0000-0000-0000-000000000005' AS uuid), CAST('33333333-3333-3333-3333-333333333705' AS uuid)) ON CONFLICT DO NOTHING;
INSERT INTO menu_item_options (menu_item_id, menu_option_id) VALUES (CAST('a2000001-0000-0000-0000-000000000005' AS uuid), CAST('33333333-3333-3333-3333-333333333706' AS uuid)) ON CONFLICT DO NOTHING;
