-- Restore menu visibility if a prior partial migration disabled most items.
UPDATE menu_items SET is_available = true;
UPDATE menu_items SET is_available = false WHERE id = 'a1000001-0000-0000-0000-00000000004b'::uuid;
UPDATE menu_items SET is_available = false WHERE id = 'a1000001-0000-0000-0000-00000000005a'::uuid;
UPDATE menu_items SET is_available = false WHERE id = 'a2000001-0000-0000-0000-00000000001c'::uuid;
UPDATE menu_items SET is_available = false WHERE id = 'a2000001-0000-0000-0000-000000000031'::uuid;
UPDATE menu_items SET is_available = false WHERE id = 'a1000001-0000-0000-0000-00000000000a'::uuid;
UPDATE menu_items SET is_available = false WHERE id = 'a1000001-0000-0000-0000-000000000042'::uuid;
UPDATE menu_items SET is_available = false WHERE id = 'a1000001-0000-0000-0000-000000000043'::uuid;
