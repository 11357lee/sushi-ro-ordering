-- Add Raw label to IKA (regular + GF). Safe to re-run.

INSERT INTO menu_item_labels (menu_item_id, label_id)
SELECT m.id, l.id
FROM menu_items m
JOIN labels l ON l.slug = 'raw'
WHERE m.id IN (
  CAST('a1000001-0000-0000-0000-000000000019' AS uuid),
  CAST('a2000001-0000-0000-0000-00000000000a' AS uuid)
)
ON CONFLICT DO NOTHING;
