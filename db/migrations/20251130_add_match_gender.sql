-- Add gender/category column to matches table
-- Run this migration in your Supabase SQL editor or via psql.
-- Adds an optional text column `gender` to categorize matches (e.g., 'men', 'women', 'mixed').

ALTER TABLE IF EXISTS matches
ADD COLUMN IF NOT EXISTS gender varchar(32);

-- Optional: if you want a default value, you can alter with DEFAULT, e.g.
-- ALTER TABLE matches ALTER COLUMN gender SET DEFAULT 'men';
