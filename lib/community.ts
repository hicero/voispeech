import type { SupabaseClient } from '@supabase/supabase-js';

export type CommunityChannel = '공지' | '질문' | '연습 나눔' | '작은 변화';

export type CommunityPost = {
  id: string;
  user_id: string;
  channel: string;
  body: string;
  created_at: string;
  /** Short author label for UI (email local-part when known). */
  author_label: string;
};

function shortAuthorLabel(email: string | null | undefined, userId: string): string {
  if (email && email.includes('@')) {
    const local = email.split('@')[0] || email;
    return local.length > 14 ? `${local.slice(0, 14)}…` : local;
  }
  return `회원 ${userId.slice(0, 6)}`;
}

function mapPost(
  raw: unknown,
  emailByUserId: Record<string, string | undefined>,
): CommunityPost | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  const id = typeof r.id === 'string' || typeof r.id === 'number' ? String(r.id) : '';
  const user_id =
    typeof r.user_id === 'string' || typeof r.user_id === 'number' ? String(r.user_id) : '';
  if (!id || !user_id || typeof r.body !== 'string') return null;
  return {
    id,
    user_id,
    channel: typeof r.channel === 'string' ? r.channel : '',
    body: r.body,
    created_at: typeof r.created_at === 'string' ? r.created_at : '',
    author_label: shortAuthorLabel(emailByUserId[user_id], user_id),
  };
}

export async function listCommunityPosts(
  client: SupabaseClient,
  channel: string,
  viewer?: { userId: string; email: string | null },
): Promise<CommunityPost[]> {
  let q = client
    .from('voispeech_community_posts')
    .select('id,user_id,channel,body,created_at')
    .order('created_at', { ascending: false })
    .limit(80);
  if (channel) q = q.eq('channel', channel);
  const { data, error } = await q;
  if (error) throw error;
  const emailByUserId: Record<string, string | undefined> = {};
  if (viewer?.userId) emailByUserId[viewer.userId] = viewer.email ?? undefined;
  return (data || [])
    .map((row) => mapPost(row, emailByUserId))
    .filter((x): x is CommunityPost => x != null);
}

export async function createCommunityPost(
  client: SupabaseClient,
  userId: string,
  channel: string,
  body: string,
  viewerEmail?: string | null,
): Promise<CommunityPost> {
  const trimmed = body.trim();
  if (!trimmed) throw new Error('empty post');
  const { data, error } = await client
    .from('voispeech_community_posts')
    .insert({ user_id: userId, channel, body: trimmed })
    .select('id,user_id,channel,body,created_at')
    .single();
  if (error) throw error;
  const mapped = mapPost(data, { [userId]: viewerEmail ?? undefined });
  if (!mapped) throw new Error('createCommunityPost returned no row');
  return mapped;
}

export async function deleteCommunityPost(
  client: SupabaseClient,
  id: string,
): Promise<void> {
  const { error } = await client.from('voispeech_community_posts').delete().eq('id', id);
  if (error) throw error;
}
