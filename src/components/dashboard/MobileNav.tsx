import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { dashboardSidebarItems, type SidebarItem } from './Sidebar'

export type MobileNavProps = {
  items?: readonly SidebarItem[]
}

/**
 * Small-screen navigation. Same destinations as Sidebar.
 * Open state stays in this component.
 */
export function MobileNav({ items = dashboardSidebarItems }: MobileNavProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="px-4 pt-3 md:hidden">
      <button
        type="button"
        className="rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800"
        aria-expanded={open}
        aria-controls="mobile-dashboard-menu"
        onClick={() => setOpen((value) => !value)}
      >
        {open ? 'Close menu' : 'Open menu'}
      </button>
      {open ? (
        <nav
          id="mobile-dashboard-menu"
          aria-label="Dashboard"
          className="mt-2 rounded border border-slate-200 bg-white p-3"
        >
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
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </div>
  )
}
