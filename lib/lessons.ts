import type { SupabaseClient } from '@supabase/supabase-js';

export type LessonAccess = 'free' | 'subscribers';

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

const LESSON_COLS =
  'id,sort_order,category,title,description,access,storage_path,duration_label,published,created_at,updated_at';

function mapLesson(raw: unknown): Lesson | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  if (typeof r.id !== 'string' || typeof r.title !== 'string') return null;
  const access = r.access === 'free' || r.access === 'subscribers' ? r.access : 'subscribers';
  return {
    id: r.id,
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
export function lessonVideoSrc(lesson: Pick<Lesson, 'storage_path'>): string {
  return lessonPublicUrl(lesson.storage_path) || '/training-sample.mp4';
}

export async function listPublishedLessons(client: SupabaseClient): Promise<Lesson[]> {
  const { data, error } = await client
    .from('voispeech_lessons')
    .select(LESSON_COLS)
    .eq('published', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });
  if (error) throw error;
  return (data || []).map(mapLesson).filter((x): x is Lesson => x != null);
}

/** Admin: all lessons including drafts. */
export async function listAllLessons(client: SupabaseClient): Promise<Lesson[]> {
  const { data, error } = await client
    .from('voispeech_lessons')
    .select(LESSON_COLS)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });
  if (error) throw error;
  return (data || []).map(mapLesson).filter((x): x is Lesson => x != null);
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
  const mapped = mapLesson(data);
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
  const mapped = mapLesson(data);
  if (!mapped) throw new Error('updateLesson returned no row');
  return mapped;
}

export async function deleteLesson(
  client: SupabaseClient,
  id: string,
  storagePath?: string | null,
): Promise<void> {
  if (storagePath) {
    try {
      await client.storage.from('voispeech-lessons').remove([storagePath]);
    } catch {
      // continue; DB row deletion is the source of truth for the catalog
    }
  }
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
