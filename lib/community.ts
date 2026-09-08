import type { SupabaseClient } from '@supabase/supabase-js';

export type CommunityChannel = '공지' | '질문' | '연습 나눔' | '작은 변화';

export type CommunityPost = {
  id: string;
  user_id: string;
  channel: string;
  body: string;
  created_at: string;
  parent_id: string | null;
  like_count: number;
  liked_by_me: boolean;
  /** Short author label for UI (email local-part when known). */
  author_label: string;
  replies: CommunityPost[];
};

export type LikeToggleResult = {
  liked: boolean;
  like_count: number;
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
  likeCount: number,
  likedByMe: boolean,
): CommunityPost | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  const id = typeof r.id === 'string' || typeof r.id === 'number' ? String(r.id) : '';
  const user_id =
    typeof r.user_id === 'string' || typeof r.user_id === 'number' ? String(r.user_id) : '';
  if (!id || !user_id || typeof r.body !== 'string') return null;
  const parentRaw = r.parent_id;
  const parent_id =
    parentRaw == null || parentRaw === ''
      ? null
      : typeof parentRaw === 'string' || typeof parentRaw === 'number'
        ? String(parentRaw)
        : null;
  return {
    id,
    user_id,
    channel: typeof r.channel === 'string' ? r.channel : '',
    body: r.body,
    created_at: typeof r.created_at === 'string' ? r.created_at : '',
    parent_id,
    like_count: likeCount,
    liked_by_me: likedByMe,
    author_label: shortAuthorLabel(emailByUserId[user_id], user_id),
    replies: [],
  };
}

async function loadLikeMeta(
  client: SupabaseClient,
  postIds: string[],
  viewerUserId?: string,
): Promise<{ counts: Record<string, number>; liked: Set<string> }> {
  const counts: Record<string, number> = {};
  const liked = new Set<string>();
  if (!postIds.length) return { counts, liked };

  const { data, error } = await client
    .from('voispeech_community_likes')
    .select('post_id,user_id')
    .in('post_id', postIds);
  if (error) throw error;

  for (const row of data || []) {
    const pid =
      typeof row.post_id === 'string' || typeof row.post_id === 'number'
        ? String(row.post_id)
        : '';
    if (!pid) continue;
    counts[pid] = (counts[pid] || 0) + 1;
    if (viewerUserId && String(row.user_id) === viewerUserId) liked.add(pid);
  }
  return { counts, liked };
}

function nestPosts(flat: CommunityPost[]): CommunityPost[] {
  const byId = new Map<string, CommunityPost>();
  for (const p of flat) {
    byId.set(p.id, { ...p, replies: [] });
  }
  const roots: CommunityPost[] = [];
  for (const p of flat) {
    const node = byId.get(p.id)!;
    if (p.parent_id && byId.has(p.parent_id)) {
      const parent = byId.get(p.parent_id)!;
      // One level only: attach under top-level parent.
      if (!parent.parent_id) parent.replies.push(node);
    } else if (!p.parent_id) {
      roots.push(node);
    }
  }
  for (const root of roots) {
    root.replies.sort((a, b) => a.created_at.localeCompare(b.created_at));
  }
  roots.sort((a, b) => b.created_at.localeCompare(a.created_at));
  return roots;
}

export type CommunityListOptions = {
  limit?: number;
  offset?: number;
};

export type CommunityListResult = {
  posts: CommunityPost[];
  hasMore: boolean;
  total: number;
};

const DEFAULT_PAGE_SIZE = 10;

