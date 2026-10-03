# PREIshare Investor Dashboard — Requirements Brief

## 1. Product context

PREIshare is where the team shares real-estate market information. An investor listing is one property opportunity: workflow status, address, asking price, and who to call. Investors need a clear home base where they can eventually see portfolio metrics, recent activity, and navigation into Portfolio, Deals, and Profile. This sprint delivers the shell only: layout plus placeholder content labeled as mock. It does not deliver live market data, account management, payments, or authentication flows.

## 2. Primary actor and goals

- **Actor:** Investor (member) viewing their dashboard. This sprint does not sign anyone in. The header shows a mock account placeholder ("Mock member").
- **Goals on first visit:**
  1. Recognize they are in the PREIshare investor area (branding and header).
  2. Navigate among Home, Portfolio, Deals, and Profile without getting lost.
  3. See high-level portfolio metrics at a glance (sample numbers, labeled as mock).
  4. Scan recent activity related to their investments (placeholder list, labeled as mock).

## 3. Primary screens (this sprint)

| Screen | Purpose | In this sprint? |
|--------|---------|-----------------|
| Dashboard home (`/dashboard`) | Shell, sample metric cards, portfolio summary, and recent-activity placeholders | Yes |
| Portfolio (`/dashboard/portfolio`) | Holdings table: property name, place, and value. Empty-state copy if the list is empty | Yes |
| Deals (`/dashboard/deals`) | Sample listing rows: title, status, city, region, asking price in USD. Details expand on this page | Yes |
| Profile (`/dashboard/profile`) | Read-only sample profile card (name and a contact channel) | Yes |
| Login / signup | Authentication | No (later) |
| Live portfolio detail / trades | Deep investment tools and live balances | No (later) |

`/` and `/about` are leftover starter pages. They are not investor screens. Deal detail is not its own URL.

## 4. Dashboard layout regions (must describe in UI work)

1. **Header** — product name and page title, plus a simple user/account placeholder ("Mock member").
2. **Navigation** — sidebar on desktop with Home, Portfolio, Deals, and Profile. On a narrow screen the sidebar collapses until a Menu button opens it. The current URL looks selected.
3. **Metrics region** — cards for summary numbers on the home page (placeholders, labeled as mock).
4. **Activity region** — list of recent items on the home page (placeholders, labeled as mock).
5. **Main content area** — where each page's content renders inside the shared shell (`#main-content`).

## 5. Must-have vs later

### Must-have (demoable shell)

- File-based routes under `/dashboard`: home, portfolio, deals, and profile.
- App shell composing header, navigation, and main content.
- Responsive behavior: usable on mobile, tablet, and desktop widths. Below 768px, navigation stays reachable through the menu.
- Placeholder metric cards and a recent-activity list on the home page.
- Empty-state messaging on Portfolio and Deals when the passed list is empty. Demo routes may still show sample rows.
- Clear navigation labels an investor would understand: Home, Portfolio, Deals, Profile.
- Sample figures marked as mock so a stakeholder can see the data is not live.
- Deal rows stay inside the existing listing words: `title`, `status`, city, `region`, and `financials.askingPrice` in `USD`. Status may only be `draft`, `published`, `under_offer`, `sold`, or `archived`.

### Later (explicitly out of scope now)

- Real Supabase queries, balances, or pgvector search
- Authentication, roles, and permissions UI
- Payments, documents vault, tax exports
- Polished design system beyond a clean functional layout
- Charts that require live time-series data
- Admin tools, listing edit forms, and a separate deal-detail page

## 6. Success criteria (how we know the shell is done)

- [ ] An investor can open `/dashboard` in the browser
- [ ] Header, navigation, metrics, and activity regions are all visible on desktop
- [ ] On a narrow (mobile) width, navigation remains usable (menu opens the sidebar)
- [ ] Placeholder content is clearly labeled so stakeholders know data is not live
- [ ] Home, Portfolio, Deals, and Profile each have their own URL and still show the shell after refresh
- [ ] Requirements in this brief match what was built (no surprise mega-features)
- [ ] A teammate can read this brief and understand scope in under 5 minutes

## 7. Notes for AI-assisted build

- Every implementation prompt should reference this file as scope control.
- Prefer small milestones: routes, then shell, then nav, then widgets, then compose, then responsive QA.
- Widgets render props. The route passes mock data. Do not put a database client or a fake API inside the cards.
- Reject agent output that adds out-of-scope fintech features without asking, including sign-in, live balances, payments, search, or a fifth investor route.
