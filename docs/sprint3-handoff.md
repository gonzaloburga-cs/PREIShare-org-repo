# Sprint 3 Handoff — PREIshare Investor Dashboard Shell

## Stakeholder summary

We built a responsive investor dashboard shell for PREIshare members. An investor can move between Home, Portfolio, Deals, and Profile without leaving the shared sidebar and header. Numbers and lists are mock data, and each screen says so, so the UI can be demoed before live accounts and database numbers exist.

This matches the Sprint 3 client brief: a clickable shell, not live finance data. Verification on 2026-09-29 passed the in-scope checks. Result: ready for stakeholder handoff. Details are in `docs/verification-checklist.md`.

## What shipped

TanStack Start and TypeScript app at the repo root. Package manager is npm (`package-lock.json`).

File-based routes under `src/routes/`:

| URL | Nav label | Header title | What the page shows |
|-----|-----------|--------------|---------------------|
| `/dashboard` | Home | Dashboard overview | Three sample stat cards, a portfolio summary, and a recent-activity list |
| `/dashboard/portfolio` | Portfolio | Your portfolio | Holdings table: property name, place, and value |
| `/dashboard/deals` | Deals | Open deals | Listing rows from the sample fixtures. A Details control on the same page shows `summary` and a sample contact. There is no separate deal-detail URL. |
| `/dashboard/profile` | Profile | Your profile | Read-only profile card |

`/` and `/about` are still the TanStack starter pages. They are not investor areas.

Shared layout, used only on `/dashboard` and its child routes:

- `AppShell` — sidebar, header, and `#main-content`
- `Sidebar` — PREIshare mark and nav. Below 768px it collapses until the Menu button opens it.
- `Header` — page title from `navConfig`, plus the label "Mock member"
- `NavItems` and `navConfig` — the only list of labels and paths. The current URL is the active item.

Home widgets: `StatsCard`, `PortfolioSummary`, `RecentActivity`.

Page shells: `PortfolioTable`, `DealsList`, `ProfileCard`.

`DealsList` shows the four sample listings already in `src/fixtures/sample-investor-listings.ts`. Visible statuses on that page are Published, Draft, Under offer, and Sold. Those words stay inside the closed list `draft`, `published`, `under_offer`, `sold`, `archived`. No archived row is on the page.

Responsive and focus rules live in `src/styles/dashboard.css`. The root route loads that file the same way it loads `src/styles.css`.

The public site header is `src/components/Header.tsx`. The dashboard header is `src/components/layout/Header.tsx`. They are different components.

## How to run locally

1. From the repo root, install with npm: `npm install`.
2. Start the dev server: `npm run dev`. The script in `package.json` is `vite dev --port 3000`.
3. Open the URL printed in the terminal and go to `/dashboard`.

If port 3000 is already in use, the terminal prints another port. The 2026-09-29 walkthrough used http://localhost:3001 for that reason. `npm run typecheck` runs `tsc --noEmit`. There is no test or lint script in `package.json`.

## Short demo script

1. Open `/dashboard`. Point at Total portfolio value `$300,000` and Open deals `3`. Mention the sample banner: "Demo shell — all figures are placeholders."
2. Use the sidebar: Portfolio (Riverfront Lofts and Cedar Business Park), Deals (status on each row; Details stays on this page), Profile (Alex Morgan and an email, no edit form).
3. Narrow the window to about a phone width. The sidebar collapses. Use Menu, then a link, and show that the menu closes.
4. Say clearly: these values are mock placeholders for Sprint 3. They are not live balances.

## Known limitations

- No sign-in, sessions, or authorization. The header says "Mock member."
- Portfolio, deals, profile, stats, and recent activity are mock or fixture data. Sample banners say the figures are not live.
- No Supabase, PostgreSQL, or pgvector client in this sprint. Those stay planned, not in the tree.
- `PortfolioTable` and `DealsList` include an empty-list message, but the demo routes pass sample rows, so the walkthrough shows data, not the empty message.
- No GitHub Actions workflow in this repo.
- Verification was on the local dev server. A Vercel Hobby project is already described in `docs/vercel-hobby-setup.md`. This checklist did not re-check that production URL.
- The shell header and each page both use a level-1 heading. That was accepted as polish, not a demo blocker. See the checklist.
- Not a production hardening pass: no live loading or error states, because there is no data API yet.

## Recommended next-sprint work

1. Supabase auth, then protect `/dashboard` and its child routes. Replace the "Mock member" label with the signed-in member.
2. Replace the mock stats, holdings table, and deals list with live queries. Keep the widgets presentational: the route loads data and passes props. Do not put a Supabase client inside `StatsCard`, `PortfolioTable`, or `DealsList`.
3. pgvector search only after listings live in Postgres. Search is out of scope for this shell.
4. GitHub Actions that install dependencies and run `npm run typecheck` on pull requests. Add test or lint scripts only when those scripts exist in `package.json`.
5. Loading and error states for the widgets once a request can fail. The empty-list copy can stay for a real empty result.

Do not add payments, a document vault, admin tools, or a fifth route for deal detail as part of picking up this shell.

## References

- Client brief: `docs/investor-dashboard-brief.md`
- Information architecture: `docs/dashboard-ia.md`
- Component inventory: `docs/component-plan.md`
- Verification: `docs/verification-checklist.md`
- Listing types already locked in Sprint 2: `docs/decisions/ADR-001-investor-listing-types.md`
- Local Vercel notes (not re-verified this sprint): `docs/vercel-hobby-setup.md`
