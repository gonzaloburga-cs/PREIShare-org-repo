export type ActivityItem = {
  id: string
  title: string
  detail: string
  dateLabel: string
}

export type RecentActivityProps = {
  title?: string
  items?: ActivityItem[]
  isSampleData?: boolean
}

export const MOCK_ACTIVITY: ActivityItem[] = [
  {
    id: 'a1',
    title: 'Distribution posted (sample)',
    detail: 'Sample Multifamily Fund A',
    dateLabel: 'Mar 1, 2026',
  },
  {
    id: 'a2',
    title: 'Capital call notice (sample)',
    detail: 'Sample Industrial Note B',
    dateLabel: 'Feb 18, 2026',
  },
  {
    id: 'a3',
    title: 'Profile document uploaded (sample)',
    detail: 'Accreditation letter',
    dateLabel: 'Feb 5, 2026',
  },
]

export function RecentActivity({
  title = 'Recent activity',
  items = MOCK_ACTIVITY,
  isSampleData = true,
}: RecentActivityProps) {
  return (
    <section
      className="recent-activity rounded-2xl border border-[rgba(79,184,178,0.25)] px-4 py-4"
      aria-labelledby="recent-activity-heading"
    >
      <div className="recent-activity__header mb-3">
        <h2
          id="recent-activity-heading"
          className="m-0 text-lg font-semibold text-[var(--sea-ink)]"
        >
          {title}
        </h2>
        {isSampleData ? (
          <p className="sample-data-banner m-0 mt-1 text-sm text-[var(--sea-ink-soft)]" role="note">
            Sample activity — not connected to a live feed
          </p>
        ) : null}
      </div>
      <ol className="recent-activity__list m-0 list-none space-y-3 p-0">
        {items.map((item) => (
          <li
            key={item.id}
            className="recent-activity__item flex items-start justify-between gap-3"
          >
            <div className="recent-activity__body">
              <p className="recent-activity__title m-0 text-sm font-semibold text-[var(--sea-ink)]">
                {item.title}
              </p>
              <p className="recent-activity__detail m-0 text-sm text-[var(--sea-ink-soft)]">
                {item.detail}
              </p>
            </div>
            <time className="recent-activity__date shrink-0 text-sm text-[var(--sea-ink-soft)]">
              {item.dateLabel}
            </time>
          </li>
        ))}
      </ol>
    </section>
  )
}
