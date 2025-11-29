-- Drop older `points_first`, `points_second`, `points_third` columns from events
-- RUN THIS ONLY AFTER YOU HAVE VERIFIED THAT `first_point`, `second_point`, `third_point` ARE POPULATED
-- and you have a backup of your database.

ALTER TABLE IF EXISTS public.events
  DROP COLUMN IF EXISTS points_first,
  DROP COLUMN IF EXISTS points_second,
  DROP COLUMN IF EXISTS points_third;

-- Note: This operation is irreversible via this script. If you need the old
-- columns later, restore from backup or recreate them manually.
