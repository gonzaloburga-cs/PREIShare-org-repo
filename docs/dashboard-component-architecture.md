# PREIshare Dashboard — Component Architecture & Responsive Layout Map

## Purpose

Blueprint for the investor dashboard shell only. Implementation agents must follow these names, regions, and responsive rules. No real portfolio API yet. Placeholder content is OK in later UI steps.

## Sources

- `docs/preishare-dashboard-requirements.md`
- `docs/dashboard-routing-plan.md`

The requirements brief says this sprint is layout plus placeholder content labeled as mock. The routing plan puts the shell in `src/routes/dashboard/route.tsx` and the home widgets in `src/routes/dashboard/index.tsx`. Child paths (`/dashboard/portfolio`, `/dashboard/deals`, `/dashboard/profile`) render in the same shell. They do not replace the homepage and they do not get their own header or sidebar.

## Layout regions

| Region | Role | Typical components |
|--------|------|--------------------|
| Header | Top bar: product name, page title, user placeholder ("Mock member") | Header |
| Sidebar | Vertical nav on tablet and desktop. Labels: Home, Portfolio, Deals, Profile. The current URL looks selected. | Sidebar |
| Mobile nav | Drawer opened by a Menu button below 768px. Same four destinations as the sidebar. | MobileNav |
| Main | Scrollable page content for the active route (`#main-content`) | Route outlet plus the widgets for that page |

Diagram in words: the browser shows one frame. AppShell is that frame. Across the top is Header. Under the header, a row: Sidebar on the left when the screen is wide enough, and Main on the right. Main is the outlet. On `/dashboard`, Main shows the home widgets. On `/dashboard/profile`, Main shows only the profile page. Header and Sidebar stay. Below 768px, Sidebar is hidden and MobileNav covers it until the investor closes the menu. Main then uses the full width under the header.

AppShell is the frame that places Header, Sidebar or MobileNav, and Main together.

## Component inventory

### AppShell

- **Responsibility:** Outer dashboard frame. Arranges header, nav, and main.
- **Parent:** Dashboard layout route (`src/routes/dashboard/route.tsx`).
- **Children:** Header, Sidebar, MobileNav, and the main content slot.
- **Props (beginner):** `children` (the page content to show in main).

### Header

- **Responsibility:** Top bar with PREIshare branding, the current page title, and a simple user placeholder. Requirements §2 and §4: the investor should recognize the PREIshare area, and the account label is "Mock member" because nobody is signed in.
- **Parent:** AppShell.
- **Children:** none required. The Menu button for small screens may live here and tell AppShell to open MobileNav.
- **Props:** `title` (text, optional; default "PREIshare").

### Sidebar

- **Responsibility:** Tablet and desktop navigation links matching the routing plan.
- **Parent:** AppShell.
- **Children:** nav links (plain links are enough).
- **Props:** `items` (list of `{ label, to }` from the routing plan).

The four items are:

| label | to |
|-------|----|
| Home | `/dashboard` |
| Portfolio | `/dashboard/portfolio` |
| Deals | `/dashboard/deals` |
| Profile | `/dashboard/profile` |

### MobileNav

- **Responsibility:** Small-screen navigation. A menu button opens a panel or drawer with the same four destinations as Sidebar.
- **Parent:** AppShell.
- **Children:** the same destinations as Sidebar.
- **Props:** `items` (same shape as Sidebar). `open` and `onClose` (the open state lives in AppShell so the layout route owns it).

### MetricCard

- **Responsibility:** One reusable metric tile: a label, a value, and an optional hint. Requirements §4: the metrics region is cards for summary numbers on the home page, labeled as mock.
- **Parent:** Dashboard home, inside Main. The index route composes the cards. The layout route does not.
- **Children:** none.
- **Props:** `label` (text), `value` (text, or a number shown as text), `hint` (text, optional).

### PortfolioSummary

- **Responsibility:** Short summary block for the portfolio snapshot placeholder on the home page.
- **Parent:** Dashboard home, inside Main.
- **Children:** none required.
- **Props:** `headline` (text), `summaryLines` (list of text), `emptyMessage` (text when there is no data).

### RecentActivity

- **Responsibility:** List of recent activity placeholders. Requirements §4: this is a region on the home page, not its own URL.
- **Parent:** Dashboard home, inside Main.
- **Children:** none required.
- **Props:** `items` (list of `{ id, title, detail, timestamp }`), `emptyMessage` (text).

