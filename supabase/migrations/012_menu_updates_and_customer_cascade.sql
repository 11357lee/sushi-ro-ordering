-- Allow deleting customers that have orders by cascading deletes.
-- WARNING: deleting a customer will also delete their orders and (via order_items FK) line items
-- if order_items references orders with ON DELETE CASCADE. Verify order_items FK separately.

ALTER TABLE orders
  DROP CONSTRAINT IF EXISTS orders_customer_id_fkey;

ALTER TABLE orders
  ADD CONSTRAINT orders_customer_id_fkey
  FOREIGN KEY (customer_id)
  REFERENCES customers(id)
  ON DELETE CASCADE;

-- Menu refinements (2026-09): options, split rolls, pizza merge, drinks.
-- Safe to re-run; uses upserts where possible.

INSERT INTO menu_options (id, name, price_modifier, sort_order) VALUES
  ('33333333-3333-3333-3333-333333333307', 'Replace with Soy Sheet', 2.5, 2),
  ('33333333-3333-3333-3333-333333333701', 'Green (Avocado)', 0, 40),
  ('33333333-3333-3333-3333-333333333702', 'Gold (Salmon)', 1, 41),
  ('33333333-3333-3333-3333-333333333703', 'White (Snapper)', 1, 42),
  ('33333333-3333-3333-3333-333333333704', 'Red (Red Tuna)', 1.5, 43),
  ('33333333-3333-3333-3333-333333333705', 'Rainbow (Assorted fish with fish roe)', 1.5, 44),
  ('33333333-3333-3333-3333-333333333706', 'Black (BBQ Eel)', 2, 45),
  ('33333333-3333-3333-3333-333333333711', 'Shrimp', 0, 50),
  ('33333333-3333-3333-3333-333333333712', 'Snapper', 0, 51),
  ('33333333-3333-3333-3333-333333333713', 'Butter fish', 0, 52),
  ('33333333-3333-3333-3333-333333333721', 'Salmon', 0, 60),
  ('33333333-3333-3333-3333-333333333722', 'White tuna', 0, 61),
  ('33333333-3333-3333-3333-333333333723', 'Tuna', 0, 62),
  ('33333333-3333-3333-3333-333333333724', 'Red Tuna', 1, 63),
  ('33333333-3333-3333-3333-333333333725', 'Pork', 0, 64),
  ('33333333-3333-3333-3333-333333333726', 'Veggie', 0, 65),
  ('33333333-3333-3333-3333-333333333727', 'Salmon', 0, 66),
  ('33333333-3333-3333-3333-333333333728', 'Red Tuna', 1, 67),
  ('33333333-3333-3333-3333-333333333731', 'Veggie — Torched vegetable with Teriyaki sauce', 11, 70),
  ('33333333-3333-3333-3333-333333333732', 'Salmon — Torched salmon with Unagi sauce', 12.5, 71),
  ('33333333-3333-3333-3333-333333333733', 'Tuna — Torched red tuna with Unagi sauce', 13.5, 72),
  ('33333333-3333-3333-3333-333333333734', 'Eel — Avocado, Torched BBQ eel with Unagi sauce', 14, 73),
  ('33333333-3333-3333-3333-333333333741', 'Coke', 0, 80),
  ('33333333-3333-3333-3333-333333333742', 'Diet Coke', 0, 81),
  ('33333333-3333-3333-3333-333333333743', 'Coke Zero', 0, 82),
  ('33333333-3333-3333-3333-333333333744', 'Ginger Ale', 0, 83),
  ('33333333-3333-3333-3333-333333333745', 'Iced Tea', 0, 84),
  ('33333333-3333-3333-3333-333333333746', 'Sprite', 0, 85),
  ('33333333-3333-3333-3333-333333333747', 'Sapporo', 0, 86),
  ('33333333-3333-3333-3333-333333333748', 'Asahi', 0, 87),
  ('33333333-3333-3333-3333-333333333801', 'Chocolate', 0, 90),
  ('33333333-3333-3333-3333-333333333802', 'Milk', 0, 91),
  ('33333333-3333-3333-3333-333333333803', 'Strawberry', 0, 92)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price_modifier = EXCLUDED.price_modifier,
  sort_order = EXCLUDED.sort_order;

