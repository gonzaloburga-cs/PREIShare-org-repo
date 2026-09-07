# PREIshare repository map

> Onboarding map for first contribution planning. Built with AI-assisted
> inventory + human path verification. Do not treat this as architecture law
> if the real tree disagrees—update this file when you learn more.

## Meta

- Clone path (from setup-log): `/Users/gonzaloburga/projects/PREIShare-org-repo`
- Date mapped: `2026-09-03`
- Agent tool used: `cursor agent`
- Mapper: `Gonzalo Burga`

## 1. Overview (5–8 sentences)

PREIshare appears to be organized as: **single package**. 

There is one root `package.json` (`preishare-org-repo`), no `workspaces` field, and no `apps/` or `packages/` folders. 

In plain language, the product code seems to live mainly in `src/` (routes, components, styles, and the TanStack Start router). 

Shared libraries or packages appear in **none found** — `src/lib/` only has a stub helper, not a published package. 

Docs and onboarding notes live in `docs/` (including this file). The root still looks like the blank TanStack Start scaffold (`README.md` titles it a starter; `package.json` scripts are `dev` / `build` / `preview` / `generate-routes`). 

I am intentionally not editing application code while building this map.

## 2. Top-level inventory

| Path | Kind (app / package / config / docs / other) | One-sentence purpose | Verified by me? (yes/no) |
|------|-----------------------------------------------|----------------------|---------------------------|
| `src/` | app | TanStack Start / React UI: routes, components, styles, router | yes |
| `docs/` | docs | Onboarding and project documentation | yes |
| `.vscode/` | config | Cursor/VS Code settings for this repo | yes |
| `package.json` | config | Root package manifest / scripts (`preishare-org-repo`) | yes |
| `package-lock.json` | config | Locked npm dependency versions | yes |
| `README.md` | docs | How to install, run, and work with the scaffold app | yes |
| `AGENTS.md` | config | Agent/project context (stack, env, Intent skills) | yes |
| `vite.config.ts` | config | Vite + TanStack Start + Tailwind + React plugins | yes |
| `tsconfig.json` | config | TypeScript compiler options (strict mode) | yes |
| `tsr.config.json` | config | TanStack Router file-route generation (`target: react`) | yes |
| `.gitignore` | config | Ignores `node_modules`, `.env`, build output, etc. | yes |
| `.cta.json` | config | TanStack CLI scaffold metadata | yes |
| `.cursorrules` | config | Cursor rules for editing this codebase | yes |

No `apps/`, `packages/`, or `.github/` directories exist at the root.

## 3. Frontend concerns (TypeScript, React, TanStack Start)

- Likely app root(s): `src/`
- Clues I used (file names, frameworks mentioned in package.json): `package.json` lists `react`, `react-dom`, `@tanstack/react-start`, `@tanstack/react-router`, `vite`, `tailwindcss`; `vite.config.ts` calls `tanstackStart()` and `viteReact()`; routes use `createRootRoute` / file-based `src/routes/`.
- Entry / routes / UI areas worth knowing:
  - `src/router.tsx` — Start/router entry (`getRouter()`); there is no `src/main.tsx`
  - `src/routeTree.gen.ts` — generated route tree (do not edit by hand)
  - `src/routes/__root.tsx` — root HTML shell, Header, Footer, CSS
  - `src/routes/index.tsx` — home page (`/`)
  - `src/routes/about.tsx` — about page (`/about`)
  - `src/components/` — `Header.tsx`, `Footer.tsx`, `ThemeToggle.tsx`
  - `src/styles.css` — Tailwind / global styles
  - `src/lib/user.ts` — stub `getUser()` that returns `null`
- How this area relates to user-facing screens: files under `src/routes/` are the pages in the browser; `src/components/` is the shared chrome (header/footer/theme). Running `npm run dev` serves this app on port 3000.

## 4. Backend / data concerns (Supabase, PostgreSQL, pgvector, APIs)

