-- Add optional category descriptions shown under menu category titles.

ALTER TABLE categories ADD COLUMN IF NOT EXISTS description TEXT;

UPDATE restaurant_settings SET phone = '+1 (613) 724-6088';
UPDATE restaurant_settings SET timezone = 'America/Toronto';

UPDATE categories SET description = 'Warm noodle bowls served with rich broth and fresh toppings.' WHERE slug = 'ramen' AND description IS NULL;
UPDATE categories SET description = 'Crispy rice base topped with fresh seafood and house sauces.' WHERE slug = 'sushi-pizza' AND description IS NULL;
UPDATE categories SET description = 'Creative specialty rolls with Sushi-Ro''s signature combinations.' WHERE slug = 'fusion-roll' AND description IS NULL;
UPDATE categories SET description = 'Shareable sushi trays for groups, parties, and family meals.' WHERE slug = 'tray' AND description IS NULL;
UPDATE categories SET description = 'Chef-selected assortments of sushi, sashimi, and rolls.' WHERE slug = 'moriawase' AND description IS NULL;
UPDATE categories SET description = 'Complete meal boxes served with your choice of side.' WHERE slug = 'bento-box' AND description IS NULL;
UPDATE categories SET description = 'Classic nigiri and sashimi prepared fresh to order.' WHERE slug = 'nigiri-sashimi' AND description IS NULL;
