import { createFileRoute } from '@tanstack/react-router'
import { PortfolioSummary, MOCK_HOLDINGS } from '../../components/dashboard/PortfolioSummary'
import { RecentActivity, MOCK_ACTIVITY } from '../../components/dashboard/RecentActivity'
import { StatsCard } from '../../components/dashboard/StatsCard'

export const Route = createFileRoute('/dashboard/')({
  component: DashboardHomePage,
})

function DashboardHomePage() {
  return (
    <main>
      <h1 className="display-title mb-3 text-3xl font-bold tracking-tight text-[var(--sea-ink)]">
        Dashboard overview
      </h1>
      <div className="dashboard-home">
        <p className="sample-data-banner mb-4 text-sm text-[var(--sea-ink-soft)]" role="note">
          Demo shell — all figures are placeholders
        </p>
        <div className="dashboard-home__stats grid gap-3 sm:grid-cols-3">
          <StatsCard label="Total portfolio value" value="$300,000" hint="Sample total" />
          <StatsCard label="Open deals" value="3" hint="Sample count" />
          <StatsCard label="Contributions YTD" value="$24,000" hint="Sample YTD" />
        </div>
        <div className="dashboard-home__panels mt-4 grid gap-3 lg:grid-cols-2">
          <PortfolioSummary totalLabel="$300,000" holdings={MOCK_HOLDINGS} />
          <RecentActivity items={MOCK_ACTIVITY} />
        </div>
      </div>
    </main>
  )
}
