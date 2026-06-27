import { createServerSupabaseClient, SupabaseClient } from '@supabase/supabase-js'
import { createClient } from '@supabase/supabase-js'

// Server-side Supabase helper. Does NOT include credentials — set via env vars.

let supabaseAdmin: ReturnType<typeof createClient> | null = null

export function getSupabaseAdminClient() {
  if (supabaseAdmin) return supabaseAdmin

  const url = process.env.SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceKey) {
    console.warn('SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set — Supabase admin client not initialized. Add these env vars to enable Supabase features.')
    return null
  }

  supabaseAdmin = createClient(url, serviceKey)
  return supabaseAdmin
}

// TODO: Add helpers for generating signed URLs, managing users, and other server-side Supabase operations.
