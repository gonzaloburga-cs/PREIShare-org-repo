import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/')({
  component: DashboardHomePage,
})

function DashboardHomePage() {
  return (
    <main>
      <h1 className="display-title mb-3 text-3xl font-bold tracking-tight text-[var(--sea-ink)]">
        Dashboard overview
      </h1>
      <p className="max-w-2xl text-base text-[var(--sea-ink-soft)]">
        Placeholder for portfolio value, open deals, and recent activity.
      </p>
    </main>
  )
}
