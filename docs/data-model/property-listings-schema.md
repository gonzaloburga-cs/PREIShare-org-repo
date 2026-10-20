# Property Listings Data Model & Auth Boundaries

> Sprint 4 design doc for PREIshare. Source of truth for migrations and RLS.
> Inputs: `docs/requirements/sponsor-auth-and-listings-brief.md`,
> `docs/setup/supabase-env-checklist.md`
>
> This file describes the table. It does not contain `CREATE TABLE` SQL.
> SQL belongs in a later migration file.

## 1. Purpose

Sponsors sign in with email and password and manage **real** property listings stored in Postgres. A sponsor creates a listing and later sees only the rows they own. Logged-out visitors can reach login and signup, and they cannot see listing data.

No mock arrays stand in for these rows. The service-role key never ships to the browser. Reads and writes that need the signed-in user go through TanStack Start server loaders and server actions, as the brief requires.

## 2. Entity: `property_listings`

Fields for one sponsor-owned listing.

| Column | Type (Postgres) | Nullable | Notes |
|--------|-----------------|----------|-------|
| `id` | `uuid` | no | Primary key; default `gen_random_uuid()` |
| `owner_id` | `uuid` | no | Foreign key to `auth.users(id)`; the sponsor who owns the row |
| `title` | `text` | no | Short display name |
| `description` | `text` | yes | Longer listing copy |
| `address_line1` | `text` | no | Street address |
| `city` | `text` | no | |
| `region` | `text` | yes | State or province. The column name is `region`. |
| `postal_code` | `text` | yes | |
| `country` | `text` | no | Default `'US'`. The brief does not ask for other countries this sprint. |
| `price` | `numeric(12,2)` | no | Asking price in USD. Must be `>= 0`. |
| `status` | `text` | no | One of: `draft`, `published`, `archived`. Enforce with a check constraint. |
| `created_at` | `timestamptz` | no | Default `now()` |
| `updated_at` | `timestamptz` | no | Default `now()`; set again on every update |

`src/types/listing-status.ts` also spells `under_offer` and `sold` for the older mock investor fixtures. Those two values are not columns or allowed statuses on `property_listings` this sprint. The brief only requires a sponsor to create and read their own listings.

### Indexes (recommended)

- Primary key on `id`
- Index on `owner_id` so "my listings" does not scan the whole table
- Optional index on `status` if a dashboard often filters published versus draft

### Out of scope for this sprint

- Images and other media tables (the brief defers document uploads)
- Full-text search and pgvector embeddings
- Multi-sponsor shared ownership (the brief defers multi-tenant orgs)
- Payment fields

## 3. Ownership link to `auth.users`

- Every listing row must have `owner_id` set to the Supabase Auth user id (`auth.users.id`) of the sponsor who created it.
- `owner_id` references `auth.users(id)` with **`ON DELETE RESTRICT`**. The brief does not ask to delete sponsor accounts. Restrict keeps a removed auth user from silently deleting listing rows. A later sprint can switch to cascade or a soft-delete if account removal becomes a product feature.
- Server code sets `owner_id` from the signed-in session on insert. A client request must not be able to store a different sponsor's id in that column.

## 4. Proposed Row Level Security (RLS) — plain language

Enable RLS on `property_listings`. With RLS on and no matching policy, the command returns no rows and writes are rejected.

The brief says a sponsor only sees their own listings, and a logged-out visitor cannot see listing data. There is no policy that lets the anon role, or any other sponsor, read a published row.

| Policy name (suggested) | Command | Who | Rule |
|-------------------------|---------|-----|------|
| `listings_select_own` | SELECT | authenticated | The row's `owner_id` equals `auth.uid()` |
| `listings_insert_own` | INSERT | authenticated | The new row's `owner_id` must equal `auth.uid()` (`WITH CHECK`) |
| `listings_update_own` | UPDATE | authenticated | Both the existing row and the updated row have `owner_id` equal to `auth.uid()` (`USING` and `WITH CHECK`) |
| `listings_delete_own` | DELETE | authenticated | The row's `owner_id` equals `auth.uid()` |

Sprint success criteria require create and read. Update and delete policies are included so those commands stay limited to the owner. They do not grant a second sponsor access.

Notes:

- Anonymous (logged-out) users get no listing access in this sprint.
- Do not add a public "read all published listings" policy. The brief does not ask for one.
- The service-role key bypasses RLS. Use it only on the server for admin or maintenance tasks. Never import it into browser code. The checklist names that variable `SUPABASE_SERVICE_ROLE_KEY`, with no `VITE_` prefix.

## 5. Server vs browser operation map

| Operation | Runs where | Client type | Notes |
|-----------|------------|-------------|-------|
| Sign up / sign in / sign out | Browser calls Supabase Auth | Browser client with the anon/publishable key plus the user session | Email and password. No service-role key. |
| Session check for protected routes | Server loader or middleware | Server Supabase client carrying the user session (cookies) | Dashboard routes that show listings redirect when there is no session. |
| List my listings | Server loader | Server client acting as that user, so RLS applies | Returns only rows with `owner_id = auth.uid()`. Replaces the mock arrays on the dashboard. |
| Create listing | Server action | Server client acting as that user | Sets `owner_id` from the session. Validates required fields and `price >= 0` on the server. |
| Update / archive listing | Server action | Server client acting as that user | RLS blocks edits to another sponsor's row. Archiving sets `status` to `archived`. |
| Admin bulk jobs | Out of scope | Service-role, server only | Not part of this sprint. Never place `SUPABASE_SERVICE_ROLE_KEY` in a client bundle. |

### Environment boundary reminder

From `docs/setup/supabase-env-checklist.md`:

- **Public / browser-safe:** `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`. Vite can expose `VITE_` values to the client. They are safe only while RLS limits what the anon key can do.
- **Server-only:** `SUPABASE_SERVICE_ROLE_KEY`, and the optional unprefixed `SUPABASE_URL`. The service-role key bypasses RLS. Read it with `process.env` inside server code only.

## 6. Acceptance checks for the next (migration) step

- [ ] Table `property_listings` matches the column list above
- [ ] `owner_id` foreign key to `auth.users` with `ON DELETE RESTRICT`
- [ ] RLS enabled with own-row SELECT, INSERT, UPDATE, and DELETE policies
- [ ] No policy grants logged-out or cross-sponsor read access
- [ ] The migration file is the only place SQL is introduced

## 7. Decisions for the migration

These were open in the scaffold. The brief is enough to lock them for this sprint.

- **Country.** Default `'US'`. The brief does not describe multi-country listings.
- **Status storage.** `text` plus a check constraint limited to `draft`, `published`, and `archived`. A Postgres enum can wait until the allowed set is stable. `under_offer` and `sold` stay off this table.
- **Delete behavior.** Hard `DELETE` is allowed for the owning sponsor by the RLS policy above. A `deleted_at` soft-delete column is deferred. Auth-user removal uses `ON DELETE RESTRICT`, not cascade.
