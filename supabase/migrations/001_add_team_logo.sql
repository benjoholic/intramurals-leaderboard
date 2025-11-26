-- Add logo column to teams table
ALTER TABLE public.teams
  ADD COLUMN IF NOT EXISTS logo TEXT;

-- You can also add a logo_url column instead if you plan to store public URLs
-- ALTER TABLE public.teams
--   ADD COLUMN IF NOT EXISTS logo_url TEXT;
