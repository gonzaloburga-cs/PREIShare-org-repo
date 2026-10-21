// Server-only session helpers. Route protection must call these, not client code.
// The access token is read from an HttpOnly cookie and checked with Supabase Auth.
import '@tanstack/react-start/server-only'
import { deleteCookie, getCookie, setCookie } from '@tanstack/react-start/server'
import type { Session, User } from '@supabase/supabase-js'
import { createServerSupabaseClient } from '../supabase/server'

const ACCESS_COOKIE = '__Host-sb-access-token'
const REFRESH_COOKIE = '__Host-sb-refresh-token'

const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'lax',
  path: '/',
} as const

function readAccessToken(): string | null {
  const token = getCookie(ACCESS_COOKIE)
  return token ? token : null
}

/**
 * Returns the sponsor session only after Supabase Auth accepts the cookie token.
 * A missing or rejected token is no session. This does not use the service-role client.
 */
export async function getSession(): Promise<Session | null> {
  const accessToken = readAccessToken()
  if (!accessToken) return null

  const supabase = createServerSupabaseClient(accessToken)
  const { data, error } = await supabase.auth.getUser(accessToken)
  if (error || !data.user) return null

  const refreshToken = getCookie(REFRESH_COOKIE)

  return {
    access_token: accessToken,
    refresh_token: refreshToken ?? '',
    expires_in: 0,
    token_type: 'bearer',
    user: data.user,
  }
}

/** Stores a session Supabase Auth has already accepted. Login and signup call this. */
export async function establishSession(
  accessToken: string,
  refreshToken: string,
): Promise<void> {
  const supabase = createServerSupabaseClient(accessToken)
  const { data, error } = await supabase.auth.getUser(accessToken)
  if (error || !data.user) {
    throw new Error('Supabase did not accept this session.')
  }

  setCookie(ACCESS_COOKIE, accessToken, { ...cookieOptions, maxAge: 60 * 60 })
  setCookie(REFRESH_COOKIE, refreshToken, {
    ...cookieOptions,
    maxAge: 60 * 60 * 24 * 7,
  })
}

export async function getUser(): Promise<User | null> {
  const session = await getSession()
  return session?.user ?? null
}

export async function signOut(): Promise<void> {
  const accessToken = readAccessToken()
  const refreshToken = getCookie(REFRESH_COOKIE)

  if (accessToken && refreshToken) {
    const supabase = createServerSupabaseClient(accessToken)
    const { error } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    })
    if (!error) {
      await supabase.auth.signOut()
    }
  }

  deleteCookie(ACCESS_COOKIE, cookieOptions)
  deleteCookie(REFRESH_COOKIE, cookieOptions)
}
