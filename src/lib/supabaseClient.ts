import { createClient } from '@supabase/supabase-js';

// Live Supabase Production Configuration
export const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || 'https://tqjccyivhbddwaftgzzb.supabase.co';

export const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_3mOjihZxqenneD_8cNZnFA_bN40WRK_';

// Production Supabase Client with Persistent Session Storage & Auto Refresh
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'eviona_auth_session',
  },
});
