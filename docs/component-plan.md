# PREIshare Investor Dashboard — Component Inventory

## Scope
- Reusable UI for the Sprint 3 shell in `docs/dashboard-ia.md`.
- Mock data only. Sample numbers and names are labeled mock.
- Components show structure and placeholder content. They do not call APIs, Supabase, or auth.
- Investor pages only: `/dashboard`, `/dashboard/portfolio`, `/dashboard/deals`, `/dashboard/profile`.
- The starter `src/components/Header.tsx` stays the public-site header for `/` and `/about`. The dashboard `Header` below is a different piece.

## Layout components (shared chrome)

| Component | Responsibility | Used on | Must NOT do |
|-----------|----------------|---------|-------------|
| `AppShell` | Frame every investor page with Sidebar, Header, and a main content region. | All `/dashboard/*` pages | Render stats, tables, deal rows, or profile fields. Fetch data. Wrap `/` or `/about`. |
| `Sidebar` | Show the PREIshare mark and the primary nav on larger screens. | AppShell | Own the page title. Hardcode deal or holding rows. Keep a second copy of the link list. |
| `Header` | Show the current page title and a simple mock member label. | AppShell | Define nav labels or paths. Replace the starter site header. Run sign-in or sign-out. |
| `NavItems` / `navConfig` | Hold the only list of labels and paths: Home, Portfolio, Deals, Profile. | Sidebar, and a collapsed nav if one is added later | Render stats, tables, or cards. Add a fifth link. Mark the active item by any rule other than the current URL. |

## Dashboard home widgets

| Component | Responsibility | Used on | Must NOT do |
|-----------|----------------|---------|-------------|
| `StatsCard` | Show one mock metric: a label, a value, and an optional hint, each marked mock. | Dashboard home only this sprint (two cards: portfolio value, deal count) | Fetch data. Own page layout. Become the portfolio table or the deals list. |
| `PortfolioSummary` | Show a short mock snapshot of portfolio value for a quick scan. | Dashboard home | Replace the Portfolio page or `PortfolioTable`. Invent a portfolio TypeScript type. |
| `RecentActivity` | Show a short list of mock recent events. | Dashboard home | Own global navigation. Turn into notifications, search, or a live feed. |

## Page-level shells

| Component | Responsibility | Used on | Must NOT do |
|-----------|----------------|---------|-------------|
| `PortfolioTable` | Show mock holdings in a table or list: property name, place, and value, labeled mock. | Portfolio page | Call a market-data API. Duplicate the home summary as a second portfolio product. |
| `DealsList` | Show mock investor listings as rows: `title`, `status`, city, `region`, `financials.askingPrice` in `USD`. May expand a row on this page for `summary` and a sample contact. | Deals page | Add a deal-detail route. Use a status outside `draft`, `published`, `under_offer`, `sold`, `archived`. Start checkout, subscribe, or edit flows. |
| `ProfileCard` | Show the mock member’s name and one contact channel (email or phone), labeled mock. | Profile page | Change a password, start auth, or edit listing contacts. |

## Composition rules
1. One job per component. If two rows describe the same job, merge or delete one.
2. `AppShell` wraps every investor page. Page widgets do not rebuild the sidebar, header, or nav list.
3. Mock values may be inline constants this sprint. Real Supabase comes later.
4. Names above stay locked for later prompts. Rename one only if both this file and `docs/dashboard-ia.md` change together.
5. Deal detail stays inside `DealsList` on `/dashboard/deals`.
6. Narrow screens: Sidebar collapses or stacks inside `AppShell`. Widgets do not invent their own nav.

## Mapping check (IA ↔ components)
- Home (`/dashboard`) → `StatsCard`, `PortfolioSummary`, `RecentActivity` inside `AppShell`
- Portfolio (`/dashboard/portfolio`) → `PortfolioTable` inside `AppShell`
- Deals (`/dashboard/deals`) → `DealsList` inside `AppShell`
- Profile (`/dashboard/profile`) → `ProfileCard` inside `AppShell`
- Nav labels and paths → `NavItems` / `navConfig` only
