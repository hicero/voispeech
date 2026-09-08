-- Optional sessions (sub-videos) under a lesson/module.
-- 0 sessions => keep single-video behavior via voispeech_lessons.storage_path.
-- Note: live voispeech_lessons.id is bigint (identity); session.lesson_id matches that.
-- Applied on project wvgckdjylodzexpgjnpq via Supabase MCP (lesson_sessions).
begin;

create table if not exists public.voispeech_lesson_sessions (
  id uuid primary key default gen_random_uuid(),
  lesson_id bigint not null references public.voispeech_lessons(id) on delete cascade,
  sort_order int not null default 0,
  title text not null check (char_length(title) between 1 and 80),
  description text not null default '' check (char_length(description) <= 300),
  storage_path text check (storage_path is null or char_length(storage_path) <= 500),
  duration_label text not null default '' check (char_length(duration_label) <= 40),
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists voispeech_lesson_sessions_lesson_sort_idx
  on public.voispeech_lesson_sessions (lesson_id, sort_order asc, created_at asc);

alter table public.voispeech_lesson_sessions enable row level security;
revoke all on public.voispeech_lesson_sessions from anon, authenticated;
grant select on public.voispeech_lesson_sessions to anon, authenticated;
grant insert, update, delete on public.voispeech_lesson_sessions to authenticated;
grant all on public.voispeech_lesson_sessions to service_role;

drop policy if exists voispeech_lesson_sessions_public_read on public.voispeech_lesson_sessions;
create policy voispeech_lesson_sessions_public_read on public.voispeech_lesson_sessions
  for select to anon, authenticated
  using (
    public.voispeech_is_admin()
    or exists (
      select 1 from public.voispeech_lessons l
      where l.id = lesson_id and l.published = true
    )
  );

drop policy if exists voispeech_lesson_sessions_admin_insert on public.voispeech_lesson_sessions;
create policy voispeech_lesson_sessions_admin_insert on public.voispeech_lesson_sessions
  for insert to authenticated
  with check (public.voispeech_is_admin());

drop policy if exists voispeech_lesson_sessions_admin_update on public.voispeech_lesson_sessions;
create policy voispeech_lesson_sessions_admin_update on public.voispeech_lesson_sessions
  for update to authenticated
  using (public.voispeech_is_admin())
  with check (public.voispeech_is_admin());

drop policy if exists voispeech_lesson_sessions_admin_delete on public.voispeech_lesson_sessions;
create policy voispeech_lesson_sessions_admin_delete on public.voispeech_lesson_sessions
  for delete to authenticated
  using (public.voispeech_is_admin());

commit;
