-- =================================================================
-- Phase 3 Migration: Public Profiles, Challenges, Leaderboard,
--                    AI Summaries, Win Ordering
-- =================================================================

-- ── Public Profiles ──────────────────────────────────────────
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  username text unique,
  display_name text,
  bio text,
  avatar_url text,
  is_public boolean not null default false,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone" on public.profiles
  for select using (is_public = true or auth.uid() = id);
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles
  for insert with check (auth.uid() = id);

create unique index if not exists idx_profiles_username on public.profiles(username);

-- ── Challenges ───────────────────────────────────────────────
create table if not exists public.challenges (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  challenge_type text not null default 'wins_count',
  target_count int not null default 10,
  start_date date not null,
  end_date date not null,
  created_by uuid references auth.users(id) on delete set null,
  is_active boolean not null default true,
  created_at timestamptz default now() not null
);

alter table public.challenges enable row level security;

create policy "Challenges are viewable by everyone" on public.challenges
  for select using (true);
create policy "Authenticated users can create challenges" on public.challenges
  for insert with check (auth.uid() = created_by);

create table if not exists public.challenge_participants (
  id uuid default gen_random_uuid() primary key,
  challenge_id uuid references public.challenges(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  progress int not null default 0,
  joined_at timestamptz default now() not null,
  unique(challenge_id, user_id)
);

alter table public.challenge_participants enable row level security;

create policy "Participants viewable by everyone" on public.challenge_participants
  for select using (true);
create policy "Users can join challenges" on public.challenge_participants
  for insert with check (auth.uid() = user_id);
create policy "Users can update own progress" on public.challenge_participants
  for update using (auth.uid() = user_id);
create policy "Users can leave challenges" on public.challenge_participants
  for delete using (auth.uid() = user_id);

create index if not exists idx_challenge_participants_challenge on public.challenge_participants(challenge_id);
create index if not exists idx_challenge_participants_user on public.challenge_participants(user_id);

-- ── AI Summaries ─────────────────────────────────────────────
create table if not exists public.ai_summaries (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  summary_type text not null check (summary_type in ('daily', 'weekly')),
  content text not null,
  period_start date not null,
  period_end date not null,
  created_at timestamptz default now() not null,
  unique(user_id, summary_type, period_start)
);

alter table public.ai_summaries enable row level security;

create policy "Users can view own summaries" on public.ai_summaries
  for select using (auth.uid() = user_id);
create policy "Users can insert own summaries" on public.ai_summaries
  for insert with check (auth.uid() = user_id);

create index if not exists idx_ai_summaries_user on public.ai_summaries(user_id);

-- ── Win ordering (for drag-and-drop reorder) ─────────────────
alter table public.wins add column if not exists sort_order int default 0;

-- ── Leaderboard RPC ──────────────────────────────────────────
create or replace function public.get_leaderboard(p_limit int default 10)
returns table (
  user_id uuid,
  display_name text,
  username text,
  total_wins bigint,
  current_streak int,
  longest_streak int
) language sql stable security definer as $$
  select
    p.id as user_id,
    coalesce(p.display_name, split_part(u.email::text, '@', 1)) as display_name,
    p.username,
    (select count(*) from public.wins w where w.user_id = p.id) as total_wins,
    coalesce(s.current_streak, 0) as current_streak,
    coalesce(s.longest_streak, 0) as longest_streak
  from public.profiles p
  join auth.users u on u.id = p.id
  left join public.streaks s on s.user_id = p.id
  where p.is_public = true
  order by total_wins desc, longest_streak desc
  limit p_limit;
$$;

-- ── Seed default global challenges ──────────────────────────
insert into public.challenges (title, description, challenge_type, target_count, start_date, end_date)
values
  ('7-Day Win Streak', 'Log at least one win every day for 7 days straight', 'streak', 7, current_date, current_date + interval '30 days'),
  ('Century Club', 'Log 100 wins this month', 'wins_count', 100, date_trunc('month', current_date)::date, (date_trunc('month', current_date) + interval '1 month - 1 day')::date),
  ('Epic Week', 'Complete 5 epic difficulty wins in a week', 'epic_wins', 5, current_date, current_date + interval '7 days')
on conflict do nothing;
