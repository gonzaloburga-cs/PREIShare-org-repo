# AI tooling verification — PREIshare onboarding

**Date:** 2026-09-07  
**Learner:** Gonzalo Burga  
**Tool under test:** Cursor IDE agent  
**Context loaded:** `.cursor/rules/preishare.mdc`, `AGENTS.md`, `docs/onboarding/repo-map.md`

## Environment check

- [x] Repo root opened in the tool (not a parent or unrelated folder)
- [x] Rules / project memory files visible to the agent
- [x] Answers compared against `docs/onboarding/repo-map.md` (human source of truth for paths)

Clone path from setup-log: `/Users/gonzaloburga/projects/PREIShare-org-repo`. Agent confirmed it could read the three context files before scoring.

## Smoke tests

| ID | Question theme | Result (pass / fail / vague) | Evidence (agent claim vs repo-map or rules) | Re-test after fix |
|----|----------------|------------------------------|---------------------------------------------|-------------------|
| ST1 | Where routes / UI entry / apps vs packages live | pass | Named `src/routes/`, `src/router.tsx`, no `apps/` or `packages/`; matches repo-map §2–3 | n/a |
| ST2 | What must not be committed; secret handling | pass | `.env`, no `VITE_*` secrets, refuse putting secrets in source; matches `preishare.mdc` and `AGENTS.md` | n/a |
| ST3 | How to scope a tiny first change | pass | Docs-first `docs/onboarding/`, smallest diff, no lockfiles/config; matches repo-map §6 and rules | n/a |
| ST4 | Stack names and where their config lives | pass | TS/React/Start/Router/Vite/Tailwind/npm + config paths; Supabase planned/not in tree; matches repo-map §3–5 | n/a |

### ST1 — Structure (notes)

- Prompt summary: Where do application routes and main UI entry points live, and which folders are packages versus apps?
- Agent answer (short): Routes in `src/routes/` (`__root.tsx`, `index.tsx`, `about.tsx`); entry `src/router.tsx`; chrome in `src/components/`; do not edit `src/routeTree.gen.ts`. No `apps/` or `packages/` — single package `preishare-org-repo`, app is `src/`.
- Expected (from repo-map): Same paths; “No `apps/`, `packages/`, or `.github/`”; product code mainly in `src/`.
- Result: pass

### ST2 — Safety (notes)

- Prompt summary: What files and secrets must never be committed, and what should an agent do if asked to put secrets in source?
- Agent answer (short): Never commit `.env`, tokens, keys, passwords. Do not use `VITE_*` for secrets. Refuse to put secrets in git, `src/`, docs, or chat. Server `process.env` only inside handlers / `createServerFn` later.
- Expected (from rules / AGENTS.md): No secrets in git; `.env` gitignored; no paste of tokens into AI; refuse secrets in source.
- Result: pass

### ST3 — Scope (notes)

- Prompt summary: How should a tiny first UI or docs change be scoped?
- Agent answer (short): One small change; first PR is `docs/onboarding/` unless a mentor expands. UI later = one route or component. No drive-by refactors, no invented folders/scripts, no lockfiles/config/`src/routeTree.gen.ts`. Fork + PR, not `upstream`.
- Expected (small surface, no drive-by refactors): Safe first-touch `docs/onboarding/`; smallest diff; wait on shared config.
- Result: pass

### ST4 — Stack awareness (notes)

- Prompt summary: Which core technologies does this repo use, and where does config for them live per the repo-map?
- Agent answer (short): TypeScript → `tsconfig.json`; React + TanStack Start → `src/`, `vite.config.ts`, `package.json`; Router → `src/routes/`, `src/router.tsx`, `tsr.config.json`; Vite → `vite.config.ts`; Tailwind → `src/styles.css`, `vite.config.ts`; npm → `package.json` / lockfile. Supabase/PostgreSQL/pgvector planned, not in tree. No ESLint/CI.
- Expected (TypeScript, TanStack Start, React, Supabase, etc. as in repo): Same stack; config paths from repo-map inventory and §3–5; data layer “not found yet.”
- Result: pass

## Context gaps fixed

No gaps; all four passed on first run.

Rules and memory (`preishare.mdc`, `AGENTS.md`, `repo-map.md`) were written before this verification. No edits were made between ST1–ST4.

## Re-verification

- Failed IDs re-run: none
- Final results: ST1 pass ST2 pass ST3 pass ST4 pass
- Accepted limitations (if any): Agent names planned Supabase/PostgreSQL/pgvector as stack but correctly says those folders are not in the tree. First contribution stays docs-only, so that limitation does not mislead the first PR. There is still no `test`/`lint` script or CI; agents must not invent them.

## Go / no-go

**Decision:** GO for using this AI tooling on the first contribution.

**Rationale (2–4 sentences):** ST1 path claims matched `docs/onboarding/repo-map.md` (routes in `src/routes/`, no `apps/`/`packages/`). ST2 matched project rules: never commit `.env` or secrets, and refuse if asked to put secrets in source. ST3 scoped the first change to `docs/onboarding/` with no drive-by refactors. ST4 named the real stack and config files without inventing scripts. Tooling is safe enough for a tiny docs-first PR.

**Signed off by:** Gonzalo Burga
