# PREIshare Investor Dashboard Shell

TanStack Start + TypeScript starter for the PREIshare investor dashboard (Sprint 3).

This app already lives at the repository root. It uses the current Vite-based TanStack Start scaffold (`vite.config.ts`), not an older `app.config.ts` / Vinxi starter.

## Setup

1. Install Node.js LTS if needed.
2. From the project root, run: `npm install`
3. Start the dev server: `npm run dev`
4. Open the local URL printed in the terminal (http://localhost:3000).

## Project notes

- Planning docs live in `docs/` (client brief, information architecture, and component plan).
- File-based routes live under `src/routes/`.
- The document title is set in `src/routes/__root.tsx`. The starter home page is `src/routes/index.tsx` (`/`).
- Dashboard area routes (portfolio, deals, profile) are added in a later step. Do not invent them in the scaffold.
- `npm run typecheck` checks the existing listing types. `npm run build` builds the app.
