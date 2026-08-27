-- Add remaining ramen varieties and keep Tonkotsu as the first item.
INSERT INTO menu_items (
  id,
  category_id,
  name,
  description,
  price,
  is_available,
  has_roll_options,
  sort_order
)
SELECT
  item.id::uuid,
  categories.id,
  item.name,
  item.description,
  item.price,
  TRUE,
  FALSE,
  item.sort_order
FROM (
  VALUES
    (
      'a1000001-0000-0000-0000-000000000026',
      'MISO RAMEN',
      'Savory miso broth ramen',
      17.00,
      2
    ),
    (
      'a1000001-0000-0000-0000-000000000027',
      'SHOYU RAMEN',
      'Soy sauce broth ramen',
      17.00,
      3
    ),
    (
      'a1000001-0000-0000-0000-000000000028',
      'VEGETABLE RAMEN',
      'Vegetable broth ramen',
      17.00,
      4
    )
) AS item(id, name, description, price, sort_order)
JOIN categories ON categories.slug = 'ramen'
ON CONFLICT (id) DO UPDATE
SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  sort_order = EXCLUDED.sort_order,
  is_available = TRUE;

-- Optional vegetarian label for Vegetable Ramen when labels table exists.
INSERT INTO menu_item_labels (menu_item_id, label_id)
SELECT
  'a1000001-0000-0000-0000-000000000028'::uuid,
  labels.id
FROM labels
WHERE labels.slug = 'vegetarian'
ON CONFLICT DO NOTHING;
