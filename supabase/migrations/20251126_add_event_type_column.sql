-- Add event_type column and backfill from existing name/title
BEGIN;

ALTER TABLE IF EXISTS public.events
  ADD COLUMN IF NOT EXISTS event_type text;

-- Backfill event_type from name or title where empty
UPDATE public.events
SET event_type = COALESCE(name, title)
WHERE event_type IS NULL OR event_type = '';

-- Keep legacy columns for now for compatibility

COMMIT;
