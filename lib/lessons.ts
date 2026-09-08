import type { SupabaseClient } from '@supabase/supabase-js';

export type LessonAccess = 'free' | 'subscribers';

export type LessonSession = {
  id: string;
  lesson_id: string;
  sort_order: number;
  title: string;
  description: string;
  storage_path: string | null;
  duration_label: string;
  published: boolean;
  created_at?: string;
  updated_at?: string;
};

export type Lesson = {
  id: string;
  sort_order: number;
  category: string;
  title: string;
  description: string;
  access: LessonAccess;
  storage_path: string | null;
  duration_label: string;
  published: boolean;
  created_at?: string;
  updated_at?: string;
  sessions: LessonSession[];
};

export type LessonInput = {
  sort_order: number;
  category: string;
  title: string;
  description: string;
  access: LessonAccess;
  duration_label?: string;
  published: boolean;
  storage_path?: string | null;
};

export type LessonSessionInput = {
  sort_order: number;
  title: string;
  description?: string;
  duration_label?: string;
  published?: boolean;
  storage_path?: string | null;
};

const LESSON_COLS =
  'id,sort_order,category,title,description,access,storage_path,duration_label,published,created_at,updated_at';

const SESSION_COLS =
  'id,lesson_id,sort_order,title,description,storage_path,duration_label,published,created_at,updated_at';

function mapSession(raw: unknown): LessonSession | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  const id = typeof r.id === 'string' || typeof r.id === 'number' ? String(r.id) : '';
  const lesson_id =
    typeof r.lesson_id === 'string' || typeof r.lesson_id === 'number' ? String(r.lesson_id) : '';
  if (!id || !lesson_id || typeof r.title !== 'string') return null;
  return {
    id,
    lesson_id,
    sort_order: typeof r.sort_order === 'number' ? r.sort_order : 0,
    title: r.title,
    description: typeof r.description === 'string' ? r.description : '',
    storage_path: typeof r.storage_path === 'string' ? r.storage_path : null,
    duration_label: typeof r.duration_label === 'string' ? r.duration_label : '',
    published: r.published !== false,
    created_at: typeof r.created_at === 'string' ? r.created_at : undefined,
    updated_at: typeof r.updated_at === 'string' ? r.updated_at : undefined,
  };
}

function mapLesson(raw: unknown, sessions: LessonSession[] = []): Lesson | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  const id = typeof r.id === 'string' || typeof r.id === 'number' ? String(r.id) : '';
  if (!id || typeof r.title !== 'string') return null;
  const access = r.access === 'free' || r.access === 'subscribers' ? r.access : 'subscribers';
  return {
    id,
    sort_order: typeof r.sort_order === 'number' ? r.sort_order : 0,
    category: typeof r.category === 'string' ? r.category : '',
    title: r.title,
    description: typeof r.description === 'string' ? r.description : '',
    access,
    storage_path: typeof r.storage_path === 'string' ? r.storage_path : null,
    duration_label: typeof r.duration_label === 'string' ? r.duration_label : '',
    published: Boolean(r.published),
    created_at: typeof r.created_at === 'string' ? r.created_at : undefined,
    updated_at: typeof r.updated_at === 'string' ? r.updated_at : undefined,
    sessions,
  };
}

/** Public object URL for a path inside the voispeech-lessons bucket. */
export function lessonPublicUrl(storagePath: string | null | undefined): string | null {
  if (!storagePath) return null;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return null;
  const trimmed = storagePath.replace(/^\/+/, '');
  return `${base.replace(/\/$/, '')}/storage/v1/object/public/voispeech-lessons/${trimmed}`;
}

/** Video src for the player: uploaded public URL, else local sample. */
export function lessonVideoSrc(
  lesson: Pick<Lesson, 'storage_path'> | Pick<LessonSession, 'storage_path'>,
): string {
  return lessonPublicUrl(lesson.storage_path) || '/training-sample.mp4';
}

async function removeStoragePath(client: SupabaseClient, storagePath?: string | null) {
  if (!storagePath) return;
  try {
    await client.storage.from('voispeech-lessons').remove([storagePath]);
  } catch {
    // best-effort; DB row is source of truth
  }
}

export async function listSessionsForLesson(
  client: SupabaseClient,
  lessonId: string,
  opts?: { publishedOnly?: boolean },
): Promise<LessonSession[]> {
  let q = client
    .from('voispeech_lesson_sessions')
    .select(SESSION_COLS)
    .eq('lesson_id', lessonId)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });
  if (opts?.publishedOnly) q = q.eq('published', true);
  const { data, error } = await q;
  if (error) throw error;
  return (data || []).map(mapSession).filter((x): x is LessonSession => x != null);
}