-- Rename bento category
UPDATE menu_categories
SET name = 'Sushi Pizza/Bento Box', slug = 'sushi-pizza-bento-box'
WHERE id = 'c1000001-0000-0000-0000-00000000000a';

-- Hide old pizza category if present
UPDATE menu_categories
SET sort_order = 99
WHERE id = 'c1000001-0000-0000-0000-000000000004';

-- Inari: no soy sheet
UPDATE menu_items SET has_roll_options = false
WHERE id = 'a1000001-0000-0000-0000-00000000002f';

-- Core item upserts for new/split items
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order) VALUES
  ('a1000001-0000-0000-0000-000000000044', 'c1000001-0000-0000-0000-000000000006', 'SAKE MAKI', '6 pcs — Salmon', 7.5, true, true, 1),
  ('a1000001-0000-0000-0000-000000000059', 'c1000001-0000-0000-0000-000000000006', 'TEKKA MAKI', '6 pcs — Red Tuna', 8.5, true, true, 2),
  ('a1000001-0000-0000-0000-00000000005a', 'c1000001-0000-0000-0000-000000000006', 'SPICY SCALLOP MAKI', '6 pcs — Scallop, tempura bits, spicy mayo, green onion', 9.5, true, true, 13),
  ('a1000001-0000-0000-0000-00000000004b', 'c1000001-0000-0000-0000-000000000006', 'SPICY TUNA MAKI', '6 pcs — Tuna, tempura bits, spicy mayo, green onion', 9.5, true, true, 12),
  ('a1000001-0000-0000-0000-000000000041', 'c1000001-0000-0000-0000-00000000000a', 'SUSHI PIZZA', 'Choose one: Veggie $11, Salmon $12.5, Tuna $13.5, Eel $14', 0, true, false, 0),
  ('a1000001-0000-0000-0000-00000000005b', 'c1000001-0000-0000-0000-00000000000b', 'CANNED POP', 'Choose: Coke, Diet Coke, Coke Zero, Ginger Ale, Iced Tea, or Sprite', 2, true, false, 4),
  ('a1000001-0000-0000-0000-00000000005c', 'c1000001-0000-0000-0000-00000000000b', 'CANNED 500ML BEER', '5% alcohol — Choose Sapporo or Asahi', 5, true, false, 5),
  ('a1000001-0000-0000-0000-00000000005d', 'c1000001-0000-0000-0000-00000000000b', 'JAPANESE SWEET ROLL', '2 pcs — Choose up to 2 flavours (Chocolate, Milk, Strawberry). Duplicates allowed', 4.5, true, false, 3),
  ('a2000001-0000-0000-0000-000000000001', 'c2000001-0000-0000-0000-000000000001', 'SAKE MAKI (GF)', '6 pcs — Salmon', 7.5, true, true, 1),
  ('a2000001-0000-0000-0000-000000000030', 'c2000001-0000-0000-0000-000000000001', 'TEKKA MAKI (GF)', '6 pcs — Red Tuna', 8.5, true, true, 2),
  ('a2000001-0000-0000-0000-00000000001c', 'c2000001-0000-0000-0000-000000000001', 'SPICY TUNA MAKI (GF)', '6 pcs — Tuna, avocado, spicy mayo, green onion', 9.5, true, true, 9),
  ('a2000001-0000-0000-0000-000000000031', 'c2000001-0000-0000-0000-000000000001', 'SPICY SCALLOP MAKI (GF)', '6 pcs — Scallop, avocado, spicy mayo, green onion', 9.5, true, true, 10)
ON CONFLICT (id) DO UPDATE SET
  category_id = EXCLUDED.category_id,
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  is_available = EXCLUDED.is_available,
  has_roll_options = EXCLUDED.has_roll_options,
  sort_order = EXCLUDED.sort_order;

