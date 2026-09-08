-- Payment-free preview membership RPCs (no Stripe).
-- Clients call these via supabase.rpc; never service_role from the browser,
-- never direct UPDATE on voispeech_subscriptions.
begin;

create or replace function public.voispeech_start_preview_membership()
returns public.voispeech_subscriptions
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := (select auth.uid());
  row public.voispeech_subscriptions;
begin
  if uid is null then
    raise exception 'not authenticated';
  end if;

  update public.voispeech_subscriptions
  set
    status = 'active',
    current_period_start = now(),
    current_period_end = now() + interval '30 days',
    cancel_at_period_end = false,
    updated_at = now()
  where user_id = uid
  returning * into row;

  if not found then
    raise exception 'subscription row missing';
  end if;

  return row;
end;
$$;

create or replace function public.voispeech_cancel_preview_renewal()
returns public.voispeech_subscriptions
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := (select auth.uid());
  row public.voispeech_subscriptions;
begin
  if uid is null then
    raise exception 'not authenticated';
  end if;

  update public.voispeech_subscriptions
  set
    cancel_at_period_end = true,
    updated_at = now()
  where user_id = uid
  returning * into row;

  if not found then
    raise exception 'subscription row missing';
  end if;

  return row;
end;
$$;

create or replace function public.voispeech_expire_preview_membership()
returns public.voispeech_subscriptions
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := (select auth.uid());
  row public.voispeech_subscriptions;
begin
  if uid is null then
    raise exception 'not authenticated';
  end if;

  update public.voispeech_subscriptions
  set
    status = 'expired',
    current_period_end = now(),
    cancel_at_period_end = false,
    updated_at = now()
  where user_id = uid
  returning * into row;

  if not found then
    raise exception 'subscription row missing';
  end if;

  return row;
end;
$$;

revoke all on function public.voispeech_start_preview_membership() from public, anon;
revoke all on function public.voispeech_cancel_preview_renewal() from public, anon;
revoke all on function public.voispeech_expire_preview_membership() from public, anon;

grant execute on function public.voispeech_start_preview_membership() to authenticated;
grant execute on function public.voispeech_cancel_preview_renewal() to authenticated;
grant execute on function public.voispeech_expire_preview_membership() to authenticated;

commit;
