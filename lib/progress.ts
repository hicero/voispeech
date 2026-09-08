import type { SupabaseClient } from '@supabase/supabase-js';

export type LessonProgress = {
  lesson_id: string;
  completed_steps: number[];
  completed: boolean;
  updated_at: string;
};

function mapProgress(raw: unknown): LessonProgress | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  const lesson_id =
    typeof r.lesson_id === 'string' || typeof r.lesson_id === 'number'
      ? String(r.lesson_id)
      : '';
  if (!lesson_id) return null;
  const stepsRaw = r.completed_steps;
  const completed_steps = Array.isArray(stepsRaw)
    ? stepsRaw
        .map((n) => (typeof n === 'number' ? n : Number(n)))
        .filter((n) => Number.isFinite(n) && n >= 0)
        .map((n) => Math.floor(n))
    : [];
  return {
    lesson_id,
    completed_steps,
    completed: Boolean(r.completed),
    updated_at: typeof r.updated_at === 'string' ? r.updated_at : '',
  };
}

export async function listLessonProgress(
  client: SupabaseClient,
  userId: string,
): Promise<LessonProgress[]> {
  const { data, error } = await client
    .from('voispeech_lesson_progress')
    .select('lesson_id,completed_steps,completed,updated_at')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });
  if (error) throw error;
  return (data || []).map(mapProgress).filter((x): x is LessonProgress => x != null);
}

export async function upsertLessonProgress(
  client: SupabaseClient,
  userId: string,
  lessonId: string,
  completedSteps: number[],
  completed: boolean,
): Promise<LessonProgress> {
  const unique = [
    ...new Set(
      completedSteps
        .map((n) => (typeof n === 'number' ? n : Number(n)))
        .filter((n) => Number.isFinite(n) && n >= 0)
        .map((n) => Math.floor(n)),
    ),
  ].sort((a, b) => a - b);

  const row = {
    user_id: userId,
    lesson_id: lessonId,
    completed_steps: unique,
    completed: Boolean(completed),
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await client
    .from('voispeech_lesson_progress')
    .upsert(row, { onConflict: 'user_id,lesson_id' })
    .select('lesson_id,completed_steps,completed,updated_at')
    .single();
  if (error) throw error;
  const mapped = mapProgress(data);
  if (!mapped) throw new Error('upsertLessonProgress returned no row');
  return mapped;
}
