# RLS policy review — property_listings

Reviewed against `docs/data-model/property-listings-schema.md`.

## Migration file

- Path: `supabase/migrations/20250321000000_property_listings.sql`
- What it creates: table `public.property_listings`, indexes on `owner_id` and `status`, an `updated_at` trigger, RLS, and four owner-only policies.
- Run this file once. A second run fails on `create policy` because those statements are not guarded with "if not exists".

## How to apply

1. Open Supabase Dashboard → SQL → New query.
2. Paste the full migration contents.
3. Run and confirm success.
4. Table Editor → `property_listings` → confirm RLS is enabled.

The SQL editor runs with a role that bypasses RLS, so a successful run does not prove the policies. Proof is an authenticated request where `auth.uid()` is the sponsor's id.

## Policies (plain language)

No policy uses `USING (true)`. No policy is granted to `anon` or `public`. A logged-out request has no matching policy, so it cannot read or write listings.

| Policy | Operation | Who | Rule |
|--------|-----------|-----|------|
| `listings_select_own` | SELECT | authenticated | `USING (owner_id = auth.uid())`. A sponsor's query returns only their rows. |
| `listings_insert_own` | INSERT | authenticated | `WITH CHECK (owner_id = auth.uid())`. The inserted `owner_id` must be the signed-in sponsor. There is no `USING` clause on INSERT. |
| `listings_update_own` | UPDATE | authenticated | `USING` and `WITH CHECK` both require `owner_id = auth.uid()`. The sponsor can edit their row and cannot change `owner_id` to someone else. |
| `listings_delete_own` | DELETE | authenticated | `USING (owner_id = auth.uid())`. A sponsor can hard-delete only their own row. |

`anon` also has no table privileges: the migration revokes `public` and `anon`, then grants `SELECT`, `INSERT`, `UPDATE`, and `DELETE` to `authenticated` only. RLS still applies to that role.

## Alignment with design doc

- Columns match `property-listings-schema.md`: yes. `owner_id` references `auth.users(id)` with `ON DELETE RESTRICT`. Address uses `region`, not `state`. `price` is `numeric(12,2)`, not null, and must be `>= 0`. `country` is not null and defaults to `'US'`. `address_line1` and `city` are not null. `status` is text constrained to `draft`, `published`, or `archived`.
- Extra behavior that the design doc asked for in words: `status` defaults to `draft`, and a `BEFORE UPDATE` trigger sets `updated_at` to `now()`.
- Missing policies: none. SELECT, INSERT, UPDATE, and DELETE each have one owner-only policy.
- Overly open grants: none. No `USING (true)`, no policy for `anon`, and no "read all published listings" policy.

## Risks and open questions

- Other sponsors cannot read a `published` row. The design doc defers a public or cross-sponsor read until a later brief asks for it.
- `SUPABASE_SERVICE_ROLE_KEY` bypasses RLS. Keep it server-only, with no `VITE_` prefix, as `docs/setup/supabase-env-checklist.md` says.
- `ON DELETE RESTRICT` means deleting an auth user fails while that user still owns listings. That is the design doc's choice. Do not switch it to cascade in the dashboard without a new migration.
- `under_offer` and `sold` are rejected by the status check. They remain on the older mock listing type only.

## Sign-off

- Reviewed by: Gonzalo
- Date: 2026-10-20
