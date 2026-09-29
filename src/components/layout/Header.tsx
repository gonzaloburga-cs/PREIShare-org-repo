import type { ReactNode } from 'react'

type HeaderProps = {
  title?: string
  children?: ReactNode
}

/** Top bar: page title plus a mock member label. Not the public-site header. */
export function Header({ title = 'Investor Dashboard', children }: HeaderProps) {
  return (
    <header className="dashboard-header flex flex-wrap items-center justify-between gap-3 border-b border-[rgba(79,184,178,0.25)] px-4 py-4">
      <h1 className="header-title m-0 text-xl font-bold text-[var(--sea-ink)]">{title}</h1>
      <div className="header-actions text-sm text-[var(--sea-ink-soft)]">
        <span>Mock member</span>
        {children}
      </div>
    </header>
  )
}
