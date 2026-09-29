import type { ReactNode } from 'react'
import { Header } from './Header'
import { Sidebar } from './Sidebar'

type AppShellProps = {
  title?: string
  children: ReactNode
}

/**
 * Shared investor chrome: sidebar + header + main content region.
 * Child routes render inside `children` (wired from the dashboard layout route).
 */
export function AppShell({ title = 'Investor Dashboard', children }: AppShellProps) {
  return (
    <div className="app-shell md:flex">
      <Sidebar />
      <div className="app-shell-main-column min-w-0 flex-1">
        <Header title={title} />
        <main className="app-shell-content px-4 py-6" id="main-content">
          {children}
        </main>
      </div>
    </div>
  )
}
