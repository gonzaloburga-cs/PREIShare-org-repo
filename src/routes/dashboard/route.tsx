// Layout route for everything under /dashboard.
import { Outlet, createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { AppShell } from '../../components/dashboard/AppShell'
import { getSponsor, signOutSponsor } from '../../lib/auth/auth.functions'

export const Route = createFileRoute('/dashboard')({
  beforeLoad: async () => {
    const user = await getSponsor()
    if (!user) {
      throw redirect({ to: '/auth/login' })
    }
  },
  component: DashboardLayout,
})

function DashboardLayout() {
  const navigate = useNavigate()
  const [pending, setPending] = useState(false)

  async function onSignOut() {
    setPending(true)
    try {
      await signOutSponsor()
      await navigate({ to: '/auth/login' })
    } finally {
      setPending(false)
    }
  }

  return (
    <AppShell
      title="Overview"
      actions={
        <button
          type="button"
          onClick={onSignOut}
          disabled={pending}
          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700"
        >
          {pending ? 'Signing out…' : 'Sign out'}
        </button>
      }
    >
      <Outlet />
    </AppShell>
  )
}
