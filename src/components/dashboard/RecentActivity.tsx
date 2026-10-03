export type ActivityItem = {
  id: string
  title: string
  detail: string
  /** Already-formatted time label for display, e.g. "Mar 18 · 2:04 PM" */
  timestamp: string
}

export type RecentActivityProps = {
  title?: string
  items: ActivityItem[]
  /** Shown when items is empty */
  emptyMessage?: string
}

/** MOCK PLACEHOLDER — replace with real activity feed later */
export const MOCK_RECENT_ACTIVITY: ActivityItem[] = [
  {
    id: 'a1',
    title: 'Distribution posted',
    detail: 'Riverfront Multifamily',
    timestamp: 'Mar 18 · 2:04 PM',
  },
  {
    id: 'a2',
    title: 'Quarterly report available',
    detail: 'Cedar Retail Plaza',
    timestamp: 'Mar 17 · 11:20 AM',
  },
  {
    id: 'a3',
    title: 'Capital call reminder',
    detail: 'Harbor Industrial',
    timestamp: 'Mar 15 · 9:00 AM',
  },
]

export function RecentActivity({
  title = 'Recent activity',
  items,
  emptyMessage = 'No recent activity.',
}: RecentActivityProps) {
  return (
    <section
      className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
      aria-labelledby="recent-activity-heading"
    >
      <h2 id="recent-activity-heading" className="text-lg font-semibold text-slate-900">
        {title}
      </h2>
      {items.length === 0 ? (
        <p className="mt-4 text-sm text-slate-600">{emptyMessage}</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {items.map((item) => (
            <li key={item.id} className="border-l-2 border-slate-200 pl-3">
              <p className="text-xs text-slate-500">{item.timestamp}</p>
              <p className="text-sm font-medium text-slate-800">{item.title}</p>
              <p className="text-xs text-slate-500">{item.detail}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
