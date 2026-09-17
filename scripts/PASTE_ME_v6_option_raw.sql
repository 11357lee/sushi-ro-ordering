-- ***** PASTE_ME_v6 ***** option-level Raw for Dragon/House/Pizza *****
-- Clear SQL editor, paste ALL, Run once. Safe to re-run.

DELETE FROM menu_item_labels WHERE menu_item_id = 'a1000001-0000-0000-0000-000000000010'::uuid AND label_id IN (SELECT id FROM labels WHERE slug = 'raw');
DELETE FROM menu_item_labels WHERE menu_item_id = 'a1000001-0000-0000-0000-00000000004c'::uuid AND label_id IN (SELECT id FROM labels WHERE slug = 'raw');
DELETE FROM menu_item_labels WHERE menu_item_id = 'a1000001-0000-0000-0000-000000000041'::uuid AND label_id IN (SELECT id FROM labels WHERE slug = 'raw');
DELETE FROM menu_item_labels WHERE menu_item_id = 'a2000001-0000-0000-0000-000000000005'::uuid AND label_id IN (SELECT id FROM labels WHERE slug = 'raw');
