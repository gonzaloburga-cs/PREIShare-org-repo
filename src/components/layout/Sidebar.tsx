import type { ReactNode } from 'react'
import { NavItems } from './NavItems'

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
      <NavItems />
      {children}
    </aside>
  )
}
