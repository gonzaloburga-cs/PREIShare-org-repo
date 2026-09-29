import type { ReactNode } from 'react'
import { Link } from '@tanstack/react-router'

type SidebarProps = {
  brandLabel?: string
  children?: ReactNode
}

/** Left navigation chrome for the investor dashboard shell. */
export function Sidebar({ brandLabel = 'PREIshare', children }: SidebarProps) {
  return (
    <aside
      className="dashboard-sidebar border-b border-[rgba(79,184,178,0.25)] px-4 py-5 md:w-56 md:shrink-0 md:border-r md:border-b-0"
      aria-label="Investor navigation"
    >
      <div className="sidebar-brand mb-4 text-lg font-bold text-[var(--sea-ink)]">
        {brandLabel}
      </div>
      <nav className="sidebar-nav">
        {/* Placeholder links — full nav config + active states come in the next step */}
        <ul className="m-0 flex list-none flex-wrap gap-3 p-0 md:flex-col">
          <li>
            <Link
              activeOptions={{ exact: true }}
              className="text-[var(--sea-ink-soft)] no-underline"
              to="/dashboard"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              className="text-[var(--sea-ink-soft)] no-underline"
              to="/dashboard/portfolio"
            >
              Portfolio
            </Link>
          </li>
          <li>
            <Link className="text-[var(--sea-ink-soft)] no-underline" to="/dashboard/deals">
              Deals
            </Link>
          </li>
          <li>
            <Link
              className="text-[var(--sea-ink-soft)] no-underline"
              to="/dashboard/profile"
            >
              Profile
            </Link>
          </li>
        </ul>
        {children}
      </nav>
    </aside>
  )
}
