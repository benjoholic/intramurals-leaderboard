-- Drop legacy `points` and `points_breakdown` columns from events
-- RUN THIS ONLY AFTER YOU HAVE VERIFIED THAT `points_first`, `points_second`, `points_third` ARE POPULATED
-- and you have a backup of your database.

ALTER TABLE IF EXISTS public.events
  DROP COLUMN IF EXISTS points,
  DROP COLUMN IF EXISTS points_breakdown;

-- Note: This operation is irreversible via this script. If you need the old
-- columns later, restore from backup or recreate them manually.
