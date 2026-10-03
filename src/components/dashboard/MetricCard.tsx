import type { ReactNode } from 'react'

export type MetricCardProps = {
  /** Short label shown above the value, e.g. "Total equity" */
  label: string
  /** Main figure investors should see first. Sample numbers passed in are mock. */
  value: string
  /** Optional secondary line. Example mock copy: "+2.4% this month" */
  hint?: string
  /** Optional icon or badge slot */
  icon?: ReactNode
}

/**
 * One presentational metric tile. It renders the props it is given.
 * It does not fetch data. Any sample figures belong at the call site and must be labeled mock.
 */
export function MetricCard({ label, value, hint, icon }: MetricCardProps) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        {icon ? <span aria-hidden="true">{icon}</span> : null}
      </div>
      <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
      {hint ? <p className="mt-1 text-sm text-slate-600">{hint}</p> : null}
    </article>
  )
}
