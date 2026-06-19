-- Sushi-Ro one-time database setup
-- Paste entire file into Supabase → SQL Editor → Run

-- Sushi-Ro Online Ordering System Schema

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Menu sections (Menu vs Gluten Free)
CREATE TABLE menu_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  sort_order INT NOT NULL DEFAULT 0,
  accent_color TEXT NOT NULL DEFAULT '#1a1a1a',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_id UUID NOT NULL REFERENCES menu_sections(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(section_id, slug)
);

CREATE TABLE labels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE menu_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  is_available BOOLEAN NOT NULL DEFAULT TRUE,
  has_roll_options BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE menu_item_labels (
  menu_item_id UUID NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
  label_id UUID NOT NULL REFERENCES labels(id) ON DELETE CASCADE,
  PRIMARY KEY (menu_item_id, label_id)
);

CREATE TABLE menu_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  price_modifier DECIMAL(10, 2) NOT NULL DEFAULT 0,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE menu_item_options (
  menu_item_id UUID NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
  menu_option_id UUID NOT NULL REFERENCES menu_options(id) ON DELETE CASCADE,
  PRIMARY KEY (menu_item_id, menu_option_id)
);

CREATE TABLE featured_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  menu_item_id UUID NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(menu_item_id)
);

CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name TEXT NOT NULL,
  last_name TEXT,
  phone TEXT NOT NULL,
  email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(phone)
);

CREATE TYPE order_status AS ENUM (
  'pending',
  'accepted',
  'rejected',
  'completed',
  'cancelled'
);

