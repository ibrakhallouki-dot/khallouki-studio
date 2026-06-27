import { createClient } from '@supabase/supabase-js'

let supabaseClient: ReturnType<typeof createClient> | null = null

export function getSupabaseClient(){
  if (supabaseClient) return supabaseClient
  const url = import.meta.env.VITE_SUPABASE_URL
  const anon = import.meta.env.VITE_SUPABASE_ANON_KEY
  if (!url || !anon) {
    console.warn('VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY not set — Supabase client not initialized. Set these in .env for full auth/storage features.')
    return null
  }
  supabaseClient = createClient(url, anon)
  return supabaseClient
}
