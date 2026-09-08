-- Fix: anon cannot EXECUTE voispeech_is_admin(), so a single SELECT policy that
-- ORs is_admin() with exists(parent published) fails for logged-out users.
-- Split policies so anon only checks parent published; authenticated keeps is_admin OR published.
-- Live: applied as lesson_sessions_anon_read_fix on project wvgckdjylodzexpgjnpq.
begin;

drop policy if exists voispeech_lesson_sessions_public_read on public.voispeech_lesson_sessions;
drop policy if exists voispeech_lesson_sessions_anon_read on public.voispeech_lesson_sessions;
drop policy if exists voispeech_lesson_sessions_authenticated_read on public.voispeech_lesson_sessions;

create policy voispeech_lesson_sessions_anon_read on public.voispeech_lesson_sessions
  for select to anon
  using (
    exists (
      select 1 from public.voispeech_lessons l
      where l.id = lesson_id and l.published = true
    )
  );

create policy voispeech_lesson_sessions_authenticated_read on public.voispeech_lesson_sessions
  for select to authenticated
  using (
    public.voispeech_is_admin()
    or exists (
      select 1 from public.voispeech_lessons l
      where l.id = lesson_id and l.published = true
    )
  );

commit;
