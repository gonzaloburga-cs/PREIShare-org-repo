# PREIshare — Data model and RLS policy matrix

## Purpose

Design-only blueprint for sponsor auth and property listings.
Step 6 migrations must follow this document; do not invent extra tables or open policies without updating this file first.

The listings table already in the repo is `public.property_listings`. This document calls that table **properties**. Step 6 keeps that table. It does not create a second `properties` table.

## Source requirements

Consumed from: `docs/sponsor-auth-requirements.md`

Related design already in the repo: `docs/data-model/property-listings-schema.md`.

## Actors and identities

| Actor | How identity is established | Notes |
| --- | --- | --- |
| Anonymous visitor | No Supabase session | Cannot read or write profiles or properties |
| Sponsor (authenticated) | Supabase Auth user; `auth.uid()` is their user id | May manage only rows they own |
| Service role / server admin tasks | Secret service-role key on the server only | Bypasses row-level security. Browser code never uses it. This matrix has no policy for that key. |

## Tables

### `profiles` (sponsor linkage)

Links a Supabase Auth user to sponsor display data. One row per sponsor. `id` is the same uuid as `auth.users.id`.

| Column | Type (intent) | Required | Notes |
| --- | --- | --- | --- |
| `id` | uuid (PK, = `auth.users.id`) | yes | Same value as `auth.uid()` after signup or login. Foreign key to `auth.users(id)`. |
| `display_name` | text | yes | Shown in the dashboard. The signup path must set it. |
| `created_at` | timestamptz | yes | Default `now()` |
| `updated_at` | timestamptz | yes | Default `now()`, set again on update |

Email and password stay on `auth.users`. This table does not copy them.

### `properties` (listings owned by a sponsor)

Postgres name: `public.property_listings`.

| Column | Type (intent) | Required | Notes |
| --- | --- | --- | --- |
| `id` | uuid (PK) | yes | Default `gen_random_uuid()` |
| `owner_id` | uuid (FK → `auth.users.id`) | yes | **RLS hinge column.** Same uuid as `profiles.id` and `auth.uid()` for the owner. `ON DELETE RESTRICT`. |
| `title` | text | yes | Listing title |
| `description` | text | no | Longer copy |
| `address_line1` | text | yes | Street address |
| `city` | text | yes | |
| `region` | text | no | State or province |
| `postal_code` | text | no | |
| `country` | text | yes | Default `'US'` |
| `price` | numeric(12,2) | yes | Must be `>= 0` |
| `status` | text | yes | `draft`, `published`, or `archived`. Default `draft`. |
| `created_at` | timestamptz | yes | Default `now()` |
| `updated_at` | timestamptz | yes | Default `now()`, set again on update |

The app sets `owner_id` from the signed-in session. The browser does not choose another sponsor's id.

## RLS posture

- Enable RLS on `profiles` and `property_listings` before relying on the API.
- Anonymous visitors cannot read either table. There is no policy for the `anon` role.
- A signed-in sponsor can touch only the row whose id or `owner_id` equals `auth.uid()`.
- No `USING (true)` policy on either table.
- Browser clients use the anon or authenticated key only.

With RLS on and no matching policy, a read returns no rows and a write is rejected.

## RLS policy matrix

Each row is one later Postgres policy, or an explicit choice to add no policy. No row grants every logged-in user access to every property.

| Table | Operation (SELECT/INSERT/UPDATE/DELETE) | Who | Rule in plain English | Notes |
| --- | --- | --- | --- | --- |
| `profiles` | SELECT | Authenticated sponsor | Can read only the profile whose `id` is their user id | `USING (id = auth.uid())` |
| `profiles` | INSERT | Authenticated sponsor | Can insert a profile only when `id` is their user id | `WITH CHECK (id = auth.uid())` |
| `profiles` | UPDATE | Authenticated sponsor | Can update only their profile, and cannot change `id` to someone else | `USING (id = auth.uid())` and `WITH CHECK (id = auth.uid())` |
| `profiles` | DELETE | Authenticated sponsor | Cannot delete a profile in this sprint | No DELETE policy |
| `profiles` | SELECT | Anonymous visitor | Cannot read any profile | No policy for `anon` |
| `profiles` | INSERT | Anonymous visitor | Cannot create a profile | No policy for `anon` |
| `profiles` | UPDATE | Anonymous visitor | Cannot change a profile | No policy for `anon` |
| `profiles` | DELETE | Anonymous visitor | Cannot delete a profile | No policy for `anon` |
| `property_listings` | SELECT | Authenticated sponsor | Can read only properties they own | `USING (owner_id = auth.uid())`. Policy name already in the repo: `listings_select_own` |
| `property_listings` | INSERT | Authenticated sponsor | Can insert a property only when `owner_id` is their user id | `WITH CHECK (owner_id = auth.uid())`. Policy name: `listings_insert_own` |
| `property_listings` | UPDATE | Authenticated sponsor | Can update only owned rows, and cannot set `owner_id` to someone else | `USING (owner_id = auth.uid())` and `WITH CHECK (owner_id = auth.uid())`. Policy name: `listings_update_own` |
| `property_listings` | DELETE | Authenticated sponsor | Can delete only properties they own | `USING (owner_id = auth.uid())`. Policy name: `listings_delete_own` |
| `property_listings` | SELECT | Anonymous visitor | Cannot read any property | No policy for `anon` |
| `property_listings` | INSERT | Anonymous visitor | Cannot create a property | No policy for `anon` |
| `property_listings` | UPDATE | Anonymous visitor | Cannot change a property | No policy for `anon` |
| `property_listings` | DELETE | Anonymous visitor | Cannot delete a property | No policy for `anon` |

## Requirement → design mapping

| Requirement (from sponsor-auth-requirements) | Satisfied by |
| --- | --- |
| Sponsors must sign in before managing listings | A session is required. Anonymous SELECT on `property_listings` has no policy. |
| A sponsor sees only their properties | `property_listings` SELECT: `owner_id = auth.uid()` |
| A sponsor can create a listing they own | INSERT `WITH CHECK (owner_id = auth.uid())`. The server sets `owner_id` from the session. |
| A visitor who is not signed in cannot open listing data | Anonymous SELECT, INSERT, UPDATE, and DELETE on both tables have no policy |
| Secrets stay off the client | The matrix uses the authenticated role only. The service-role key stays in server environment variables. |
| Listing fields for the dashboard | `title`, `description`, `city`, `status`, and `created_at` on `property_listings`, plus the address and price columns already on that table |

## Out of scope this sprint

- A public read of published listings. That would need its own SELECT policy, added here before any migration.
- Several sponsors owning one property.
- An admin screen. The service-role key stays on the server and is not an RLS policy for sponsors.
- Sponsor DELETE on `profiles`.

## Open questions for review

- [x] DELETE vs archive. A sponsor may hard-delete their own `property_listings` row. Setting `status` to `archived` is an UPDATE of a row they still own.
- [x] Who creates `profiles`. The app inserts the profile on signup with `id` equal to the new auth user id. A database trigger is not required for this sprint. The INSERT policy still requires `id = auth.uid()`.

## Ready for Step 6 when

- [x] Every sponsor-facing action in the requirements maps to a matrix row.
- [x] `owner_id` exists on `property_listings` and is the column policies compare to `auth.uid()`.
- [x] No policy grants all authenticated users access to all properties.
