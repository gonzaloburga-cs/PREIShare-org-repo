# Sprint 2 Topic 1 — Types Handoff: PREIshare Investor Listings

**Audience:** next sprint topic owners, PREIshare eng, product partners  
**Status:** Topic 1 (TypeScript foundations) complete — implementation topics not started  
**Date:** 2026-09-15

Read this with [ADR-001](../decisions/ADR-001-investor-listing-types.md). If a field name or status in a later PR does not appear in the box below, it is wrong until product files a new ADR.

## Closed vocabularies (copy these — do not invent)

From `src/types/listing-status.ts` and `src/types/property-type.ts`:

- **Listing status:** `draft` | `published` | `under_offer` | `sold` | `archived`  
  Not `active`, `live`, `under_contract`, `UNDER_OFFER`, `closed`, or any other spelling.
- **Property type:** `multifamily` | `office` | `retail` | `industrial` | `mixed_use` | `land`
- **Currency:** `USD` only (`CurrencyCode`)
- **Contact role:** `broker` | `owner_rep`
- **Ownership relationship:** `primary_owner` | `co_owner` | `broker` | `property_manager`

Import public types from `src/types/index.ts` only: `Address`, `CurrencyCode`, `FinancialSummary`, `ContactRole`, `InvestorContact`, `InvestorListing`, `InvestorListingBase`, `NonEmptyContacts`, `NonEmptyOwnership`, `OpenInvestorListing`, `SoldInvestorListing`, `ListingStatus`, `Ownership`, `OwnershipRelationship`, `PropertyType`.

Nested field names that later work must keep:

- Address: `line1`, optional `line2`, `city`, **`region`** (not `state`), `postalCode`, `country`
- Financials object: `financials.askingPrice` (number), `financials.currency`, optional `projectedIrrPercent`, `capRatePercent`
- Prose field on the type: **`summary`** (the domain brief still says `description` — types win; see ADR Follow-ups)
- Contacts: `id`, `name`, `role`, and **email or phone** (or both)
- Listing extras on the type: `primaryContactId`; `soldAt` **required only when** `status` is `sold`
- Ownership: `contactNameOrId`, `relationship`, optional `sharePercent`

## 1. Client story recap

An **investor listing** is a PREIshare record of a property opportunity: workflow status, address, asking price, who to call, and how people relate to the asset.

Without a shared type, that record is easy to pass around as a loose object. Then production-class bugs show up: a missing asking price, a city that vanishes on one screen, or the same status spelled three ways (`published`, `Published`, `live`). Investors and reviewers cannot trust browse if those fields are optional or free text.

Sprint 2 Topic 1 modeled listings with **strict TypeScript types** so those mistakes fail at **compile time** (while the developer is still building) instead of in front of users. This repo’s blank scaffold never shipped live listing JSON; the “loose objects” story is the class of bug the types exist to prevent.

## 2. What we shipped this topic

| Deliverable | Path | Why it matters |
| --- | --- | --- |
| Domain brief | `docs/domain/investor-listing-domain-brief.md` | Lifecycle, nested groups, what “valid” means for investors |
| Field inventory | `docs/domain/listing-field-inventory.md` | Required vs optional fields and closed lists |
| Types barrel | `src/types/index.ts` | Single import surface for `InvestorListing` and related types |
| Core listing type | `src/types/investor-listing.ts` | `InvestorListingBase`, status-narrowed `InvestorListing`, `readonly id` / `createdAt` / `updatedAt` |
| Nested + relationship types | `src/types/address.ts`, `financial-summary.ts`, `investor-contact.ts`, `ownership.ts`, `listing-status.ts`, `property-type.ts` | Nested objects, contacts, ownership, closed unions |
| Valid fixtures | `src/fixtures/sample-investor-listings.ts` | Realistic `published`, `draft`, `under_offer`, and `sold` listings that type-check |
| Invalid cases + expected errors | `src/fixtures/invalid-listings.errors.ts`, `docs/type-safety/expected-type-errors.md` | Prove bad data is rejected (five intentional failures) |
| Typecheck gate + checklist | `package.json` (`npm run typecheck` → `tsc --noEmit`), `tsconfig.json` `exclude`, `docs/type-safety/verification-checklist.md`, `src/types/README.md` | Repeatable safety gate |
| Decision record | `docs/decisions/ADR-001-investor-listing-types.md` | Stakeholder-facing type decisions and known docs-vs-types gaps |

**How to verify locally:** follow `docs/type-safety/verification-checklist.md` and run `npm run typecheck` from the project root. Valid fixtures must pass. `src/fixtures/invalid-listings.errors.ts` is excluded from that script on purpose; those objects must remain type errors as listed in `docs/type-safety/expected-type-errors.md`. Do not “fix” them.

Intentional invalid cases (exact ids): `invalidStatusSpelling`, `missingAddressCity`, `priceAsString`, `emptyPublishedContacts`, `emptyPublishedOwnership`.

Status-dependent rules next owners must keep:

- `published`, `under_offer`, and `sold` need at least one contact (`NonEmptyContacts`) and at least one ownership row (`NonEmptyOwnership`).
- `draft` and `archived` may use empty `contacts` / `ownership` arrays.
- `sold` requires `soldAt`. Other statuses must not carry a real `soldAt`.

