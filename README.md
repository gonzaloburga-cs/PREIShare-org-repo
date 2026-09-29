# PREIshare Investor Dashboard Shell

Clickable investor dashboard for PREIshare: Home, Portfolio, Deals, and Profile, filled with labeled mock data. TanStack Start and TypeScript, one app at the repository root.

## Prerequisites

- Node.js and npm. This repo has no pinned Node version (no `engines` field and no `.nvmrc`).
- No `.env` file is required to run the shell.

## Cold start

From the repository root:

1. `npm install`
2. `npm run dev` — this runs `vite dev --port 3000`
3. Open the local URL printed in the terminal. If port 3000 is already in use, use the other port Vite prints.
4. Go to `/dashboard`.

`/` and `/about` are leftover starter pages. They are not the investor demo.

## Docs

- Sprint 3 handoff: [docs/sprint3-handoff.md](docs/sprint3-handoff.md)
- Architecture decisions: [docs/architecture-decisions.md](docs/architecture-decisions.md)

Optional checks that exist in `package.json`: `npm run typecheck` (`tsc --noEmit`) and `npm run build`. There is no `test` or `lint` script.
