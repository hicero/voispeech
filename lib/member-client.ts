import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let client: SupabaseClient | null = null;

// Only the publishable key belongs in a static browser build.
export function getMemberClient() {
  if (typeof window === 'undefined') return null;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key || !key.startsWith('sb_publishable_')) return null;
  if (!client) client = createClient(url, key, {
    auth: { flowType: 'pkce', persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
  });
  return client;
}
