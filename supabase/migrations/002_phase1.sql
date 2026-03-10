-- ============================================================
-- Phase 1 Migration: Categories, Tags, Difficulty, Mood, Pin
-- Run this in the Supabase SQL editor before deploying code
-- ============================================================

-- ============================================================
-- CATEGORIES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.categories (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name       TEXT NOT NULL,
  color      TEXT NOT NULL DEFAULT '#8b5cf6',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS categories_user_id_idx ON public.categories (user_id);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own categories"
  ON public.categories FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own categories"
  ON public.categories FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own categories"
  ON public.categories FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own categories"
  ON public.categories FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================
-- ADD NEW COLUMNS TO WINS TABLE
-- ============================================================
ALTER TABLE public.wins
  ADD COLUMN IF NOT EXISTS category_id  UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS tags         TEXT[]  DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS difficulty   TEXT    CHECK (difficulty IN ('easy', 'medium', 'hard', 'epic')),
  ADD COLUMN IF NOT EXISTS mood         TEXT    CHECK (mood IN ('great', 'good', 'okay', 'tough')),
  ADD COLUMN IF NOT EXISTS pinned       BOOLEAN DEFAULT FALSE NOT NULL;

CREATE INDEX IF NOT EXISTS wins_category_id_idx ON public.wins (category_id);
CREATE INDEX IF NOT EXISTS wins_pinned_idx ON public.wins (user_id, pinned) WHERE pinned = TRUE;
