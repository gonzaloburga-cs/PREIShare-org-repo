# Sprint 4 Topic 2 Handoff — PREIshare Sponsor Auth & Protected Listings

**Date:** 2026-10-22
**Branch:** `main` (security checks recorded against `b75ab54`)
**Audience:** the next learner and stakeholders reviewing sponsor sign-in and property isolation

Read the four source documents before changing auth, env names, or row-level security.

| Doc | Path | Purpose |
| --- | --- | --- |
| Requirements | `docs/sponsor-auth-requirements.md` | Who can see and change what |
| Data model and RLS | `docs/data-model-and-rls-matrix.md` | Tables, keys, and the policy matrix |
| Env checklist | `docs/env-var-checklist.md` | Public vs server-only variables |
| Security verification | `docs/security-verification-checklist.md` | What was tested, and the leftover risks |

---

## Client story outcomes

Sponsors sign in with email and password on `/login` and reach a dashboard that knows who they are. A visitor with no session who opens the dashboard, the property list, or the create form is sent to `/login`. A wrong password stays on the login page. Sign out sends `/dashboard` and `/dashboard/properties` back to `/login`.

After sign-in, the property list and the create form run as that sponsor. Postgres row-level security is what limits the rows. The list for `test@test.com` showed Harbor Check Cottage and Mi Casa, both owned by that account. A second sponsor's list did not include those two rows. Creating Harbor Check Cottage stored the row for the signed-in sponsor.

The browser may receive the public Supabase URL and the anon key. The service-role key is read only in server modules. Property pages do not import those helpers, so the secret key is not part of the browser bundle for this topic.

The verification checklist records every required row as `pass`. The stakeholder verdict there is **yes**. Leftover risks are listed below. They are not failed checks.

---

## Architecture decisions

**Auth.** Supabase Auth is the identity. Login, the dashboard guard, and sign-out go through server functions in `src/lib/auth/auth.functions.ts` (`signInSponsor`, `getSponsor`, `signOutSponsor`). The session is an HttpOnly cookie. `src/routes/dashboard.tsx` calls `getSponsor()` before the dashboard renders and redirects to `/login` when there is no user. The browser does not send the service-role key to do this.

**Data.** There is no `sponsors` table and no second `properties` table. A sponsor is an `auth.users` row. Listings live in `public.property_listings`. `owner_id` references `auth.users(id)` and is the column policies compare to `auth.uid()`. The migration also creates `public.profiles` (one row per auth user, `id` equal to that user) for display name. The running app does not insert profile rows yet. The create handler sets `owner_id` from the signed-in user. The form does not accept another sponsor's id.

**Row-level security.** Anonymous visitors have no policies on `profiles` or `property_listings`. A signed-in sponsor can select, insert, update, and delete a listing only when `owner_id = auth.uid()`. Insert and update include `WITH CHECK`. Profile delete has no policy. There is no `USING (true)` policy and no public "read every published listing" policy. The property list query does not add its own owner filter. It trusts those policies. The older listings loader in `src/server/listings.ts` still filters by `owner_id` as well.

**Clients.** `src/lib/supabase.client.ts` is the browser client. It reads `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` only. `src/lib/supabase.server.ts` is server-only. It can build a session client from the access cookie, and it is the only place in that file that reads `SUPABASE_SERVICE_ROLE_KEY`. A second server module, `src/lib/supabase/server.ts`, also reads that key inside `createServiceRoleSupabaseClient`. Login uses the anon server client in that older module. Sponsor list and create do not call either service-role helper.

**Env hygiene.** Names and placeholders live in `.env.example` and `docs/env-var-checklist.md`: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `SUPABASE_URL`, and `SUPABASE_SERVICE_ROLE_KEY`. Real values stay in gitignored `.env` or `.env.local`, or in the host's environment. The checklist search did not find a pasted key in tracked source.

---

## File map

| Path | Role |
| --- | --- |
| `src/lib/supabase.client.ts` | Browser client. Public URL and anon key only. |
| `src/lib/supabase.server.ts` | Server client for the property list and create. Service-role helper stays in this module. |
| `src/lib/supabase/server.ts` | Older server client used by login and the existing listings flow. Also defines a service-role helper. |
| `src/lib/auth/auth.functions.ts` | Sign in, sign up, current sponsor, sign out. Does not read the service-role key. |
| `src/routes/login.tsx` | Email and password form. Redirects to `/dashboard` when a session already exists. |
| `src/routes/dashboard.tsx` | Dashboard shell. Blocks visitors who are not signed in. Sign out returns to `/login`. |
| `src/routes/dashboard/properties.tsx` | Property list for the signed-in sponsor. Renders the create page when that child route is open. |
| `src/routes/dashboard/properties.new.tsx` | Create form. Inserts into `property_listings` with `owner_id` from the session. |
| `src/routes/dashboard/listings/index.tsx` | Existing listings page. Links to both **Add listing** and **Add property**. |
| `src/routes/dashboard/listings/new.tsx` | Fuller create form for the same table. |
| `supabase/migrations/20250321000000_property_listings.sql` | Original listings table and the four owner policies. |
| `supabase/migrations/20250321000000_sponsors_properties_rls.sql` | `profiles`, the listings table if it is missing, and the policies from the matrix. |

---

## Known limitations

The checklist has no `fail` or `not-run` rows. These leftovers are still open:

- The create error that was seen is "Title is required." A write that Postgres rejects under row-level security was not provoked, so that error text was not seen (checklist 4.3).
- Checklist 5.2 passed as a policy review. A second session was not used to update another sponsor's row directly.
- Service-role helpers exist in the two server modules. Sponsor pages do not call them. A deploy still has to keep `SUPABASE_SERVICE_ROLE_KEY` off the client. GitHub Actions secret injection is not set up in this topic.
- **Add listing** (`/dashboard/listings/new`) and **Add property** (`/dashboard/properties/new`) both insert into `property_listings`. The topic form saves title, address, city, price, and an optional description as a US draft. Region, postal code, country, and status stay on the fuller form. The empty-state copy "No properties yet" was not on screen for the account that was tested, because that account already had rows.
- `profiles` is in the migration. Signup does not collect `display_name` and does not insert a profile row. Email and password remain on `auth.users`.
- One sponsor per listing. No invites, no shared organization, no admin screen, no public read of published listings, no payments, and no uploads.
- There is no automated test that sponsor A cannot read sponsor B's rows. The proof is the manual checklist.

---

## Recommended next work

1. Extend listing fields and validation to the product set (region, postal code, country, status) without a second table.
2. Add a sponsor invite or role model if more than one person should manage one account. That needs a matrix update before a new policy.
3. Inject secrets in CI and check them at deploy time so production never reads a committed key. Keep `SUPABASE_SERVICE_ROLE_KEY` server-only.
4. Add an automated isolation test: sponsor A cannot read or update sponsor B's `property_listings` row.
5. Insert the `profiles` row on signup, with `id` equal to the new auth user, if the dashboard needs `display_name`.

---

## Handoff checklist for the next learner

- [ ] Read the four source docs above before changing auth or row-level security.
- [ ] Confirm the local env file uses the names in `.env.example`. Never commit real secret values.
- [ ] Re-run `docs/security-verification-checklist.md` after any policy or client change.
- [ ] Keep service-role usage inside the server modules. Do not import it from a route or a React component.
- [ ] Keep using `property_listings.owner_id` and `auth.uid()`. Do not add a `sponsors` table or a second properties table unless the matrix is updated first.
