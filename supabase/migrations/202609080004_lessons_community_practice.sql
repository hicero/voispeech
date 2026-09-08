-- Lessons, community posts, practice records, and lesson video storage.
-- Already applied on project wvgckdjylodzexpgjnpq; this file keeps repo history in sync.
-- Admin gate: public.voispeech_is_admin() (JWT app_metadata.voispeech_admin).
-- Clients never use service_role.
begin;

-- ---------------------------------------------------------------------------
-- Lessons catalog
-- ---------------------------------------------------------------------------
create table if not exists public.voispeech_lessons (
  id uuid primary key default gen_random_uuid(),
  sort_order int not null default 0,
  category text not null default '기초' check (char_length(category) <= 40),
  title text not null check (char_length(title) between 1 and 120),
  description text not null default '' check (char_length(description) <= 500),
  access text not null default 'subscribers'
    check (access in ('free', 'subscribers')),
  storage_path text check (storage_path is null or char_length(storage_path) <= 500),
  duration_label text not null default '' check (char_length(duration_label) <= 40),
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists voispeech_lessons_sort_idx
  on public.voispeech_lessons (sort_order asc, created_at asc);

alter table public.voispeech_lessons enable row level security;
revoke all on public.voispeech_lessons from anon, authenticated;
grant select on public.voispeech_lessons to anon, authenticated;
grant insert, update, delete on public.voispeech_lessons to authenticated;
grant all on public.voispeech_lessons to service_role;

drop policy if exists voispeech_lessons_public_read on public.voispeech_lessons;
create policy voispeech_lessons_public_read on public.voispeech_lessons
  for select to anon, authenticated
  using (published = true or public.voispeech_is_admin());

drop policy if exists voispeech_lessons_admin_insert on public.voispeech_lessons;
create policy voispeech_lessons_admin_insert on public.voispeech_lessons
  for insert to authenticated
  with check (public.voispeech_is_admin());

drop policy if exists voispeech_lessons_admin_update on public.voispeech_lessons;
create policy voispeech_lessons_admin_update on public.voispeech_lessons
  for update to authenticated
  using (public.voispeech_is_admin())
  with check (public.voispeech_is_admin());

drop policy if exists voispeech_lessons_admin_delete on public.voispeech_lessons;
create policy voispeech_lessons_admin_delete on public.voispeech_lessons
  for delete to authenticated
  using (public.voispeech_is_admin());

-- ---------------------------------------------------------------------------
-- Community posts
-- ---------------------------------------------------------------------------
create table if not exists public.voispeech_community_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  channel text not null check (channel in ('공지', '질문', '연습 나눔', '작은 변화')),
  body text not null check (char_length(body) between 1 and 500),
  created_at timestamptz not null default now()
);

create index if not exists voispeech_community_posts_channel_idx
  on public.voispeech_community_posts (channel, created_at desc);

alter table public.voispeech_community_posts enable row level security;
revoke all on public.voispeech_community_posts from anon, authenticated;
grant select, insert, delete on public.voispeech_community_posts to authenticated;
grant all on public.voispeech_community_posts to service_role;

drop policy if exists voispeech_community_read on public.voispeech_community_posts;
create policy voispeech_community_read on public.voispeech_community_posts
  for select to authenticated using (true);

drop policy if exists voispeech_community_insert on public.voispeech_community_posts;
create policy voispeech_community_insert on public.voispeech_community_posts
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists voispeech_community_delete on public.voispeech_community_posts;
create policy voispeech_community_delete on public.voispeech_community_posts
  for delete to authenticated
  using ((select auth.uid()) = user_id or public.voispeech_is_admin());

-- ---------------------------------------------------------------------------
-- Practice check-in records
-- ---------------------------------------------------------------------------
create table if not exists public.voispeech_practice_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null check (char_length(kind) between 1 and 40),
  minutes int not null check (minutes between 1 and 600),
  note text not null default '' check (char_length(note) <= 120),
  created_at timestamptz not null default now()
);

create index if not exists voispeech_practice_records_user_idx
  on public.voispeech_practice_records (user_id, created_at desc);

alter table public.voispeech_practice_records enable row level security;
revoke all on public.voispeech_practice_records from anon, authenticated;
grant select, insert, delete on public.voispeech_practice_records to authenticated;
grant all on public.voispeech_practice_records to service_role;

drop policy if exists voispeech_practice_read on public.voispeech_practice_records;
create policy voispeech_practice_read on public.voispeech_practice_records
  for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists voispeech_practice_insert on public.voispeech_practice_records;
create policy voispeech_practice_insert on public.voispeech_practice_records
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists voispeech_practice_delete on public.voispeech_practice_records;
create policy voispeech_practice_delete on public.voispeech_practice_records
  for delete to authenticated
  using ((select auth.uid()) = user_id);

-- ---------------------------------------------------------------------------
-- Storage bucket: public read, admin write
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'voispeech-lessons',
  'voispeech-lessons',
  true,
  524288000,
  array['video/mp4', 'video/webm']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists voispeech_lessons_storage_public_read on storage.objects;
create policy voispeech_lessons_storage_public_read on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'voispeech-lessons');

drop policy if exists voispeech_lessons_storage_admin_insert on storage.objects;
create policy voispeech_lessons_storage_admin_insert on storage.objects
  for insert to authenticated
  with check (bucket_id = 'voispeech-lessons' and public.voispeech_is_admin());

drop policy if exists voispeech_lessons_storage_admin_update on storage.objects;
create policy voispeech_lessons_storage_admin_update on storage.objects
  for update to authenticated
  using (bucket_id = 'voispeech-lessons' and public.voispeech_is_admin())
  with check (bucket_id = 'voispeech-lessons' and public.voispeech_is_admin());

drop policy if exists voispeech_lessons_storage_admin_delete on storage.objects;
create policy voispeech_lessons_storage_admin_delete on storage.objects
  for delete to authenticated
  using (bucket_id = 'voispeech-lessons' and public.voispeech_is_admin());

-- ---------------------------------------------------------------------------
-- Seed 4 lessons matching the current training UI (storage_path null until upload)
-- ---------------------------------------------------------------------------
insert into public.voispeech_lessons (
  sort_order, category, title, description, access, storage_path, duration_label, published
)
select * from (values
  (1, '기초', '연습을 시작하기 전에',
   '목표와 연습 환경을 정리하는 첫 시간', 'free', null::text, '미리보기', true),
  (2, 'SOVT', '빨대 발성, 연습의 출발점',
   '수업에서 배운 연습을 다시 확인하기', 'subscribers', null::text, '', true),
  (3, '기초', '작은 소리에서 연결 찾기',
   '소리의 크기와 연결을 살펴보는 시간', 'subscribers', null::text, '', true),
  (4, '노래 적용', '한 구절로 옮겨보기',
   '연습과 노래를 연결하는 과정', 'subscribers', null::text, '', true)
) as seed(sort_order, category, title, description, access, storage_path, duration_label, published)
where not exists (select 1 from public.voispeech_lessons limit 1);

commit;
