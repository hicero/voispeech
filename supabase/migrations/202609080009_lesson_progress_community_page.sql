-- Lesson completion progress (per user) + community top-level pagination index.
-- Project: wvgckdjylodzexpgjnpq
begin;

create table if not exists public.voispeech_lesson_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id bigint not null references public.voispeech_lessons(id) on delete cascade,
  completed_steps int[] not null default '{}',
  completed boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

create index if not exists voispeech_lesson_progress_user_idx
  on public.voispeech_lesson_progress (user_id, updated_at desc);

alter table public.voispeech_lesson_progress enable row level security;
revoke all on public.voispeech_lesson_progress from anon, authenticated;
grant select, insert, update, delete on public.voispeech_lesson_progress to authenticated;
grant all on public.voispeech_lesson_progress to service_role;

drop policy if exists voispeech_lesson_progress_select on public.voispeech_lesson_progress;
create policy voispeech_lesson_progress_select on public.voispeech_lesson_progress
  for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists voispeech_lesson_progress_insert on public.voispeech_lesson_progress;
create policy voispeech_lesson_progress_insert on public.voispeech_lesson_progress
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists voispeech_lesson_progress_update on public.voispeech_lesson_progress;
create policy voispeech_lesson_progress_update on public.voispeech_lesson_progress
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists voispeech_lesson_progress_delete on public.voispeech_lesson_progress;
create policy voispeech_lesson_progress_delete on public.voispeech_lesson_progress
  for delete to authenticated
  using ((select auth.uid()) = user_id);

-- Top-level posts only (parent_id is null) for channel feed pagination.
create index if not exists voispeech_community_posts_top_page_idx
  on public.voispeech_community_posts (channel, created_at desc)
  where parent_id is null;

commit;