CREATE TYPE pickup_type AS ENUM ('asap', 'scheduled');

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number SERIAL,
  customer_id UUID NOT NULL REFERENCES customers(id),
  status order_status NOT NULL DEFAULT 'pending',
  pickup_type pickup_type NOT NULL,
  pickup_time TIMESTAMPTZ,
  cutlery BOOLEAN NOT NULL DEFAULT FALSE,
  cutlery_quantity INT NOT NULL DEFAULT 0,
  extra_wasabi BOOLEAN NOT NULL DEFAULT FALSE,
  extra_ginger BOOLEAN NOT NULL DEFAULT FALSE,
  extra_soy_sauce BOOLEAN NOT NULL DEFAULT FALSE,
  no_wasabi BOOLEAN NOT NULL DEFAULT FALSE,
  no_ginger BOOLEAN NOT NULL DEFAULT FALSE,
  no_soy_sauce BOOLEAN NOT NULL DEFAULT FALSE,
  special_instructions TEXT,
  allergy_notes TEXT,
  subtotal DECIMAL(10, 2) NOT NULL DEFAULT 0,
  confirmed_at TIMESTAMPTZ,
  cancel_window_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id UUID REFERENCES menu_items(id) ON DELETE SET NULL,
  section_slug TEXT NOT NULL DEFAULT 'menu',
  name TEXT NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  selected_options JSONB NOT NULL DEFAULT '[]'::jsonb,
  special_request TEXT,
  line_total DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE restaurant_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  is_open BOOLEAN NOT NULL DEFAULT TRUE,
  banner_image_url TEXT,
  closing_time TIME NOT NULL DEFAULT '20:45:00',
  timezone TEXT NOT NULL DEFAULT 'America/Vancouver',
  business_email TEXT NOT NULL DEFAULT 'sushi-ro@sushi-ro.com',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE waiting_time (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  minutes INT NOT NULL DEFAULT 15 CHECK (minutes IN (15, 30, 60, 120)),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_menu_items_category ON menu_items(category_id);
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_customers_phone ON customers(phone);

-- Realtime for orders (admin notifications)
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE orders;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER customers_updated_at BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER menu_items_updated_at BEFORE UPDATE ON menu_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Row Level Security
ALTER TABLE menu_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE labels ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_item_labels ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_item_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE featured_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE waiting_time ENABLE ROW LEVEL SECURITY;

-- Public read for menu and settings
CREATE POLICY "Public read menu_sections" ON menu_sections FOR SELECT USING (true);
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public read labels" ON labels FOR SELECT USING (true);
CREATE POLICY "Public read menu_items" ON menu_items FOR SELECT USING (true);
CREATE POLICY "Public read menu_item_labels" ON menu_item_labels FOR SELECT USING (true);
CREATE POLICY "Public read menu_options" ON menu_options FOR SELECT USING (true);
CREATE POLICY "Public read menu_item_options" ON menu_item_options FOR SELECT USING (true);
CREATE POLICY "Public read featured_items" ON featured_items FOR SELECT USING (true);
CREATE POLICY "Public read restaurant_settings" ON restaurant_settings FOR SELECT USING (true);
CREATE POLICY "Public read waiting_time" ON waiting_time FOR SELECT USING (true);

-- Customers can read their own data via service role / API
CREATE POLICY "Public insert customers" ON customers FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read customers" ON customers FOR SELECT USING (true);
CREATE POLICY "Public update customers" ON customers FOR UPDATE USING (true);

-- Orders: insert and read own via API
CREATE POLICY "Public insert orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read orders" ON orders FOR SELECT USING (true);
CREATE POLICY "Public update orders" ON orders FOR UPDATE USING (true);

CREATE POLICY "Public insert order_items" ON order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read order_items" ON order_items FOR SELECT USING (true);

-- Seed data
-- Seed data for Sushi-Ro

INSERT INTO menu_sections (id, name, slug, sort_order, accent_color) VALUES
  ('11111111-1111-1111-1111-111111111101', 'Menu', 'menu', 1, '#1a1a1a'),
  ('11111111-1111-1111-1111-111111111102', 'Gluten Free', 'gluten-free', 2, '#0d9488');

INSERT INTO labels (id, name, slug) VALUES
  ('22222222-2222-2222-2222-222222222201', 'Vegetarian', 'vegetarian'),
  ('22222222-2222-2222-2222-222222222202', 'Egg', 'egg'),
  ('22222222-2222-2222-2222-222222222203', 'Cheese', 'cheese'),
  ('22222222-2222-2222-2222-222222222204', 'Popular', 'popular');

INSERT INTO menu_options (id, name, price_modifier, sort_order) VALUES
  ('33333333-3333-3333-3333-333333333301', 'Deep-fried', 1.00, 1),
  ('33333333-3333-3333-3333-333333333302', 'Replace with Soy Sheet', 1.00, 2),
  ('33333333-3333-3333-3333-333333333303', 'Spicy', 1.50, 3);

INSERT INTO restaurant_settings (is_open, banner_image_url, closing_time, business_email) VALUES
  (true, '/banner.jpg', '20:45:00', 'sushi-ro@sushi-ro.com');

INSERT INTO waiting_time (minutes) VALUES (15);

-- Menu categories
INSERT INTO categories (id, section_id, name, slug, sort_order) VALUES
  ('c1000001-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111101', 'Nigiri & Sashimi', 'nigiri-sashimi', 1),
  ('c1000001-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111101', 'Vegetable Roll', 'vegetable-roll', 2),
  ('c1000001-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111101', 'Appetizer', 'appetizer', 3),
  ('c1000001-0000-0000-0000-000000000004', '11111111-1111-1111-1111-111111111101', 'Sushi Pizza', 'sushi-pizza', 4),
  ('c1000001-0000-0000-0000-000000000005', '11111111-1111-1111-1111-111111111101', 'Soup & Salad', 'soup-salad', 5),
  ('c1000001-0000-0000-0000-000000000006', '11111111-1111-1111-1111-111111111101', 'Traditional Roll', 'traditional-roll', 6),
  ('c1000001-0000-0000-0000-000000000007', '11111111-1111-1111-1111-111111111101', 'Fusion Roll', 'fusion-roll', 7),
  ('c1000001-0000-0000-0000-000000000008', '11111111-1111-1111-1111-111111111101', 'Moriawase', 'moriawase', 8),
  ('c1000001-0000-0000-0000-000000000009', '11111111-1111-1111-1111-111111111101', 'Ramen', 'ramen', 9),
  ('c1000001-0000-0000-0000-00000000000a', '11111111-1111-1111-1111-111111111101', 'Bento Box', 'bento-box', 10),
  ('c1000001-0000-0000-0000-00000000000b', '11111111-1111-1111-1111-111111111101', 'Dessert', 'dessert', 11),
  ('c1000001-0000-0000-0000-00000000000c', '11111111-1111-1111-1111-111111111101', 'Tray', 'tray', 12),
  ('c2000001-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111102', 'Traditional Roll', 'gf-traditional-roll', 1),
  ('c2000001-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111102', 'Vegetable Roll', 'gf-vegetable-roll', 2),
  ('c2000001-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111102', 'Appetizer', 'gf-appetizer', 3),
  ('c2000001-0000-0000-0000-000000000004', '11111111-1111-1111-1111-111111111102', 'Fusion Roll', 'gf-fusion-roll', 4),
  ('c2000001-0000-0000-0000-000000000005', '11111111-1111-1111-1111-111111111102', 'Moriawase', 'gf-moriawase', 5);

-- Sample menu items (Menu section)
INSERT INTO menu_items (id, category_id, name, description, price, has_roll_options, sort_order) VALUES
  ('a1000001-0000-0000-0000-000000000001', 'c1000001-0000-0000-0000-000000000001', 'EBI Nigiri / Sashimi', 'Shrimp — 2 pc nigiri or 3 pc sashimi', 5.50, false, 1),
  ('a1000001-0000-0000-0000-000000000002', 'c1000001-0000-0000-0000-000000000001', 'SAKE Nigiri / Sashimi', 'Salmon — 2 pc nigiri or 3 pc sashimi', 7.00, false, 2),
  ('a1000001-0000-0000-0000-000000000003', 'c1000001-0000-0000-0000-000000000001', 'MAGURO Nigiri / Sashimi', 'Red Tuna — 2 pc nigiri or 3 pc sashimi', 7.50, false, 3),
  ('a1000001-0000-0000-0000-000000000004', 'c1000001-0000-0000-0000-000000000002', 'KAPPA MAKI', '6 pcs — Cucumber', 6.00, true, 1),
  ('a1000001-0000-0000-0000-000000000005', 'c1000001-0000-0000-0000-000000000002', 'AVOCADO MAKI', '6 pcs', 7.50, true, 2),
  ('a1000001-0000-0000-0000-000000000006', 'c1000001-0000-0000-0000-000000000002', 'VEGETABLE DRAGON MAKI', '8 pcs — Sweet potato, cucumber, topped with avocado & grilled veggies', 14.00, true, 3),
  ('a1000001-0000-0000-0000-000000000007', 'c1000001-0000-0000-0000-000000000003', 'EDAMAME', 'Steamed soybeans', 7.00, false, 1),
  ('a1000001-0000-0000-0000-000000000008', 'c1000001-0000-0000-0000-000000000003', 'AGEDASHI TOFU', 'Deep-fried tofu in dashi broth', 8.00, false, 2),
  ('a1000001-0000-0000-0000-000000000009', 'c1000001-0000-0000-0000-000000000003', 'SHRIMP TEMPURA', '5 pcs', 10.00, false, 3),
  ('a1000001-0000-0000-0000-00000000000a', 'c1000001-0000-0000-0000-000000000004', 'SALMON PIZZA', 'Crispy rice base with salmon', 12.50, false, 1),
  ('a1000001-0000-0000-0000-00000000000b', 'c1000001-0000-0000-0000-000000000005', 'MISO SOUP', 'Traditional miso soup', 3.00, false, 1),
  ('a1000001-0000-0000-0000-00000000000c', 'c1000001-0000-0000-0000-000000000005', 'WAKAME SALAD', 'Japanese seaweed salad', 7.00, false, 2),
  ('a1000001-0000-0000-0000-00000000000d', 'c1000001-0000-0000-0000-000000000006', 'CALIFORNIA MAKI', '6 pcs — Crab, avocado, cucumber', 8.50, true, 1),
  ('a1000001-0000-0000-0000-00000000000e', 'c1000001-0000-0000-0000-000000000006', 'SPICY SALMON MAKI', '6 pcs — Salmon, avocado, spicy mayo', 9.00, true, 2),
  ('a1000001-0000-0000-0000-00000000000f', 'c1000001-0000-0000-0000-000000000006', 'SPIDER MAKI', '8 pcs — Softshell crab, cucumber, avocado', 14.00, true, 3),
  ('a1000001-0000-0000-0000-000000000010', 'c1000001-0000-0000-0000-000000000007', 'DRAGON ROLL', 'Cucumber, avocado, shrimp + your topping choice', 13.00, true, 1),
  ('a1000001-0000-0000-0000-000000000011', 'c1000001-0000-0000-0000-000000000007', 'ROCK''N ROLL', 'Cucumber, avocado, lobster tail. Topped with fried ginger, green onion, garlic', 16.50, true, 2),
  ('a1000001-0000-0000-0000-000000000012', 'c1000001-0000-0000-0000-000000000007', 'CLOUD NINE', 'Avocado, cream cheese, asparagus. Topped with smoked salmon', 15.50, true, 3),
  ('a1000001-0000-0000-0000-000000000013', 'c1000001-0000-0000-0000-000000000008', 'SUSHI MORIAWASE', 'Nigiri, sashimi, maki combo', 21.00, false, 1),
  ('a1000001-0000-0000-0000-000000000014', 'c1000001-0000-0000-0000-000000000008', 'SUSHI-RO BOAT FOR 2', '14 maki, 10 nigiri, 10 sashimi', 65.00, false, 2),
  ('a1000001-0000-0000-0000-000000000015', 'c1000001-0000-0000-0000-000000000009', 'TONKOTSU RAMEN', 'Rich pork bone broth ramen', 17.00, false, 1),
  ('a1000001-0000-0000-0000-000000000016', 'c1000001-0000-0000-0000-00000000000a', 'SALMON TERIYAKI BENTO', 'Salmon teriyaki with rice and sides', 17.50, false, 1),
  ('a1000001-0000-0000-0000-000000000017', 'c1000001-0000-0000-0000-00000000000b', 'MATCHA TIRAMISU', 'Green tea tiramisu', 5.50, false, 1);

-- Gluten Free items
INSERT INTO menu_items (id, category_id, name, description, price, has_roll_options, sort_order) VALUES
  ('a2000001-0000-0000-0000-000000000001', 'c2000001-0000-0000-0000-000000000001', 'SAKE OR TEKKA MAKI (GF)', '6 pcs — Salmon or Red Tuna (+$1 for tuna)', 7.50, true, 1),
  ('a2000001-0000-0000-0000-000000000002', 'c2000001-0000-0000-0000-000000000001', 'SPICY SALMON MAKI (GF)', '6 pcs — Salmon, avocado, spicy mayo', 9.00, true, 2),
  ('a2000001-0000-0000-0000-000000000003', 'c2000001-0000-0000-0000-000000000002', 'KAPPA MAKI (GF)', '6 pcs — Cucumber', 6.00, true, 1),
  ('a2000001-0000-0000-0000-000000000004', 'c2000001-0000-0000-0000-000000000003', 'EDAMAME (GF)', 'Steamed soybeans', 7.00, false, 1),
  ('a2000001-0000-0000-0000-000000000005', 'c2000001-0000-0000-0000-000000000004', 'DRAGON WITH YOUR TOPPING (GF)', 'Cucumber, avocado, shrimp + topping', 14.00, true, 1),
  ('a2000001-0000-0000-0000-000000000006', 'c2000001-0000-0000-0000-000000000004', 'FUJI MOUNTAIN (GF)', 'Cucumber, avocado, salmon, spicy mayo', 14.00, true, 2),
  ('a2000001-0000-0000-0000-000000000007', 'c2000001-0000-0000-0000-000000000005', 'SUSHI MORIAWASE (GF)', 'Nigiri, sashimi, maki combo', 21.00, false, 1);

-- Roll options for items with has_roll_options
INSERT INTO menu_item_options (menu_item_id, menu_option_id)
SELECT mi.id, mo.id
FROM menu_items mi
CROSS JOIN menu_options mo
WHERE mi.has_roll_options = true;

-- Labels
INSERT INTO menu_item_labels (menu_item_id, label_id) VALUES
  ('a1000001-0000-0000-0000-000000000004', '22222222-2222-2222-2222-222222222201'),
  ('a1000001-0000-0000-0000-000000000005', '22222222-2222-2222-2222-222222222201'),
  ('a1000001-0000-0000-0000-000000000007', '22222222-2222-2222-2222-222222222201'),
  ('a1000001-0000-0000-0000-00000000000e', '22222222-2222-2222-2222-222222222204'),
  ('a1000001-0000-0000-0000-000000000010', '22222222-2222-2222-2222-222222222204'),
  ('a1000001-0000-0000-0000-000000000011', '22222222-2222-2222-2222-222222222204'),
  ('a1000001-0000-0000-0000-000000000012', '22222222-2222-2222-2222-222222222203'),
  ('a1000001-0000-0000-0000-000000000012', '22222222-2222-2222-2222-222222222204');

-- Featured items (5)
INSERT INTO featured_items (menu_item_id, sort_order) VALUES
  ('a1000001-0000-0000-0000-000000000010', 1),
  ('a1000001-0000-0000-0000-000000000011', 2),
  ('a1000001-0000-0000-0000-00000000000e', 3),
  ('a1000001-0000-0000-0000-000000000014', 4),
  ('a1000001-0000-0000-0000-000000000015', 5);
