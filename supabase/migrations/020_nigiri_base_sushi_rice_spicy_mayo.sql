-- Flip GF nigiri/sashimi so base = nigiri (sashimi costs more),
-- add Spicy Mayo to Extra Sauce, make Sushi Rice its own $4 item,
-- and add GF canned pop. Safe to re-run.

-- 1) GF nigiri options → modifier 0 (base price is nigiri)
UPDATE menu_options
SET price_modifier = 0
WHERE id IN (
  CAST('33333333-3333-3333-3333-333333333410' AS uuid),
  CAST('33333333-3333-3333-3333-333333333411' AS uuid),
  CAST('33333333-3333-3333-3333-333333333412' AS uuid),
  CAST('33333333-3333-3333-3333-333333333413' AS uuid),
  CAST('33333333-3333-3333-3333-333333333414' AS uuid),
  CAST('33333333-3333-3333-3333-333333333415' AS uuid),
  CAST('33333333-3333-3333-3333-333333333416' AS uuid),
  CAST('33333333-3333-3333-3333-333333333417' AS uuid),
  CAST('33333333-3333-3333-3333-333333333418' AS uuid),
  CAST('33333333-3333-3333-3333-333333333419' AS uuid),
  CAST('33333333-3333-3333-3333-33333333341a' AS uuid),
  CAST('33333333-3333-3333-3333-33333333341b' AS uuid)
);

-- Per-item sashimi options (former nigiri deltas)
INSERT INTO menu_options (id, name, price_modifier, sort_order) VALUES
  (CAST('33333333-3333-3333-3333-33333333341c' AS uuid), '3 pcs Sashimi', 2, 11),
  (CAST('33333333-3333-3333-3333-33333333341d' AS uuid), '3 pcs Sashimi', 1.5, 11),
  (CAST('33333333-3333-3333-3333-33333333341e' AS uuid), '3 pcs Sashimi', 0.5, 11),
  (CAST('33333333-3333-3333-3333-33333333341f' AS uuid), '3 pcs Sashimi', 2, 11),
  (CAST('33333333-3333-3333-3333-333333333420' AS uuid), '3 pcs Sashimi', 3, 11),
  (CAST('33333333-3333-3333-3333-333333333421' AS uuid), '3 pcs Sashimi', 3, 11),
  (CAST('33333333-3333-3333-3333-333333333422' AS uuid), '3 pcs Sashimi', 2.5, 11),
  (CAST('33333333-3333-3333-3333-333333333423' AS uuid), '3 pcs Sashimi', 3, 11),
  (CAST('33333333-3333-3333-3333-333333333424' AS uuid), '3 pcs Sashimi', 3, 11),
  (CAST('33333333-3333-3333-3333-333333333425' AS uuid), '3 pcs Sashimi', 3.5, 11),
  (CAST('33333333-3333-3333-3333-333333333426' AS uuid), '3 pcs Sashimi', 3.5, 11),
  (CAST('33333333-3333-3333-3333-333333333427' AS uuid), '3 pcs Sashimi', 3.5, 11)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price_modifier = EXCLUDED.price_modifier,
  sort_order = EXCLUDED.sort_order;

-- Detach shared sashimi (409) from GF nigiri items
DELETE FROM menu_item_options
WHERE menu_item_id IN (
  CAST('a2000001-0000-0000-0000-000000000008' AS uuid),
  CAST('a2000001-0000-0000-0000-000000000009' AS uuid),
  CAST('a2000001-0000-0000-0000-00000000000a' AS uuid),
  CAST('a2000001-0000-0000-0000-00000000000b' AS uuid),
  CAST('a2000001-0000-0000-0000-00000000000c' AS uuid),
  CAST('a2000001-0000-0000-0000-00000000000d' AS uuid),
  CAST('a2000001-0000-0000-0000-00000000000e' AS uuid),
  CAST('a2000001-0000-0000-0000-00000000000f' AS uuid),
  CAST('a2000001-0000-0000-0000-000000000010' AS uuid),
  CAST('a2000001-0000-0000-0000-000000000011' AS uuid),
  CAST('a2000001-0000-0000-0000-000000000012' AS uuid),
  CAST('a2000001-0000-0000-0000-000000000013' AS uuid)
)
AND menu_option_id = CAST('33333333-3333-3333-3333-333333333409' AS uuid);

INSERT INTO menu_item_options (menu_item_id, menu_option_id) VALUES
  (CAST('a2000001-0000-0000-0000-000000000008' AS uuid), CAST('33333333-3333-3333-3333-33333333341c' AS uuid)),
  (CAST('a2000001-0000-0000-0000-000000000009' AS uuid), CAST('33333333-3333-3333-3333-33333333341d' AS uuid)),
  (CAST('a2000001-0000-0000-0000-00000000000a' AS uuid), CAST('33333333-3333-3333-3333-33333333341e' AS uuid)),
  (CAST('a2000001-0000-0000-0000-00000000000b' AS uuid), CAST('33333333-3333-3333-3333-33333333341f' AS uuid)),
  (CAST('a2000001-0000-0000-0000-00000000000c' AS uuid), CAST('33333333-3333-3333-3333-333333333420' AS uuid)),
  (CAST('a2000001-0000-0000-0000-00000000000d' AS uuid), CAST('33333333-3333-3333-3333-333333333421' AS uuid)),
  (CAST('a2000001-0000-0000-0000-00000000000e' AS uuid), CAST('33333333-3333-3333-3333-333333333422' AS uuid)),
  (CAST('a2000001-0000-0000-0000-00000000000f' AS uuid), CAST('33333333-3333-3333-3333-333333333423' AS uuid)),
  (CAST('a2000001-0000-0000-0000-000000000010' AS uuid), CAST('33333333-3333-3333-3333-333333333424' AS uuid)),
  (CAST('a2000001-0000-0000-0000-000000000011' AS uuid), CAST('33333333-3333-3333-3333-333333333425' AS uuid)),
  (CAST('a2000001-0000-0000-0000-000000000012' AS uuid), CAST('33333333-3333-3333-3333-333333333426' AS uuid)),
  (CAST('a2000001-0000-0000-0000-000000000013' AS uuid), CAST('33333333-3333-3333-3333-333333333427' AS uuid))
