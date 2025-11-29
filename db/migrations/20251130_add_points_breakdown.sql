-- Add points_breakdown JSONB column to events table
-- Run this in Supabase SQL editor or via psql connected to your database.

ALTER TABLE IF EXISTS public.events
ADD COLUMN IF NOT EXISTS points_breakdown jsonb;

-- Backfill from legacy `points` column if present: set first = points
-- This will keep existing single-value points information in the new JSON field.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'events' AND column_name = 'points') THEN
    UPDATE public.events
    SET points_breakdown = jsonb_build_object('first', points)
    WHERE points IS NOT NULL;
  END IF;
END$$;