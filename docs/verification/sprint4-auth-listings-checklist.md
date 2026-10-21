# Sprint 4 — Auth & Listings Verification Checklist

**Project:** PREIshare dashboard  
**Date:** 2026-10-20  
**Verifier:** Gonzalo Burga  
**Environment:** local dev at `http://localhost:3012` (ports 3010 and 3011 were already in use) and Supabase project ref `qonplfndsiwinvltcsgg`. No keys are written here.

## How to use this doc
Mark each row **PASS** or **FAIL**. Under Evidence, write what you did and what you saw.
If FAIL, note the fix prompt used and re-test before marking PASS.

Results below are what was actually observed on 2026-10-20. A row stays **FAIL** when that check was not completed.

---

## 1. Database & migration

| # | Check | Result | Evidence |
|---|--------|--------|----------|
| 1.1 | `property_listings` (or agreed table name) exists in Supabase | PASS | Gonzalo opened the Supabase Table Editor for this project and reported a listings table with a "4 RLS policies" badge. The repo migration creates `public.property_listings`. This checklist pass did not re-open the Table Editor. |
| 1.2 | RLS is **enabled** on the listings table | PASS | Same Table Editor report: the badge listed four policies applied to `authenticated`. `supabase/migrations/20250321000000_property_listings.sql` contains `alter table public.property_listings enable row level security`. Not re-checked in the dashboard while writing this file. |
| 1.3 | Policies match `docs/data-model/rls-policy-review.md` (select/insert/update scoped to owner) | PASS | Gonzalo read the badge names as `listings_select_own`, `listings_insert_own`, `listings_update_own`, and `listings_delete_own`, role `authenticated`. The review doc and the migration both use those names with `owner_id = auth.uid()` (`WITH CHECK` on insert and update). No anon policy. |
| 1.4 | Migration file present: `supabase/migrations/20250321000000_property_listings.sql` | PASS | File is in the repo at that path and was read again on 2026-10-20. |

## 2. Authentication & session

| # | Check | Result | Evidence |
|---|--------|--------|----------|
| 2.1 | Sponsor can sign up with email/password | FAIL | The signup form at `/auth/signup` is on screen. A too-short password showed "Password should be at least 6 characters." A confirmation email from Supabase opened Grafana instead of the app. No User A email was left with a working session. No fix was applied in this pass. |
| 2.2 | Sponsor can log in via `src/routes/auth/login.tsx` | FAIL | `/auth/login` rendered email, password, and Log in. A fake sign-in showed "Invalid login credentials." A successful login into `/dashboard` was not observed. |
| 2.3 | Signed-out user hitting `/dashboard` (or listings) is redirected to login | PASS | With no session, `curl` to `http://localhost:3012/dashboard/listings` and `http://localhost:3012/dashboard/listings/new` returned `307` and `location: /auth/login`. The browser, opened on `http://localhost:3012/dashboard/listings`, finished on `http://localhost:3012/auth/login` with the Log in heading. Earlier the same day, signed-out visits to `/dashboard`, `/dashboard/deals`, `/dashboard/portfolio`, and `/dashboard/profile` also landed on `/auth/login`. |
| 2.4 | Sign-out clears session; protected pages no longer load data | FAIL | The dashboard header has a Sign out button wired to `signOutSponsor`. It was never clicked with a real session, so a cleared session was not observed. |

## 3. Listings happy path (User A)

| # | Check | Result | Evidence |
|---|--------|--------|----------|
| 3.1 | Create listing via UI (title, address/fields per schema) succeeds | FAIL | `/dashboard/listings/new` exists and calls `createListing` after `createListingSchema`. No signed-in session was available, so the form was not submitted and no listing id or title was created. |
| 3.2 | New row visible on `src/routes/dashboard/listings/index.tsx` | FAIL | The list route calls `listMyListings` and has an empty state. It was not opened while signed in, so no new row was seen. |
| 3.3 | Data matches Postgres (Supabase Table Editor), not mock arrays in the client | FAIL | The listings pages do not contain a mock listing array. No created row was compared with the Table Editor. |
| 3.4 | Server path used: create/read go through `src/server/listings.ts` (or documented server functions) | FAIL | Source review: the list page loader calls `listMyListings` and the create page calls `createListing`, both exported from `src/server/listings.ts`. No Network or server log of a real create/read was captured. |