async function attachSessions(
  client: SupabaseClient,
  lessons: Lesson[],
  opts?: { publishedOnly?: boolean },
): Promise<Lesson[]> {
  if (!lessons.length) return lessons;
  const ids = lessons.map((l) => l.id);
  let q = client
    .from('voispeech_lesson_sessions')
    .select(SESSION_COLS)
    .in('lesson_id', ids)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });
  if (opts?.publishedOnly) q = q.eq('published', true);
  const { data, error } = await q;
  if (error) {
    // Catalog must not die if sessions RLS glitches (e.g. anon cannot execute is_admin).
    console.warn('[voispeech] attachSessions failed; returning lessons with empty sessions', error);
    return lessons.map((l) => ({ ...l, sessions: [] }));
  }
  const byLesson = new Map<string, LessonSession[]>();
  for (const raw of data || []) {
    const s = mapSession(raw);
    if (!s) continue;
    const list = byLesson.get(s.lesson_id) || [];
    list.push(s);
    byLesson.set(s.lesson_id, list);
  }
  return lessons.map((l) => ({ ...l, sessions: byLesson.get(l.id) || [] }));
}

export async function listPublishedLessons(client: SupabaseClient): Promise<Lesson[]> {
  const { data, error } = await client
    .from('voispeech_lessons')
    .select(LESSON_COLS)
    .eq('published', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });
  if (error) throw error;
  const lessons = (data || []).map((row) => mapLesson(row, [])).filter((x): x is Lesson => x != null);
  return attachSessions(client, lessons, { publishedOnly: true });
}

/** Admin: all lessons including drafts, with all sessions. */
export async function listAllLessons(client: SupabaseClient): Promise<Lesson[]> {
  const { data, error } = await client
    .from('voispeech_lessons')
    .select(LESSON_COLS)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });
  if (error) throw error;
  const lessons = (data || []).map((row) => mapLesson(row, [])).filter((x): x is Lesson => x != null);
  return attachSessions(client, lessons);
}

export async function createLesson(
  client: SupabaseClient,
  input: LessonInput,
): Promise<Lesson> {
  const row = {
    sort_order: input.sort_order,
    category: input.category.trim(),
    title: input.title.trim(),
    description: input.description.trim(),
    access: input.access,
    duration_label: (input.duration_label || '').trim(),
    published: input.published,
    storage_path: input.storage_path ?? null,
    updated_at: new Date().toISOString(),
  };
  const { data, error } = await client
    .from('voispeech_lessons')
    .insert(row)
    .select(LESSON_COLS)
    .single();
  if (error) throw error;
  const mapped = mapLesson(data, []);
  if (!mapped) throw new Error('createLesson returned no row');
  return mapped;
}

export async function updateLesson(
  client: SupabaseClient,
  id: string,
  input: Partial<LessonInput> & { storage_path?: string | null },
): Promise<Lesson> {
  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (input.sort_order != null) patch.sort_order = input.sort_order;
  if (input.category != null) patch.category = input.category.trim();
  if (input.title != null) patch.title = input.title.trim();
  if (input.description != null) patch.description = input.description.trim();
  if (input.access != null) patch.access = input.access;
  if (input.duration_label != null) patch.duration_label = input.duration_label.trim();
  if (input.published != null) patch.published = input.published;
  if ('storage_path' in input) patch.storage_path = input.storage_path ?? null;

  const { data, error } = await client
    .from('voispeech_lessons')
    .update(patch)
    .eq('id', id)
    .select(LESSON_COLS)
    .single();
  if (error) throw error;
  const mapped = mapLesson(data, []);
  if (!mapped) throw new Error('updateLesson returned no row');
  const sessions = await listSessionsForLesson(client, id);
  return { ...mapped, sessions };
}

export async function deleteLesson(
  client: SupabaseClient,
  id: string,
  storagePath?: string | null,
): Promise<void> {
  const sessions = await listSessionsForLesson(client, id).catch(() => [] as LessonSession[]);
  for (const s of sessions) {
    await removeStoragePath(client, s.storage_path);
  }
  await removeStoragePath(client, storagePath);
  const { error } = await client.from('voispeech_lessons').delete().eq('id', id);
  if (error) throw error;
}

/**
 * Upload mp4/webm to voispeech-lessons/{lessonId}/{filename} and save storage_path.
 * Returns the updated lesson. onProgress receives 0–100 when the client supports it.
 */
