-- ***** PASTE_ME_v7_missed_status *****
-- Adds order status "missed" for the 3-minute accept window.
-- Clear SQL editor, paste ALL, Run once.

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
