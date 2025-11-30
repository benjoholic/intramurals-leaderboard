-- Add participants JSONB column to matches
-- Run this migration in Supabase SQL editor or via psql.

ALTER TABLE IF EXISTS matches
ADD COLUMN IF NOT EXISTS participants jsonb;

-- You can backfill participants from existing columns if you had a different format.
-- Example: UPDATE matches SET participants = jsonb_build_array(team_a_name, team_b_name) WHERE participants IS NULL;
