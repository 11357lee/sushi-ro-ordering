-- Clear SQL editor, then paste this whole file and run.
-- Prefer raw GitHub copy. Creates missing menu items, then attaches options.
-- Options from 014 should already exist; this is safe to re-run.

-- Ensure categories used below exist / renamed
UPDATE menu_categories
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

-- Attach options (items + options must exist)
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
