-- Add separate point columns for 1st/2nd/3rd place to events
-- Run in Supabase SQL editor or via psql

ALTER TABLE IF EXISTS public.events
ADD COLUMN IF NOT EXISTS first_point integer,
ADD COLUMN IF NOT EXISTS second_point integer,
ADD COLUMN IF NOT EXISTS third_point integer;

-- Backfill from existing JSONB column `points_breakdown` if present
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'events' AND column_name = 'points_breakdown') THEN
    UPDATE public.events
    SET
      first_point = (points_breakdown->>'first')::int,
      second_point = (points_breakdown->>'second')::int,
      third_point = (points_breakdown->>'third')::int
    WHERE points_breakdown IS NOT NULL;
  END IF;
END$$;

-- If JSON backfill didn't populate (or JSON not present), backfill first_point from legacy `points` column
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'events' AND column_name = 'points') THEN
    -- set first_point where null
    UPDATE public.events
    SET first_point = points
    WHERE first_point IS NULL AND points IS NOT NULL;
  END IF;
END$$;

-- Note: this migration only adds columns and attempts to populate them. If you want to remove the old `points_breakdown` column, do so in a separate migration after verifying data.
