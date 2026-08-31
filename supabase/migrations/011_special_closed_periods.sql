-- special_closed_dates JSONB now supports date ranges:
-- [ "2025-12-25", { "start": "2025-12-03", "end": "2025-12-31", "message": "Closed for vacation" } ]
-- No schema change required; document format for admin UI.

COMMENT ON COLUMN restaurant_settings.special_closed_dates IS
  'Array of YYYY-MM-DD strings (single day) or objects { start, end, message? } for closure periods.';
