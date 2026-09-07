<!-- intent-skills:start -->
## Skill Loading

Before editing files for a substantial task:
- Run `npx @tanstack/intent@latest list` from the workspace root to see available local skills.
- If a listed skill matches the task, run `npx @tanstack/intent@latest load <package>#<skill>` before changing files.
- Use the loaded `SKILL.md` guidance while making the change.
- Monorepos: when working across packages, run the skill check from the workspace root and prefer the local skill for the package being changed.
- Multiple matches: prefer the most specific local skill for the package or concern you are changing; load additional skills only when the task spans multiple packages or concerns.
<!-- intent-skills:end -->

# PREIshare

Real-estate market information, shared by the team through GitHub pull requests. One app at the repo root (`preishare-org-repo`). Blank TanStack Start scaffold today; planned data layer is Supabase / PostgreSQL / pgvector (not in the tree yet).

**Cursor and other agents:** follow `.cursor/rules/preishare.mdc`. This file is the short human + tool memory; that file is the detailed edit rules.

## Docs

- `docs/onboarding/` — start here
- `docs/onboarding/setup-log.md` — machine setup (fork, remotes, Git identity)
- `docs/onboarding/repo-map.md` — verified folder map, safe vs do-not-edit

Contribute from your fork. Do not push to `upstream` (team repo).

## Stack (now)

TypeScript, React 19, TanStack Start, TanStack Router (`src/routes/`), Vite 8, Tailwind CSS v4, npm. App code: `src/`.

## Scripts (from repo-map)

Listed in root `package.json` / `docs/onboarding/repo-map.md` only. Do not invent others.

- `npm run dev` — app at http://localhost:3000
- `npm run build`
- `npm run preview`
- `npm run generate-routes`

No `test` or `lint` script yet.

## Agent workflow

1. **Plan** — read `docs/onboarding/repo-map.md` and `.cursor/rules/preishare.mdc`. First work is docs unless a mentor expands scope.
2. **Small diff** — smallest change that solves the task. No drive-by refactors. Do not invent folders or scripts missing from the repo-map.
3. **Verify** — re-read the diff; if you changed a path claim, update `docs/onboarding/repo-map.md`. Humans: commit on a branch, open a PR, wait for review.

Before Start / Router / Devtools edits, use the Skill Loading block at the top. Never hand-edit `src/routeTree.gen.ts`.

## Safe vs wait

- **Safe first-touch:** `docs/onboarding/`
- **Wait:** `package.json`, `package-lock.json`, Vite/TS/router config, `.gitignore`, generated routes, secrets/`.env`

No secrets in git or in AI chats. Blank scaffold needs no env vars yet.
