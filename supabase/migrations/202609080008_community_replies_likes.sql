-- Community replies (parent_id), likes, and admin-only 공지 inserts.
-- Project: wvgckdjylodzexpgjnpq
begin;

alter table public.voispeech_community_posts
  add column if not exists parent_id bigint
    references public.voispeech_community_posts(id) on delete cascade;

create index if not exists voispeech_community_posts_parent_idx
  on public.voispeech_community_posts (parent_id, created_at asc);

create table if not exists public.voispeech_community_likes (
  post_id bigint not null
    references public.voispeech_community_posts(id) on delete cascade,
  user_id uuid not null
    references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

create index if not exists voispeech_community_likes_user_idx
  on public.voispeech_community_likes (user_id, created_at desc);

alter table public.voispeech_community_likes enable row level security;
revoke all on public.voispeech_community_likes from anon, authenticated;
grant select, insert, delete on public.voispeech_community_likes to authenticated;
grant all on public.voispeech_community_likes to service_role;

drop policy if exists voispeech_community_likes_read on public.voispeech_community_likes;
create policy voispeech_community_likes_read on public.voispeech_community_likes
  for select to authenticated
  using (true);

drop policy if exists voispeech_community_likes_insert on public.voispeech_community_likes;
create policy voispeech_community_likes_insert on public.voispeech_community_likes
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists voispeech_community_likes_delete on public.voispeech_community_likes;
create policy voispeech_community_likes_delete on public.voispeech_community_likes
  for delete to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists voispeech_community_insert on public.voispeech_community_posts;
create policy voispeech_community_insert on public.voispeech_community_posts
  for insert to authenticated
  with check (
    (select auth.uid()) = user_id
    and (channel <> '공지' or public.voispeech_is_admin())
  );

commit;
