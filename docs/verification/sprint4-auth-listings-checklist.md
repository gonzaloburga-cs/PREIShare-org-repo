# Sprint 4 — Auth & Listings Verification Checklist

**Project:** PREIshare dashboard  
**Date:** 2026-10-20  
**Verifier:** Gonzalo Burga  
**Environment:** Supabase project ref `qonplfndsiwinvltcsgg`. After Grafana was stopped, this app served `http://localhost:3000`. No keys or passwords are written here.

## How to use this doc
Mark each row **PASS** or **FAIL**. Under Evidence, write what you did and what you saw.
If FAIL, note the fix prompt used and re-test before marking PASS.

---

## 1. Database & migration

| # | Check | Result | Evidence |
|---|--------|--------|----------|
| 1.1 | `property_listings` (or agreed table name) exists in Supabase | PASS | In the Supabase Table Editor, the listings table showed a "4 RLS policies" badge. The migration creates `public.property_listings`. |
| 1.2 | RLS is **enabled** on the listings table | PASS | That same badge is the Table Editor RLS control. The migration contains `alter table public.property_listings enable row level security`. |
| 1.3 | Policies match `docs/data-model/rls-policy-review.md` (select/insert/update scoped to owner) | PASS | The badge listed `listings_select_own`, `listings_insert_own`, `listings_update_own`, and `listings_delete_own`, all on `authenticated`. The review doc and the migration use those names with `owner_id = auth.uid()`. |
| 1.4 | Migration file present: `supabase/migrations/20250321000000_property_listings.sql` | PASS | Opened that path in the repo on 2026-10-20. It is the `property_listings` migration. |

## 2. Authentication & session

| # | Check | Result | Evidence |
|---|--------|--------|----------|
| 2.1 | Sponsor can sign up with email/password | PASS | Signed up User A as `sprint4.user.a.3012@gmail.com` at `http://localhost:3012/auth/signup`. The page left signup and finished at `http://localhost:3012/dashboard` with heading "Investor dashboard". No confirmation screen appeared. |
| 2.2 | Sponsor can log in via `src/routes/auth/login.tsx` | PASS | After sign-out, logged in again as `sprint4.user.a.3012@gmail.com` at `http://localhost:3012/auth/login`. The page finished at `http://localhost:3012/dashboard` with heading "Investor dashboard". |
| 2.3 | Signed-out user hitting `/dashboard` (or listings) is redirected to login | PASS | After sign-out, opening `http://localhost:3012/dashboard/listings` finished at `http://localhost:3012/auth/login` with heading "Log in". After Grafana was stopped and this app was restarted, `curl` to `http://localhost:3000/dashboard/listings` and `http://localhost:3000/dashboard/listings/new` returned `307` and `location: /auth/login`. |
| 2.4 | Sign-out clears session; protected pages no longer load data | PASS | Clicked Sign out on `http://localhost:3012/dashboard`. The button changed to "Signing out…", then the URL became `http://localhost:3012/auth/login`. A following visit to `/dashboard/listings` stayed on the login page. |

## 3. Listings happy path (User A)

| # | Check | Result | Evidence |
|---|--------|--------|----------|
| 3.1 | Create listing via UI (title, address/fields per schema) succeeds | PASS | While signed in as User A, submitted `/dashboard/listings/new` with title `Sprint 4 Harbor House`, address `100 Market Street`, city `Portland`, region `OR`, postal code `97201`, country `US`, price `250000`, status `draft`. The button showed "Saving…", then the browser went to `http://localhost:3012/dashboard/listings`. A listing id was not shown on the page. |
| 3.2 | New row visible on `src/routes/dashboard/listings/index.tsx` | PASS | That listings page showed one card: "Sprint 4 Harbor House", "Portland", "Status: draft". |
| 3.3 | Data matches Postgres (Supabase Table Editor), not mock arrays in the client | PASS | In the Supabase Table Editor for `property_listings`, both created titles were visible: `Sprint 4 Harbor House` and `Sprint 4 User B Cottage`. The listings page does not use a mock listing array. |
| 3.4 | Server path used: create/read go through `src/server/listings.ts` (or documented server functions) | PASS | The browser create request was `POST` status 200 to `/_serverFn/` for `createListing` in `/src/server/listings.ts`. The following list request was status 200 to `/_serverFn/` for `listMyListings` in the same file. |

## 4. Row Level Security (User B)

