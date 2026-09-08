import type { SupabaseClient } from '@supabase/supabase-js';

export type Membership = {
  status: string;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
};

function asIsoTimestamp(value: unknown): string | null {
  if (value == null || value === '') return null;
  if (value instanceof Date) {
    const t = value.getTime();
    return Number.isNaN(t) ? null : value.toISOString();
  }
  if (typeof value === 'string' || typeof value === 'number') {
    const d = new Date(value);
    const t = d.getTime();
    return Number.isNaN(t) ? null : d.toISOString();
  }
  return null;
}

function mapMembershipRow(data: unknown): Membership | null {
  const row = Array.isArray(data) ? data[0] : data;
  if (!row || typeof row !== 'object') return null;
  const r = row as Record<string, unknown>;
  if (typeof r.status !== 'string') return null;
  return {
    status: r.status,
    current_period_start: asIsoTimestamp(r.current_period_start),
    current_period_end: asIsoTimestamp(r.current_period_end),
    cancel_at_period_end: Boolean(r.cancel_at_period_end),
  };
}

/** True when status is active and the paid period covers now. */
export function isSubscriptionActive(m: Membership | null | undefined): boolean {
  if (!m || m.status !== 'active') return false;
  const now = Date.now();
  if (!m.current_period_end) return false;
  const end = new Date(m.current_period_end).getTime();
  if (Number.isNaN(end) || !(end > now)) return false;
  if (m.current_period_start) {
    const start = new Date(m.current_period_start).getTime();
    if (Number.isNaN(start) || !(start <= now)) return false;
  }
  return true;
}

export async function fetchMembership(
  client: SupabaseClient,
  userId: string,
): Promise<Membership | null> {
  const { data, error } = await client
    .from('voispeech_subscriptions')
    .select('status,current_period_start,current_period_end,cancel_at_period_end')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) throw error;
  return mapMembershipRow(data);
}

async function callMembershipRpc(
  client: SupabaseClient,
  name: string,
): Promise<Membership> {
  const { data, error } = await client.rpc(name);
  if (error) throw error;
  const { data: userData, error: userError } = await client.auth.getUser();
  if (!userError && userData.user) {
    const fresh = await fetchMembership(client, userData.user.id);
    if (fresh) return fresh;
  }
  const mapped = mapMembershipRow(data);
  if (!mapped) throw new Error(`${name} returned no membership row`);
  return mapped;
}

/** Sets the caller's subscription active for 30 days (payment-free preview). */
export function startPreviewMembership(client: SupabaseClient): Promise<Membership> {
  return callMembershipRpc(client, 'voispeech_start_preview_membership');
}

/** Marks cancel_at_period_end on the caller's subscription. */
export function cancelPreviewRenewal(client: SupabaseClient): Promise<Membership> {
  return callMembershipRpc(client, 'voispeech_cancel_preview_renewal');
}

/** Expires the caller's preview membership immediately. */
export function expirePreviewMembership(client: SupabaseClient): Promise<Membership> {
  return callMembershipRpc(client, 'voispeech_expire_preview_membership');
}
