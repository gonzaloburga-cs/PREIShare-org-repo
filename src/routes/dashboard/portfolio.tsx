import { createFileRoute } from '@tanstack/react-router'
import { MOCK_PORTFOLIO_HOLDINGS, PortfolioTable } from '../../components/dashboard/PortfolioTable'

export const Route = createFileRoute('/dashboard/portfolio')({
  component: PortfolioPage,
})

function PortfolioPage() {
  return (
    <main>
      <h1 className="display-title mb-3 text-3xl font-bold tracking-tight text-[var(--sea-ink)]">
        Portfolio
      </h1>
      <PortfolioTable holdings={MOCK_PORTFOLIO_HOLDINGS} />
    </main>
  )
}
