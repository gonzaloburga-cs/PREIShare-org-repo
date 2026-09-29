// Renders nav links from navConfig and marks the active route.

import { Link, useRouterState } from '@tanstack/react-router'
import { dashboardNavItems } from './navConfig'

export function NavItems() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })

  return (
    <nav className="dash-nav" aria-label="Investor">
      <ul className="nav-list m-0 flex list-none flex-wrap gap-3 p-0 md:flex-col">
        {dashboardNavItems.map((item) => {
          const isActive =
            item.path === '/dashboard'
              ? pathname === '/dashboard' || pathname === '/dashboard/'
              : pathname === item.path || pathname.startsWith(`${item.path}/`)

          return (
            <li key={item.path}>
              <Link
                to={item.path}
                activeOptions={{ exact: item.path === '/dashboard' }}
                className={
                  isActive
                    ? 'nav-link nav-link-active font-semibold text-[var(--sea-ink)] no-underline'
                    : 'nav-link text-[var(--sea-ink-soft)] no-underline'
                }
                aria-current={isActive ? 'page' : undefined}
              >
                {item.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
