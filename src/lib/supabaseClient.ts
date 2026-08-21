import { createClient } from '@supabase/supabase-js';

// Supabase project connection parameters
const SUPABASE_PROJECT_ID = 'tqjccyivhbddwaftgzzb';
const DEFAULT_SUPABASE_URL = `https://${SUPABASE_PROJECT_ID}.supabase.co`;

const metaEnv = (import.meta as any)?.env || {};

// Vite environment variables (prefixed with VITE_)
export const supabaseUrl: string = metaEnv.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
export const supabaseAnonKey: string = metaEnv.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured: boolean = Boolean(
  supabaseAnonKey &&
  !supabaseAnonKey.includes('placeholder') &&
  supabaseAnonKey.length > 50
);

// Create Supabase client with safe fallback
export const supabase = createClient(
  supabaseUrl,
  isSupabaseConfigured ? supabaseAnonKey : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.dummy',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: isSupabaseConfigured,
      detectSessionInUrl: true,
      storageKey: 'deos_auth_session',
    },
  }
);
