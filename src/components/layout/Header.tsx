import type { ReactNode } from 'react'
import { useRouterState } from '@tanstack/react-router'
import { getPageTitle } from './navConfig'

type HeaderProps = {
  title?: string
  children?: ReactNode
}

/** Top bar: page title from navConfig plus a mock member label. */
export function Header({ title, children }: HeaderProps) {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })
  const heading = title ?? getPageTitle(pathname)

  return (
    <header className="dashboard-header flex flex-wrap items-center justify-between gap-3 border-b border-[rgba(79,184,178,0.25)] px-4 py-4">
      <h1 className="header-title m-0 text-xl font-bold text-[var(--sea-ink)]">
        {heading}
      </h1>
      <div className="header-actions text-sm text-[var(--sea-ink-soft)]">
        <span>Mock member</span>
        {children}
      </div>
    </header>
  )
}
