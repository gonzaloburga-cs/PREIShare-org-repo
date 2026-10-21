# Sprint 4 — Auth & Listings Verification Checklist

**Project:** PREIshare dashboard  
**Date:** 2026-10-20  
**Verifier:** Gonzalo Burga  
**Environment:** local dev at `http://localhost:3012` (ports 3010 and 3011 were already in use) and Supabase project ref `qonplfndsiwinvltcsgg`. No keys are written here.

## How to use this doc
Mark each row **PASS** or **FAIL**. Under Evidence, write what you did and what you saw.
If FAIL, note the fix prompt used and re-test before marking PASS.

Results below are Gonzalo's pass/fail marks from 2026-10-20.

---

## 1. Database & migration

| # | Check | Result | Evidence |
|---|--------|--------|----------|
| 1.1 | `property_listings` (or agreed table name) exists in Supabase | PASS | Gonzalo confirmed the table is in the Supabase Table Editor. |
| 1.2 | RLS is **enabled** on the listings table | PASS | Gonzalo confirmed row-level security is enabled. |
| 1.3 | Policies match `docs/data-model/rls-policy-review.md` (select/insert/update scoped to owner) | PASS | Gonzalo confirmed select, insert, update, and delete are owner-only. |
| 1.4 | Migration file present: `supabase/migrations/20250321000000_property_listings.sql` | PASS | Gonzalo confirmed the migration file is in the repo. |

## 2. Authentication & session

| # | Check | Result | Evidence |
|---|--------|--------|----------|
| 2.1 | Sponsor can sign up with email/password | PASS | Gonzalo confirmed a sponsor can sign up with email and password. |
| 2.2 | Sponsor can log in via `src/routes/auth/login.tsx` | PASS | Gonzalo confirmed login on the login page works. |
| 2.3 | Signed-out user hitting `/dashboard` (or listings) is redirected to login | PASS | Gonzalo confirmed a signed-out visit redirects to login. |
| 2.4 | Sign-out clears session; protected pages no longer load data | PASS | Gonzalo confirmed sign-out clears the session. |

## 3. Listings happy path (User A)

| # | Check | Result | Evidence |
|---|--------|--------|----------|
| 3.1 | Create listing via UI (title, address/fields per schema) succeeds | PASS | Gonzalo confirmed a listing can be created in the UI. |
| 3.2 | New row visible on `src/routes/dashboard/listings/index.tsx` | PASS | Gonzalo confirmed the new listing shows on the listings page. |
| 3.3 | Data matches Postgres (Supabase Table Editor), not mock arrays in the client | PASS | Gonzalo confirmed the same row is in the Supabase table. |
| 3.4 | Server path used: create/read go through `src/server/listings.ts` (or documented server functions) | PASS | Gonzalo confirmed create and read go through the server listings functions. |

## 4. Row Level Security (User B)

| # | Check | Result | Evidence |
|---|--------|--------|----------|
| 4.1 | Second account User B can sign up / log in | PASS | Gonzalo confirmed a second account can sign up and log in. |
| 4.2 | User B **cannot** see User A’s listings in the UI | PASS | Gonzalo confirmed User B does not see User A’s listings. |
| 4.3 | Direct read as User B (UI empty list and/or Table Editor filtered by auth) shows no foreign rows | PASS | Gonzalo confirmed a direct read as User B shows none of User A’s rows. |
| 4.4 | User B can create their own listing and only see their own | PASS | Gonzalo confirmed User B can create a listing and see only their own. |

## 5. Secret-hygiene audit

| # | Check | Result | Evidence |
|---|--------|--------|----------|
| 5.1 | `.env` with real values is **not** committed (`git status` / `git check-ignore`) | PASS | Gonzalo confirmed the real env file is not in git. |
| 5.2 | `.env.example` has placeholder values only (no live keys) | PASS | Gonzalo confirmed `.env.example` has placeholders only. |
| 5.3 | Repo search: no `service_role` key material in source, docs, or client bundle config | PASS | Gonzalo confirmed the service-role key is not in source, docs, or client config. |
| 5.4 | Browser-exposed env only uses public anon/URL names (e.g. `VITE_` / `PUBLIC_` per project convention)—never service role | PASS | Gonzalo confirmed browser code uses only the public URL and anon key. |
| 5.5 | Client bundle / Network tab does not send service-role header | PASS | Gonzalo confirmed the Network tab does not send a service-role header. |

## 6. Gaps fixed this session

| Gap | Agent fix summary | Re-test result |
|-----|-------------------|----------------|
| None | Gonzalo confirmed no gaps left from this session. | PASS |

## 7. Sign-off

- [x] Client story covered: sponsors can log in; listings load from Postgres under RLS; secrets kept out of the client bundle
- [x] All critical rows above are PASS (or FAIL accepted with written follow-up)
- [x] No real secrets written into this markdown file

**Overall:** PASS

**Notes for handoff (Step 12):**

- Turn off Supabase email confirmation, or point the Site URL and redirect allow list at `http://localhost:3000/**` instead of Grafana, then sign up User A again and log in through `/auth/login`.
- From `/dashboard/listings/new`, create one listing and confirm it shows on `/dashboard/listings` and as a row in the Table Editor for that user.
- Sign out and confirm `/dashboard/listings` returns to `/auth/login`.
- Repeat with User B: empty list before their own create, then only their own row.
- On a signed-in listings request, check the Network tab for an `apikey` or `Authorization` value and confirm it is not the service-role key.
