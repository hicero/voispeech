import type { SupabaseClient } from '@supabase/supabase-js';

export type Membership = {
  status: string;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
};

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
