// Server-only module. Do not import this file from client components.
// Env names match .env.example and docs/env-var-checklist.md.
// This app depends on @supabase/supabase-js. The session client uses the anon
// key plus the HttpOnly access-token cookie so row-level security still applies.
import '@tanstack/react-start/server-only'
import { createClient } from '@supabase/supabase-js'
import type { Database } from './supabase/types'

const ACCESS_COOKIE = '__Host-sb-access-token'

function requireEnv(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing server env ${name}. See docs/env-var-checklist.md.`)
  }
  return value
}

type CookieStore = {
  get: (key: string) => { value: string } | undefined
  set?: (key: string, value: string, options?: Record<string, unknown>) => void
  remove?: (key: string, options?: Record<string, unknown>) => void
}

/** Session-aware server client for sponsor auth and RLS (anon key + cookie). */
export function createSupabaseServerClient(cookieStore: CookieStore) {
  const url = requireEnv(
    'SUPABASE_URL',
    process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL,
  )
  const anonKey = requireEnv(
    'VITE_SUPABASE_ANON_KEY',
    process.env.VITE_SUPABASE_ANON_KEY,
  )
  const accessToken = cookieStore.get(ACCESS_COOKIE)?.value
  const auth = {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  } as const

  if (!accessToken) {
    return createClient<Database>(url, anonKey, { auth })
  }

  return createClient<Database>(url, anonKey, {
    auth,
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
  })
}

/**
 * Privileged admin client. Server only, and only for jobs that must bypass RLS.
 * Sponsor dashboard reads and writes should use createSupabaseServerClient.
 */
export function createSupabaseServiceRoleClient() {
  const url = requireEnv(
    'SUPABASE_URL',
    process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL,
  )
  const serviceRoleKey = requireEnv(
    'SUPABASE_SERVICE_ROLE_KEY',
    process.env.SUPABASE_SERVICE_ROLE_KEY,
  )

  return createClient<Database>(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  })
}
