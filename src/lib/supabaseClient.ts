import { createClient } from '@supabase/supabase-js';

// Supabase project connection parameters
const SUPABASE_PROJECT_ID = 'tqjccyivhbddwaftgzzb';
const DEFAULT_SUPABASE_URL = `https://${SUPABASE_PROJECT_ID}.supabase.co`;

const metaEnv = (import.meta as any)?.env || {};

// Vite environment variables (prefixed with VITE_)
export const supabaseUrl: string = metaEnv.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
export const supabaseAnonKey: string =
  metaEnv.VITE_SUPABASE_ANON_KEY || 'sb_publishable_3mOjihZxqenneD_8cNZnFA_bN40WRK_';

export const isSupabaseConfigured: boolean = Boolean(
  supabaseAnonKey &&
  !supabaseAnonKey.includes('placeholder') &&
  supabaseAnonKey.length > 10
);

// Create Supabase client with live credentials
export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: 'deos_auth_session',
    },
  }
);
