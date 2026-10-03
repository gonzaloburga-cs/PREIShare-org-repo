export type PortfolioHolding = {
  id: string
  name: string
  /** Display string already formatted for UI, e.g. "$120,000" or "18%" */
  allocationLabel: string
}

export type PortfolioSummaryProps = {
  /** Architecture field: short heading for the snapshot */
  headline?: string
  /** Architecture field: holdings lines (name and allocation or value) */
  summaryLines: PortfolioHolding[]
  /** Optional total line for the snapshot */
  totalLabel?: string
  /** Architecture field: shown when summaryLines is empty */
  emptyMessage?: string
}

/** MOCK PLACEHOLDER — replace with real portfolio data in a later sprint */
export const MOCK_PORTFOLIO_HOLDINGS: PortfolioHolding[] = [
  { id: 'h1', name: 'Riverfront Multifamily', allocationLabel: '42%' },
  { id: 'h2', name: 'Cedar Retail Plaza', allocationLabel: '33%' },
  { id: 'h3', name: 'Harbor Industrial', allocationLabel: '25%' },
]

export function PortfolioSummary({
  headline = 'Portfolio summary',
  summaryLines,
  totalLabel,
  emptyMessage = 'No holdings to show.',
}: PortfolioSummaryProps) {
  return (
    <section
      className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
      aria-labelledby="portfolio-summary-heading"
    >
      <h2 id="portfolio-summary-heading" className="text-lg font-semibold text-slate-900">
        {headline}
      </h2>
      {totalLabel ? (
        <p className="mt-1 text-sm text-slate-600">Total: {totalLabel}</p>
      ) : null}
      {summaryLines.length === 0 ? (
        <p className="mt-4 text-sm text-slate-600">{emptyMessage}</p>
      ) : (
        <ul className="mt-4 divide-y divide-slate-100">
          {summaryLines.map((item) => (
            <li key={item.id} className="flex items-center justify-between py-2 text-sm">
              <span className="font-medium text-slate-800">{item.name}</span>
              <span className="text-slate-600">{item.allocationLabel}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
