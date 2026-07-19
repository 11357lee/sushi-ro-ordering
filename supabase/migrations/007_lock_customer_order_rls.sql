-- Lock customer and order data behind server API routes before public launch.
-- The app uses the Supabase service role from Next.js API routes, so public
-- browser access does not need direct customer/order table permissions.

DROP POLICY IF EXISTS "Public insert customers" ON customers;
DROP POLICY IF EXISTS "Public read customers" ON customers;
DROP POLICY IF EXISTS "Public update customers" ON customers;

DROP POLICY IF EXISTS "Public insert orders" ON orders;
DROP POLICY IF EXISTS "Public read orders" ON orders;
DROP POLICY IF EXISTS "Public update orders" ON orders;

DROP POLICY IF EXISTS "Public insert order_items" ON order_items;
DROP POLICY IF EXISTS "Public read order_items" ON order_items;
