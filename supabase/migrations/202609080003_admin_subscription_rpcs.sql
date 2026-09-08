-- Operator admin RPCs for subscription management.
-- Already applied on project wvgckdjylodzexpgjnpq; this file keeps repo history in sync.
-- Admin gate: auth.users.raw_app_meta_data->>'voispeech_admin' = 'true'
-- (JWT app_metadata.voispeech_admin). Clients never use service_role.
begin;

create or replace function public.voispeech_is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(
    (
      select (u.raw_app_meta_data ->> 'voispeech_admin') = 'true'
      from auth.users u
      where u.id = (select auth.uid())
    ),
    false
  );
$$;

create or replace function public.voispeech_admin_list_members()
returns table (
  user_id uuid,
  email text,
  display_name text,
  status text,
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean,
  updated_at timestamptz
)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if not public.voispeech_is_admin() then
    raise exception 'not authorized';
  end if;

  return query
  select
    s.user_id,
    coalesce(u.email, '')::text as email,
    coalesce(p.display_name, '')::text as display_name,
    s.status,
    s.current_period_start,
    s.current_period_end,
    s.cancel_at_period_end,
    s.updated_at
  from public.voispeech_subscriptions s
  join auth.users u on u.id = s.user_id
  left join public.voispeech_profiles p on p.user_id = s.user_id
  order by s.updated_at desc nulls last, u.email asc;
end;
$$;

create or replace function public.voispeech_admin_set_subscription(
  p_user_id uuid,
  p_status text,
  p_period_days int default 30
)
returns public.voispeech_subscriptions
language plpgsql
security definer
set search_path = ''
as $$
declare
  row public.voispeech_subscriptions;
  days int := greatest(coalesce(p_period_days, 30), 1);
begin
  if not public.voispeech_is_admin() then
    raise exception 'not authorized';
  end if;

  if p_user_id is null then
    raise exception 'user_id required';
  end if;

  if p_status not in ('inactive', 'active', 'past_due', 'expired', 'revoked') then
    raise exception 'invalid status';
  end if;

  if p_status = 'active' then
    update public.voispeech_subscriptions
    set
      status = 'active',
      current_period_start = now(),
      current_period_end = now() + make_interval(days => days),
      cancel_at_period_end = false,
      updated_at = now()
    where user_id = p_user_id
    returning * into row;
  elsif p_status = 'inactive' then
    update public.voispeech_subscriptions
    set
      status = 'inactive',
      current_period_start = null,
      current_period_end = null,
      cancel_at_period_end = false,
      updated_at = now()
    where user_id = p_user_id
    returning * into row;
  elsif p_status = 'expired' then
    update public.voispeech_subscriptions
    set
      status = 'expired',
      current_period_end = least(coalesce(current_period_end, now()), now()),
      current_period_start = coalesce(current_period_start, now()),
      cancel_at_period_end = false,
      updated_at = now()
    where user_id = p_user_id
    returning * into row;
  else
    -- revoked
    update public.voispeech_subscriptions
    set
      status = 'revoked',
      current_period_end = least(coalesce(current_period_end, now()), now()),
      current_period_start = coalesce(current_period_start, now()),
      cancel_at_period_end = false,
      updated_at = now()
    where user_id = p_user_id
    returning * into row;
  end if;

  if not found then
    raise exception 'subscription row missing';
  end if;

  return row;
end;
$$;

revoke all on function public.voispeech_is_admin() from public, anon;
revoke all on function public.voispeech_admin_list_members() from public, anon;
revoke all on function public.voispeech_admin_set_subscription(uuid, text, int) from public, anon;

grant execute on function public.voispeech_is_admin() to authenticated;
grant execute on function public.voispeech_admin_list_members() to authenticated;
grant execute on function public.voispeech_admin_set_subscription(uuid, text, int) to authenticated;

commit;
