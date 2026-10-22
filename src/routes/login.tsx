// Sponsor sign-in. Uses the anon-key server function, which stores the
// session in HttpOnly cookies. This file does not read the service-role key.
import { Link, createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { useState, type FormEvent } from 'react'
import { getSponsor, signInSponsor } from '../lib/auth/auth.functions'

export const Route = createFileRoute('/login')({
  beforeLoad: async () => {
    const user = await getSponsor()
    if (user) {
      throw redirect({ to: '/dashboard' })
    }
  },
  component: LoginPage,
})

function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage(null)
    setIsSubmitting(true)

    try {
      const result = await signInSponsor({ data: { email, password } })
      if (!result.ok) {
        setErrorMessage(
          result.error || 'Sign-in failed. Check your email and password.',
        )
        return
      }
      await navigate({ to: '/dashboard' })
    } catch (caught) {
      setErrorMessage(
        caught instanceof Error
          ? caught.message
          : 'Sign-in failed. Check your email and password.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="page-wrap px-4 py-12">
      <form
        onSubmit={handleSubmit}
        className="mx-auto flex max-w-sm flex-col gap-4"
      >
        <h1 className="text-2xl font-semibold text-[var(--sea-ink)]">
          Sponsor sign in
        </h1>
        <p className="text-sm text-[var(--sea-ink-soft)]">
          Sign in to manage PREIshare properties you are allowed to see.
        </p>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Email</span>
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="rounded-md border border-[var(--line)] px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Password</span>
          <input
            type="password"
            name="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="rounded-md border border-[var(--line)] px-3 py-2"
          />
        </label>
        {errorMessage ? (
          <p role="alert" className="text-sm text-red-700">
            {errorMessage}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-full bg-[var(--lagoon-deep)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {isSubmitting ? 'Signing in…' : 'Sign in'}
        </button>
        <Link to="/auth/signup" className="text-sm">
          Need an account? Sign up
        </Link>
      </form>
    </main>
  )
}
