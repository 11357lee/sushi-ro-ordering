-- Remove item-level Raw from Dragon / House / Sushi Pizza (option-level Raw is code-side).
-- Safe to re-run. One statement per line.

DELETE FROM menu_item_labels WHERE menu_item_id = 'a1000001-0000-0000-0000-000000000010'::uuid AND label_id IN (SELECT id FROM labels WHERE slug = 'raw');
DELETE FROM menu_item_labels WHERE menu_item_id = 'a1000001-0000-0000-0000-00000000004c'::uuid AND label_id IN (SELECT id FROM labels WHERE slug = 'raw');
DELETE FROM menu_item_labels WHERE menu_item_id = 'a1000001-0000-0000-0000-000000000041'::uuid AND label_id IN (SELECT id FROM labels WHERE slug = 'raw');
DELETE FROM menu_item_labels WHERE menu_item_id = 'a2000001-0000-0000-0000-000000000005'::uuid AND label_id IN (SELECT id FROM labels WHERE slug = 'raw');
