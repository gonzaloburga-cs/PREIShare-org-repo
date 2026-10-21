# Architecture Decisions — PREIshare Dashboard Shell (Sprint 3)

Accepted for the investor dashboard shell on 2026-09-29.

These notes say why the shell is shaped this way, and what a later teammate should not rip out. Sprint 2 listing types are a separate decision: `docs/decisions/ADR-001-investor-listing-types.md`. The numbers below apply only to this dashboard shell. They do not replace that file.

## ADR-001: TanStack Start with file-based routes

- **Context:** An investor must open Home, Portfolio, Deals, and Profile as their own URLs, including after a refresh. The information architecture nests those four areas under `/dashboard` so one parent layout can wrap them. Deal detail stays on the deals page. The TanStack starter pages `/` and `/about` are not investor areas.
- **Decision:** Use TanStack Start and TypeScript file-based routing under `src/routes/`. `src/routes/dashboard.tsx` is the parent. Child files are `dashboard/index.tsx`, `dashboard/portfolio.tsx`, `dashboard/deals.tsx`, and `dashboard/profile.tsx`. Do not hand-edit `src/routeTree.gen.ts`.
- **Consequences:** The nav matches the information architecture, and a direct URL still shows the same shell. Later data loading can attach to a route without turning the app into one page of tabs. Do not add a fifth URL for deal detail, billing, settings, or admin. Do not move investor pages off `/dashboard`, or the shared layout stops wrapping them.

## ADR-002: Shared AppShell layout

- **Context:** Every investor page needs the same chrome: sidebar, header, and main. The brief also keeps the starter home and about pages outside that chrome. Two different headers already exist: the public site header in `src/components/Header.tsx`, and the dashboard header in `src/components/layout/Header.tsx`.
- **Decision:** `DashboardLayout` in `src/routes/dashboard.tsx` wraps `<Outlet />` with `AppShell`. `AppShell` renders `Sidebar`, the dashboard `Header`, and `<main id="main-content">`. Child routes render only their page content.
- **Consequences:** Page files stay focused on content. A layout fix happens in `AppShell`, `Sidebar`, or `Header`, not in four copies. Do not mount `AppShell` on the root route, or `/` and `/about` pick up investor chrome. Do not merge the two header components. The public header and the dashboard header serve different pages.

## ADR-003: Central nav config

- **Context:** Labels, paths, and the header title must stay the same on every investor page. The active item has to follow the current URL, including after refresh. The allowed labels are short: Home, Portfolio, Deals, Profile.
- **Decision:** `src/components/layout/navConfig.ts` is the only list of investor paths, labels, and titles (`dashboardNavItems`, `DashboardNavPath`, `getPageTitle`). `NavItems` renders that list and marks the current path. The header title comes from `getPageTitle`.
- **Consequences:** Adding an in-scope route is a config change plus a route file, then the sidebar and the header stay in sync. Do not hard-code a second link list inside `Sidebar` or `Header`. Do not add a nav item for a page the brief left out.

## ADR-004: Mock data boundary for the shell

- **Context:** Sprint 3 is a trustworthy UI shell. Stakeholders must see that figures are samples. Live accounts and database totals are later work. There is still no portfolio type in `src/types`. Deals already have a locked shape: `InvestorListing`, `ListingStatus` (`draft`, `published`, `under_offer`, `sold`, `archived`), address `region`, and `financials.askingPrice` in `USD`. Sample listings live in `src/fixtures/sample-investor-listings.ts`.
- **Decision:** Dashboard widgets in `src/components/dashboard/` render props only. The route file passes the mock or fixture data. Sample banners stay visible. There is no hidden fake API that pretends to be production. `DealsList` expands `summary` and a sample contact on `/dashboard/deals`. Portfolio rows stay a local mock shape (property name, place, value) until a real portfolio type exists.
- **Consequences:** Next sprint can replace mocks at the route boundary. Do not import a Supabase client, a server function, or environment variables inside `StatsCard`, `PortfolioSummary`, `RecentActivity`, `PortfolioTable`, `DealsList`, or `ProfileCard`. Do not invent status words such as Open or Closing soon. Do not add a portfolio type in this shell just to make the mock look official. Empty-list copy already lives in the table and the deals list; the demo routes pass sample rows, so that copy stays hidden until the array is actually empty.

## ADR-005: Responsive CSS and an accessibility baseline

- **Context:** Investors use a phone and a desktop. The information architecture asks for a left sidebar on a wide screen and a collapsed nav on a narrow screen, with text and cards that do not overlap. Tailwind in this app uses the default breakpoints (640px, 768px, 1024px). The scaffold already treated 768px as the shell breakpoint.
- **Decision:** Dashboard layout rules live in `src/styles/dashboard.css`, loaded from `src/routes/__root.tsx` as its own stylesheet link, the same way `src/styles.css` is loaded. Below 768px the sidebar is a drawer opened with the Menu button (`aria-expanded`, `aria-controls`, and `inert` while closed). From 768px up the sidebar stays visible and the menu control is hidden. Card grids are one column, two columns from 640px, and three from 1024px. Focus uses `:focus-visible`. Touch targets on the nav are at least 44px. `prefers-reduced-motion` is respected.
- **Consequences:** Demo layout and keyboard basics are in one file. Do not replace this with a second styling system, and do not rely on an `@import` of `dashboard.css` from inside `src/styles.css`: the root route's `?url` stylesheet drops that import, so the browser never applies the rules. Do not drop the Menu button's accessible name or the sidebar `inert` state. A deeper accessibility audit is still required before production. The shell header and each page both use a level-1 heading; that was accepted as polish for this sprint, not as the final heading structure.

## Next-sprint foundations (do not reverse casually)

| Foundation | Why it builds on this shell |
| --- | --- |
| Supabase auth | Gate the `/dashboard` layout route so Home, Portfolio, Deals, and Profile inherit protection together. Then replace the "Mock member" label and the profile card from the signed-in member. Do not put auth checks inside presentational widgets, and do not leave these URLs public once real member data is on them. |
| Live portfolio data | Load on the route (loader or server function) and pass props into the existing cards and table. That is why the widgets do not fetch. Remove the sample banner only when the numbers are live. A portfolio type can arrive with that work. This shell deliberately did not invent one. |
| pgvector-powered search | Search and pgvector are out of scope for this shell. Add a search UI on deals or documents only after listings live in Postgres. Do not put a search box on the mock list and pretend it queries a database. |
| GitHub Actions CI | There is no `.github` workflow yet. `package.json` has `npm run typecheck` (`tsc --noEmit`) and has no test or lint script. The first workflow should install dependencies and run typecheck on pull requests, on this single-package layout. Add a test step only after a test script exists. Do not write `npm test` into CI before that. |

## Explicit non-goals for Sprint 3

- Real sign-in, sessions, or authorization
- Live Supabase, PostgreSQL, migrations, or pgvector
- Payments, subscriptions, document signing, or other money movement
- Trading or compliance workflows
- Admin, listing-editor, or reviewer tools
- A fifth route for deal detail
- A finished visual brand system
- Production deployment hardening (the local shell was verified; production was not re-checked this sprint)
