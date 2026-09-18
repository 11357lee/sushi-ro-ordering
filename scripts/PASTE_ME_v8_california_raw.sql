-- PASTE_ME_v8_california_raw
-- Run in Supabase SQL editor (whole script). Adds Raw label to California Maki.

INSERT INTO menu_item_labels (menu_item_id, label_id)
SELECT m.id, l.id
FROM menu_items m
JOIN labels l ON l.slug = 'raw'
WHERE m.id = 'a1000001-0000-0000-0000-00000000000d'::uuid
ON CONFLICT DO NOTHING;
