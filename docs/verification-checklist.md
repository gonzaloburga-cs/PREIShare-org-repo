# PREIshare Investor Dashboard Shell — Verification Checklist

**Sprint:** 3 (TanStack Start UI shell)  
**Verifier:** Gonzalo  
**Date:** 2026-09-29  
**App URL tested:** http://localhost:3001  
**Sources of truth:** `docs/investor-dashboard-brief.md`, `docs/dashboard-ia.md`, `docs/component-plan.md`

The README names http://localhost:3000. This walkthrough used the dev server that was already running on port 3001.

## How to use this checklist

- **Pass** — requirement met; evidence describes what you saw.
- **Fail** — in-scope shell issue; fix before handoff or note the fix commit.
- **Deferred** — intentionally out of scope for this sprint; reason required.

---

## 1. Routing and information architecture

| ID | Check | Status | Evidence |
|----|--------|--------|----------|
| R1 | `/dashboard` (or agreed home) loads dashboard home inside AppShell | Pass | Opened `/dashboard`. Sidebar, header title "Dashboard overview", and the stats row were visible inside the shell. |
| R2 | `/dashboard/portfolio` loads portfolio page shell | Pass | Direct load showed header "Your portfolio", page heading "Portfolio", and the holdings table. |
| R3 | `/dashboard/deals` loads deals page shell | Pass | Direct load showed header "Open deals", page heading "Deals", and four listing rows. |
| R4 | `/dashboard/profile` loads profile page shell | Pass | Direct load showed header "Your profile", page heading "Profile", and the profile card. |
| R5 | Unknown paths do not break the whole app (sensible fallback or framework 404) | Pass | `/dashboard/not-a-page` stayed inside the shell and showed "Not Found". `/nope` showed "Not Found" with the site header and footer still usable. |

**IA notes:** Nav labels match the IA: Home, Portfolio, Deals, Profile. Deal detail stays on `/dashboard/deals` (a Details control on the same page). The home page also shows a third sample stat, Contributions YTD, in addition to portfolio value and open deals. Profile also shows membership, preferred contact, and a notes line besides name and email. Those extras are read-only sample fields, not new product areas.

---

## 2. Navigation labels and active states

| ID | Check | Status | Evidence |
|----|--------|--------|----------|
| N1 | Sidebar/nav labels match brief/IA (Home/Dashboard, Portfolio, Deals, Profile) | Pass | The investor nav read Home, Portfolio, Deals, Profile. |
| N2 | Active nav item highlights the current route | Pass | On `/dashboard/portfolio` the Portfolio link had `aria-current="page"` and the active class. Deals and Profile did the same on their routes. Home was current only on `/dashboard`. |
| N3 | Header page title updates when changing routes | Pass | Header titles were "Dashboard overview", "Your portfolio", "Open deals", and "Your profile". An unknown dashboard path fell back to "Dashboard". |
| N4 | Nav links use client routing (no full page reload flash if applicable) | Pass | Clicking Portfolio from Home changed the URL to `/dashboard/portfolio` and the document navigation count stayed at 1. |

---

## 3. Layout shell and responsiveness

| ID | Check | Status | Evidence |
|----|--------|--------|----------|
| L1 | AppShell shows sidebar + header + main content on desktop | Pass | At about 1130px the sidebar sat beside the content (256px wide), with the header and `#main-content` in the main column. |
| L2 | Narrow viewport: nav remains usable (collapse, drawer, or stacked pattern) | Pass | At 375px the sidebar was collapsed (`max-height: 0`, `inert`) and a Menu button was visible. Opening it set `aria-expanded="true"` and showed the four links. Choosing Portfolio closed the menu and loaded that page. |
| L3 | No permanent horizontal scroll on home/portfolio/deals/profile at ~375px width | Pass | Page overflow was 0px on `/dashboard`, `/dashboard/deals`, `/dashboard/portfolio`, and `/dashboard/profile` at 375px. |
| L4 | Main content remains readable; cards/tables stack or scroll intentionally | Pass | Home cards stacked in one column at 375px. The portfolio table stayed inside the card and scrolled sideways by about 139px (`dash-table-wrap`), not the whole page. |
| L5 | Basic accessibility: buttons/links are keyboard-focusable; interactive controls have accessible names | Pass | Nav links are named Home, Portfolio, Deals, and Profile. The narrow-screen control is named Menu/Close, with `aria-expanded` and `aria-controls="dashboard-sidebar"`. Deal rows use a button named Details. `src/styles/dashboard.css` draws a focus outline on `:focus-visible` for those controls. Collapsed sidebar links are `inert`, so they are not a hidden tab stop. |

