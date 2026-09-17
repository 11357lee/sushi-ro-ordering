-- ***** RESTORE_MENU_AVAILABILITY *****
-- If the main page is missing most items, earlier SQL may have set
-- is_available=false on the whole menu. This restores availability.
-- Clear SQL editor, paste ALL, Run once.

UPDATE menu_items SET is_available = true;
UPDATE menu_items SET is_available = false WHERE id = 'a1000001-0000-0000-0000-00000000004b'::uuid;
UPDATE menu_items SET is_available = false WHERE id = 'a1000001-0000-0000-0000-00000000005a'::uuid;
UPDATE menu_items SET is_available = false WHERE id = 'a2000001-0000-0000-0000-00000000001c'::uuid;
UPDATE menu_items SET is_available = false WHERE id = 'a2000001-0000-0000-0000-000000000031'::uuid;
UPDATE menu_items SET is_available = false WHERE id = 'a1000001-0000-0000-0000-00000000000a'::uuid;
UPDATE menu_items SET is_available = false WHERE id = 'a1000001-0000-0000-0000-000000000042'::uuid;
UPDATE menu_items SET is_available = false WHERE id = 'a1000001-0000-0000-0000-000000000043'::uuid;
