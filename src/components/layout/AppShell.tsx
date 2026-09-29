import { useEffect, useState, type ReactNode } from 'react'
import { useRouterState } from '@tanstack/react-router'
import { Header } from './Header'
import { Sidebar } from './Sidebar'

const SIDEBAR_ID = 'dashboard-sidebar'

type AppShellProps = {
  children: ReactNode
}

/**
 * Shared investor chrome: sidebar + header + main content region.
 * Child routes render inside `children` (wired from the dashboard layout route).
 * The header title comes from navConfig via the current path.
 */
export function AppShell({ children }: AppShellProps) {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })
  const [navOpen, setNavOpen] = useState(false)
  const [isNarrow, setIsNarrow] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(max-width: 767px)')
    const sync = () => setIsNarrow(media.matches)
    sync()
    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    setNavOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!navOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setNavOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [navOpen])

  const sidebarCollapsed = isNarrow && !navOpen

  return (
    <div className={navOpen ? 'app-shell dash-shell nav-open md:flex' : 'app-shell dash-shell md:flex'}>
      <Sidebar id={SIDEBAR_ID} inert={sidebarCollapsed} />
      <div className="app-shell-main-column dash-main min-w-0 flex-1">
        <Header
          menuExpanded={navOpen}
          menuControlsId={SIDEBAR_ID}
          onMenuToggle={() => setNavOpen((open) => !open)}
        />
        <main className="app-shell-content dash-content px-4 py-6" id="main-content">
          {children}
        </main>
      </div>
    </div>
  )
}
