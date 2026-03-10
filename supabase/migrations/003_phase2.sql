-- =================================================================
-- Phase 2 Migration: Achievements, Goals, Daily Reflections
-- =================================================================

-- ── Achievements ─────────────────────────────────────────────
create table if not exists public.achievements (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  key text not null,           -- unique achievement key e.g. 'first_win', 'streak_7'
  unlocked_at timestamptz default now() not null,
  unique(user_id, key)
);

alter table public.achievements enable row level security;

create policy "Users can view own achievements" on public.achievements
  for select using (auth.uid() = user_id);
create policy "Users can insert own achievements" on public.achievements
  for insert with check (auth.uid() = user_id);

create index if not exists idx_achievements_user on public.achievements(user_id);

-- ── Goals ────────────────────────────────────────────────────
create table if not exists public.goals (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  target_count int not null default 1,
  current_count int not null default 0,
  deadline date,
  completed boolean not null default false,
  completed_at timestamptz,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.goals enable row level security;

create policy "Users can view own goals" on public.goals
  for select using (auth.uid() = user_id);
create policy "Users can insert own goals" on public.goals
  for insert with check (auth.uid() = user_id);
create policy "Users can update own goals" on public.goals
  for update using (auth.uid() = user_id);
create policy "Users can delete own goals" on public.goals
  for delete using (auth.uid() = user_id);

create index if not exists idx_goals_user on public.goals(user_id);

-- ── Daily Reflections ────────────────────────────────────────
create table if not exists public.daily_reflections (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  date date not null,
  content text not null,
  mood text check (mood in ('great', 'good', 'okay', 'tough')),
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  unique(user_id, date)
);

alter table public.daily_reflections enable row level security;

create policy "Users can view own reflections" on public.daily_reflections
  for select using (auth.uid() = user_id);
create policy "Users can insert own reflections" on public.daily_reflections
  for insert with check (auth.uid() = user_id);
create policy "Users can update own reflections" on public.daily_reflections
  for update using (auth.uid() = user_id);
create policy "Users can delete own reflections" on public.daily_reflections
  for delete using (auth.uid() = user_id);

create index if not exists idx_reflections_user_date on public.daily_reflections(user_id, date);
