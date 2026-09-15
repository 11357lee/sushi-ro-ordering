-- Fix SUSHI PIZZA description (toppings copy, not "choose one" price list).

UPDATE menu_items
SET description = 'Torched cheese sauce, cheese powder, pepper and onion'
WHERE id = CAST('a1000001-0000-0000-0000-000000000041' AS uuid);
