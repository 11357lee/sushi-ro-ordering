-- Full menu catalog from March 2026 posters
INSERT INTO categories (id, section_id, name, slug, sort_order, description)
VALUES ('c2000001-0000-0000-0000-000000000006', '11111111-1111-1111-1111-111111111102', 'Nigiri & Sashimi', 'gf-nigiri-sashimi', 0, NULL)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, slug = EXCLUDED.slug, sort_order = EXCLUDED.sort_order;

INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a1000001-0000-0000-0000-000000000001', 'c1000001-0000-0000-0000-000000000001', 'EBI', 'Shrimp', 5.5, true, false, 1)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a1000001-0000-0000-0000-000000000018', 'c1000001-0000-0000-0000-000000000001', 'TAI', 'Snapper', 6.5, true, false, 2)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a1000001-0000-0000-0000-000000000019', 'c1000001-0000-0000-0000-000000000001', 'IKA', 'Squid', 7, true, false, 3)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a1000001-0000-0000-0000-00000000001a', 'c1000001-0000-0000-0000-000000000001', 'TAKO', 'Octopus', 7, true, false, 4)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a1000001-0000-0000-0000-000000000002', 'c1000001-0000-0000-0000-000000000001', 'SAKE', 'Salmon', 7, true, false, 5)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a1000001-0000-0000-0000-00000000001b', 'c1000001-0000-0000-0000-000000000001', 'ESCOLAR', 'Butter Fish', 7, true, false, 6)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a1000001-0000-0000-0000-00000000001c', 'c1000001-0000-0000-0000-000000000001', 'SABA', 'Mackerel', 7.5, true, false, 7)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a1000001-0000-0000-0000-00000000001d', 'c1000001-0000-0000-0000-000000000001', 'HOKIGAI', 'Surf Clam', 7, true, false, 8)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a1000001-0000-0000-0000-00000000001e', 'c1000001-0000-0000-0000-000000000001', 'ALBACORE', 'White Tuna', 7.5, true, false, 9)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a1000001-0000-0000-0000-00000000001f', 'c1000001-0000-0000-0000-000000000001', 'HOTATE', 'Scallop', 7.5, true, false, 10)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a1000001-0000-0000-0000-000000000003', 'c1000001-0000-0000-0000-000000000001', 'MAGURO', 'Red Tuna', 7.5, true, false, 11)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a1000001-0000-0000-0000-000000000020', 'c1000001-0000-0000-0000-000000000001', 'UNAGI', 'BBQ Eel', 7.5, true, false, 12)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a1000001-0000-0000-0000-000000000021', 'c1000001-0000-0000-0000-000000000001', 'HAMACHI', 'Yellow Tail', 7.5, true, false, 13)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a1000001-0000-0000-0000-000000000022', 'c1000001-0000-0000-0000-000000000001', 'MASAGO', 'Capelin Roe', 7, true, false, 14)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a1000001-0000-0000-0000-000000000023', 'c1000001-0000-0000-0000-000000000001', 'TOBIKO', 'Flying Fish Roe', 7.5, true, false, 15)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a1000001-0000-0000-0000-000000000024', 'c1000001-0000-0000-0000-000000000001', 'IKURA', 'Salmon Roe', 13.5, true, false, 16)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a1000001-0000-0000-0000-000000000004', 'c1000001-0000-0000-0000-000000000002', 'KAPPA MAKI', '6 pcs — Cucumber', 6, true, true, 1)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a1000001-0000-0000-0000-000000000005', 'c1000001-0000-0000-0000-000000000002', 'AVOCADO MAKI', '6 pcs', 7.5, true, true, 2)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a1000001-0000-0000-0000-000000000029', 'c1000001-0000-0000-0000-000000000002', 'CUCUMBER AVOCADO MAKI', '6 pcs', 7.5, true, true, 3)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a1000001-0000-0000-0000-00000000002a', 'c1000001-0000-0000-0000-000000000002', 'ASPARAGUS MAKI', '6 pcs', 7.5, true, true, 4)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a1000001-0000-0000-0000-00000000002b', 'c1000001-0000-0000-0000-000000000002', 'GRILLED VEGGIE MAKI', '6 pcs — Pepper, zucchini, eggplant, carrot', 7.5, true, true, 5)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a1000001-0000-0000-0000-00000000002c', 'c1000001-0000-0000-0000-000000000002', 'SWEET POTATO MAKI', '6 pcs', 8, true, true, 6)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a1000001-0000-0000-0000-00000000002d', 'c1000001-0000-0000-0000-000000000002', 'SWEET N'' CREAM MAKI', '6 pcs — Sweet potato tempura, avocado, cream cheese', 9, true, true, 7)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a1000001-0000-0000-0000-00000000002e', 'c1000001-0000-0000-0000-000000000002', 'SEAWEED CUCUMBER MAKI', '6 pcs — Seaweed salad, cucumber', 7.5, true, true, 8)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a1000001-0000-0000-0000-00000000002f', 'c1000001-0000-0000-0000-000000000002', 'INARI ROLL', '6 pcs — Salmon, tempura bits, spicy mayo, green onion', 7.5, true, true, 9)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a1000001-0000-0000-0000-000000000006', 'c1000001-0000-0000-0000-000000000002', 'VEGETABLE DRAGON MAKI', '8 pcs — Sweet potato tempura, cucumber, topped with avocado, grilled veggies, inari', 14, true, true, 10)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a1000001-0000-0000-0000-00000000000b', 'c1000001-0000-0000-0000-000000000003', 'MISO SOUP', 'Seaweed, tofu and green onion. Spicy available +$1', 3, true, false, 1)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a1000001-0000-0000-0000-000000000030', 'c1000001-0000-0000-0000-000000000003', 'TUNA AVOCADO SALAD', 'White tuna and avocado with sweet soy sauce and fried garlic', 14, true, false, 2)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a1000001-0000-0000-0000-000000000031', 'c1000001-0000-0000-0000-000000000003', 'HOUSE SALAD', 'Assorted greens with ginger dressing', 6.5, true, false, 3)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a1000001-0000-0000-0000-00000000000c', 'c1000001-0000-0000-0000-000000000003', 'WAKAME SALAD', 'Japanese seaweed salad', 7, true, false, 4)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a1000001-0000-0000-0000-000000000032', 'c1000001-0000-0000-0000-000000000003', 'BLACK FUNGUS SALAD', 'Inari, asparagus, black fungus with soy chili sauce, fried ginger and green onion', 9.5, true, false, 5)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a1000001-0000-0000-0000-000000000033', 'c1000001-0000-0000-0000-000000000003', 'BAMBOO SHOOT SALAD', 'Bamboo shoot, soybeans, cucumber with soy chili sauce, fried ginger and green onion', 9.5, true, false, 6)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a1000001-0000-0000-0000-000000000034', 'c1000001-0000-0000-0000-000000000003', 'GARI SALMON', '5 pcs — Pickled ginger, avocado, fish roe, cucumber, spicy mayo, sweet spicy sauce, wrapped with raw salmon', 15, true, false, 7)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a1000001-0000-0000-0000-000000000008', 'c1000001-0000-0000-0000-000000000003', 'AGEDASHI TOFU', 'Deep-fried tofu', 8, true, false, 8)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a1000001-0000-0000-0000-000000000035', 'c1000001-0000-0000-0000-000000000003', 'PORK OR CHICKEN CUTLET', 'With spicy sauce', 9, true, false, 9)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a1000001-0000-0000-0000-000000000009', 'c1000001-0000-0000-0000-000000000003', 'SHRIMP TEMPURA', '4 pcs', 10, true, false, 10)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a1000001-0000-0000-0000-000000000036', 'c1000001-0000-0000-0000-000000000003', 'VEGGIE OR PORK GYOZA', '5 pcs', 7.5, true, false, 11)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a1000001-0000-0000-0000-000000000007', 'c1000001-0000-0000-0000-000000000003', 'EDAMAME', 'Steamed soybeans. Spicy available +$1.50', 7, true, false, 12)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a1000001-0000-0000-0000-000000000037', 'c1000001-0000-0000-0000-000000000003', 'KARAKUCHI SHRIMP', '6 pcs — Deep-fried shrimp with spicy sauce', 13, true, false, 13)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a1000001-0000-0000-0000-000000000038', 'c1000001-0000-0000-0000-000000000003', 'TAKOYAKI', '6 pcs — Octopus ball with bonito flake, mayo and teriyaki sauce', 11.5, true, false, 14)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a1000001-0000-0000-0000-000000000039', 'c1000001-0000-0000-0000-000000000003', 'BABY OCTOPUS', '8 pcs — Deep-fried octopus with fried onion and pepper', 15, true, false, 15)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a1000001-0000-0000-0000-00000000003a', 'c1000001-0000-0000-0000-000000000003', 'CATERPILLAR ROLL', '5 pcs — Avocado, smoked salmon, cream cheese, fish roe, crab meat, mayo, wrapped with cucumber', 14, true, false, 16)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a1000001-0000-0000-0000-00000000003b', 'c1000001-0000-0000-0000-000000000003', 'SALMON OR TUNA TATAKI', 'Lightly breaded and slightly deep-fried salmon or tuna (+$1 for tuna)', 15.5, true, false, 17)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a1000001-0000-0000-0000-00000000003c', 'c1000001-0000-0000-0000-000000000003', 'LOBSTER TEMPURA', '4 oz — Deep-fried lobster tail with bonito flake', 16.5, true, false, 18)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a1000001-0000-0000-0000-00000000003d', 'c1000001-0000-0000-0000-000000000003', 'SPRING ROLL', '5 pcs — Vegetable, with honey sauce', 8.5, true, false, 19)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a1000001-0000-0000-0000-00000000003e', 'c1000001-0000-0000-0000-000000000003', 'VEGETABLE TEMPURA', '2 sweet potato, 1 eggplant, 1 asparagus, 1 zucchini', 9.5, true, false, 20)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a1000001-0000-0000-0000-00000000003f', 'c1000001-0000-0000-0000-000000000003', 'CHICKEN KARAAGE', 'With wasabi mayo sauce', 12.5, true, false, 21)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a1000001-0000-0000-0000-000000000040', 'c1000001-0000-0000-0000-000000000003', 'SOFTSHELL CRAB', 'Deep-fried softshell crab with plum sauce', 13.5, true, false, 22)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a1000001-0000-0000-0000-000000000041', 'c1000001-0000-0000-0000-000000000004', 'VEGGIE PIZZA', 'Torched vegetable with teriyaki sauce', 11, true, false, 1)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a1000001-0000-0000-0000-00000000000a', 'c1000001-0000-0000-0000-000000000004', 'SALMON PIZZA', 'Torched salmon with unagi sauce', 12.5, true, false, 2)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a1000001-0000-0000-0000-000000000042', 'c1000001-0000-0000-0000-000000000004', 'EEL PIZZA', 'Avocado, torched BBQ eel with unagi sauce', 14, true, false, 3)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a1000001-0000-0000-0000-000000000043', 'c1000001-0000-0000-0000-000000000004', 'TUNA PIZZA', 'Torched red tuna with unagi sauce', 13.5, true, false, 4)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a1000001-0000-0000-0000-000000000044', 'c1000001-0000-0000-0000-000000000006', 'SAKE OR TEKKA MAKI', '6 pcs — Salmon or red tuna (+$1 for tuna)', 7.5, true, true, 1)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a1000001-0000-0000-0000-00000000000d', 'c1000001-0000-0000-0000-000000000006', 'CALIFORNIA MAKI', '6 pcs — Cucumber, avocado, crab meat, fish roe. Deep-fried available (+$1)', 8.5, true, true, 2)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a1000001-0000-0000-0000-000000000045', 'c1000001-0000-0000-0000-000000000006', 'BBQ SALMON OR TUNA MAKI', '6 pcs — Cucumber, avocado, unagi sauce. Salmon or white tuna', 9, true, true, 3)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a1000001-0000-0000-0000-000000000046', 'c1000001-0000-0000-0000-000000000006', 'ALASKA SALMON OR TUNA MAKI', '6 pcs — Cucumber, avocado. Choice of salmon or tuna (+$1 for tuna)', 9, true, true, 4)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a1000001-0000-0000-0000-000000000047', 'c1000001-0000-0000-0000-000000000006', 'NEGI HAMACHI MAKI', '6 pcs — Chopped yellow tail fish with green onion', 8.5, true, true, 5)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a1000001-0000-0000-0000-000000000048', 'c1000001-0000-0000-0000-000000000006', 'PHILADELPHIA MAKI', '6 pcs — Smoked salmon, cucumber, cream cheese, green onion', 9.5, true, true, 6)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a1000001-0000-0000-0000-000000000049', 'c1000001-0000-0000-0000-000000000006', 'UNAGI MAKI', '6 pcs — Avocado, BBQ eel, unagi sauce', 9.5, true, true, 7)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a1000001-0000-0000-0000-00000000004a', 'c1000001-0000-0000-0000-000000000006', 'DYNAMITE MAKI', '8 pcs — Cucumber, avocado, shrimp tempura, tempura bits', 11.5, true, true, 8)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a1000001-0000-0000-0000-00000000000f', 'c1000001-0000-0000-0000-000000000006', 'SPIDER MAKI', '8 pcs — Cucumber, avocado, softshell crab, unagi sauce, fish roe', 14, true, true, 9)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a1000001-0000-0000-0000-00000000000e', 'c1000001-0000-0000-0000-000000000006', 'SPICY SALMON MAKI', '6 pcs — Salmon, avocado, spicy mayo', 9, true, true, 10)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a1000001-0000-0000-0000-00000000004b', 'c1000001-0000-0000-0000-000000000006', 'SPICY TUNA OR SCALLOP MAKI', '6 pcs — Tuna or scallop, tempura bits, spicy mayo, green onion', 9.5, true, true, 11)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a1000001-0000-0000-0000-000000000010', 'c1000001-0000-0000-0000-000000000007', 'DRAGON ROLL WITH YOUR TOPPING', '8 pcs — Cucumber, avocado, crab meat, shrimp tempura. Green (avocado) $13, Gold (salmon) or White (snapper) $14, Red (red tuna) or Rainbow (assorted fish with fish roe) $14.5, Black (BBQ eel) $15', 13, true, true, 1)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a1000001-0000-0000-0000-00000000004c', 'c1000001-0000-0000-0000-000000000007', 'HOUSE ROLL WITH YOUR TOPPING', '8 pcs — Choice of shrimp, snapper, butter fish or scallop. Cucumber, avocado, crab meat. Topped with fish roe, cheese sauce, unagi sauce, cheese powder, tempura bits, green onion', 13, true, true, 2)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a1000001-0000-0000-0000-00000000004d', 'c1000001-0000-0000-0000-000000000007', 'KAMIKAZE', '8 pcs — Deep-fried roll. Avocado, cream cheese, jalapeño, assorted fish. Topped with spicy mayo, sweet spicy sauce, unagi sauce', 14, true, true, 3)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a1000001-0000-0000-0000-00000000004e', 'c1000001-0000-0000-0000-000000000007', 'FUJI MOUNTAIN', '8 pcs — Cucumber, avocado, crab meat, salmon. Topped with fish roe, tempura bits, spicy mayo, sweet spicy sauce', 14, true, true, 4)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a1000001-0000-0000-0000-00000000004f', 'c1000001-0000-0000-0000-000000000007', 'TROPICANA', '8 pcs — Cucumber, shrimp tempura, crab meat. Topped with mango, scallop, green onion, coconut, spicy mayo, sweet spicy sauce', 15, true, true, 5)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a1000001-0000-0000-0000-000000000012', 'c1000001-0000-0000-0000-000000000007', 'CLOUD NINE', '8 pcs — Avocado, breaded cream cheese, asparagus. Topped with smoked salmon, onion, pepper, fried garlic', 15.5, true, true, 6)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a1000001-0000-0000-0000-000000000050', 'c1000001-0000-0000-0000-000000000007', 'OCEAN WAVE', '8 pcs — Avocado, shrimp tempura. Topped with assorted fish, cheese sauce, unagi sauce', 15.5, true, true, 7)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a1000001-0000-0000-0000-000000000051', 'c1000001-0000-0000-0000-000000000007', 'GALAXY', '8 pcs — Cucumber, cream cheese. Topped with smoked salmon, crab meat, mayo, fried ginger, green onion, fish roe', 16, true, true, 8)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a1000001-0000-0000-0000-000000000011', 'c1000001-0000-0000-0000-000000000007', 'ROCK''N ROLL', '8 pcs — Cucumber, avocado, lobster tempura. Topped with fish roe, fried ginger, green onion, garlic', 16.5, true, true, 9)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a1000001-0000-0000-0000-000000000052', 'c1000001-0000-0000-0000-000000000008', 'MAKI MORIAWASE', '17 pcs — 8 shrimp roll, 3 California, 3 spicy salmon, 3 tekka. Includes miso soup', 22, true, false, 1)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a1000001-0000-0000-0000-000000000013', 'c1000001-0000-0000-0000-000000000008', 'SUSHI MORIAWASE', '6 maki (3 California, 3 spicy salmon), 6 nigiri (salmon, red tuna, white tuna, butter fish, snapper, shrimp). Includes miso soup', 21, true, false, 2)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a1000001-0000-0000-0000-000000000053', 'c1000001-0000-0000-0000-000000000008', 'SASHIMI MORIAWASE', '14 pcs — 2 salmon, 2 red tuna, 2 white tuna, 2 butter fish, 2 snapper, 2 surf clam, 2 shrimp. Includes miso soup', 27, true, false, 3)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a1000001-0000-0000-0000-000000000054', 'c1000001-0000-0000-0000-000000000008', 'DELUXE MORIAWASE', '6 maki (3 California, 3 spicy salmon), 5 nigiri (salmon, red tuna, butter fish, snapper, shrimp), 6 sashimi (2 salmon, 2 red tuna, 2 butter fish). Includes miso soup', 32, true, false, 4)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a1000001-0000-0000-0000-000000000014', 'c1000001-0000-0000-0000-000000000008', 'SUSHI-RO BOAT FOR 2', '14 maki (3 California, 3 spicy salmon, 8 dragon), 10 nigiri (2 salmon, 2 red tuna, 2 butter fish, 2 snapper, 2 shrimp), 10 sashimi (2 salmon, 2 red tuna, 2 white tuna, 2 snapper, 2 surf clam). Includes miso soup', 65, true, false, 5)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a1000001-0000-0000-0000-000000000055', 'c1000001-0000-0000-0000-000000000008', 'SUSHI-RO BOAT FOR 3', '28 maki (6 California, 3 spicy salmon, 3 spicy tuna, 8 dynamite, 8 dragon), 14 nigiri (3 salmon, 3 red tuna, 2 butter fish, 2 snapper, 2 shrimp, 2 hamachi), 17 sashimi (3 salmon, 3 red tuna, 2 white tuna, 2 snapper, 2 surf clam, 2 butter fish, 2 hamachi, 1 squid). Includes miso soup', 108, true, false, 6)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a1000001-0000-0000-0000-000000000056', 'c1000001-0000-0000-0000-000000000008', 'MAKI TRAY', '6 California, 6 spicy salmon, 6 spicy tuna, 6 spicy scallop, 6 sake, 6 tekka, 6 Alaska-salmon, 6 Philadelphia, 8 dynamite, 6 BBQ salmon, 8 spider', 104, true, false, 7)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a1000001-0000-0000-0000-000000000057', 'c1000001-0000-0000-0000-000000000008', 'VEGGIE TRAY', '12 sweet potato, 12 avocado, 12 asparagus, 12 grilled veggie, 2 inari, 12 kappa', 75, true, false, 8)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a1000001-0000-0000-0000-000000000028', 'c1000001-0000-0000-0000-000000000009', 'VEGETABLE RAMEN', 'Vegetable broth, bean sprout, tofu. Spicy available +$1', 15.5, true, false, 1)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a1000001-0000-0000-0000-000000000015', 'c1000001-0000-0000-0000-000000000009', 'TONKOTSU RAMEN', 'Pork broth, chashu. Spicy available +$1', 17, true, false, 2)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a1000001-0000-0000-0000-000000000026', 'c1000001-0000-0000-0000-000000000009', 'MISO RAMEN', 'Chicken broth, seasoned chicken, fried onion. Spicy available +$1', 17, true, false, 3)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a1000001-0000-0000-0000-000000000027', 'c1000001-0000-0000-0000-000000000009', 'SHOYU RAMEN', 'Beef broth, slow-cooked beef, bean sprout. Spicy available +$1', 18, true, false, 4)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a1000001-0000-0000-0000-000000000016', 'c1000001-0000-0000-0000-00000000000a', 'BENTO BOX', 'Includes rice, grilled veggie, orange, choice of your meat and side', 0, true, false, 1)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a1000001-0000-0000-0000-000000000025', 'c1000001-0000-0000-0000-00000000000a', 'VEGGIE BENTO', 'Rice, grilled veggie, orange, agedashi tofu, vegetable tempura', 17, true, false, 2)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a1000001-0000-0000-0000-000000000017', 'c1000001-0000-0000-0000-00000000000b', 'MATCHA TIRAMISU', 'Green tea tiramisu', 5.5, true, false, 1)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a1000001-0000-0000-0000-000000000058', 'c1000001-0000-0000-0000-00000000000b', 'SWEET POTATO CAKE', NULL, 5.5, true, false, 2)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a2000001-0000-0000-0000-000000000008', 'c2000001-0000-0000-0000-000000000006', 'EBI (GF)', 'Shrimp', 5.5, true, false, 1)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a2000001-0000-0000-0000-000000000009', 'c2000001-0000-0000-0000-000000000006', 'TAI (GF)', 'Snapper', 6.5, true, false, 2)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a2000001-0000-0000-0000-00000000000a', 'c2000001-0000-0000-0000-000000000006', 'IKA (GF)', 'Squid', 7, true, false, 3)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a2000001-0000-0000-0000-00000000000b', 'c2000001-0000-0000-0000-000000000006', 'TAKO (GF)', 'Octopus', 7, true, false, 4)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a2000001-0000-0000-0000-00000000000c', 'c2000001-0000-0000-0000-000000000006', 'SAKE (GF)', 'Salmon', 7, true, false, 5)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a2000001-0000-0000-0000-00000000000d', 'c2000001-0000-0000-0000-000000000006', 'ESCOLAR (GF)', 'Butter Fish', 7, true, false, 6)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a2000001-0000-0000-0000-00000000000e', 'c2000001-0000-0000-0000-000000000006', 'SABA (GF)', 'Mackerel', 7, true, false, 7)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a2000001-0000-0000-0000-00000000000f', 'c2000001-0000-0000-0000-000000000006', 'HOKIGAI (GF)', 'Surf Clam', 7.5, true, false, 8)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a2000001-0000-0000-0000-000000000010', 'c2000001-0000-0000-0000-000000000006', 'ALBACORE (GF)', 'White Tuna', 7.5, true, false, 9)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a2000001-0000-0000-0000-000000000011', 'c2000001-0000-0000-0000-000000000006', 'HOTATE (GF)', 'Scallop', 7.5, true, false, 10)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a2000001-0000-0000-0000-000000000012', 'c2000001-0000-0000-0000-000000000006', 'MAGURO (GF)', 'Red Tuna', 7.5, true, false, 11)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a2000001-0000-0000-0000-000000000013', 'c2000001-0000-0000-0000-000000000006', 'HAMACHI (GF)', 'Yellow Tail', 7.5, true, false, 12)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a2000001-0000-0000-0000-000000000001', 'c2000001-0000-0000-0000-000000000001', 'SAKE OR TEKKA MAKI (GF)', '6 pcs — Salmon or red tuna (+$1 for tuna)', 7.5, true, true, 1)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a2000001-0000-0000-0000-000000000017', 'c2000001-0000-0000-0000-000000000001', 'BBQ SALMON OR TUNA MAKI (GF)', '6 pcs — Cucumber, avocado, salmon or white tuna', 9, true, true, 2)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a2000001-0000-0000-0000-000000000018', 'c2000001-0000-0000-0000-000000000001', 'ALASKA SALMON OR TUNA MAKI (GF)', '6 pcs — Cucumber, avocado. Choice of salmon or tuna (+$1 for tuna)', 9, true, true, 3)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a2000001-0000-0000-0000-000000000019', 'c2000001-0000-0000-0000-000000000001', 'NEGI HAMACHI MAKI (GF)', '6 pcs — Chopped yellow tail fish with green onion', 8.5, true, true, 4)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a2000001-0000-0000-0000-00000000001a', 'c2000001-0000-0000-0000-000000000001', 'PHILADELPHIA MAKI (GF)', '6 pcs — Smoked salmon, cucumber, cream cheese, green onion', 9.5, true, true, 5)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a2000001-0000-0000-0000-00000000001b', 'c2000001-0000-0000-0000-000000000001', 'SPIDER MAKI (GF)', '8 pcs — Cucumber, avocado, softshell crab', 14, true, true, 6)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a2000001-0000-0000-0000-000000000002', 'c2000001-0000-0000-0000-000000000001', 'SPICY SALMON MAKI (GF)', '6 pcs — Salmon, avocado, spicy mayo', 9, true, true, 7)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a2000001-0000-0000-0000-00000000001c', 'c2000001-0000-0000-0000-000000000001', 'SPICY TUNA OR SCALLOP MAKI (GF)', '6 pcs — Tuna or scallop, avocado, spicy mayo, green onion', 9.5, true, true, 8)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a2000001-0000-0000-0000-000000000003', 'c2000001-0000-0000-0000-000000000002', 'KAPPA MAKI (GF)', '6 pcs — Cucumber', 6, true, true, 1)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a2000001-0000-0000-0000-00000000001d', 'c2000001-0000-0000-0000-000000000002', 'AVOCADO MAKI (GF)', '6 pcs', 7.5, true, true, 2)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a2000001-0000-0000-0000-00000000001e', 'c2000001-0000-0000-0000-000000000002', 'CUCUMBER AVOCADO MAKI (GF)', '6 pcs', 7.5, true, true, 3)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a2000001-0000-0000-0000-00000000001f', 'c2000001-0000-0000-0000-000000000002', 'ASPARAGUS MAKI (GF)', '6 pcs', 7.5, true, true, 4)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a2000001-0000-0000-0000-000000000020', 'c2000001-0000-0000-0000-000000000002', 'GRILLED VEGGIE MAKI (GF)', '6 pcs — Pepper, zucchini, eggplant, carrot', 7.5, true, true, 5)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a2000001-0000-0000-0000-000000000021', 'c2000001-0000-0000-0000-000000000002', 'SWEET POTATO MAKI (GF)', '6 pcs', 8, true, true, 6)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a2000001-0000-0000-0000-000000000022', 'c2000001-0000-0000-0000-000000000002', 'SWEET N'' CREAM MAKI (GF)', '6 pcs — Sweet potato, avocado, cream cheese', 9, true, true, 7)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a2000001-0000-0000-0000-000000000023', 'c2000001-0000-0000-0000-000000000002', 'SEAWEED CUCUMBER MAKI (GF)', '6 pcs — Seaweed salad, cucumber', 7.5, true, true, 8)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a2000001-0000-0000-0000-000000000024', 'c2000001-0000-0000-0000-000000000002', 'VEGETABLE DRAGON MAKI (GF)', '8 pcs — Sweet potato, cucumber, topped with avocado, grilled veggies', 14, true, true, 9)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a2000001-0000-0000-0000-000000000004', 'c2000001-0000-0000-0000-000000000003', 'EDAMAME (GF)', 'Steamed soybeans', 7, true, false, 1)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a2000001-0000-0000-0000-000000000025', 'c2000001-0000-0000-0000-000000000003', 'CATERPILLAR ROLL (GF)', '5 pcs — Avocado, smoked salmon, cream cheese, mayo, wrapped with cucumber', 14, true, false, 2)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a2000001-0000-0000-0000-000000000026', 'c2000001-0000-0000-0000-000000000003', 'GARI SALMON (GF)', '5 pcs — Pickled ginger, avocado, cucumber, spicy mayo, sweet spicy sauce, wrapped with raw salmon', 15, true, false, 3)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a2000001-0000-0000-0000-000000000027', 'c2000001-0000-0000-0000-000000000003', 'WAKAME SALAD (GF)', 'Japanese seaweed salad', 7, true, false, 4)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a2000001-0000-0000-0000-000000000005', 'c2000001-0000-0000-0000-000000000004', 'DRAGON WITH YOUR TOPPING (GF)', '8 pcs — Cucumber, avocado, shrimp + topping. Green (avocado) $14, Gold (salmon) or White (snapper) $15, Red (red tuna) or Rainbow (assorted fish) $15.5', 14, true, true, 1)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a2000001-0000-0000-0000-000000000006', 'c2000001-0000-0000-0000-000000000004', 'FUJI MOUNTAIN (GF)', '8 pcs — Cucumber, avocado, salmon, spicy mayo, sweet spicy sauce', 14, true, true, 2)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a2000001-0000-0000-0000-000000000028', 'c2000001-0000-0000-0000-000000000004', 'TROPICANA (GF)', '8 pcs — Cucumber, shrimp. Topped with mango, scallop, green onion, coconut, spicy mayo, sweet spicy sauce', 15, true, true, 3)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a2000001-0000-0000-0000-000000000029', 'c2000001-0000-0000-0000-000000000004', 'CLOUD NINE (GF)', '8 pcs — Avocado, cream cheese, asparagus. Topped with smoked salmon, onion, pepper, fried garlic', 15.5, true, true, 4)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a2000001-0000-0000-0000-00000000002a', 'c2000001-0000-0000-0000-000000000004', 'GALAXY (GF)', '8 pcs — Cucumber, cream cheese. Topped with smoked salmon, mayo, fried ginger, green onion', 16, true, true, 5)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a2000001-0000-0000-0000-00000000002b', 'c2000001-0000-0000-0000-000000000004', 'ROCK''N ROLL (GF)', '8 pcs — Cucumber, avocado, lobster tail. Topped with fried ginger, green onion, garlic', 16.5, true, true, 6)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a2000001-0000-0000-0000-000000000007', 'c2000001-0000-0000-0000-000000000005', 'SUSHI MORIAWASE (GF)', '6 maki (3 cucumber-avocado, 3 spicy salmon), 6 nigiri (salmon, red tuna, white tuna, butter fish, snapper, shrimp)', 21, true, false, 1)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a2000001-0000-0000-0000-00000000002c', 'c2000001-0000-0000-0000-000000000005', 'SASHIMI MORIAWASE (GF)', '14 pcs — 2 salmon, 2 red tuna, 2 white tuna, 2 butter fish, 2 snapper, 2 surf clam, 2 shrimp', 27, true, false, 2)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a2000001-0000-0000-0000-00000000002d', 'c2000001-0000-0000-0000-000000000005', 'DELUXE MORIAWASE (GF)', '6 maki (3 cucumber-avocado, 3 spicy salmon), 5 nigiri (salmon, red tuna, butter fish, snapper, shrimp), 6 sashimi (2 salmon, 2 red tuna, 2 butter fish)', 32, true, false, 3)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a2000001-0000-0000-0000-00000000002e', 'c2000001-0000-0000-0000-000000000005', 'SUSHI-RO BOAT FOR 2 (GF)', '14 maki (3 cucumber-avocado, 3 spicy salmon, 8 dragon), 10 nigiri (2 salmon, 2 red tuna, 2 butter fish, 2 snapper, 2 shrimp), 10 sashimi (2 salmon, 2 red tuna, 2 white tuna, 2 snapper, 2 surf clam)', 65, true, false, 4)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
INSERT INTO menu_items (id, category_id, name, description, price, is_available, has_roll_options, sort_order)
VALUES ('a2000001-0000-0000-0000-00000000002f', 'c2000001-0000-0000-0000-000000000005', 'SUSHI-RO BOAT FOR 3 (GF)', '28 maki (6 cucumber-avocado, 3 spicy salmon, 3 spicy tuna, 8 dynamite, 8 dragon), 14 nigiri (3 salmon, 3 red tuna, 2 butter fish, 2 snapper, 2 shrimp, 2 hamachi), 17 sashimi (3 salmon, 3 red tuna, 2 snapper, 2 surf clam, 3 butter fish, 3 hamachi, 1 squid)', 108, true, false, 5)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, is_available = EXCLUDED.is_available, has_roll_options = EXCLUDED.has_roll_options, sort_order = EXCLUDED.sort_order;
