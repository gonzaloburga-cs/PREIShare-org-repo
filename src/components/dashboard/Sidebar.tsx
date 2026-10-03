import { Link } from '@tanstack/react-router'

export type SidebarItem = {
  label: string
  to: '/dashboard' | '/dashboard/portfolio' | '/dashboard/deals' | '/dashboard/profile'
}

/** Labels and paths from docs/dashboard-routing-plan.md */
export const dashboardSidebarItems: readonly SidebarItem[] = [
  { label: 'Home', to: '/dashboard' },
  { label: 'Portfolio', to: '/dashboard/portfolio' },
  { label: 'Deals', to: '/dashboard/deals' },
  { label: 'Profile', to: '/dashboard/profile' },
]

export type SidebarProps = {
  items?: readonly SidebarItem[]
}

/**
 * Desktop navigation for the dashboard shell.
 * AppShell already provides the side region, so this component is the nav inside it.
 */
export function Sidebar({ items = dashboardSidebarItems }: SidebarProps) {
  return (
    <nav aria-label="Dashboard" className="p-4">
      <ul className="m-0 list-none space-y-1 p-0">
        {items.map((item) => (
          <li key={item.to}>
            <Link
              to={item.to}
              activeOptions={{ exact: item.to === '/dashboard' }}
              className="block rounded px-3 py-2 text-sm text-slate-800 hover:bg-slate-200"
              activeProps={{
                className:
                  'block rounded bg-slate-200 px-3 py-2 text-sm font-semibold text-slate-900',
              }}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
