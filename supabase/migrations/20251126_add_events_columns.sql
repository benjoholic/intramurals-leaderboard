-- Migration: Add event columns used by the app
-- Date: 2025-11-26

-- This migration adds the following columns to `public.events`:
--   - name (text)
--   - time (timestamptz)
--   - location (text)
--   - matchup (text)
--   - team_a_id (uuid) - optional reference to teams.id
--   - team_b_id (uuid) - optional reference to teams.id

-- Run this in Supabase SQL Editor or via supabase CLI.

-- Ensure pgcrypto extension for UUID gen is available (safe to run repeatedly)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Add columns if they don't already exist
ALTER TABLE IF EXISTS public.events
  ADD COLUMN IF NOT EXISTS name text,
  ADD COLUMN IF NOT EXISTS time timestamptz,
  ADD COLUMN IF NOT EXISTS location text,
  ADD COLUMN IF NOT EXISTS matchup text,
  ADD COLUMN IF NOT EXISTS team_a_id uuid,
  ADD COLUMN IF NOT EXISTS team_b_id uuid;

-- Optional indexes to improve query performance
CREATE INDEX IF NOT EXISTS idx_events_time ON public.events (time DESC);
CREATE INDEX IF NOT EXISTS idx_events_matchup ON public.events (matchup);

-- Optional: add foreign key constraints if your `teams.id` is uuid and you want referential integrity.
-- Uncomment and run if appropriate for your schema.
-- ALTER TABLE public.events
--   ADD CONSTRAINT fk_events_team_a FOREIGN KEY (team_a_id) REFERENCES public.teams(id),
--   ADD CONSTRAINT fk_events_team_b FOREIGN KEY (team_b_id) REFERENCES public.teams(id);

-- Optional: ensure no-null defaults if you prefer (run manually after review)
-- UPDATE public.events SET matchup = '' WHERE matchup IS NULL;

-- Done
