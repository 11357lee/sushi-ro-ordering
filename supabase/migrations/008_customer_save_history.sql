-- Consent flag: only customers who accept Privacy/Terms keep reusable account history.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'customers'
      AND column_name = 'save_history'
  ) THEN
    ALTER TABLE customers
      ADD COLUMN save_history BOOLEAN NOT NULL DEFAULT FALSE;

    -- Existing accounts already used for login/history stay retained.
    UPDATE customers SET save_history = TRUE;
  END IF;
END $$;

COMMENT ON COLUMN customers.save_history IS
  'True when customer accepted Privacy Policy/Terms to keep account and order history.';