export async function uploadLessonVideo(
  client: SupabaseClient,
  lessonId: string,
  file: File,
  onProgress?: (pct: number) => void,
): Promise<Lesson> {
  const safeName = file.name.replace(/[^\w.\-()+ ]+/g, '_').slice(0, 120) || 'lesson.mp4';
  const path = `${lessonId}/${safeName}`;
  onProgress?.(5);

  const { error: upErr } = await client.storage.from('voispeech-lessons').upload(path, file, {
    upsert: true,
    contentType: file.type || 'video/mp4',
    cacheControl: '3600',
  });
  if (upErr) throw upErr;
  onProgress?.(90);

  const updated = await updateLesson(client, lessonId, { storage_path: path });
  onProgress?.(100);
  return updated;
}

export async function createSession(
  client: SupabaseClient,
  lessonId: string,
  input: LessonSessionInput,
): Promise<LessonSession> {
  const row = {
    lesson_id: lessonId,
    sort_order: input.sort_order,
    title: input.title.trim(),
    description: (input.description || '').trim(),
    duration_label: (input.duration_label || '').trim(),
    published: input.published !== false,
    storage_path: input.storage_path ?? null,
    updated_at: new Date().toISOString(),
  };
  const { data, error } = await client
    .from('voispeech_lesson_sessions')
    .insert(row)
    .select(SESSION_COLS)
    .single();
  if (error) throw error;
  const mapped = mapSession(data);
  if (!mapped) throw new Error('createSession returned no row');
  return mapped;
}

export async function updateSession(
  client: SupabaseClient,
  id: string,
  input: Partial<LessonSessionInput> & { storage_path?: string | null },
): Promise<LessonSession> {
  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (input.sort_order != null) patch.sort_order = input.sort_order;
  if (input.title != null) patch.title = input.title.trim();
  if (input.description != null) patch.description = input.description.trim();
  if (input.duration_label != null) patch.duration_label = input.duration_label.trim();
  if (input.published != null) patch.published = input.published;
  if ('storage_path' in input) patch.storage_path = input.storage_path ?? null;

  const { data, error } = await client
    .from('voispeech_lesson_sessions')
    .update(patch)
    .eq('id', id)
    .select(SESSION_COLS)
    .single();
  if (error) throw error;
  const mapped = mapSession(data);
  if (!mapped) throw new Error('updateSession returned no row');
  return mapped;
}

export async function deleteSession(
  client: SupabaseClient,
  id: string,
  storagePath?: string | null,
): Promise<void> {
  await removeStoragePath(client, storagePath);
  const { error } = await client.from('voispeech_lesson_sessions').delete().eq('id', id);
  if (error) throw error;
}

export async function uploadSessionVideo(
  client: SupabaseClient,
  lessonId: string,
  sessionId: string,
  file: File,
  onProgress?: (pct: number) => void,
): Promise<LessonSession> {
  const safeName = file.name.replace(/[^\w.\-()+ ]+/g, '_').slice(0, 120) || 'session.mp4';
  const path = `${lessonId}/sessions/${sessionId}/${safeName}`;
  onProgress?.(5);

  const { error: upErr } = await client.storage.from('voispeech-lessons').upload(path, file, {
    upsert: true,
    contentType: file.type || 'video/mp4',
    cacheControl: '3600',
  });
  if (upErr) throw upErr;
  onProgress?.(90);

  const updated = await updateSession(client, sessionId, { storage_path: path });
  onProgress?.(100);
  return updated;
}

export type SessionDraft = {
  /** Existing DB id, or null for a new session. */
  id: string | null;
  /** Stable client key for React lists. */
  key: string;
  sort_order: number;
  title: string;
  description: string;
  duration_label: string;
  published: boolean;
  storage_path: string | null;
};

/**
 * Diff draft sessions against current DB rows: create / update / delete.
 * Does not upload files — caller uploads after upsert returns ids.
 */
export async function syncLessonSessions(
  client: SupabaseClient,
  lessonId: string,
  drafts: SessionDraft[],
): Promise<LessonSession[]> {
  const existing = await listSessionsForLesson(client, lessonId);
  const keepIds = new Set(drafts.map((d) => d.id).filter((id): id is string => !!id));

  for (const old of existing) {
    if (!keepIds.has(old.id)) {
      await deleteSession(client, old.id, old.storage_path);
    }
  }

  const result: LessonSession[] = [];
  for (let i = 0; i < drafts.length; i++) {
    const d = drafts[i];
    const title = d.title.trim();
    if (!title) continue;
    const payload: LessonSessionInput = {
      sort_order: Number.isFinite(d.sort_order) ? d.sort_order : i,
      title,
      description: d.description,
      duration_label: d.duration_label,
      published: d.published !== false,
      storage_path: d.storage_path,
    };
    if (d.id) {
      result.push(await updateSession(client, d.id, payload));
    } else {
      result.push(await createSession(client, lessonId, payload));
    }
  }
  return result;
}
