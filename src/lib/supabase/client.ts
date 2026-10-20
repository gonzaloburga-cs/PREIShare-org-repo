// BROWSER-SAFE: public URL + anon key only.
// Env names: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY.
// See docs/setup/supabase-env-checklist.md.
import '@tanstack/react-start/client-only'
import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

export function createBrowserSupabaseClient() {
  const url = import.meta.env.VITE_SUPABASE_URL
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    throw new Error(
      'Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. See docs/setup/supabase-env-checklist.md',
    )
  }

  return createClient<Database>(url, anonKey)
}
