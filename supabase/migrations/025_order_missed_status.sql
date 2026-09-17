-- Add missed status for orders not accepted within the admin window.
-- Safe to re-run on Postgres 15+ / Supabase.

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum e
    JOIN pg_type t ON e.enumtypid = t.oid
    WHERE t.typname = 'order_status' AND e.enumlabel = 'missed'
  ) THEN
    ALTER TYPE order_status ADD VALUE 'missed';
  END IF;
END $$;
