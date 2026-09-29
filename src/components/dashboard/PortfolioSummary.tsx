export type HoldingSnapshot = {
  id: string
  name: string
  allocationLabel: string
  valueLabel: string
}

export type PortfolioSummaryProps = {
  title?: string
  totalLabel: string
  holdings?: HoldingSnapshot[]
  isSampleData?: boolean
}

export const MOCK_HOLDINGS: HoldingSnapshot[] = [
  {
    id: 'h1',
    name: 'Sample Multifamily Fund A',
    allocationLabel: '40%',
    valueLabel: '$120,000',
  },
  {
    id: 'h2',
    name: 'Sample Industrial Note B',
    allocationLabel: '35%',
    valueLabel: '$105,000',
  },
  {
    id: 'h3',
    name: 'Sample Cash Reserve',
    allocationLabel: '25%',
    valueLabel: '$75,000',
  },
]

export function PortfolioSummary({
  title = 'Portfolio summary',
  totalLabel,
  holdings = MOCK_HOLDINGS,
  isSampleData = true,
}: PortfolioSummaryProps) {
  return (
    <section
      className="portfolio-summary rounded-2xl border border-[rgba(79,184,178,0.25)] px-4 py-4"
      aria-labelledby="portfolio-summary-heading"
    >
      <div className="portfolio-summary__header mb-3">
        <h2 id="portfolio-summary-heading"className="m-0 text-lg font-semibold text-[var(--sea-ink)]">
          {title}
        </h2>
        {isSampleData ? (
          <p className="sample-data-banner m-0 mt-1 text-sm text-[var(--sea-ink-soft)]" role="note">
            Sample data — placeholders only, not live balances
          </p>
        ) : null}
      </div>
      <p className="portfolio-summary__total m-0 mb-3 flex items-baseline justify-between gap-3">
        <span className="portfolio-summary__total-label text-sm text-[var(--sea-ink-soft)]">
          Total (sample)
        </span>
        <span className="portfolio-summary__total-value text-xl font-bold text-[var(--sea-ink)]">
          {totalLabel}
        </span>
      </p>
      <ul className="portfolio-summary__list m-0 list-none space-y-2 p-0">
        {holdings.map((item) => (
          <li
            key={item.id}
            className="portfolio-summary__row grid grid-cols-[minmax(0,1fr)_3.5rem_6.5rem] items-baseline gap-x-3 text-sm"
          >
            <span className="portfolio-summary__name min-w-0 text-[var(--sea-ink)]">{item.name}</span>
            <span className="portfolio-summary__allocation text-right tabular-nums text-[var(--sea-ink-soft)]">
              {item.allocationLabel}
            </span>
            <span className="portfolio-summary__value text-right font-semibold tabular-nums text-[var(--sea-ink)]">
              {item.valueLabel}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}
