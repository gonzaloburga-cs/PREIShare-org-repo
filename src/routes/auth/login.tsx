import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, type FormEvent } from 'react'
import { signInSponsor } from '../../lib/auth/auth.functions'

export const Route = createFileRoute('/auth/login')({
  component: LoginPage,
})

function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setPending(true)
    try {
      const result = await signInSponsor({ data: { email, password } })
      if (!result.ok) {
        setError(result.error)
        return
      }
      await navigate({ to: '/dashboard' })
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Sign-in failed.')
    } finally {
      setPending(false)
    }
  }

  return (
    <main className="page-wrap px-4 py-12">
      <form
        onSubmit={onSubmit}
        className="mx-auto flex max-w-sm flex-col gap-4"
      >
        <h1 className="text-2xl font-semibold text-[var(--sea-ink)]">Log in</h1>
        <p className="text-sm text-[var(--sea-ink-soft)]">
          If you just signed up, confirm your email when Supabase asks you to,
          then log in here.
        </p>
        <label className="flex flex-col gap-1 text-sm">
          Email
          <input
            type="email"
            name="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="rounded-md border border-[var(--line)] px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Password
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="rounded-md border border-[var(--line)] px-3 py-2"
          />
        </label>
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-[var(--lagoon-deep)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {pending ? 'Logging in…' : 'Log in'}
        </button>
        <p role="alert" className="min-h-5 text-sm text-red-700">
          {error}
        </p>
        <Link to="/auth/signup" className="text-sm">
          Need an account? Sign up
        </Link>
      </form>
    </main>
  )
}
