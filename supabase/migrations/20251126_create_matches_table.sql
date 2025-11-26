-- Create matches table
-- Columns:
-- id: primary key (bigint serial)
-- event_id: references events(id)
-- team_a_id, team_b_id: references teams(id)
-- time: timestamptz (required)
-- location: text
-- score_a, score_b: integer
-- created_at: timestamptz default now()

CREATE TABLE IF NOT EXISTS public.matches (
  id bigserial PRIMARY KEY,
  event_id bigint NULL,
  team_a_id bigint NULL,
  team_b_id bigint NULL,
  time timestamptz NOT NULL,
  location text,
  score_a integer,
  score_b integer,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_matches_event_id ON public.matches(event_id);
CREATE INDEX IF NOT EXISTS idx_matches_time ON public.matches(time);

-- Optional foreign keys if events & teams tables exist with numeric ids
ALTER TABLE public.matches
  ADD CONSTRAINT fk_matches_event FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE SET NULL;

ALTER TABLE public.matches
  ADD CONSTRAINT fk_matches_team_a FOREIGN KEY (team_a_id) REFERENCES public.teams(id) ON DELETE SET NULL;

ALTER TABLE public.matches
  ADD CONSTRAINT fk_matches_team_b FOREIGN KEY (team_b_id) REFERENCES public.teams(id) ON DELETE SET NULL;