## 4. Row Level Security (User B)

| # | Check | Result | Evidence |
|---|--------|--------|----------|
| 4.1 | Second account User B can sign up / log in | FAIL | A second account was not created. No User B email. |
| 4.2 | User B **cannot** see User A’s listings in the UI | FAIL | Not run. User A also has no observed listing. |
| 4.3 | Direct read as User B (UI empty list and/or Table Editor filtered by auth) shows no foreign rows | FAIL | Not run. |
| 4.4 | User B can create their own listing and only see their own | FAIL | Not run. |

## 5. Secret-hygiene audit

| # | Check | Result | Evidence |
|---|--------|--------|----------|
| 5.1 | `.env` with real values is **not** committed (`git status` / `git check-ignore`) | PASS | On 2026-10-20, `git check-ignore -v` reported `.gitignore:6` for `.env` and `.gitignore:7` for `.env.local`. `git status` was clean of env files. `git ls-files` lists `.env.example` only. |
| 5.2 | `.env.example` has placeholder values only (no live keys) | PASS | Read on 2026-10-20. Values are `https://your-project-ref.supabase.co`, `your-anon-or-publishable-key`, and `your-service-role-key`. |
| 5.3 | Repo search: no `service_role` key material in source, docs, or client bundle config | PASS | Search terms: `service_role`, `SERVICE_ROLE`, `sb_secret_`, and a long `eyJ` token pattern. Hits are the env variable name, the placeholder `your-service-role-key`, and docs that say to keep that variable server-only. `src/lib/supabase/server.ts` reads `process.env.SUPABASE_SERVICE_ROLE_KEY` inside `createServiceRoleSupabaseClient`. No live key string was found. One `eyJ` pattern hit was an npm integrity hash in `package-lock.json`, not a Supabase key. |
| 5.4 | Browser-exposed env only uses public anon/URL names (e.g. `VITE_` / `PUBLIC_` per project convention)—never service role | PASS | `src/lib/supabase/client.ts` reads only `import.meta.env.VITE_SUPABASE_URL` and `import.meta.env.VITE_SUPABASE_ANON_KEY`. That matches `docs/setup/supabase-env-checklist.md`. Listing routes and `ListingForm` / `ListingCard` do not import `server.ts` or read `SUPABASE_SERVICE_ROLE_KEY`. |
| 5.5 | Client bundle / Network tab does not send service-role header | FAIL | The Network tab was not inspected on a listings or auth request. Source review shows the listing UI calls server functions and does not import `createServiceRoleSupabaseClient`, but that is not a Network-tab observation. |

## 6. Gaps fixed this session

| Gap | Agent fix summary | Re-test result |
|-----|-------------------|----------------|
| None during this verification pass | Signup confirmation still opens Grafana. Sign-in, sign-out, create, and User B were not re-tested because no working session was available. | FAIL |

## 7. Sign-off

- [ ] Client story covered: sponsors can log in; listings load from Postgres under RLS; secrets kept out of the client bundle
- [ ] All critical rows above are PASS (or FAIL accepted with written follow-up)
- [x] No real secrets written into this markdown file

**Overall:** FAIL

**Notes for handoff (Step 12):**

- Turn off Supabase email confirmation, or point the Site URL and redirect allow list at `http://localhost:3000/**` instead of Grafana, then sign up User A again and log in through `/auth/login`.
- From `/dashboard/listings/new`, create one listing and confirm it shows on `/dashboard/listings` and as a row in the Table Editor for that user.
- Sign out and confirm `/dashboard/listings` returns to `/auth/login`.
- Repeat with User B: empty list before their own create, then only their own row.
- On a signed-in listings request, check the Network tab for an `apikey` or `Authorization` value and confirm it is not the service-role key.
