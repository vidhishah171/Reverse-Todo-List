-- ============================================================
-- Public Profile Data RPC
-- Returns wins, streak, and achievements for a public profile
-- Uses SECURITY DEFINER to bypass RLS (only for public profiles)
-- ============================================================

create or replace function public.get_public_profile_data(p_username text)
returns json
language plpgsql stable security definer as $$
declare
  v_user_id uuid;
  v_result json;
begin
  -- Only allow fetching data for public profiles
  select id into v_user_id
    from public.profiles
   where username = p_username and is_public = true;

  if v_user_id is null then
    return null;
  end if;

  select json_build_object(
    'total_wins', (
      select count(*) from public.wins where user_id = v_user_id
    ),
    'current_streak', (
      select coalesce(s.current_streak, 0)
        from public.streaks s where s.user_id = v_user_id
    ),
    'longest_streak', (
      select coalesce(s.longest_streak, 0)
        from public.streaks s where s.user_id = v_user_id
    ),
    'achievements', (
      select coalesce(json_agg(
        json_build_object('key', a.key, 'unlocked_at', a.unlocked_at)
      ), '[]'::json)
        from public.achievements a where a.user_id = v_user_id
    ),
    'wins', (
      select coalesce(json_agg(
        json_build_object(
          'id', w.id,
          'title', w.title,
          'description', w.description,
          'date', w.date,
          'pinned', w.pinned,
          'difficulty', w.difficulty,
          'mood', w.mood,
          'tags', w.tags,
          'created_at', w.created_at
        ) order by w.pinned desc, w.created_at desc
      ), '[]'::json)
        from (
          select * from public.wins
           where user_id = v_user_id
           order by pinned desc, created_at desc
           limit 20
        ) w
    )
  ) into v_result;

  return v_result;
end;
$$;