- Supabase or data config paths: **not found yet** (no `supabase/` folder; no `src/lib/supabase.ts` even though `.cursorrules` mentions it)
- Migrations / SQL / schema-related paths: **not found yet** (no `migrations/`, `prisma/`, `drizzle/`, or `*.sql`)
- Env examples (NOT secret values): **none found** — no `.env.example`. `.gitignore` lists `.env` so a real secrets file should not be committed. `AGENTS.md` says the blank scaffold needs no env vars yet.
- Notes on what a beginner should not touch in production data: there is no in-repo database to change. Do not create or commit a real `.env` with secrets. Do not invent production Supabase/Postgres edits; that layer is not in this tree yet.

## 5. Tooling and CI

- TypeScript / lint / format config: `tsconfig.json` (strict TypeScript; this is the only lint-like config). **No** ESLint, Prettier, or Biome files. **No** `lint` / `format` / `test` scripts in `package.json`. Also: `tsr.config.json`, `vite.config.ts`.
- CI workflows (e.g. GitHub Actions): **not found** — no `.github/` directory.
- Editor or agent config already present: `.vscode/settings.json`, `.cursorrules`, `AGENTS.md`, `.cta.json`
- Scripts from package manifests that look like dev/build/test: `dev`, `build`, `preview`, `generate-routes` (no `test`)

## 6. Safe first-touch vs do-not-edit-yet

### Safe first-touch (good candidates for a tiny onboarding PR)

| Path or area | Why it is relatively safe | Risk if handled carelessly |
|--------------|---------------------------|----------------------------|
| `docs/onboarding/` | Docs-only; helps the team | Misleading docs |
| `docs/onboarding/setup-log.md` | Already used for machine setup; no runtime | Wrong URLs or incomplete PASS/FAIL |
| `docs/onboarding/repo-map.md` | This map; onboarding only | Stale paths if the tree changes |
| `README.md` | Human docs at root (only if a mentor asks) | Confusing install/run instructions |

### Do not edit yet (wait until you have tests, review, and a real task)

| Path or area | Why wait | What could break |
|--------------|----------|------------------|
| Root workspace / package manager lockfiles (`package.json`, `package-lock.json`) | Dependency graph | Install failures for all |
| `vite.config.ts`, `tsconfig.json`, `tsr.config.json` | Shared compile/build | Dev server or typecheck breaks for everyone |
| `src/routeTree.gen.ts` | Generated by TanStack Router | Route tree fights the generator |
| `.cursorrules`, `AGENTS.md`, `.cta.json`, `.vscode/` | Shared editor/agent/scaffold config | Agents and editors behave differently per clone |
| `.gitignore` | What the whole team tracks | Secrets or junk committed, or needed files ignored |
| Supabase / migrations / production env | Data and secrets (not in tree yet) | Data loss or leaked secrets |
| Shared packages used by multiple apps | Wide blast radius | N/A today (single package); still do not invent a monorepo |
| Auth, payments, or vector/search core (if present) | High complexity | Not present; `src/lib/user.ts` is a stub — do not “finish” auth unasked |

## 7. Open questions for the team

- `.cursorrules` says to use a Supabase client from `lib/supabase.ts`, but that file is not in the clone. Is that a future step, or a leftover rule?
- The README still describes a generic TanStack Start starter. When does product-specific PREIshare UI replace the scaffold pages?
- There is no `test` script and no CI. Where should tests live once “write tests for new features” (from `.cursorrules`) applies?
- `src/lib/user.ts` always returns `null`. Is that the intended empty session, or unfinished auth?
- Upstream org spelling: setup-log records the team repo as `EdTechForLearning/PREIShare-org-repo`. Confirm that remains the source of truth for `git remote upstream`.

## 8. How I will use this map next

- Configure AI project rules/memory using the paths above (next tooling steps).
- Pick a first contribution only from **Safe first-touch** unless a mentor expands scope.
- Revisit and edit this file when a path claim is proven wrong.
