-- Add department and event columns to teams table
-- Run this in the Supabase SQL editor for the project referenced by your `.env.local`

ALTER TABLE public.teams
  ADD COLUMN IF NOT EXISTS department TEXT,
  ADD COLUMN IF NOT EXISTS event TEXT;

-- Optionally make columns nullable or add defaults per your app's needs.
