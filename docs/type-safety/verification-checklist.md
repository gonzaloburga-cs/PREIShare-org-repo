# Investor listing types — verification checklist

Use this list before review. Check each box only when you have evidence.

Evidence lives in: `docs/domain/investor-listing-domain-brief.md`, `docs/domain/listing-field-inventory.md`, `src/types/`, `src/fixtures/`, `docs/type-safety/expected-type-errors.md`, `package.json`, `tsconfig.json`, `src/types/README.md`.

## A. Domain coverage

- [ ] Every required field from `docs/domain/listing-field-inventory.md` appears on `InvestorListing` (or a nested type it uses).
- [ ] Listing status values match the allowed business statuses (`draft`, `published`, `under_offer`, `sold`, `archived`) — no free-form strings.
- [ ] Property type values match the allowed property kinds (`multifamily`, `office`, `retail`, `industrial`, `mixed_use`, `land`).
- [ ] Address and FinancialSummary nested shapes match the inventory (`address.region` not `state`; `financials.askingPrice` + `currency`).
- [ ] Investor contact and ownership relationship fields match the domain brief (`ContactRole`, `OwnershipRelationship`, `contactNameOrId`).

## B. Type safety shape

- [ ] Public types are exported from `src/types/index.ts`.
- [ ] Discriminated / narrowed status modeling still matches `docs/type-safety/expected-type-errors.md` (`sold` requires `soldAt`; other statuses must not carry a real `soldAt`).
- [ ] Readonly intent is documented where the team agreed on it (`readonly id`, `createdAt`, `updatedAt` on `InvestorListingBase`).
- [ ] Investor-facing statuses (`published`, `under_offer`, `sold`) require non-empty `contacts` and `ownership` (`NonEmptyContacts`, `NonEmptyOwnership`); `draft` / `archived` may be empty.

## C. Fixtures

- [ ] `src/fixtures/sample-investor-listings.ts` typechecks cleanly and includes more than one realistic listing (`sampleInvestorListings: InvestorListing[]`).
- [ ] `src/fixtures/invalid-listings.errors.ts` still demonstrates the intentional failures listed in `docs/type-safety/expected-type-errors.md`.
- [ ] Expected-error notes still match the real compiler messages (no stale examples).

## D. Typecheck gate

- [ ] `package.json` defines a `typecheck` script that runs `tsc --noEmit`.
- [ ] Running the typecheck script from the project root succeeds for valid sources.
- [ ] The intentional invalid fixtures file is not required to pass the normal typecheck gate (`tsconfig.json` `exclude`).
- [ ] `src/types/README.md` explains how a beginner runs typecheck and what success looks like.

## E. Sign-off

- [ ] I re-ran typecheck after any last fixes.
- [ ] I would hand this package to a teammate without a verbal walkthrough of secret steps.
