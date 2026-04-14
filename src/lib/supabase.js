import { createClient } from '@supabase/supabase-js'

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL  || 'your_supabase_project_url'
const supabaseKey  = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your_supabase_anon_key'

const isMissingConfig =
  !supabaseUrl ||
  supabaseUrl === 'your_supabase_project_url' ||
  !supabaseKey ||
  supabaseKey === 'your_supabase_anon_key'

// Client Supabase — retourne un objet vide si non configuré (évite le crash en dev)
export const supabase = isMissingConfig
  ? {
      auth: {
        signInWithOtp: async () => ({ data: null, error: { message: 'Supabase non configuré' } }),
        verifyOtp:     async () => ({ data: null, error: { message: 'Supabase non configuré' } }),
        signOut:       async () => ({}),
        getSession:    async () => ({ data: { session: null } }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      },
      from: () => ({
        select: () => ({ data: [], error: null }),
        insert: () => ({ data: null, error: null }),
        update: () => ({ data: null, error: null }),
        delete: () => ({ data: null, error: null }),
      }),
    }
  : createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession:    true,
        autoRefreshToken:  true,
        detectSessionInUrl: true,
      },
      realtime: {
        params: { eventsPerSecond: 10 },
      },
    })

export const isSupabaseConfigured = !isMissingConfig
