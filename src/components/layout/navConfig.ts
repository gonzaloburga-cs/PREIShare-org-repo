// Single source of truth for investor-facing nav labels, paths, and page titles.

export type DashboardNavPath = '/dashboard'

export type NavItemConfig = {
  label: string
  path: DashboardNavPath
  title: string
}

export const dashboardNavItems: NavItemConfig[] = [
  {
    label: 'Home',
    path: '/dashboard',
    title: 'Dashboard overview',
  },
]

function normalizePath(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith('/')) {
    return pathname.slice(0, -1)
  }
  return pathname
}

export function getPageTitle(pathname: string): string {
  const current = normalizePath(pathname)
  const exact = dashboardNavItems.find((item) => item.path === current)
  if (exact) return exact.title

  // Prefer the most specific matching path (longest prefix) for nested routes later.
  const prefixMatch = [...dashboardNavItems]
    .sort((a, b) => b.path.length - a.path.length)
    .find(
      (item) =>
        item.path !== '/dashboard' && current.startsWith(`${item.path}/`),
    )

  return prefixMatch?.title ?? 'Dashboard'
}