-- Soft-hide old individual pizza SKUs
UPDATE menu_items SET is_available = false
WHERE id IN (
  'a1000001-0000-0000-0000-00000000000a',
  'a1000001-0000-0000-0000-000000000042',
  'a1000001-0000-0000-0000-000000000043'
);

-- Attach common choice options (ignore duplicates)
INSERT INTO menu_item_options (menu_item_id, menu_option_id)
VALUES
  ('a1000001-0000-0000-0000-000000000010'::uuid, '33333333-3333-3333-3333-333333333701'::uuid),
  ('a1000001-0000-0000-0000-000000000010'::uuid, '33333333-3333-3333-3333-333333333702'::uuid),
  ('a1000001-0000-0000-0000-000000000010'::uuid, '33333333-3333-3333-3333-333333333703'::uuid),
  ('a1000001-0000-0000-0000-000000000010'::uuid, '33333333-3333-3333-3333-333333333704'::uuid),
  ('a1000001-0000-0000-0000-000000000010'::uuid, '33333333-3333-3333-3333-333333333705'::uuid),
  ('a1000001-0000-0000-0000-000000000010'::uuid, '33333333-3333-3333-3333-333333333706'::uuid),
  ('a1000001-0000-0000-0000-00000000004c'::uuid, '33333333-3333-3333-3333-333333333711'::uuid),
  ('a1000001-0000-0000-0000-00000000004c'::uuid, '33333333-3333-3333-3333-333333333712'::uuid),
  ('a1000001-0000-0000-0000-00000000004c'::uuid, '33333333-3333-3333-3333-333333333713'::uuid),
  ('a1000001-0000-0000-0000-000000000041'::uuid, '33333333-3333-3333-3333-333333333731'::uuid),
  ('a1000001-0000-0000-0000-000000000041'::uuid, '33333333-3333-3333-3333-333333333732'::uuid),
  ('a1000001-0000-0000-0000-000000000041'::uuid, '33333333-3333-3333-3333-333333333733'::uuid),
  ('a1000001-0000-0000-0000-000000000041'::uuid, '33333333-3333-3333-3333-333333333734'::uuid),
  ('a1000001-0000-0000-0000-00000000005b'::uuid, '33333333-3333-3333-3333-333333333741'::uuid),
  ('a1000001-0000-0000-0000-00000000005b'::uuid, '33333333-3333-3333-3333-333333333742'::uuid),
  ('a1000001-0000-0000-0000-00000000005b'::uuid, '33333333-3333-3333-3333-333333333743'::uuid),
  ('a1000001-0000-0000-0000-00000000005b'::uuid, '33333333-3333-3333-3333-333333333744'::uuid),
  ('a1000001-0000-0000-0000-00000000005b'::uuid, '33333333-3333-3333-3333-333333333745'::uuid),
  ('a1000001-0000-0000-0000-00000000005b'::uuid, '33333333-3333-3333-3333-333333333746'::uuid),
  ('a1000001-0000-0000-0000-00000000005c'::uuid, '33333333-3333-3333-3333-333333333747'::uuid),
  ('a1000001-0000-0000-0000-00000000005c'::uuid, '33333333-3333-3333-3333-333333333748'::uuid),
  ('a1000001-0000-0000-0000-00000000005d'::uuid, '33333333-3333-3333-3333-333333333801'::uuid),
  ('a1000001-0000-0000-0000-00000000005d'::uuid, '33333333-3333-3333-3333-333333333802'::uuid),
  ('a1000001-0000-0000-0000-00000000005d'::uuid, '33333333-3333-3333-3333-333333333803'::uuid),
  ('a1000001-0000-0000-0000-000000000052'::uuid, '33333333-3333-3333-3333-333333333307'::uuid),
  ('a1000001-0000-0000-0000-000000000013'::uuid, '33333333-3333-3333-3333-333333333302'::uuid),
  ('a1000001-0000-0000-0000-000000000054'::uuid, '33333333-3333-3333-3333-333333333302'::uuid)
ON CONFLICT DO NOTHING;
