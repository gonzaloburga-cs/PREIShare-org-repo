# Security verification checklist — PREIshare sponsor auth & properties

**Date:** 2026-10-22
**Verifier:** Gonzalo
**Build / branch:** `main` at `b75ab54`
**Related docs:** `docs/sponsor-auth-requirements.md`, `docs/env-var-checklist.md`, `docs/data-model-and-rls-matrix.md`

Status values: `pass` | `fail` | `not-run`

Local app: `http://localhost:3000`. The signed-in browser session for the UI checks was `test@test.com`.

---

## 1. Environment and secret hygiene

| # | Check | How you verified | Status | Notes |
| --- | --- | --- | --- | --- |
| 1.1 | Browser-safe client (`src/lib/supabase.client.ts`) uses only public URL + anon key | Opened the file. It reads `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` only. | pass | No service-role import and no `process.env` read. |
| 1.2 | Service-role / secret key used only in server module (`src/lib/supabase.server.ts`) or never used in this topic | Searched `src` for `SUPABASE_SERVICE_ROLE_KEY` and the service-role client functions. | pass | The key is read inside `src/lib/supabase.server.ts` and `src/lib/supabase/server.ts`. Both files are marked server-only. Routes and components do not import those functions. Property list and create use the anon session client. |
| 1.3 | No raw secrets committed in source or checklist | `git check-ignore` on `.env` and `.env.local`. Searched tracked files for key-like strings. | pass | Both env files match `.gitignore` (`.env*`). Tracked hits are the name `service_role` in docs and a package checksum, not a pasted key. |
| 1.4 | `.env.example` documents required vars without real values | Compared with `docs/env-var-checklist.md`. | pass | Placeholders only: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`. |

**Section result:** pass

---

## 2. Login and session-aware routing

| # | Check | How you verified | Status | Notes |
| --- | --- | --- | --- | --- |
| 2.1 | Unauthenticated visit to dashboard (or properties) redirects or blocks access | Opened `/dashboard`, `/dashboard/listings`, `/dashboard/properties`, and `/dashboard/properties/new` with no session. | pass | Each URL ended on `/login`. |
| 2.2 | Valid sponsor credentials reach an authenticated dashboard session | Signed in through `src/routes/login.tsx` with a valid sponsor password. | pass | Gonzalo confirmed the session reached the dashboard. |
| 2.3 | Invalid credentials do not grant dashboard access | Submitted a wrong password on `/login`. | pass | The page stayed on `/login` and showed "Invalid login credentials". |
| 2.4 | Logout clears session; protected routes no longer load data as that user | Signed out, then opened `/dashboard` and `/dashboard/properties`. | pass | Gonzalo confirmed both URLs returned to `/login`. |

**Section result:** pass

---

## 3. Property list isolation (RLS)

| # | Check | How you verified | Status | Notes |
| --- | --- | --- | --- | --- |
| 3.1 | Signed-in sponsor sees property list UI from `src/routes/dashboard/properties.tsx` | Opened `/dashboard/properties` as `test@test.com`. | pass | The heading "Your properties" rendered. |
| 3.2 | List shows only rows owned by the current sponsor (per `docs/data-model-and-rls-matrix.md`) | Compared the on-screen titles with `property_listings` owners. | pass | The page showed Harbor Check Cottage and Mi Casa. Both are owned by `test@test.com`. My Crib, Sprint 4 User B Cottage, and Sprint 4 Harbor House belong to other sponsors and were not on the page. |
| 3.3 | Empty state is safe (no error that leaks other tenants' data) | Observed the filtered list for this sponsor. | pass | This account already had rows, so the "No properties yet" message was not on screen. The list that did render did not include other sponsors' titles. |

**Section result:** pass

---

## 4. Property create under RLS

| # | Check | How you verified | Status | Notes |
| --- | --- | --- | --- | --- |
| 4.1 | Create form on `src/routes/dashboard/properties.new.tsx` requires an authenticated session | Opened `/dashboard/properties/new` logged out, then again as `test@test.com`. | pass | Logged out, the URL became `/login`. Signed in, the form rendered. |
| 4.2 | Successful create inserts a row owned by the current sponsor | Created Harbor Check Cottage from the listings **Add property** link. Confirmed the owner and that the listings page shows it. | pass | Address 100 Harbor Lane, city Salt Lake City, status draft. Owner matches `test@test.com`. The listings page showed that row. |
| 4.3 | Create failure (validation or RLS) does not expose secret keys or raw DB internals in the UI | Submitted a title made only of spaces, with the other fields filled. | pass | The form stayed on `/dashboard/properties/new` and showed "Title is required." This was a validation failure, not a live RLS denial. |

**Section result:** pass

---

## 5. Cross-sponsor access attempt

| # | Check | How you verified | Status | Notes |
| --- | --- | --- | --- | --- |
| 5.1 | Sponsor B cannot list Sponsor A's properties in the UI | Signed in as a second sponsor and compared the property list. | pass | Gonzalo confirmed the second sponsor did not see Harbor Check Cottage or Mi Casa. |
| 5.2 | Direct read/update of another sponsor's row is denied by RLS (UI and/or Supabase policy behavior) | Compared `docs/data-model-and-rls-matrix.md` with `supabase/migrations/20250321000000_sponsors_properties_rls.sql` and `supabase/migrations/20250321000000_property_listings.sql`. | pass | Select, insert, update, and delete policies on `property_listings` require `owner_id = auth.uid()`. A second session was not used to attempt an update. |

**Section result:** pass

---

## 6. Gaps found and fixes applied

| Gap (checklist #) | What was wrong | Fix applied (files) | Re-test status |
| --- | --- | --- | --- |
| 4.1 | **Add property** on the properties page changed the URL to `/dashboard/properties/new` and left the list on screen. The create route is a child of the properties page, and that page did not render the child. | `src/routes/dashboard/properties.tsx` renders the child route. `src/routes/dashboard/properties.new.tsx` refreshes the list after a successful save. | pass |

---

## 7. Residual risks (honest leftovers)

- The create failure on screen was "Title is required." A rejected RLS write was not provoked, so that error text was not seen.
- Check 5.2 is a policy review. A second session was not used to try updating another sponsor's row directly.
- Service-role helpers exist in the two server modules above. Sponsor pages do not call them. A deploy still has to keep `SUPABASE_SERVICE_ROLE_KEY` out of the browser.
- **Add listing** and **Add property** both insert into `property_listings`. They are two forms for the same table.

---

## 8. Stakeholder verdict

**Ready to show stakeholders?** yes

**Summary:**

File review shows the browser client reads only the public Supabase URL and anon key. The service-role key is read in server modules, and the property pages do not import those helpers. Logged-out visits to the dashboard, the property list, and the create form return to `/login`. A valid password on `/login` reaches the dashboard, a wrong password stays on the login page, and Sign out sends `/dashboard` and `/dashboard/properties` back to `/login`. Signed in as `test@test.com`, the property list showed Harbor Check Cottage and Mi Casa, both owned by that account. A second sponsor's list did not include those two rows. Creating Harbor Check Cottage saved that row for this sponsor, and a blank title showed "Title is required." instead of navigating away. A direct update of another sponsor's row was reviewed in the RLS policies and was not attempted in a second session.

**Sign-off:** Gonzalo, 2026-10-22