### Page content for later nav targets

These are not a second shell. Each one is the only thing Main shows for that URL. The routing plan marks them as later nav targets.

| Component | Route file | Responsibility | Props (beginner) |
|-----------|------------|----------------|------------------|
| Portfolio page content | `src/routes/dashboard/portfolio.tsx` | Holdings list: property name, place, and value. Show `emptyMessage` when the list is empty. | `rows` (list of `{ propertyName, place, value }`), `emptyMessage` (text) |
| Deals page content | `src/routes/dashboard/deals.tsx` | Listing rows: title, status, city, region, asking price in USD. A row may expand on this same page for a summary and a contact. | `deals` (list of those fields), `emptyMessage` (text) |
| Profile page content | `src/routes/dashboard/profile.tsx` | Read-only card: sample name and one contact channel. | `name` (text), `contact` (text) |

Deal status text may only be `draft`, `published`, `under_offer`, `sold`, or `archived` (requirements §5).

## Composition (dashboard home)

`src/routes/dashboard/index.tsx` composes Main. `src/routes/dashboard/route.tsx` does not.

1. A row or grid of MetricCard (three placeholders is enough: a sample portfolio value, a sample deal count, and one more sample figure).
2. PortfolioSummary.
3. RecentActivity.

Each widget must accept a clear empty message. Sample numbers are allowed when they are labeled as mock. Requirements §5: "Sample figures marked as mock so a stakeholder can see the data is not live."

`/dashboard/profile` (and Portfolio and Deals) pass their own page content as `children` into AppShell. The index widgets unmount. Header, Sidebar, and MobileNav stay.

## Responsive behavior

| Viewport | Approx width | Nav behavior | Main content |
|----------|--------------|--------------|--------------|
| Mobile | < 768px | Sidebar hidden. MobileNav opens from a Menu button. Same labels: Home, Portfolio, Deals, Profile. | Single column. Metric cards stack. |
| Tablet | 768px–1024px | Sidebar visible and narrower. It stays visible. It does not switch back to a drawer at tablet width. | Two-column card grid when space allows. |
| Desktop | > 1024px | Sidebar visible in the shell. | Metric cards in a multi-column grid. PortfolioSummary and RecentActivity sit side by side, with a max readable width. |

This matches requirements §4 and §5: sidebar on a wide screen, and below 768px the nav stays reachable through the menu.

Notes for implementers:

- The Menu button must be easy to tap. Give it a visible name such as "Menu", not a hover-only icon.
- Main content stays scrollable. The header does not cover the page.
- Do not rely on hover-only actions for anything required on mobile.
- The selected nav item follows the current URL on every width.

## File targets (for later steps — do not create them in this step)

- `src/components/dashboard/AppShell.tsx`
- `src/components/dashboard/Header.tsx`
- `src/components/dashboard/Sidebar.tsx`
- `src/components/dashboard/MobileNav.tsx`
- `src/components/dashboard/MetricCard.tsx`
- `src/components/dashboard/PortfolioSummary.tsx`
- `src/components/dashboard/RecentActivity.tsx`

The layout route that mounts AppShell is `src/routes/dashboard/route.tsx`. The home page that mounts MetricCard, PortfolioSummary, and RecentActivity is `src/routes/dashboard/index.tsx`.

## Out of scope (prevent scope creep)

- Real Supabase or PostgreSQL queries, balances, and pgvector search
- Authentication, roles, permissions UI, and a login or signup screen
- Payments, a documents vault, and tax exports
- Charts, map views, PDF export, and any chart that needs live time-series data
- Routes beyond the routing plan (no `/dashboard/activity`, no deal-detail URL, no trades page)
- A design-system package or animation-heavy UI
- Editing portfolio holdings, listing forms, and admin tools
- Fetching inside MetricCard, PortfolioSummary, or RecentActivity. The route passes props. The widget renders them.

## Success criteria for this blueprint

- Every named component has one clear responsibility.
- Props are listed in plain language.
- Mobile, tablet, and desktop nav behavior is explicit, with one tablet choice: sidebar visible from 768px up.
- The home widgets match requirements §3 and §4: metric cards, a portfolio summary, and recent activity on `/dashboard`.
- Portfolio, Deals, and Profile are page content inside the same AppShell, not extra shells.
- The out-of-scope section blocks live data, payments, and authentication.
