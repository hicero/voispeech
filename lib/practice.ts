import type { SupabaseClient } from '@supabase/supabase-js';

export type PracticeRecord = {
  id: string;
  user_id: string;
  kind: string;
  minutes: number;
  note: string;
  created_at: string;
};

function mapRecord(raw: unknown): PracticeRecord | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  const id = typeof r.id === 'string' || typeof r.id === 'number' ? String(r.id) : '';
  const user_id =
    typeof r.user_id === 'string' || typeof r.user_id === 'number' ? String(r.user_id) : '';
  if (!id || !user_id || typeof r.kind !== 'string') return null;
  const minutes = typeof r.minutes === 'number' ? r.minutes : Number(r.minutes);
  if (!Number.isFinite(minutes)) return null;
  return {
    id,
    user_id,
    kind: r.kind,
    minutes,
    note: typeof r.note === 'string' ? r.note : '',
    created_at: typeof r.created_at === 'string' ? r.created_at : '',
  };
}

export async function listPracticeRecords(
  client: SupabaseClient,
  userId: string,
): Promise<PracticeRecord[]> {
  const { data, error } = await client
    .from('voispeech_practice_records')
    .select('id,user_id,kind,minutes,note,created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(100);
  if (error) throw error;
  return (data || []).map(mapRecord).filter((x): x is PracticeRecord => x != null);
}

export async function createPracticeRecord(
  client: SupabaseClient,
  userId: string,
  kind: string,
  minutes: number,
  note: string,
): Promise<PracticeRecord> {
  if (!Number.isFinite(minutes) || minutes < 1 || minutes > 600) {
    throw new Error('invalid minutes');
  }
  const { data, error } = await client
    .from('voispeech_practice_records')
    .insert({
      user_id: userId,
      kind: String(kind).trim().slice(0, 40),
      minutes: Math.floor(minutes),
      note: String(note || '').trim().slice(0, 120),
    })
    .select('id,user_id,kind,minutes,note,created_at')
    .single();
  if (error) throw error;
  const mapped = mapRecord(data);
  if (!mapped) throw new Error('createPracticeRecord returned no row');
  return mapped;
}

export async function deletePracticeRecord(
  client: SupabaseClient,
  id: string,
): Promise<void> {
  const { error } = await client.from('voispeech_practice_records').delete().eq('id', id);
  if (error) throw error;
}
