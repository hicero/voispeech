import type { SupabaseClient, User } from '@supabase/supabase-js';

export type AdminMemberRow = {
  user_id: string;
  email: string;
  display_name: string;
  status: string;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  updated_at: string | null;
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

function mapAdminMemberRow(raw: unknown): AdminMemberRow | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  if (typeof r.user_id !== 'string') return null;
  return {
    user_id: r.user_id,
    email: typeof r.email === 'string' ? r.email : '',
    display_name: typeof r.display_name === 'string' ? r.display_name : '',
    status: typeof r.status === 'string' ? r.status : 'inactive',
    current_period_start: asIsoTimestamp(r.current_period_start),
    current_period_end: asIsoTimestamp(r.current_period_end),
    cancel_at_period_end: Boolean(r.cancel_at_period_end),
    updated_at: asIsoTimestamp(r.updated_at),
  };
}

/** True when JWT app_metadata.voispeech_admin is exactly true. */
export function isVoiSpeechAdmin(user: User | null | undefined): boolean {
  if (!user) return false;
  const meta = user.app_metadata as Record<string, unknown> | undefined;
  return meta?.voispeech_admin === true;
}

export async function adminListMembers(
  client: SupabaseClient,
): Promise<AdminMemberRow[]> {
  const { data, error } = await client.rpc('voispeech_admin_list_members');
  if (error) throw error;
  if (!Array.isArray(data)) return [];
  return data
    .map(mapAdminMemberRow)
    .filter((row): row is AdminMemberRow => row != null);
}

export async function adminSetSubscription(
  client: SupabaseClient,
  userId: string,
  status: string,
  periodDays?: number,
): Promise<void> {
  const params: {
    p_user_id: string;
    p_status: string;
    p_period_days?: number;
  } = {
    p_user_id: userId,
    p_status: status,
  };
  if (periodDays != null) params.p_period_days = periodDays;
  const { error } = await client.rpc('voispeech_admin_set_subscription', params);
  if (error) throw error;
}
