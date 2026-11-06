-- GF Dragon Rainbow topping: "Assorted fish" only (no fish roe).
-- Regular Dragon keeps "Rainbow (Assorted fish with fish roe)".
-- GF Rainbow is a mandatory topping choice (radio), same as other Dragon toppings.

INSERT INTO menu_options (id, name, price_modifier, sort_order)
VALUES (
  CAST('33333333-3333-3333-3333-333333333707' AS uuid),
  'Rainbow (Assorted fish)',
  1.5,
  44
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price_modifier = EXCLUDED.price_modifier,
  sort_order = EXCLUDED.sort_order;

-- Detach regular Rainbow (with fish roe) from GF Dragon.
DELETE FROM menu_item_options
WHERE menu_item_id = CAST('a2000001-0000-0000-0000-000000000005' AS uuid)
  AND menu_option_id = CAST('33333333-3333-3333-3333-333333333705' AS uuid);

-- Attach GF Rainbow (assorted fish only).
INSERT INTO menu_item_options (menu_item_id, menu_option_id)
VALUES (
  CAST('a2000001-0000-0000-0000-000000000005' AS uuid),
  CAST('33333333-3333-3333-3333-333333333707' AS uuid)
)
ON CONFLICT DO NOTHING;