## 3. What we must NOT claim is done yet

- No TanStack Start UI or listing forms are built or wired to these types.
- No Supabase / PostgreSQL tables, migrations, or pgvector work from this model.
- No HTTP API routes, request/response validation at the network boundary, or auth rules.
- No runtime schema library (for example Zod) is required by this topic unless a later topic adds one on purpose.
- No production deployment of listing create/edit flows.

If a demo only shows green typecheck on fixtures, say: **“the data model is typed and verified; product surfaces are next.”**

## 4. Next sprint pickups (use the types — do not reinvent them)

### A. TanStack Start forms (UI)

- Build create/edit listing forms whose field names and option lists match `InvestorListing`, `ListingStatus`, and `PropertyType` from `src/types`.
- Prefer importing types from `src/types/index.ts` rather than copying string literals into components.
- Use `src/fixtures/sample-investor-listings.ts` as realistic form defaults / Story-style examples.
- Wire `status` so `sold` is the only path that collects `soldAt`. Use `summary`, not `description`, unless product first updates the types and ADR.
- Acceptance sketch: a form cannot submit a status outside `draft` | `published` | `under_offer` | `sold` | `archived` without a type or validation failure during development.

### B. Supabase / PostgreSQL schema alignment (data)

- Draft table columns that mirror required listing fields, nested address/financial concepts (as columns or related tables), and constrained status/property-type values using the same spellings as the unions above.
- Document any intentional difference between TypeScript optional fields (`address.line2`, projected IRR, cap rate, `sharePercent`) and database NULL rules in a follow-up ADR—do not silently diverge.
- Plan indexes and relationships (contacts, ownership) from the same domain brief that drove the types. Decide whether `contactNameOrId` stays a loose string or becomes a foreign key to `contacts[].id`.
- Confirm product on ADR Follow-ups before locking schema: `summary` vs `description`, whether a `draft` may omit price/address, `primaryContactId`, `soldAt`, and `property_manager`.
- Acceptance sketch: a row that would fail `InvestorListing` assignment is also rejected by DB constraints or insert validation.

### C. API boundaries (server)

- Define request/response shapes for list/get/create/update that re-export or compose `src/types` instead of anonymous JSON.
- Keep write endpoints from accepting free-form status strings; align with `ListingStatus`.
- Add tests that send fixture-shaped payloads (valid) and known-bad payloads (invalid) at the boundary — start from the five invalid fixture ids.
- Runtime checks still needed later: empty `id` / `title` strings, `primaryContactId` that does not exist in `contacts`, and datetime strings that are not ISO-8601. TypeScript does not catch those.
- Acceptance sketch: API handlers never widen listing status back to plain `string` without an explicit, documented escape hatch.

```text
Client pain (loose JSON)
        |
        v
 Domain brief + field inventory
        |
        v
 Strict TS types + fixtures + typecheck + ADR-001   <-- you are here
        |
        +--> TanStack Start forms (UI)
        +--> Supabase/PostgreSQL schema (data)
        +--> API routes & validation (boundary)
```

## 5. Prompting and review self-assessment

- **Prompting habit that helped:** I asked the agent to open the domain brief, field inventory, expected-type-errors notes, verification checklist, and `src/types/index.ts` and gather facts *before* drafting. That kept later prose from inventing statuses such as `active` or `closed`.
- **Second prompting habit that helped:** When docs and types disagreed, I told the agent to trust the types and put mismatches in the ADR Follow-ups instead of silently rewriting history. That is how `summary` vs `description` and `soldAt` stayed visible.
- **Review habit that caught an agent mistake:** I treated the first ADR draft as untrusted and asked what a product partner should look at closely. The template’s example statuses (`active` / `under contract` / `closed`) would have been wrong if they had been copied through. Follow-ups also caught that the verification checklist mentions `soldAt` but the invalid-fixture table does not prove it.
- **What I would do differently next topic:** Confirm the open product calls (`soldAt`, `summary`/`description`, how incomplete a `draft` may be, `property_manager`) with a partner *before* marking an ADR Accepted, and add an invalid fixture for any status-only field we claim is required.
- **Confidence (1–5) explaining InvestorListing to a teammate:** 4 — I can walk the nested shape, the five statuses, and the published-vs-draft contact rules. I would still want the ADR Follow-ups in front of me for the docs-vs-types gaps.

## 6. Handoff checklist for the next owner

- [ ] Read ADR-001 and this handoff before opening a UI or SQL PR
- [ ] Import listing types from `src/types/index.ts` only
- [ ] Keep `npm run typecheck` green on valid fixtures
- [ ] Do not delete intentional invalid fixture files; they document safety
- [ ] File a new ADR if product changes allowed statuses or required fields
- [ ] Do not introduce `active`, `under_contract`, `closed`, `state`, or `description` as listing fields unless types and ADR-001 are updated first
- [ ] Resolve or explicitly carry forward ADR-001 Follow-ups (`summary` vs `description`, draft completeness, `primaryContactId`, `soldAt` fixture gap, `property_manager`)
