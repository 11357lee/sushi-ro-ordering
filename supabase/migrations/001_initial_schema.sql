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
