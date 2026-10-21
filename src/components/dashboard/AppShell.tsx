import type { ReactNode } from 'react'
import { Header } from './Header'
import { MobileNav } from './MobileNav'
import { Sidebar } from './Sidebar'

export type AppShellProps = {
  children: ReactNode
  /** Forwarded to Header */
  title?: string
  /** Forwarded to Header, such as a sign-out button */
  actions?: ReactNode
}

/**
 * Shared frame for all /dashboard routes: header, nav, and main slot.
 */
export function AppShell({ children, title, actions }: AppShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-transparent text-slate-900">
      <Header
        {...(title !== undefined ? { title } : {})}
        {...(actions !== undefined ? { actions } : {})}
      />
      <MobileNav />

      <div className="flex min-h-0 flex-1">
        <aside
          className="hidden w-60 shrink-0 border-r border-[var(--line)] bg-transparent md:block"
          aria-label="Dashboard sidebar"
        >
          <Sidebar />
        </aside>

        <main className="min-w-0 flex-1 p-4 md:p-6" id="main-content">
          {children}
        </main>
      </div>
    </div>
  )
}
