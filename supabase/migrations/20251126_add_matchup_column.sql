-- Migration: Add only the `matchup` column to public.events
-- Date: 2025-11-26

-- Safe: adds the column only if it doesn't exist
ALTER TABLE IF EXISTS public.events
  ADD COLUMN IF NOT EXISTS matchup text;

-- Optional index to speed text searches on matchup
CREATE INDEX IF NOT EXISTS idx_events_matchup ON public.events (matchup);

-- Done
