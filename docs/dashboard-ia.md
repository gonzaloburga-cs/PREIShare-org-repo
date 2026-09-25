# PREIshare Investor Dashboard — Information Architecture

## Purpose
- Map of investor-facing pages for the Sprint 3 dashboard shell.
- Source: `docs/investor-dashboard-brief.md`.
- Mock data only. Every sample figure is labeled mock.
- No auth flows, admin tools, or live API contracts in this sprint.

## URL map and page purposes

| URL path | Route name | Nav label | Page purpose | Primary content |
|----------|------------|-----------|--------------|-----------------|
| `/dashboard` | Dashboard home | Home | Quick scan of sample portfolio value and activity | Page title. Stat cards: mock portfolio value, mock deal count. Portfolio summary placeholder. Recent-activity list placeholder. Each value labeled mock. |
| `/dashboard/portfolio` | Portfolio | Portfolio | Review sample holdings at a glance | Page title. Table or list shell. Columns: sample property name, place, value. Labeled mock. No portfolio type in `src/types` yet. |
| `/dashboard/deals` | Deals | Deals | See sample property opportunities (investor listings) | Page title. List of mock rows. Fields: `title`, `status`, city, `region`, `financials.askingPrice`, currency `USD`. Status only: `draft`, `published`, `under_offer`, `sold`, `archived`. Same page may expand a row for `summary` and a sample contact. |
| `/dashboard/profile` | Profile | Profile | View the sample member, not a listing contact editor | Page title. Profile card: mock name, mock email or phone. Labeled mock. |

Routes are nested under `/dashboard` so one parent layout can wrap Home, Portfolio, Deals, and Profile. Deal detail stays on `/dashboard/deals`. It is not its own URL.

## Navigation rules
- Shared chrome: left sidebar on desktop, top header, main content to the right or below.
- Narrow screens: nav collapses or stacks. Text and cards do not overlap.
- Active nav item matches the current URL path.
- Labels stay short: Home, Portfolio, Deals, Profile.
- Demo path is these four URLs. Starter pages `/` and `/about` are not investor areas.
- Direct URL and refresh still show the same shell.

## Out of scope for this shell
- Sign-in, sign-up, sessions, and multi-portfolio switcher
- Live Supabase or PostgreSQL queries
- Admin, listing-editor, or reviewer tools
- Payments, subscriptions, document vaults, photos, notifications, search
- A fifth route for deal detail, billing, or settings

## Notes for later route files
- Parent layout route: `dashboard`
- Child routes: index (home), `portfolio`, `deals`, `profile`
- File-based routing later, under `src/routes/`
- Mock deals may copy field names from `src/types/index.ts` (`region`, not `state`; prose field `summary`)
- Realistic placeholders may come from `src/fixtures/sample-investor-listings.ts`
- Do not add status words outside `draft`, `published`, `under_offer`, `sold`, `archived`
