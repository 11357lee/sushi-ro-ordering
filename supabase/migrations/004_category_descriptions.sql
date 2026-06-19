-- Add optional category descriptions shown under menu category titles.

ALTER TABLE categories ADD COLUMN IF NOT EXISTS description TEXT;

UPDATE restaurant_settings SET phone = '+1 (613) 724-6088';
