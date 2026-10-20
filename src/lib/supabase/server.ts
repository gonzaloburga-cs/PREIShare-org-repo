// SERVER-ONLY: never import this file from browser components.
// Checklist names: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, and the public
// anon key when a signed-in sponsor's row-level security must still apply.
import '@tanstack/react-start/server-only'
import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

function readServerUrl(): string {
  const url = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL
  if (!url) {
    throw new Error(
      'Missing SUPABASE_URL. See docs/setup/supabase-env-checklist.md',
    )
  }
  return url
}

/**
 * Sponsor-scoped server client. Uses the anon key plus the signed-in user's
 * access token, so property_listings policies (`owner_id = auth.uid()`) apply.
 * Call this from a server function for list and create.
 */
export function createServerSupabaseClient(accessToken: string) {
  const url = readServerUrl()
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY

  if (!anonKey) {
    throw new Error(
      'Missing VITE_SUPABASE_ANON_KEY. See docs/setup/supabase-env-checklist.md',
    )
  }
  if (!accessToken) {
    throw new Error('A signed-in sponsor access token is required.')
  }

  return createClient<Database>(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  })
}

/**
 * Bypasses row-level security. Admin or maintenance only.
 * Reads SUPABASE_SERVICE_ROLE_KEY. Do not use this for sponsor listing pages.
 */
export function createServiceRoleSupabaseClient() {
  const url = readServerUrl()
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!serviceRoleKey) {
    throw new Error(
      'Missing SUPABASE_SERVICE_ROLE_KEY. See docs/setup/supabase-env-checklist.md',
    )
  }

  return createClient<Database>(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  })
}
