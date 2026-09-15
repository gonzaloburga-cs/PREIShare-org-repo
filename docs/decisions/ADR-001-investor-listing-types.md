# ADR-001: Investor listing TypeScript types (PREIshare)

- **Status:** Accepted (Sprint 2, Topic 1)
- **Date:** 2026-09-15
- **Owners:** PREIshare types working group (learner + coach)
- **Related code:** `src/types/index.ts` (barrel export for the types package)

## Context

PREIshare is a place for the team to share real-estate market information. An **investor listing** is the record of a property opportunity: its workflow status, where it is, the asking price, who to call, and how people relate to the asset.

Before these types, listings could be passed around as loose objects. That made it easy to ship mistakes product partners care about: a missing price, a city that vanished on one screen, or the same workflow status spelled three different ways (`published`, `Published`, `live`). Investors and reviewers cannot trust a browse list if those fields are optional or free text.

Sprint 2 Topic 1 therefore models the listing as strict TypeScript types. Invalid shapes fail while we compile the project, not after someone opens the site.

Business inputs that drove the model:

- Domain brief: `docs/domain/investor-listing-domain-brief.md`
- Field inventory: `docs/domain/listing-field-inventory.md`
- Safety evidence: `docs/type-safety/expected-type-errors.md` and `docs/type-safety/verification-checklist.md`

What `src/types/index.ts` currently exports (this is the public types package): `Address`, `CurrencyCode`, `FinancialSummary`, `ContactRole`, `InvestorContact`, `InvestorListing`, `InvestorListingBase`, `NonEmptyContacts`, `NonEmptyOwnership`, `OpenInvestorListing`, `SoldInvestorListing`, `ListingStatus`, `Ownership`, `OwnershipRelationship`, and `PropertyType`.

## Decision

We adopt a small, explicit types package centered on `InvestorListing`, with supporting types for status, property type, address, financial summary, investor contacts, and ownership. Call sites should import from `src/types/index.ts` rather than reaching into individual files when possible.

A listing is one shared nested shape for every status. Drafts are not a second, looser type. What *does* change with status is how complete the contact and ownership lists must be, and whether a sold date is required.

## Type choices mapped to business rules

| Business rule (plain language) | Type choice | Why this shape |
| --- | --- | --- |
| Every listing has a stable id, title, timestamps, a property category, an address, and a money summary | Required fields on `InvestorListingBase` (not marked optional with `?`) | Optional core fields reintroduce the “missing price / missing city” class of bugs |
| The short investor-facing write-up is always present on the type | Required `summary` (string) on every listing | Gives screens a field to show; see Follow-ups for the brief’s `description` name |
| Listing workflow may only be a known set of values | `ListingStatus`: `draft`, `published`, `under_offer`, `sold`, `archived` | Free `string` allows typos and three spellings of the same status. Not `active`, `under_contract`, or `closed`. |
| Property category is a closed vocabulary | `PropertyType`: `multifamily`, `office`, `retail`, `industrial`, `mixed_use`, `land` | Same reason as status: closed set, so the compiler can flag an unknown category |
| Street, city, region, postal code, and country travel together | Nested `Address` (`line1` required; `line2` optional; `region`, not `state`) | Prevents half-present addresses and keeps location shape the same on every screen |
| Money is a structured summary, not one anonymous number or a phrase like “dollars” | Nested `FinancialSummary`: required `askingPrice` (a number) and `currency` (`USD` only for now); optional projected IRR and cap rate | Makes required money fields explicit and keeps totals grouped |
| Who to contact is structured people/firms, not a blob of text | `InvestorContact`: required `id`, `name`, and `role` (`broker` or `owner_rep`); **email or phone** (or both) | Stops “contact” from being a random string; each person has a reachable channel |
| Published-quality listings must have someone to reach | `published`, `under_offer`, and `sold` use `NonEmptyContacts` (at least one contact). `draft` and `archived` may use an empty list while editors work. | Matches the brief: investors never see a live listing with nobody to call |
| Ownership is a first-class list tied to contacts | `Ownership`: required `contactNameOrId` and `relationship` (`primary_owner`, `co_owner`, `broker`, `property_manager`); optional `sharePercent` | Captures how people relate to the asset without free-text labels like `owner` |
| Published-quality listings must have at least one ownership row | Same status split as contacts, using `NonEmptyOwnership` | A published listing without a relationship row would be incomplete for reviewers |
| One contact is marked as the primary person to reach | Required `primaryContactId` (a string) | Gives UI a default contact; TypeScript cannot prove that id exists in `contacts` (see Follow-ups) |
| A sold listing is a closed deal and must record when it sold; other statuses must not pretend they have a sold date | Discriminated union on `status`: `sold` requires `soldAt`; `draft`, `archived`, `published`, and `under_offer` must not carry a real `soldAt`. Helpers: `SoldInvestorListing` and `OpenInvestorListing`. | Lets TypeScript require the right fields for the right status |
| Identity and audit timestamps should not be casually overwritten in app code | `readonly` on `id`, `createdAt`, and `updatedAt` | Signals “do not reassign these after create” at the type level |

