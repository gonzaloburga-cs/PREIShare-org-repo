# PREIshare investor listing types

Shared TypeScript types for PREIshare investor listings (status, address, money, contacts).
Investors rely on complete, consistent data; these types catch mistakes at **compile time**.

Domain modules only — no UI, API routes, or database clients.

## Typecheck gate

From the project root after `npm install`:

```bash
npm run typecheck
```

That runs `tsc --noEmit` using `tsconfig.json`. **Success:** the command prints nothing after the script line and exits 0. Any type error in the app, types, or valid fixtures (`src/fixtures/sample-investor-listings.ts`) is a failure.

`src/fixtures/invalid-listings.errors.ts` is **excluded** on purpose (see `tsconfig.json`). Those objects are supposed to fail the checker; they are documented in `docs/type-safety/expected-type-errors.md`. Do not “fix” them to make typecheck pass.

## Source of truth

`docs/domain/investor-listing-domain-brief.md` and `docs/domain/listing-field-inventory.md`.
