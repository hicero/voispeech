import type { SupabaseClient } from '@supabase/supabase-js';

export type Membership = {
  status: string;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
};

function mapMembershipRow(data: unknown): Membership | null {
  if (!data || typeof data !== 'object') return null;
  const row = data as Record<string, unknown>;
  if (typeof row.status !== 'string') return null;
  return {
    status: row.status,
    current_period_start:
      typeof row.current_period_start === 'string' ? row.current_period_start : null,
    current_period_end:
      typeof row.current_period_end === 'string' ? row.current_period_end : null,
    cancel_at_period_end: Boolean(row.cancel_at_period_end),
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
  const { data } = await client
    .from('voispeech_subscriptions')
    .select('status,current_period_start,current_period_end,cancel_at_period_end')
    .eq('user_id', userId)
    .maybeSingle();
  return data;
}

async function callMembershipRpc(
  client: SupabaseClient,
  name: string,
): Promise<Membership> {
  const { data, error } = await client.rpc(name);
  if (error) throw error;
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
