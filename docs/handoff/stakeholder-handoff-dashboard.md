# PREIshare Investor Dashboard — Stakeholder Handoff

**Sprint focus:** Responsive investor dashboard shell (TanStack Start routes + React UI)
**Audience:** PREIshare product stakeholders and the next implementation topic owners
**Date:** 2026-10-02
**Prepared by:** Gonzalo

## 1. Demo today (what investors can click)

- Open `http://localhost:3000/dashboard`. The layout in `src/routes/dashboard/route.tsx` wraps the home page from `src/routes/dashboard/index.tsx` in `AppShell`.
- The header shows PREIshare and the account label "Mock member".
- At 1280px the sidebar stays visible with Home, Portfolio, Deals, and Profile. The current link looks selected.
- Below 768px the sidebar is hidden. A button reads "Open menu" and then "Close menu", and it shows those same four links.
- The home page shows three metric cards labeled mock: Portfolio value `$300,000`, Active investments `3`, Distributions (YTD) `$24,000`, plus the line "Mock data — not live balances."
- Portfolio summary shows three mock holdings (Riverfront Multifamily 42%, Cedar Retail Plaza 33%, Harbor Industrial 25%) and a mock total of `$300,000`.
- Recent activity shows three mock rows with a time, a title, and a detail.
- `/dashboard/portfolio`, `/dashboard/deals`, and `/dashboard/profile` keep the same shell. Each page is one heading and one sentence ("Holdings will appear here.", "Listing rows will appear here.", "A sample profile will appear here.").

**Out of scope for this demo:** live Supabase data, login, editing holdings, payments, and charts. The requirements brief lists those as later.

## 2. Requirements traceability

Criteria are copied from section 6 of `docs/preishare-dashboard-requirements.md`.

| Success criterion (from requirements brief) | Status | Evidence |
| --- | --- | --- |
| An investor can open `/dashboard` in the browser | Met | `src/routes/dashboard/index.tsx` is `createFileRoute('/dashboard/')`. QA URL `http://localhost:3000/dashboard`. |
| Header, navigation, metrics, and activity regions are all visible on desktop | Met | QA checklist, desktop D1–D5, all Pass at 1280px. |
| On a narrow (mobile) width, navigation remains usable (menu opens the sidebar) | Partial | At 375px the sidebar is hidden and MobileNav opens the four links (QA M3–M5 Pass). The menu does not open the desktop sidebar itself. |
| Placeholder content is clearly labeled so stakeholders know data is not live | Met | Home copy: "Mock data — not live balances." Metric hints say "Mock total", "Mock count", and "Mock YTD". |
| Home, Portfolio, Deals, and Profile each have their own URL and still show the shell after refresh | Partial | All four URLs exist under the layout route. Portfolio, Deals, and Profile are one-sentence placeholders, not the holdings table, listing rows, or profile card in requirements §3. |
| Requirements in this brief match what was built (no surprise mega-features) | Met | No login, payments, live balances, or extra investor URL. Activity stays on `/dashboard`. |
| A teammate can read this brief and understand scope in under 5 minutes | Met | `docs/preishare-dashboard-requirements.md` is the scope brief. |

## 3. Decisions made (so the next topic does not re-litigate them)

- **Routing:** `src/routes/dashboard/route.tsx` is the layout (`createFileRoute('/dashboard')` and `<Outlet />`). `src/routes/dashboard/index.tsx` is only the home page (`createFileRoute('/dashboard/')`).
- **Shell regions:** `AppShell` places Header, Sidebar, MobileNav, and `<main id="main-content">`. The architecture doc sets the breakpoints: sidebar hidden below 768px, sidebar visible from 768px up, metric cards in one column on mobile, two columns on tablet, and summary plus activity side by side above 1024px.
- **Widgets:** `MetricCard`, `PortfolioSummary`, and `RecentActivity` take props only. The home route passes `MOCK_PORTFOLIO_HOLDINGS` and `MOCK_RECENT_ACTIVITY`. `emptyMessage` is still a prop and shows only when the passed list is empty.
- **Responsive check:** QA used 375px, 768px, and 1280px. Every listed row passed. The fix log says no file was changed.

## 4. Known limitations (honest baseline)

- **Mock data only.** Home figures and lists are constants in the route file. There is no Supabase client, route loader, or server function in `src/`.
- **Auth is not wired.** The requirements brief says this sprint does not sign anyone in. Any visitor can open `/dashboard`.
- **No mutations.** Nothing on these pages saves a change.
- **Child screens are stubs.** Portfolio, Deals, and Profile do not yet show the table, listing rows, or profile card named in requirements §3. Deal status words (`draft`, `published`, `under_offer`, `sold`, `archived`) are not on the Deals page.
- **QA residual risks.** The checklist has no open failures. M10 notes the empty-state sentence is not on screen because the home lists have mock rows. Charts stay out of scope.

## 5. Recommended next sprint work

1. Add a loader and a server function for real portfolio and activity reads. Keep passing the result into the existing widget props.
2. Add authentication and limit `/dashboard` to a signed-in investor.
3. Replace `MOCK_PORTFOLIO_HOLDINGS` and `MOCK_RECENT_ACTIVITY` with those loader results. Leave `MetricCard`, `PortfolioSummary`, and `RecentActivity` presentational.
4. Build the Portfolio, Deals, and Profile page content the requirements brief already names, still inside this shell. Deal detail stays on `/dashboard/deals`.
5. Re-run `docs/responsive-qa-checklist.md` with a long name and with an empty list, so M10 and D6 are checked against both cases.

## 6. Artifact index (for handoff package)

- Requirements: `docs/preishare-dashboard-requirements.md`
- Routing plan: `docs/dashboard-routing-plan.md`
- Component architecture: `docs/dashboard-component-architecture.md`
- Responsive QA: `docs/responsive-qa-checklist.md`
- Routes: `src/routes/dashboard/route.tsx`, `src/routes/dashboard/index.tsx`
