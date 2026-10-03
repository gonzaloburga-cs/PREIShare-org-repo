# PREIshare Dashboard Routing Plan

## Purpose

Map investor-facing dashboard URLs to TanStack Start route files before any UI generation.

Source requirements: `docs/preishare-dashboard-requirements.md`.

## Current app inventory (as found)

| File / folder | Likely URL | Notes |
| --- | --- | --- |
| `src/routes/__root.tsx` | (app root layout) | Existing shared root. Do not replace it. |
| `src/routes/index.tsx` | `/` | Existing starter home. Not an investor screen (requirements §3). |
| `src/routes/about.tsx` | `/about` | Existing starter about page. Not an investor screen (requirements §3). |
| `src/routes/dashboard.tsx` | `/dashboard` | Flat file found in the tree today. This plan does not treat it as the layout file to create. |
| `src/routes/dashboard/index.tsx` | `/dashboard` | Home page file. Route id in the generated tree is `/dashboard/`. Kept as the separate index page. |
| `src/routes/dashboard/portfolio.tsx` | `/dashboard/portfolio` | Path found on disk. The file map below still names this as a later nav target, not a finished screen. |
| `src/routes/dashboard/deals.tsx` | `/dashboard/deals` | Path found on disk. Planned child for the Deals label. |
| `src/routes/dashboard/profile.tsx` | `/dashboard/profile` | Path found on disk. Planned child for the Profile label. |
| `src/routeTree.gen.ts` | (generated) | Generated route tree. Do not edit by hand. |
| `src/router.tsx` | (router setup) | Loads `routeTree` from `src/routeTree.gen.ts`. |

`src/routes/dashboard/route.tsx` is not in the tree yet. A later step creates that layout file. The flat `src/routes/dashboard.tsx` found above does not replace that plan.

## Planned dashboard route tree

```text
/dashboard                 → layout route (shell: header + sidebar + outlet)
/dashboard                 → index (investor home: metrics, portfolio summary, activity)
/dashboard/portfolio       → placeholder child (later nav target; holdings not finished here)
/dashboard/deals           → placeholder child (later nav target; listing rows)
/dashboard/profile         → placeholder child (later nav target; sample profile)
```

Requirements §3 names these four screens and marks each "Yes" for this sprint. Requirements §5 requires "file-based routes under `/dashboard`: home, portfolio, deals, and profile." Requirements §2 goal 2 is "Navigate among Home, Portfolio, Deals, and Profile without getting lost."

Recent activity is not a fifth URL. Requirements §4 calls it an "activity region" that is a "list of recent items on the home page."

## File map (exact files to create in a later step)

| URL | Role | File to create | Wraps / renders |
| --- | --- | --- | --- |
| `/dashboard` | Layout route | `src/routes/dashboard/route.tsx` | Shared dashboard chrome (header, sidebar, main). Renders the child via Outlet. Create this layout later. |
| `/dashboard` | Index page | `src/routes/dashboard/index.tsx` | Separate home page: investor dashboard home content (metrics, portfolio summary, activity). Not the layout file. |
| `/dashboard/portfolio` | Placeholder | `src/routes/dashboard/portfolio.tsx` | Later nav target. Stub page so the Portfolio link has a real path. Full holdings UI is not this step. |
| `/dashboard/deals` | Placeholder | `src/routes/dashboard/deals.tsx` | Later nav target. Stub page for Deals. Detail stays on this path, not a new URL. |
| `/dashboard/profile` | Placeholder | `src/routes/dashboard/profile.tsx` | Later nav target. Stub page for Profile. |

`src/routes/dashboard/route.tsx` is the planned layout file. Do not skip it because a flat `src/routes/dashboard.tsx` already exists.

## Layout vs page responsibilities

- **Layout (`src/routes/dashboard/route.tsx`)**: persistent navigation regions only (header, sidebar or mobile nav slot, main outlet). No metric card business content. This file is created in a later step.
- **Index (`src/routes/dashboard/index.tsx`)**: dashboard home composition (summary widgets and the activity list). Uses the parent layout. This stays a separate page from the layout file.
- **Placeholders**: minimal pages so nav links have real targets. Portfolio is the first later nav target. Deals and Profile are the other later targets. Full UI comes in later topics. Deal detail does not get its own file (requirements §3: "Deal detail is not its own URL").

## Navigation labels (for sidebar / mobile nav later)

| Label | Path | Requirement link |
| --- | --- | --- |
| Home | `/dashboard` | §2 goal 3 and §3: home base with portfolio metrics and the activity list on this page. §6: an investor can open `/dashboard`. |
| Portfolio | `/dashboard/portfolio` | §3: deeper portfolio tools. Later nav target, not a finished screen in this plan. |
| Deals | `/dashboard/deals` | §3: sample listing rows (title, status, city, region, asking price in USD). Later nav target. Details expand on this page. |
| Profile | `/dashboard/profile` | §3: read-only sample profile card (name and a contact channel). Later nav target. |

Requirements §4: the sidebar lists Home, Portfolio, Deals, and Profile, and "the current URL looks selected." Requirements §5: "Clear navigation labels an investor would understand: Home, Portfolio, Deals, Profile."

## Out of scope for this plan

- Creating the route files in this step (the map names them; a later step creates them)
- A route for recent activity, login, trades, or deal detail
- Component prop designs and styling tokens
- Auth guards and loader data shape
- API routes, Supabase queries, balances, and pgvector search
- Deleting `/` or `/about`

## Success criteria for implementation steps

- Visiting `/dashboard` shows the layout shell from `src/routes/dashboard/route.tsx` and the home content from `src/routes/dashboard/index.tsx`.
- Child placeholder paths, including `/dashboard/portfolio`, render inside the same layout, not as a full-page replacement of the shell.
- No unrelated existing routes (`/`, `/about`, `__root.tsx`) were deleted.
- The URL list matches requirements §3. No extra investor path was added.

## Open questions

- **Why not `/dashboard/activity`?** Resolved. Requirements §4 puts recent activity on the home page. A separate activity URL would not trace to a required screen.
- **Which file is the layout to create?** Resolved. `src/routes/dashboard/route.tsx` is the layout route to create later. `src/routes/dashboard/index.tsx` stays the separate home page. A flat `src/routes/dashboard.tsx` found in the inventory does not cancel that planned path.
- **Is Portfolio a finished screen in this plan?** No. `/dashboard/portfolio` is a later nav target so the sidebar has a real path. Full holdings UI is a later topic.