export async function listCommunityPosts(
  client: SupabaseClient,
  channel: string,
  viewer?: { userId: string; email: string | null },
  opts?: CommunityListOptions,
): Promise<CommunityListResult> {
  const limit =
    opts?.limit != null && Number.isFinite(opts.limit) && opts.limit > 0
      ? Math.min(Math.floor(opts.limit), 50)
      : DEFAULT_PAGE_SIZE;
  const offset =
    opts?.offset != null && Number.isFinite(opts.offset) && opts.offset > 0
      ? Math.floor(opts.offset)
      : 0;

  let countQ = client
    .from('voispeech_community_posts')
    .select('id', { count: 'exact', head: true })
    .is('parent_id', null);
  if (channel) countQ = countQ.eq('channel', channel);
  const { count, error: countError } = await countQ;
  if (countError) throw countError;
  const total = count ?? 0;

  let q = client
    .from('voispeech_community_posts')
    .select('id,user_id,channel,body,created_at,parent_id')
    .is('parent_id', null)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);
  if (channel) q = q.eq('channel', channel);
  const { data: roots, error } = await q;
  if (error) throw error;

  const rootRows = roots || [];
  const rootIds = rootRows
    .map((row) =>
      typeof row.id === 'string' || typeof row.id === 'number' ? String(row.id) : '',
    )
    .filter(Boolean);

  let replyRows: unknown[] = [];
  if (rootIds.length) {
    let rq = client
      .from('voispeech_community_posts')
      .select('id,user_id,channel,body,created_at,parent_id')
      .in('parent_id', rootIds)
      .order('created_at', { ascending: true });
    if (channel) rq = rq.eq('channel', channel);
    const { data: replies, error: replyError } = await rq;
    if (replyError) throw replyError;
    replyRows = replies || [];
  }

  const emailByUserId: Record<string, string | undefined> = {};
  if (viewer?.userId) emailByUserId[viewer.userId] = viewer.email ?? undefined;

  const allRows = [...rootRows, ...replyRows];
  const ids = allRows
    .map((row) => {
      const r = row as { id?: string | number };
      return typeof r.id === 'string' || typeof r.id === 'number' ? String(r.id) : '';
    })
    .filter(Boolean);
  const { counts, liked } = await loadLikeMeta(client, ids, viewer?.userId);

  const flat = allRows
    .map((row) => {
      const r = row as { id?: string | number };
      const id = typeof r.id === 'string' || typeof r.id === 'number' ? String(r.id) : '';
      return mapPost(row, emailByUserId, counts[id] || 0, liked.has(id));
    })
    .filter((x): x is CommunityPost => x != null);

  const posts = nestPosts(flat);
  const hasMore = offset + rootRows.length < total;
  return { posts, hasMore, total };
}

export async function createCommunityPost(
  client: SupabaseClient,
  userId: string,
  channel: string,
  body: string,
  viewerEmail?: string | null,
  parentId?: string | null,
): Promise<CommunityPost> {
  const trimmed = body.trim();
  if (!trimmed) throw new Error('empty post');

  let resolvedChannel = channel;
  let resolvedParent: string | null = parentId ? String(parentId) : null;

  if (resolvedParent) {
    const { data: parent, error: parentError } = await client
      .from('voispeech_community_posts')
      .select('id,channel,parent_id')
      .eq('id', resolvedParent)
      .maybeSingle();
    if (parentError) throw parentError;
    if (!parent) throw new Error('parent not found');
    const parentParent =
      parent.parent_id == null || parent.parent_id === ''
        ? null
        : String(parent.parent_id);
    if (parentParent) throw new Error('nested replies not allowed');
    resolvedChannel = typeof parent.channel === 'string' ? parent.channel : channel;
  }

  const insertRow: {
    user_id: string;
    channel: string;
    body: string;
    parent_id?: string;
  } = {
    user_id: userId,
    channel: resolvedChannel,
    body: trimmed,
  };
  if (resolvedParent) insertRow.parent_id = resolvedParent;

  const { data, error } = await client
    .from('voispeech_community_posts')
    .insert(insertRow)
    .select('id,user_id,channel,body,created_at,parent_id')
    .single();
  if (error) throw error;
  const mapped = mapPost(data, { [userId]: viewerEmail ?? undefined }, 0, false);
  if (!mapped) throw new Error('createCommunityPost returned no row');
  return mapped;
}

export async function deleteCommunityPost(
  client: SupabaseClient,
  id: string,
): Promise<void> {
  const { error } = await client.from('voispeech_community_posts').delete().eq('id', String(id));
  if (error) throw error;
}

export async function toggleCommunityLike(
  client: SupabaseClient,
  userId: string,
  postId: string,
): Promise<LikeToggleResult> {
  const pid = String(postId);
  const { data: existing, error: findError } = await client
    .from('voispeech_community_likes')
    .select('post_id')
    .eq('post_id', pid)
    .eq('user_id', userId)
    .maybeSingle();
  if (findError) throw findError;

  if (existing) {
    const { error } = await client
      .from('voispeech_community_likes')
      .delete()
      .eq('post_id', pid)
      .eq('user_id', userId);
    if (error) throw error;
  } else {
    const { error } = await client
      .from('voispeech_community_likes')
      .insert({ post_id: pid, user_id: userId });
    if (error) throw error;
  }

  const { count, error: countError } = await client
    .from('voispeech_community_likes')
    .select('post_id', { count: 'exact', head: true })
    .eq('post_id', pid);
  if (countError) throw countError;

  return {
    liked: !existing,
    like_count: count ?? 0,
  };
}
