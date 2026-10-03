# PREIshare Dashboard Routing Plan

## Purpose

Map investor-facing dashboard URLs to TanStack Start route files. This plan records the tree already in `src/routes`. It does not add new route files.

Source requirements: `docs/preishare-dashboard-requirements.md`.

## Current app inventory (as found)

| File / folder | Likely URL | Notes |
| --- | --- | --- |
| `src/routes/__root.tsx` | (app root layout) | Shared root for every page. Do not replace it. |
| `src/routes/index.tsx` | `/` | Starter home. Not an investor screen (requirements §3). |
| `src/routes/about.tsx` | `/about` | Starter about page. Not an investor screen (requirements §3). |
| `src/routes/dashboard.tsx` | `/dashboard` | Layout route. Renders `AppShell` and `<Outlet />`. Parent of the investor pages. |
| `src/routes/dashboard/index.tsx` | `/dashboard` | Index page. Route id in the generated tree is `/dashboard/`. |
| `src/routes/dashboard/portfolio.tsx` | `/dashboard/portfolio` | Child of the dashboard layout. |
| `src/routes/dashboard/deals.tsx` | `/dashboard/deals` | Child of the dashboard layout. |
| `src/routes/dashboard/profile.tsx` | `/dashboard/profile` | Child of the dashboard layout. |
| `src/routeTree.gen.ts` | (generated) | Records the parent and child links above. Do not edit by hand. |
| `src/router.tsx` | (router setup) | Loads `routeTree` from `src/routeTree.gen.ts`. |

`src/routes/dashboard/` is the only route folder. There is no `src/routes/dashboard/route.tsx`.

## Planned dashboard route tree

```text
/dashboard                 → layout route (shell: header + sidebar + outlet)
/dashboard                 → index (investor home: metrics, portfolio summary, activity)
/dashboard/portfolio       → child (holdings table; mock rows)
/dashboard/deals           → child (listing rows; detail expands on this page)
/dashboard/profile         → child (read-only sample profile)
```

Requirements §3 names these four screens and marks each "Yes" for this sprint. Requirements §5 requires "file-based routes under `/dashboard`: home, portfolio, deals, and profile." Requirements §2 goal 2 is "Navigate among Home, Portfolio, Deals, and Profile without getting lost."

Recent activity is not a fifth URL. Requirements §4 calls it an "activity region" that is a "list of recent items on the home page."

## File map (exact files for this tree)

These files already exist. A later step must not create a second layout.

| URL | Role | File | Wraps / renders |
| --- | --- | --- | --- |
| `/dashboard` | Layout route | `src/routes/dashboard.tsx` | Shared dashboard chrome (`AppShell`: header, sidebar, main). Renders the child via `<Outlet />`. |
| `/dashboard` | Index page | `src/routes/dashboard/index.tsx` | Investor home: sample metric cards, portfolio summary, and recent-activity list. |
| `/dashboard/portfolio` | Child page | `src/routes/dashboard/portfolio.tsx` | Holdings table: property name, place, and value. Empty-state copy when the list is empty. |
| `/dashboard/deals` | Child page | `src/routes/dashboard/deals.tsx` | Sample listing rows. Details stay on this page. |
| `/dashboard/profile` | Child page | `src/routes/dashboard/profile.tsx` | Read-only sample profile card. |

This app's layout file is `src/routes/dashboard.tsx`, not `src/routes/dashboard/route.tsx`. The generated tree imports `./routes/dashboard`. Adding `route.tsx` beside it would be a second layout, not a rename.

## Layout vs page responsibilities

- **Layout (`src/routes/dashboard.tsx`)**: persistent chrome only. Header, sidebar, and the main outlet. No metric cards and no activity list in this file.
- **Index (`src/routes/dashboard/index.tsx`)**: dashboard home composition (summary widgets and the activity list). Renders inside the parent layout.
- **Child pages**: real nav targets for Portfolio, Deals, and Profile. Content is mock or fixture data. Full live UI is later. Deal detail does not get its own file (requirements §3: "Deal detail is not its own URL").

## Navigation labels (for sidebar / mobile nav)

| Label | Path | Requirement link |
| --- | --- | --- |
| Home | `/dashboard` | §2 goal 3 and §3: home base with portfolio metrics and the activity list on this page. §6: an investor can open `/dashboard`. |
| Portfolio | `/dashboard/portfolio` | §3: holdings table (property name, place, value) and empty-state copy if the list is empty. |
| Deals | `/dashboard/deals` | §3: sample listing rows (title, status, city, region, asking price in USD). Details expand on this page. |
| Profile | `/dashboard/profile` | §3: read-only sample profile card (name and a contact channel). |

Requirements §4: the sidebar lists Home, Portfolio, Deals, and Profile, and "the current URL looks selected." Requirements §5: "Clear navigation labels an investor would understand: Home, Portfolio, Deals, Profile."

## Out of scope for this plan

- A route for recent activity, login, trades, or deal detail
- Component prop designs and styling tokens
- Auth guards and loader data shape
- API routes, Supabase queries, balances, and pgvector search
- Deleting `/` or `/about`

## Success criteria for implementation steps

- Visiting `/dashboard` shows the layout shell and the home index content region.
- `/dashboard/portfolio`, `/dashboard/deals`, and `/dashboard/profile` render inside the same layout, not as a full-page replacement of the shell.
- No unrelated existing routes (`/`, `/about`, `__root.tsx`) were deleted.
- The URL list matches requirements §3. No extra investor path was added.

## Open questions

- **Why not `/dashboard/activity`?** Resolved. Requirements §4 puts recent activity on the home page. A separate activity URL would not trace to a required screen.
- **Why not `src/routes/dashboard/route.tsx`?** Resolved. This repo's layout file is `src/routes/dashboard.tsx`. The generated route tree already parents the child routes there.
- **Are the child pages still stubs?** No. They already render mock or fixture content. They stay in this tree as the nav targets. Live data is a later sprint, not a new URL.