## Alternatives considered

1. **Keep listings as `string` / `any` / untyped JSON**  
   Rejected: fastest short term, but pushes every bug to runtime and production.

2. **One giant flat interface with dozens of optional fields**  
   Rejected: optional everything recreates missing-field bugs; a flat shape hides that address and financials are groups, not leftover strings.

3. **Enums (`enum`) for every closed vocabulary**  
   Deferred for this beginner package in favor of string union types, which stay simple to read in fixtures and error messages. Revisit only if runtime enum objects become a clear need.

4. **A runtime schema library (for example Zod) as the source of truth in this topic**  
   Out of scope for Topic 1. Compile-time types and fixtures come first; runtime validators can wrap the same decisions later.

## Consequences

**Positive**

- Invalid listings in `src/fixtures/invalid-listings.errors.ts` show the compiler rejecting five intentional mistakes, documented in `docs/type-safety/expected-type-errors.md`:
  - a status typo (`availble`) is not a member of `ListingStatus`
  - an address without `city` is missing a required field
  - an asking price written as the string `"610000"` is not a number
  - a `published` listing with `contacts: []` has too few contacts
  - a `published` listing with `ownership: []` has too few ownership rows
- Valid samples in `src/fixtures/sample-investor-listings.ts` prove realistic `published`, `draft`, `under_offer`, and `sold` listings can be constructed (the sold sample includes `soldAt`).
- `npm run typecheck` runs `tsc --noEmit` and is the shared gate before merge. The invalid-fixtures file is excluded in `tsconfig.json` on purpose so that gate can succeed; those objects are supposed to fail the checker.

**Tradeoffs**

- Authors must use the exact allowed words; “almost right” status or property-type strings fail typecheck by design.
- Nested objects mean fixtures and future API mappers must supply whole `Address` and `FinancialSummary` objects, not scattered fields.
- Status-specific rules (non-empty lists, required `soldAt`) add a small learning curve in exchange for stronger guarantees.
- The compiler still cannot catch empty `id` / `title` strings, a `primaryContactId` that does not match any contact, or timestamps that are not real ISO dates. Those remain product/runtime rules.

## Out of scope for Sprint 2 Topic 1

- Database tables, migrations, or Supabase row types
- HTTP API routes and request/response validation at runtime
- React form components and client-side validation UX
- Authentication, authorization, and multi-tenant rules
- pgvector / search indexing fields beyond what the current listing model already includes
- Changing production data or deploying a service
- Extra top-level groups (documents, photos, payments) that the domain brief does not list

## Follow-ups (for the next topic / implementers)

1. Import domain types from `src/types/index.ts` when building UI or API layers.
2. Keep fixtures green under `npm run typecheck` before expanding the model.
3. If product adds a new listing status or property type, extend the **union** and update fixtures + this ADR—do not widen the field back to free `string`.
4. Consider runtime validators that mirror these types once API boundaries land.
5. Use `docs/type-safety/verification-checklist.md` as the acceptance gate when types change.
6. **Docs vs types (types win; do not silently rewrite history):**
   - The brief and field inventory call the prose field `description`. The types use `summary`, and it is required on every status, including `draft`. The inventory only required that prose for `published`, `under_offer`, and `sold`.
   - The brief says a `draft` may omit published-level fields. The types still require a full `address`, `financials`, `title`, and `summary` on drafts; only `contacts` and `ownership` may be empty.
   - `primaryContactId` and `contacts[].id` exist on the types and are not named in the field inventory.
   - `soldAt` is required on `sold` listings in the types (and named on the verification checklist). The domain brief and field inventory do not mention it. The expected-type-errors table also has **no** invalid fixture for a missing or extra `soldAt`.
   - The domain brief’s ownership list is `primary_owner`, `co_owner`, `broker`. The field inventory and the types also allow `property_manager`. Align the brief with the inventory, or drop the extra value—do not leave two stories in the docs.
7. If we want compile-time proof of the `soldAt` rule, add an invalid fixture and a row in `docs/type-safety/expected-type-errors.md` rather than only documenting it on the checklist.

## Evidence links

- Domain brief: `docs/domain/investor-listing-domain-brief.md`
- Field inventory: `docs/domain/listing-field-inventory.md`
- Expected compile errors: `docs/type-safety/expected-type-errors.md`
- Verification checklist: `docs/type-safety/verification-checklist.md`
- Types entrypoint: `src/types/index.ts`
- Listing type (discriminated union, `readonly` ids/timestamps): `src/types/investor-listing.ts`
- Valid fixtures: `src/fixtures/sample-investor-listings.ts`
- Intentional invalid fixtures: `src/fixtures/invalid-listings.errors.ts`