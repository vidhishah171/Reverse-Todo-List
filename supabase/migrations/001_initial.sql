-- ============================================================
-- Reverse Todo — Supabase Migration
-- Run this in your Supabase SQL editor to set up the schema
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- WINS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.wins (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  description TEXT,
  date        DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Index for fast user queries ordered by date
CREATE INDEX IF NOT EXISTS wins_user_id_date_idx ON public.wins (user_id, date DESC);

-- ============================================================
-- STREAKS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.streaks (
  id               UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id          UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  current_streak   INTEGER DEFAULT 0 NOT NULL,
  longest_streak   INTEGER DEFAULT 0 NOT NULL,
  last_logged_date DATE,
  updated_at       TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Wins: users can only see and modify their own rows
ALTER TABLE public.wins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own wins"
  ON public.wins FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own wins"
  ON public.wins FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own wins"
  ON public.wins FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own wins"
  ON public.wins FOR DELETE
  USING (auth.uid() = user_id);

-- Streaks: users can only see and modify their own row
ALTER TABLE public.streaks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own streak"
  ON public.streaks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own streak"
  ON public.streaks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own streak"
  ON public.streaks FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================================
-- STREAK AUTO-UPDATE FUNCTION
-- Callable via RPC to recalculate streak after inserting a win
-- ============================================================
CREATE OR REPLACE FUNCTION public.update_streak(p_user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_last_date       DATE;
  v_current_streak  INTEGER;
  v_longest_streak  INTEGER;
  v_today           DATE := CURRENT_DATE;
BEGIN
  -- Get existing streak record
  SELECT last_logged_date, current_streak, longest_streak
    INTO v_last_date, v_current_streak, v_longest_streak
    FROM public.streaks
   WHERE user_id = p_user_id;

  IF NOT FOUND THEN
    -- First time: create streak record
    INSERT INTO public.streaks (user_id, current_streak, longest_streak, last_logged_date)
    VALUES (p_user_id, 1, 1, v_today);
    RETURN;
  END IF;

  -- Already logged today — nothing to update
  IF v_last_date = v_today THEN
    RETURN;
  END IF;

  -- Consecutive day: increment streak
  IF v_last_date = v_today - INTERVAL '1 day' THEN
    v_current_streak := v_current_streak + 1;
  ELSE
    -- Streak broken: reset
    v_current_streak := 1;
  END IF;

  v_longest_streak := GREATEST(v_longest_streak, v_current_streak);

  UPDATE public.streaks
     SET current_streak   = v_current_streak,
         longest_streak   = v_longest_streak,
         last_logged_date = v_today,
         updated_at       = NOW()
   WHERE user_id = p_user_id;
END;
$$;
