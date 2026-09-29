import type { ReactNode } from 'react'
import { NavItems } from './NavItems'

type SidebarProps = {
  brandLabel?: string
  children?: ReactNode
  id?: string
  inert?: boolean
}

/** Left navigation chrome for the investor dashboard shell. */
export function Sidebar({ brandLabel = 'PREIshare', children, id, inert = false }: SidebarProps) {
  return (
    <aside
      id={id}
      inert={inert}
      className="dashboard-sidebar dash-sidebar border-b border-[rgba(79,184,178,0.25)] px-4 py-5 md:w-56 md:shrink-0 md:border-r md:border-b-0"
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
