-- Prepared migration; apply only to the selected VoiSpeech Supabase project.
-- Passwords and sessions remain in Supabase Auth, never in these tables.
begin;

create table public.voispeech_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '' check (char_length(display_name) <= 80),
  created_at timestamptz not null default now()
);

create table public.voispeech_subscriptions (
  user_id uuid primary key references auth.users(id) on delete cascade,
  status text not null default 'inactive'
    check (status in ('inactive', 'active', 'past_due', 'expired', 'revoked')),
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  updated_at timestamptz not null default now(),
  check (current_period_end is null or current_period_start is null
    or current_period_end > current_period_start),
  check (status <> 'active' or
    (current_period_start is not null and current_period_end is not null))
);

alter table public.voispeech_profiles enable row level security;
alter table public.voispeech_subscriptions enable row level security;
revoke all on public.voispeech_profiles from anon, authenticated;
revoke all on public.voispeech_subscriptions from anon, authenticated;
grant select on public.voispeech_profiles to authenticated;
grant update (display_name) on public.voispeech_profiles to authenticated;
grant select on public.voispeech_subscriptions to authenticated;
grant all on public.voispeech_profiles, public.voispeech_subscriptions to service_role;

create policy voispeech_profile_read on public.voispeech_profiles
  for select to authenticated using ((select auth.uid()) = user_id);
create policy voispeech_profile_name_update on public.voispeech_profiles
  for update to authenticated using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy voispeech_subscription_read on public.voispeech_subscriptions
  for select to authenticated using ((select auth.uid()) = user_id);
-- No client INSERT, UPDATE or DELETE grant/policy on subscriptions.

create function public.voispeech_initialize_member()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.voispeech_profiles(user_id) values (new.id);
  insert into public.voispeech_subscriptions(user_id) values (new.id);
  return new;
end;
$$;
revoke all on function public.voispeech_initialize_member() from public, anon, authenticated;
create trigger voispeech_member_created after insert on auth.users
  for each row execute function public.voispeech_initialize_member();

create function public.voispeech_can_watch()
returns boolean language sql stable security invoker set search_path = '' as $$
  select exists (
    select 1 from public.voispeech_subscriptions
    where user_id = (select auth.uid())
      and status = 'active'
      and current_period_start <= now()
      and current_period_end > now()
  );
$$;
revoke all on function public.voispeech_can_watch() from public, anon;
grant execute on function public.voispeech_can_watch() to authenticated;

commit;
