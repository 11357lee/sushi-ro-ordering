-- Remove customer email (not collected on checkout)

ALTER TABLE customers DROP COLUMN IF EXISTS email;
