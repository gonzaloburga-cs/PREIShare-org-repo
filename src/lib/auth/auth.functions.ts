// Sign-in and sign-up actions. The anon key stays in the server handler.
// This file does not read SUPABASE_SERVICE_ROLE_KEY.
import { createServerFn } from '@tanstack/react-start'

type AuthResult =
  | { ok: true; needsEmailConfirm: false }
  | { ok: true; needsEmailConfirm: true }
  | { ok: false; error: string }

function readCredentials(input: unknown): { email: string; password: string } {
  if (typeof input !== 'object' || input === null) {
    throw new Error('Email and password are required.')
  }
  const record = input as Record<string, unknown>
  const email = typeof record.email === 'string' ? record.email.trim() : ''
  const password = typeof record.password === 'string' ? record.password : ''
  if (!email || !password) {
    throw new Error('Email and password are required.')
  }
  return { email, password }
}

export const signInSponsor = createServerFn({ method: 'POST' })
  .validator(readCredentials)
  .handler(async ({ data }): Promise<AuthResult> => {
    const { createAuthServerSupabaseClient } = await import('../supabase/server')
    const { establishSession } = await import('./session')
    const supabase = createAuthServerSupabaseClient()
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (error || !authData.session) {
      return { ok: false, error: error?.message ?? 'Sign-in failed.' }
    }

    await establishSession(
      authData.session.access_token,
      authData.session.refresh_token,
    )
    return { ok: true, needsEmailConfirm: false }
  })

export const signUpSponsor = createServerFn({ method: 'POST' })
  .validator(readCredentials)
  .handler(async ({ data }): Promise<AuthResult> => {
    const { createAuthServerSupabaseClient } = await import('../supabase/server')
    const { establishSession } = await import('./session')
    const supabase = createAuthServerSupabaseClient()
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    })

    if (error) {
      return { ok: false, error: error.message }
    }

    if (!authData.session) {
      return { ok: true, needsEmailConfirm: true }
    }

    await establishSession(
      authData.session.access_token,
      authData.session.refresh_token,
    )
    return { ok: true, needsEmailConfirm: false }
  })

export const getSponsor = createServerFn({ method: 'GET' }).handler(async () => {
  const { getUser } = await import('./session')
  const user = await getUser()
  if (!user) return null
  return { id: user.id, email: user.email ?? null }
})

export const signOutSponsor = createServerFn({ method: 'POST' }).handler(
  async () => {
    const { signOut } = await import('./session')
    await signOut()
    return { ok: true as const }
  },
)
