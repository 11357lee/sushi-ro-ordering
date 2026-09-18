-- Add Raw label to CALIFORNIA MAKI (regular menu).
-- Safe to re-run.

INSERT INTO menu_item_labels (menu_item_id, label_id)
SELECT m.id, l.id
FROM menu_items m
JOIN labels l ON l.slug = 'raw'
WHERE m.id = 'a1000001-0000-0000-0000-00000000000d'::uuid
ON CONFLICT DO NOTHING;