ON CONFLICT DO NOTHING;

-- Regular nigiri/sashimi already uses base = nigiri (migration 006).

-- 2) Extra Sauce: add Spicy Mayo
INSERT INTO menu_options (id, name, price_modifier, sort_order) VALUES
  (CAST('33333333-3333-3333-3333-333333333754' AS uuid), 'Spicy Mayo', 0, 97)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price_modifier = EXCLUDED.price_modifier,
  sort_order = EXCLUDED.sort_order;

INSERT INTO menu_item_options (menu_item_id, menu_option_id) VALUES
  (CAST('a1000001-0000-0000-0000-00000000005f' AS uuid), CAST('33333333-3333-3333-3333-333333333754' AS uuid))
ON CONFLICT DO NOTHING;

UPDATE menu_items
SET description = 'Choose Unagi, Teriyaki, Sriracha, or Spicy Mayo'
WHERE id = CAST('a1000001-0000-0000-0000-00000000005f' AS uuid);

-- 3) Remove sushi-rice checkbox from steamed white rice; keep steamed at $3
DELETE FROM menu_item_options
WHERE menu_item_id IN (
  CAST('a1000001-0000-0000-0000-000000000060' AS uuid),
  CAST('a2000001-0000-0000-0000-000000000033' AS uuid)
)
AND menu_option_id = CAST('33333333-3333-3333-3333-333333333308' AS uuid);

UPDATE menu_items
SET description = NULL,
    price = 3
WHERE id IN (
  CAST('a1000001-0000-0000-0000-000000000060' AS uuid),
  CAST('a2000001-0000-0000-0000-000000000033' AS uuid)
);

-- 4) Regular Sushi Rice $4 (next to steamed white rice)
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order) VALUES
  (CAST('a1000001-0000-0000-0000-000000000061' AS uuid), CAST('c1000001-0000-0000-0000-00000000000b' AS uuid), 'SUSHI RICE', NULL, 4, true, false, 6)
ON CONFLICT (id) DO UPDATE SET
  category_id = EXCLUDED.category_id,
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  is_available = EXCLUDED.is_available,
  has_roll_options = EXCLUDED.has_roll_options,
  sort_order = EXCLUDED.sort_order;

-- 5) GF: canned pop + sushi rice
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order) VALUES
  (CAST('a2000001-0000-0000-0000-000000000034' AS uuid), CAST('c2000001-0000-0000-0000-000000000007' AS uuid), 'CANNED POP (GF)', 'Choose: Coke, Diet Coke, Coke Zero, Ginger Ale, Iced Tea, or Sprite', 2, true, false, 1),
  (CAST('a2000001-0000-0000-0000-000000000035' AS uuid), CAST('c2000001-0000-0000-0000-000000000007' AS uuid), 'SUSHI RICE (GF)', NULL, 4, true, false, 4)
ON CONFLICT (id) DO UPDATE SET
  category_id = EXCLUDED.category_id,
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  is_available = EXCLUDED.is_available,
  has_roll_options = EXCLUDED.has_roll_options,
  sort_order = EXCLUDED.sort_order;

INSERT INTO menu_item_options (menu_item_id, menu_option_id) VALUES
  (CAST('a2000001-0000-0000-0000-000000000034' AS uuid), CAST('33333333-3333-3333-3333-333333333741' AS uuid)),
  (CAST('a2000001-0000-0000-0000-000000000034' AS uuid), CAST('33333333-3333-3333-3333-333333333742' AS uuid)),
  (CAST('a2000001-0000-0000-0000-000000000034' AS uuid), CAST('33333333-3333-3333-3333-333333333743' AS uuid)),
  (CAST('a2000001-0000-0000-0000-000000000034' AS uuid), CAST('33333333-3333-3333-3333-333333333744' AS uuid)),
  (CAST('a2000001-0000-0000-0000-000000000034' AS uuid), CAST('33333333-3333-3333-3333-333333333745' AS uuid)),
  (CAST('a2000001-0000-0000-0000-000000000034' AS uuid), CAST('33333333-3333-3333-3333-333333333746' AS uuid))
ON CONFLICT DO NOTHING;

UPDATE menu_items SET sort_order = 2 WHERE id = CAST('a2000001-0000-0000-0000-000000000032' AS uuid);
UPDATE menu_items SET sort_order = 3 WHERE id = CAST('a2000001-0000-0000-0000-000000000033' AS uuid);
UPDATE menu_items SET sort_order = 4 WHERE id = CAST('a2000001-0000-0000-0000-000000000035' AS uuid);
