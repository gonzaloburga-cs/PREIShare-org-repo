# Sprint 4 Handoff — Sponsor Auth & Postgres Property Listings

**Project:** PREIshare dashboard  
**Sprint:** 4 (Topic 1) — Supabase auth & database  
**Audience:** Sponsors and the next-sprint implementer  
**Status date:** 2026-10-20

## 1. Client story recap

From `docs/requirements/sponsor-auth-and-listings-brief.md`:

> PREIshare sponsors need a secure way to sign in to the dashboard and manage real property listings stored in PostgreSQL. Secret keys and privileged database access must stay on the server and never ship in the browser bundle.

That story is the whole of this sprint. Sponsors sign up and log in. Logged-out visitors reach login and signup only. Listings live in Postgres and a sponsor sees only the rows they own. The service-role key stays off the client.

## 2. Delivered vs original request

| Client need | Delivered? | Where / evidence |
| --- | --- | --- |
| Secure sponsor login | Yes | Goal 1 and success criteria "sign up and log in" and "logged-out users cannot open protected dashboard listing pages." `/auth/signup` and `/auth/login` are email/password. The dashboard layout sends a signed-out visit to `/auth/login`. Checklist rows 2.1–2.4 passed: User A `sprint4.user.a.3012@gmail.com` reached `/dashboard`, sign-out returned to `/auth/login`, and `/dashboard/listings` stayed on login. |
| Postgres-backed listings (create/read/display) | Yes | Goals 3 and 4: listings stored in Postgres, and a sponsor can create and read their own. Table `public.property_listings`. UI: `/dashboard/listings` (`listMyListings`) and `/dashboard/listings/new` (`createListing`) in `src/server/listings.ts`. Checklist 3.1–3.4 passed. User A created `Sprint 4 Harbor House` (Portland, draft). The list showed that card. The Table Editor showed that title and `Sprint 4 User B Cottage`. |
| Row-level security so sponsors only see allowed rows | Yes | Success criterion "a sponsor only sees their own listings." Migration `supabase/migrations/20250321000000_property_listings.sql` enables RLS. Policies `listings_select_own`, `listings_insert_own`, `listings_update_own`, and `listings_delete_own` use `owner_id = auth.uid()` for `authenticated`. Checklist 4.1–4.4 passed. User B `sprint4.user.b.3012@gmail.com` first saw "No properties yet" and did not see `Sprint 4 Harbor House`. After creating `Sprint 4 User B Cottage`, that list showed only the Cottage. |
| Secrets kept out of the client bundle | Yes | Goal 5 and the server-only boundary in the brief. `.env.example` has placeholders only. Browser client `src/lib/supabase/client.ts` reads `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. `SUPABASE_SERVICE_ROLE_KEY` is read with `process.env` inside `createServiceRoleSupabaseClient` in `src/lib/supabase/server.ts`. Checklist 5.1–5.5 passed. Create and list requests from the browser carried `accept`, `content-type`, and `x-tsr-serverfn`, and no header value contained `service_role` or `sb_secret`. |

Gaps, from `docs/verification/sprint4-auth-listings-checklist.md`: every numbered row and section 6 passed on 2026-10-20. The passing signup did not show an email-confirmation screen, so that setting was off for the recorded run. The investor home at `/dashboard` still shows the mock tiles from the brief (`$300,000`, `3`, `$24,000`). Those tiles are not listing rows. Listing create and list are the Postgres path. Grafana had been bound to port 3000; it was stopped, and `http://localhost:3000/dashboard/listings` then returned `307` to `/auth/login`. Starting Grafana again with `brew services start grafana` takes port 3000 back.

## 3. Architecture decisions (keep short)