| # | Check | Result | Evidence |
|---|--------|--------|----------|
| 4.1 | Second account User B can sign up / log in | PASS | Signed up User B as `sprint4.user.b.3012@gmail.com` at `http://localhost:3012/auth/signup`. The page finished at `http://localhost:3012/dashboard` with heading "Investor dashboard". |
| 4.2 | User B **cannot** see User A’s listings in the UI | PASS | Signed in as User B, `http://localhost:3012/dashboard/listings` showed "No properties yet. Add your first listing to get started." The page did not show `Sprint 4 Harbor House`. |
| 4.3 | Direct read as User B (UI empty list and/or Table Editor filtered by auth) shows no foreign rows | PASS | That same User B list request rendered the empty state above. No foreign title was on the page. The Table Editor was not opened. |
| 4.4 | User B can create their own listing and only see their own | PASS | User B created title `Sprint 4 User B Cottage`, address `20 Oak Street`, city `Salem`, price `180000`, status `draft`. The list then showed only "Sprint 4 User B Cottage", "Salem", "Status: draft". `Sprint 4 Harbor House` was not on that page. |

## 5. Secret-hygiene audit

| # | Check | Result | Evidence |
|---|--------|--------|----------|
| 5.1 | `.env` with real values is **not** committed (`git status` / `git check-ignore`) | PASS | `git check-ignore -v` reported `.gitignore:6` for `.env` and `.gitignore:7` for `.env.local`. `git ls-files` lists `.env.example` only. |
| 5.2 | `.env.example` has placeholder values only (no live keys) | PASS | The file contains `https://your-project-ref.supabase.co`, `your-anon-or-publishable-key`, and `your-service-role-key`. |
| 5.3 | Repo search: no `service_role` key material in source, docs, or client bundle config | PASS | Search `service_role` / `SERVICE_ROLE`: 15 hits in 6 files (`.env.example` 1, `docs/setup/supabase-env-checklist.md` 5, `docs/data-model/property-listings-schema.md` 3, `docs/data-model/rls-policy-review.md` 1, `src/lib/auth/auth.functions.ts` 1, `src/lib/supabase/server.ts` 4). Search `sb_secret_`: 0 hits. Hits are the variable name and the example placeholder. `server.ts` reads `process.env.SUPABASE_SERVICE_ROLE_KEY` inside `createServiceRoleSupabaseClient`. |
| 5.4 | Browser-exposed env only uses public anon/URL names (e.g. `VITE_` / `PUBLIC_` per project convention)—never service role | PASS | `src/lib/supabase/client.ts` reads `import.meta.env.VITE_SUPABASE_URL` and `import.meta.env.VITE_SUPABASE_ANON_KEY` only. Listing pages do not import `src/lib/supabase/server.ts`. |
| 5.5 | Client bundle / Network tab does not send service-role header | PASS | On User A's create and list calls, the browser request headers were `accept`, `content-type`, and `x-tsr-serverfn`. No header value contained `service_role` or `sb_secret`. Header values were not copied into this file. |

## 6. Gaps fixed this session

| Gap | Agent fix summary | Re-test result |
|-----|-------------------|----------------|
| Signup, login, sign-out, and the two-user listing flow had not been observed | Re-ran them on `http://localhost:3012` as User A `sprint4.user.a.3012@gmail.com` and User B `sprint4.user.b.3012@gmail.com`. | PASS |
| Table Editor was not compared to the new rows | Gonzalo opened the Table Editor and saw both `Sprint 4 Harbor House` and `Sprint 4 User B Cottage`. | PASS |
| Documented port 3000 was Grafana | Stopped the Homebrew Grafana service (`brew services stop grafana`) and started `npm run dev`. `http://localhost:3000/dashboard/listings` then returned `307` to `/auth/login`. | PASS |

## 7. Sign-off

- [x] Client story covered: sponsors can log in; listings load from Postgres under RLS; secrets kept out of the client bundle
- [x] All critical rows above are PASS (or FAIL accepted with written follow-up)
- [x] No real secrets written into this markdown file

**Overall:** PASS

**Notes for handoff (Step 12):**

- Numbered rows and section 6 are PASS. User A listing title: `Sprint 4 Harbor House`. User B listing title: `Sprint 4 User B Cottage`. Both titles were visible in the Table Editor, and User B's list did not include User A's title.
- Grafana was stopped so this app can use port 3000. Starting Grafana again with `brew services start grafana` will take port 3000 back.
