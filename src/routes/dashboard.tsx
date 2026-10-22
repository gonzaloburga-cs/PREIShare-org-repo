// Layout route for everything under /dashboard.
// Session check uses the anon-key server function. No service-role key.
import { Outlet, createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { AppShell } from '../components/dashboard/AppShell'
import { getSponsor, signOutSponsor } from '../lib/auth/auth.functions'

export const Route = createFileRoute('/dashboard')({
  beforeLoad: async () => {
    const user = await getSponsor()
    if (!user) {
      throw redirect({ to: '/login' })
    }
    return { sponsor: user }
  },
  component: DashboardLayout,
})

function DashboardLayout() {
  const navigate = useNavigate()
  const { sponsor } = Route.useRouteContext()
  const [pending, setPending] = useState(false)

  async function handleSignOut() {
    setPending(true)
    try {
      await signOutSponsor()
      await navigate({ to: '/login' })
    } finally {
      setPending(false)
    }
  }

  return (
    <AppShell
      title="Overview"
      actions={
        <div className="flex items-center gap-3">
          <p className="text-sm text-slate-600">{sponsor.email ?? 'Sponsor'}</p>
          <button
            type="button"
            onClick={handleSignOut}
            disabled={pending}
            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-600"
          >
            {pending ? 'Signing out…' : 'Sign out'}
          </button>
        </div>
      }
    >
      <Outlet />
    </AppShell>
  )
}
