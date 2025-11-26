-- Add points (integer) column to events table
-- This migration adds an optional integer column `points` to store points per win for an event
ALTER TABLE IF EXISTS public.events
ADD COLUMN IF NOT EXISTS points integer;

-- Optionally create an index if you plan to query by points frequently
-- CREATE INDEX IF NOT EXISTS idx_events_points ON public.events(points);
