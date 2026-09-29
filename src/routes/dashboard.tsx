import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard')({
  component: DashboardLayout,
})

function DashboardLayout() {
  return (
    <div className="page-wrap px-4 pb-8 pt-14" data-area="dashboard-layout">
      <p className="max-w-2xl text-base text-[var(--sea-ink-soft)]">
        PREIshare investor dashboard layout (shell comes next)
      </p>
      <Outlet />
    </div>
  )
}
