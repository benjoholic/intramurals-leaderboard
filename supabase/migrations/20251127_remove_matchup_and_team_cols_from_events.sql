-- Migration: remove matchup and team columns from events, add points

BEGIN;

ALTER TABLE IF EXISTS public.events
  DROP COLUMN IF EXISTS matchup;

ALTER TABLE IF EXISTS public.events
  DROP COLUMN IF EXISTS team_a_id;

ALTER TABLE IF EXISTS public.events
  DROP COLUMN IF EXISTS team_b_id;

ALTER TABLE IF EXISTS public.events
  ADD COLUMN IF NOT EXISTS points integer;

COMMIT;