---

## 4. Mock content clarity (demo readiness)

| ID | Check | Status | Evidence |
|----|--------|--------|----------|
| M1 | Dashboard home: stats cards show labeled mock investor metrics | Pass | Three cards: Total portfolio value $300,000 (Sample total), Open deals 3 (Sample count), Contributions YTD $24,000 (Sample YTD). Banner: "Demo shell — all figures are placeholders". |
| M2 | Portfolio summary / table shows clear placeholder holdings | Pass | Home summary lists Sample Multifamily Fund A, Sample Industrial Note B, and Sample Cash Reserve, labeled "Sample data — placeholders only, not live balances". The portfolio page table shows Riverfront Lofts, Austin, Texas, $56,200 and Cedar Business Park, Dallas, Texas, $74,100, with the same sample banner. |
| M3 | Deals list shows open-deal style placeholders | Pass | Four sample listings with a visible status: Published, Draft, Under offer, and Sold. Each row shows city, region, and a USD asking price. Banner: "Sample data — placeholders only, not live listings". Status words match the closed list in the IA, not extra labels such as Open or Closing soon. |
| M4 | Profile card shows member-style placeholder fields | Pass | Alex Morgan, alex.morgan@example.com, Preferred investor, preferred contact Email, and a short notes line. Banner: "Sample data — placeholders only, not a live account". No inputs. |
| M5 | No raw "TODO" / empty broken panels on primary views | Pass | The four dashboard routes render their sample panels. A search of `src/` found no TODO, sign-in, password, Supabase, or payment code. |

---

## 5. Out-of-scope boundaries (must stay deferred)

| ID | Check | Status | Evidence / reason |
|----|--------|--------|-------------------|
| O1 | No real authentication / login gate required for shell demo | Deferred | Sprint 3 is a clickable shell. Sign-in, sessions, and a multi-portfolio switcher are out of scope in `docs/dashboard-ia.md`. The header only says "Mock member". |
| O2 | No live Supabase/PostgreSQL data — mock data only | Deferred | The data layer is planned and not in the tree. Figures come from component mocks and `src/fixtures/sample-investor-listings.ts`. |
| O3 | No production deploy required for this verification | Deferred | This pass used the local dev server only. |
| O4 | No payment, document vault, or admin tools added beyond brief | Pass | Nothing in `src/` adds payments, a document vault, admin tools, or a deal-detail route. Profile has no password or edit form. |

---

## 6. Defects found and resolution

| Defect | Severity (blocker / polish) | Resolution | Re-check |
|--------|----------------------------|------------|----------|
| None that failed an in-scope check | — | All in-scope checks passed on this walkthrough. | — |

Observed and accepted, not a handoff blocker: the shell header and each page both render a level-1 heading (for example "Your portfolio" in the header and "Portfolio" in the page). Screen-reader users hear two titles. Left as-is because both titles are the intended shell labels and the demo remains readable.

---

## 7. Sign-off for handoff

- [x] All **blocker** fails fixed or explicitly accepted with reason
- [x] Deferred items only cover agreed out-of-scope work
- [x] Shell is demoable against the PREIshare client story for Sprint 3

**Overall result:** Ready for stakeholder handoff

**Verifier signature:** Gonzalo
