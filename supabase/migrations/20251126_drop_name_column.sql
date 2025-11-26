-- Drop `name` column from events now that `event_type` exists
BEGIN;

ALTER TABLE IF EXISTS public.events
  DROP COLUMN IF EXISTS name;

COMMIT;
