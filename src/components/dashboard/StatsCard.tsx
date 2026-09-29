import type { ReactNode } from 'react'

export type StatsCardProps = {
  label: string
  value: string
  hint?: string
  /** Optional icon or badge slot for later polish */
  icon?: ReactNode
}

/** Reusable metric tile for the investor dashboard home. */
export function StatsCard({ label, value, hint, icon }: StatsCardProps) {
  return (
    <article
      className="stats-card rounded-2xl border border-[rgba(79,184,178,0.25)] px-4 py-4"
      aria-label={label}
    >
      <header className="stats-card__header mb-2 flex items-center justify-between gap-2">
        <p className="stats-card__label m-0 text-sm text-[var(--sea-ink-soft)]">{label}</p>
        {icon ? <span className="stats-card__icon">{icon}</span> : null}
      </header>
      <p className="stats-card__value m-0 text-2xl font-bold text-[var(--sea-ink)]">{value}</p>
      {hint ? (
        <p className="stats-card__hint m-0 mt-2 text-sm text-[var(--sea-ink-soft)]">{hint}</p>
      ) : null}
    </article>
  )
}
