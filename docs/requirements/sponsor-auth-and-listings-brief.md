# Sponsor Auth & Property Listings — Requirements Brief (Sprint 4)

## Client story (restated)
PREIshare sponsors need a secure way to sign in to the dashboard and manage
real property listings stored in PostgreSQL. Secret keys and privileged
database access must stay on the server and never ship in the browser bundle.

## Actors
| Actor | Goal |
| --- | --- |
| Sponsor | Sign up / log in, create and view their property listings |
| Unauthenticated visitor | Reach login/signup only; cannot see listing data |
| System (server) | Enforce session checks, talk to Supabase with correct keys |

## Goals for this sprint
1. Sponsors can register and log in (email/password or equivalent Supabase Auth).
2. Dashboard routes that show listings require a valid session.
3. Property listings are stored in Postgres (not mock arrays in the client).
4. Sponsors can create and read listings that belong to them.
5. Environment secrets are separated: publishable/anon values may be client-safe;
   service-role and other secrets stay server-only.

## Out of scope (defer)
- Payment processing, document uploads, full admin roles
- Social OAuth providers beyond what Supabase email auth covers
- Production custom domain / multi-tenant orgs

## Current dashboard observations
- Framework: TanStack Start + React + TypeScript (existing scaffold).
- Routes found:
  - `/` — public starter home with a link to the dashboard.
  - `/about` — public about page.
  - `/dashboard` — layout shell (header, sidebar, mobile menu) with no session check.
  - `/dashboard/` — investor home. Shows three hardcoded tiles: Portfolio value `$300,000`, Active investments `3`, Distributions (YTD) `$24,000`, plus mock holdings and mock activity. Banner says "Mock data — not live balances."
  - `/dashboard/portfolio` — one sentence: "Holdings will appear here."
  - `/dashboard/deals` — one sentence: "Listing rows will appear here."
  - `/dashboard/profile` — one sentence: "A sample profile will appear here."
  - No `/login` or `/signup` route exists.
- Listings today: no Postgres table and no Supabase client (`src/lib/supabase.ts` is not in the tree). The deals page does not render listings. Sample listing objects live in `src/fixtures/sample-investor-listings.ts`, and `DealsList` maps those into `MOCK_DEALS`, but that component is not mounted on `/dashboard/deals`. Home metrics and activity are constants in the route and widget files, not rows from a database.
- Auth today: none. The dashboard header always shows a "Mock member" chip (`MM`). `src/lib/user.ts` `getUser()` always returns `null`. Anyone who opens `/dashboard`, `/dashboard/deals`, `/dashboard/portfolio`, or `/dashboard/profile` sees the shell. There is no `.env` or `.env.example`, and `src/` has no `createServerFn`.
- Gaps this sprint must close: login/signup, session-aware dashboard shell, Postgres-backed list + create flows, env separation.

## Success criteria (how we know it worked)
- [ ] A sponsor can sign up and log in and is redirected to a protected dashboard.
- [ ] Logged-out users cannot open protected dashboard listing pages.
- [ ] Creating a listing persists it in Postgres and it appears after refresh.
- [ ] A sponsor only sees their own listings (row-level security intentional).
- [ ] No service-role or other secret key appears in client bundle or committed `.env`.
- [ ] `.env.example` documents required variables without real secret values.

## Server-only boundary (must not ship to the browser)
- Supabase **service role** key (and any other privileged secrets)
- Direct privileged DB URLs if used outside Supabase client helpers
- Any server-only env vars used for admin or bypass operations

Client-safe (when intentionally exposed by Supabase design):
- Project URL
- Anon / publishable key (still respect RLS; never treat as a secret bypass)

## Implementation notes for later prompts
- Prefer server loaders/actions in TanStack Start for reads/writes that need
  the user session or privileged checks.
- Data model and RLS policies will be designed in later steps; this brief only
  locks the product contract.
- Handoff later should map deliverables back to the goals and success criteria above.
