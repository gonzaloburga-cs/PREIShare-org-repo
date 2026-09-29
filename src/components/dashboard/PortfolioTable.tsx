export type PortfolioHolding = {
  id: string
  propertyName: string
  place: string
  value: number
}

export const MOCK_PORTFOLIO_HOLDINGS: PortfolioHolding[] = [
  {
    id: 'h1',
    propertyName: 'Riverfront Lofts',
    place: 'Austin, Texas',
    value: 56200,
  },
  {
    id: 'h2',
    propertyName: 'Cedar Business Park',
    place: 'Dallas, Texas',
    value: 74100,
  },
]

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

export type PortfolioTableProps = {
  holdings?: PortfolioHolding[]
  emptyMessage?: string
  isSampleData?: boolean
}

export function PortfolioTable({
  holdings = MOCK_PORTFOLIO_HOLDINGS,
  emptyMessage = 'No holdings to show yet. New investments will appear here.',
  isSampleData = true,
}: PortfolioTableProps) {
  return (
    <section
      className="portfolio-table rounded-2xl border border-[rgba(79,184,178,0.25)] px-4 py-4"
      aria-labelledby="portfolio-table-heading"
    >
      <div className="portfolio-table__header mb-2">
        <h2 id="portfolio-table-heading" className="m-0 text-lg font-semibold text-[var(--sea-ink)]">
          Your holdings
        </h2>
        {isSampleData ? (
          <p className="sample-data-banner m-0 mt-1 text-sm text-[var(--sea-ink-soft)]" role="note">
            Sample data — placeholders only, not live balances
          </p>
        ) : null}
      </div>
      <div className="portfolio-table__wrap dash-table-wrap overflow-x-auto">
        <table className="w-full min-w-[28rem] border-collapse text-left text-sm whitespace-nowrap">
          <thead>
            <tr className="border-b border-[rgba(79,184,178,0.25)] text-[var(--sea-ink-soft)]">
              <th scope="col" className="px-2 py-2 font-medium">
                Property
              </th>
              <th scope="col" className="px-2 py-2 font-medium">
                Place
              </th>
              <th scope="col" className="px-2 py-2 text-right font-medium">
                Value
              </th>
            </tr>
          </thead>
          <tbody>
            {holdings.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-2 py-6">
                  <p className="empty-state m-0 text-sm text-[var(--sea-ink-soft)]" role="status">
                    {emptyMessage}
                  </p>
                </td>
              </tr>
            ) : (
              holdings.map((row) => (
                <tr key={row.id} className="border-b border-[rgba(79,184,178,0.15)] last:border-b-0">
                  <td className="px-2 py-2 text-[var(--sea-ink)]">{row.propertyName}</td>
                  <td className="px-2 py-2 text-[var(--sea-ink-soft)]">{row.place}</td>
                  <td className="px-2 py-2 text-right font-semibold tabular-nums text-[var(--sea-ink)]">
                    {formatCurrency(row.value)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
