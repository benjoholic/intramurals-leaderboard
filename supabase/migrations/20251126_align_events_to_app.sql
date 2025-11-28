-- Migration: Align `public.events` table to app schema
-- Date: 2025-11-26

-- Adds app-expected columns (safe to run repeatedly) and backfills from legacy columns
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Add columns used by the frontend/API if they don't exist
ALTER TABLE IF EXISTS public.events
  ADD COLUMN IF NOT EXISTS name text,
  ADD COLUMN IF NOT EXISTS time timestamptz,
  ADD COLUMN IF NOT EXISTS matchup text,
  ADD COLUMN IF NOT EXISTS team_a_id bigint,
  ADD COLUMN IF NOT EXISTS team_b_id bigint,
  ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now();

-- Backfill new columns from legacy columns where possible
-- Map existing title -> name
UPDATE public.events
SET name = title
WHERE title IS NOT NULL AND (name IS NULL OR name = '');

-- Map existing date -> time (convert date to timestamptz at midnight UTC)
UPDATE public.events
SET time = date::timestamptz
WHERE date IS NOT NULL AND time IS NULL;

-- Ensure created_at is present
UPDATE public.events
SET created_at = now()
WHERE created_at IS NULL;

-- Make legacy title nullable so inserts that only set `name` won't fail
ALTER TABLE IF EXISTS public.events
  ALTER COLUMN title DROP NOT NULL;

-- Indexes to help queries
CREATE INDEX IF NOT EXISTS idx_events_time ON public.events (time DESC);
CREATE INDEX IF NOT EXISTS idx_events_matchup ON public.events (matchup);

-- Optional: add foreign key constraints to teams if your teams.id is bigint
-- Uncomment and run only if appropriate for your schema
-- ALTER TABLE public.events
--   ADD CONSTRAINT fk_events_team_a FOREIGN KEY (team_a_id) REFERENCES public.teams(id),
--   ADD CONSTRAINT fk_events_team_b FOREIGN KEY (team_b_id) REFERENCES public.teams(id);

-- Done
