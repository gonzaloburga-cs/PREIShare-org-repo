# PREIshare Investor Dashboard — Client Brief (Sprint 3 Shell)

## Product summary
PREIshare is where the team shares real-estate market information. An investor listing is one property opportunity: workflow status, address, asking price, who to call, and how people relate to the asset. Sprint 2 Topic 1 already locked that shape in TypeScript (`InvestorListing` and related types in `src/types/index.ts`).

This sprint gives an investor a clean dashboard shell so they can scan a sample portfolio value, browse sample deals, and review a sample profile without hunting through cluttered pages. The sprint delivers the shell only: responsive layout, TanStack Start file-based routes, and reusable React placeholders filled with mock data. Stakeholders should hear: the screens are clickable and labeled as samples; live accounts and database numbers are later work.

## Primary actors
| Actor | Role in this sprint | In scope to build? |
|-------|---------------------|--------------------|
| Investor (member) | Opens the dashboard to scan portfolio value, open deals, and view profile | Yes — primary user |
| Future admin | Later may create or review listings (the domain brief’s listing editor and reviewer). This sprint only names that role so we do not build those tools now | No — mention only as a future actor |

## Investor goals
1. Open the dashboard and immediately see a home overview: a sample portfolio snapshot plus a recent-activity placeholder.
2. Navigate to Portfolio, Deals, and Profile without leaving the app shell.
3. Trust the layout: plain labels, the same navigation on every page, and text that stays readable on a phone and on a desktop.

## Must-have dashboard areas (this sprint)
| Area | Route idea (for later steps) | What the investor should see |
|------|------------------------------|------------------------------|
| Home overview | `/dashboard` | Page title, stat cards (sample portfolio value and a short deal count), a portfolio summary placeholder, and a recent-activity list placeholder. Each number or name is marked as mock. |
| Portfolio | `/dashboard/portfolio` | Page title and a table or list shell of holdings. Columns can show a sample property name, place, and value. There is no portfolio type in `src/types` yet, so these rows are mock only. |
| Deals | `/dashboard/deals` | Page title and a list shell of property opportunities. Each row uses listing words we already have: `title`, `status`, city and `region`, and `financials.askingPrice` with currency `USD`. Status text may only be `draft`, `published`, `under_offer`, `sold`, or `archived`. A row may expand on this same page to show `summary` and a sample contact. Do not add a fifth route for that detail. |
| Profile | `/dashboard/profile` | Page title and a profile card shell: sample investor name and contact placeholders (email or phone). This is who is viewing the shell, not a listing contact editor. |

Shared chrome on every area: a header, a sidebar (or equivalent nav) with the four areas, and a main content region. The nav item for the current page looks selected.

Mock deals should follow the field names in `src/types/index.ts`. Helpful spellings to copy: address uses `region` (not a field named `state`); the short write-up is `summary`. Sample objects already live in `src/fixtures/sample-investor-listings.ts` if a later step wants realistic placeholders. The shell does not have to import those types to render static text, but it must not invent new status words.

## Success criteria (demo-ready shell)
- [ ] Investor can reach Home, Portfolio, Deals, and Profile from persistent navigation.
- [ ] Each area has its own route and page shell with a clear page title.
- [ ] Layout includes sidebar (or equivalent nav), header, and main content region.
- [ ] On a narrow screen, content remains usable (nav collapses or stacks; text and cards do not overlap).
- [ ] Placeholder and mock content is labeled as mock so a stakeholder can see the data is not live.
- [ ] Direct URLs for the four routes still show the same shells after refresh.
- [ ] Brief, information architecture, and UI stay aligned: no new investor pages beyond the four areas above.

Demo line for a stakeholder: the investor can move through the four areas and read sample portfolio value, sample deals, and a sample profile. Live portfolio math and saved listings come later.

## Out of scope (explicit non-goals for this sprint)
- Real sign-in, authentication, authorization, sessions, or a multi-user switcher
- Live Supabase or PostgreSQL data, migrations, and database-backed portfolio totals
- HTTP APIs, runtime validators, and create or edit listing forms
- Payments, subscriptions, and document e-sign
- Admin tools for managing investors, listings, or reviews
- Documents, photos, notifications, search, and pgvector
- Production deployment hardening and CI beyond the project’s existing setup
- New top-level product areas that are not Home, Portfolio, Deals, or Profile

## Prompting notes for later AI steps
When directing a coding agent or an in-editor copilot, attach or quote this brief. Require TypeScript, TanStack Start file-based routes under `src/routes/`, reusable React components, mock data only, and no auth. Ask it to keep listing field names aligned with `src/types/index.ts` and this brief. Reject output that adds pages or features listed under Out of scope, including a sign-in screen, a live database client, or an admin CRUD area.

This brief is for beginners. Prefer short sentences and the PREIshare words already in the domain brief (investor, listing, status, asking price). Leave out generic SaaS filler such as billing, teams, notifications, and “growth dashboards.”

## Open questions / assumptions
- Assume English UI copy for the shell.
- Assume one investor persona viewing their own sample data. No multi-portfolio switcher in this sprint.
- Visual brand can be simple and professional. A full brand system is not required. Reuse the app’s existing layout habits (Tailwind utilities and CSS variables in `src/styles.css`) where that stays simple.
- Portfolio value is a labeled mock total. Do not invent a new portfolio TypeScript type in this sprint.
- Deal detail stays on `/dashboard/deals` (expanded row or panel). It is not a new page.
- The TanStack starter may still have `/` and `/about`. This sprint’s investor demo path is the four `/dashboard` routes. Those starter pages are not extra investor areas to design.
