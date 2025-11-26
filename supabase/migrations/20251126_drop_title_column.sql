-- Backfill `event_type` from `title` where missing, then drop `title` column
BEGIN;

-- Ensure event_type is populated from title if empty
UPDATE public.events
SET event_type = title
WHERE (event_type IS NULL OR event_type = '')
  AND (title IS NOT NULL AND title <> '');

-- Drop legacy title column
ALTER TABLE IF EXISTS public.events
  DROP COLUMN IF EXISTS title;

COMMIT;
