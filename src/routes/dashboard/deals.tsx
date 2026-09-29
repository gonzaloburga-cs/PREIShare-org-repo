import { createFileRoute } from '@tanstack/react-router'
import { DealsList, MOCK_DEALS } from '../../components/dashboard/DealsList'

export const Route = createFileRoute('/dashboard/deals')({
  component: DealsPage,
})

function DealsPage() {
  return (
    <main>
      <h1 className="display-title mb-3 text-3xl font-bold tracking-tight text-[var(--sea-ink)]">
        Deals
      </h1>
      <DealsList deals={MOCK_DEALS} />
    </main>
  )
}
