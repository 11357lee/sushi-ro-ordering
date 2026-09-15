-- Staff test mode: ignore hours so the owner can place a test order after close.
-- Clear SQL editor, copy from RAW GitHub, then Run. Safe to re-run.

ALTER TABLE restaurant_settings
  ADD COLUMN IF NOT EXISTS test_mode BOOLEAN NOT NULL DEFAULT FALSE;

COMMENT ON COLUMN restaurant_settings.test_mode IS
  'When true, business hours, night cutoff, pause, and closed dates are ignored so staff can test ordering.';
