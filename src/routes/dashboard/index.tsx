// Default page at exactly /dashboard.
import { createFileRoute } from '@tanstack/react-router'
import { MetricCard } from '../../components/dashboard/MetricCard'
import {
  MOCK_PORTFOLIO_HOLDINGS,
  PortfolioSummary,
} from '../../components/dashboard/PortfolioSummary'
import {
  MOCK_RECENT_ACTIVITY,
  RecentActivity,
} from '../../components/dashboard/RecentActivity'

export const Route = createFileRoute('/dashboard/')({
  component: DashboardHomePage,
})

// Shell demo data only — mock placeholders, not live totals.
const demoMetrics = [
  { label: 'Portfolio value', value: '$300,000', hint: 'Mock total' },
  { label: 'Active investments', value: '3', hint: 'Mock count' },
  { label: 'Distributions (YTD)', value: '$24,000', hint: 'Mock YTD' },
]

function DashboardHomePage() {

  return (
    <div className="flex flex-col gap-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Investor dashboard</h1>
        <p className="text-sm text-[var(--sea-ink-soft)]">
          Your PREIshare home base for portfolio metrics and recent activity.
        </p>
        <p className="text-sm text-[var(--sea-ink-soft)]">Mock data — not live balances.</p>
      </header>

      <section aria-label="Key metrics" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {demoMetrics.map((metric) => (
          <MetricCard
            key={metric.label}
            label={metric.label}
            value={metric.value}
            hint={metric.hint}
          />
        ))}
        <PortfolioSummary
          summaryLines={MOCK_PORTFOLIO_HOLDINGS}
          totalLabel="$300,000"
          emptyMessage="No portfolio holdings to show yet. When your account is linked, summaries will appear here."
        />
      </section>

      <RecentActivity
        items={MOCK_RECENT_ACTIVITY}
        emptyMessage="No recent activity yet. Distributions, documents, and updates will list here."
      />
    </div>
  )
}