- **Auth:** Supabase email/password, as goal 1 in the brief. `/auth/login` and `/auth/signup` call server actions. The dashboard layout checks the session and redirects to `/auth/login` when it is missing (checklist 2.3).
- **Data:** PostgreSQL `property_listings` as specified in `docs/data-model/property-listings-schema.md`. `owner_id` references `auth.users(id)` with `ON DELETE RESTRICT`. Country defaults to `US`. Price is `numeric(12,2)` and must be `>= 0`. Status is `draft`, `published`, or `archived`. `under_offer` and `sold` stay off this table.
- **Authorization:** RLS from that schema doc. The browser does not send the service-role key. Listing create sets `owner_id` from the signed-in session. There is no policy that lets a logged-out visitor or another sponsor read a row.
- **Clients:** `src/lib/supabase/server.ts` reads server-only secrets. `src/lib/supabase/client.ts` reads the public URL and anon key only. Listing pages call `src/server/listings.ts` and do not import the server client.
- **Env hygiene:** Public names are `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. Server-only names are `SUPABASE_SERVICE_ROLE_KEY` and optional `SUPABASE_URL`, with no `VITE_` prefix (`docs/setup/supabase-env-checklist.md`). Real values stay in gitignored `.env` or `.env.local`. `.env.example` is placeholders only.

## 4. How to run locally (sponsor-friendly)

1. Copy `.env.example` to `.env.local` (or `.env`) and fill the values from Supabase → Project Settings → API. Names and the public vs server-only split are in `docs/setup/supabase-env-checklist.md`. Do not commit that file.
2. If `public.property_listings` is not already in the project, run `supabase/migrations/20250321000000_property_listings.sql` once in the Supabase SQL editor. Confirm the Table Editor shows four RLS policies on `authenticated`.
3. From the repo root, run `npm install` if needed, then `npm run dev`. The app is `http://localhost:3000`. Port 3000 must be this app, not Grafana.
4. Sign up or log in at `/auth/signup` or `/auth/login`. Open `/dashboard/listings`, create one listing, and confirm the card appears after you return to the list. The same title should be a row in the `property_listings` Table Editor.

## 5. Known limitations

These match the brief's "out of scope" list and what the checklist actually exercised.

- No payment processing, document uploads, or image table.
- No social OAuth, password-reset screen, or branded email template. Signup in the passing run went straight to `/dashboard` with no confirmation screen.
- No custom domain and no multi-tenant organization. Isolation is one auth user per `owner_id`.
- No edit or delete page. Update and delete RLS policies exist so those commands stay owner-only. The verified UI is list and create. The card shows title, city, and status.
- No approval queue. A sponsor can set `draft`, `published`, or `archived` on create. Nothing submits a row to a second person for approval.
- No full-text search and no pgvector embeddings. The schema doc defers both.
- `/dashboard` home, portfolio, deals, and profile still use the scaffold copy and mock figures described in the brief. They are behind the same login gate. They are not `property_listings` rows.
- The Table Editor, opened as the project owner, shows every row. That screen bypasses RLS. The owner-only proof is User B's list, not the Table Editor badge.

No numbered checklist row was left FAIL. Section 6 re-tests passed.

## 6. Recommended next-sprint work (pick with stakeholders)

Each option keeps Supabase auth, `owner_id`, the four owner RLS policies, and the `VITE_` vs server-only env split. None of them replaces that boundary.

1. **Richer listing fields** — add columns on `property_listings` and extend `src/lib/listings/schema.ts` plus the create form. Add an edit screen that calls a server action still scoped with `.eq('owner_id', session user)`. Delete, if added, must use the existing `listings_delete_own` policy. Do not accept `owner_id` from the browser body.
2. **Approvals workflow** — keep `draft`, `published`, and `archived` as the owner's statuses. Add an explicit submit/approve/reject transition and a reviewer only if stakeholders want one. A reviewer policy must name that role. Do not open `USING (true)` or a public read of every draft. Owner RLS stays in place for the sponsor's own rows.
3. **pgvector search** — add an embedding column and a similarity query after create/read stay stable. Search runs through a server function with the sponsor session so RLS still limits rows to `owner_id = auth.uid()`. A public catalog of published listings would be a new policy, not a change to the anon key or the service-role split.

## 7. Open questions for stakeholders

- This sprint lets only the owning sponsor create and view listings. Should a later sprint add a reviewer who can read someone else's draft, or keep create and view on the owner alone?
- Owner isolation is already required and was verified with User A and User B. Should the next sprint add a public list of `published` rows, which this sprint deliberately does not have?
- Which next theme should be built on this base: richer fields, approvals, or pgvector search?

## 8. Source artifacts

- `docs/requirements/sponsor-auth-and-listings-brief.md`
- `docs/verification/sprint4-auth-listings-checklist.md`
- `docs/data-model/property-listings-schema.md`
- `docs/setup/supabase-env-checklist.md`
