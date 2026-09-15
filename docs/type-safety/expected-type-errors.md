# Expected type errors for invalid investor listings

`src/fixtures/invalid-listings.errors.ts` is supposed to **fail** typechecking. Do not “fix” those errors. Update this table if you add or remove cases.

Happy-path samples live in `src/fixtures/sample-investor-listings.ts` and must stay valid.

| id | business problem | rule that should catch it | expected TS kind |
| --- | --- | --- | --- |
| `invalidStatusSpelling` | status typo would break filters | `ListingStatus` string union (`draft` \| `published` \| `under_offer` \| `sold` \| `archived`) | invalid string literal |
| `missingAddressCity` | city required for display/maps | `Address` required fields (`city`) | missing property |
| `priceAsString` | money must be numeric for math | `FinancialSummary.askingPrice: number` | type not assignable |
| `emptyPublishedContacts` | investors would have no one to reach | published+ needs at least one `InvestorContact` (`NonEmptyContacts`) | source has fewer elements than target |
| `emptyPublishedOwnership` | published listing with no owner/relationship row | published+ needs at least one `Ownership` (`NonEmptyOwnership`) | source has fewer elements than target |

## How the check is forced

Each export uses a **type annotation** (`const name: InvestorListing = { ... }`), not `as InvestorListing`, `any`, or `@ts-ignore`. The annotation is a check: TypeScript must accept the object as `InvestorListing` and therefore reports the intentional violation.

## Hole-hunting notes (agreed rules only)

Tightened in this pass (already in the domain brief / field inventory):

- `published`, `under_offer`, and `sold` require a non-empty `contacts` array and a non-empty `ownership` array.
- `draft` and `archived` may still use empty arrays while editors work.

Left open on purpose (TypeScript cannot enforce without brands or runtime checks):

- Empty `id` / `title` strings (`""`) still type-check; “non-empty” is a string-content rule, not a type-shape rule.
- `primaryContactId` is not proven to exist in `contacts`.
- Datetime strings are not validated as ISO-8601.

## Notes

- Nested field names in the error file match our types (`region`, `financials.currency`, `contacts[].id` / `role`, `ownership[].contactNameOrId`), so each case isolates one failure instead of failing for leftover tutorial names (`state`, `multi_family`, `ownerName`).
- `npm run typecheck` is expected to fail while this file is included by `tsconfig.json`.
