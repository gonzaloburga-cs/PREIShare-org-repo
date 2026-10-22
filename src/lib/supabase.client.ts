// Browser-safe: ONLY public env values from .env.example.
// Names: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY.
// See docs/env-var-checklist.md. Never import the service-role key here.
import '@tanstack/react-start/client-only'
import { createClient } from '@supabase/supabase-js'
import type { Database } from './supabase/types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Check .env and docs/env-var-checklist.md.',
  )
}

export const supabaseBrowser = createClient<Database>(supabaseUrl, supabaseAnonKey)
