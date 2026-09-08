# First contribution plan — PREIshare onboarding

## Author
- Name / GitHub handle: Gonzalo Burga / gonzaloburga-cs
- Feature branch: docs/first-contribution-gonzaloburga-cs
- Date: 2026-09-07

## One-sentence goal
Add myself as a new contributor in `CONTRIBUTORS.md` so the team can practice review on a small first PR.

## Why this surface (link to prior artifacts)
- From `docs/onboarding/repo-map.md`: Safe first-touch is docs, not app code — “`docs/onboarding/` — Docs-only; helps the team.” Do-not-edit-yet includes `src/`, lockfiles, Vite/TS config, `src/routeTree.gen.ts`, secrets, and auth. This PR stays off those surfaces. `CONTRIBUTORS.md` is not in the map table yet; it is the contributor list this tutorial assigns. It is docs-only (no runtime) and is the single product of this PR besides this plan file.
- From `docs/onboarding/setup-log.md` (orientation lives here): First-PR definition of done is (1) the change is small, (2) work is on a separate line of work, (3) described in a commit message, (4) someone reviews it before it is accepted, (5) every box is checked. This plan is one file (`CONTRIBUTORS.md`), on branch `docs/first-contribution-gonzaloburga-cs`, with a later reviewed PR. Out of scope there: large rewrites, secrets, and tooling I cannot explain.
- From `docs/onboarding/ai-tooling-verification.md`: Decision is **GO**. ST1–ST4 all passed; tooling is “safe enough for a tiny docs-first PR.” Agent may help implement next; I remain director and will refuse diffs outside the files table.

## In scope (only these)
1. Create `CONTRIBUTORS.md` at the repo root with my name, GitHub handle `gonzaloburga-cs`, and a one-line role: "Onboarding engineer".
2. Optional second touch: none. No UI copy change. No extra docs edits in this PR.
3. Capture implementation notes later in `docs/onboarding/first-contribution-notes.md` (next step—not done here).

## Out of scope (explicitly not this PR)
- Auth, sessions, or environment secrets
- Database schema, migrations, Supabase policies, or pgvector changes
- Dependency upgrades or lockfile churn unrelated to the contribution
- Multi-package refactors, renames, or formatting the whole repo
- CI/CD workflow edits unless a mentor explicitly assigns them
- Any file under `src/`, `package.json`, `package-lock.json`, `vite.config.ts`, `tsconfig.json`, `tsr.config.json`, `src/routeTree.gen.ts`, `.gitignore`, `.env`, `AGENTS.md`, `.cursorrules`, `.cursor/rules/preishare.mdc`
- `README.md` (repo-map: only if a mentor asks)
- Inventing `docs/onboarding/team-orientation-notes.md` or renaming `setup-log.md`

## Likely files to change
| File | Action | Why |
|------|--------|-----|
| CONTRIBUTORS.md | create | Add my contributor entry |
| n/a | n/a | No optional second touch |
| docs/onboarding/first-contribution-notes.md | create (next step) | Record what the agent did and what I verified |
| docs/onboarding/first-contribution-plan.md | create (this step) | This plan; already in scope for the planning step |

## Acceptance criteria
- [X] I am on feature branch `docs/first-contribution-gonzaloburga-cs` (not the default branch).
- [ ] `CONTRIBUTORS.md` lists my name and GitHub handle in a consistent format.
- [X] Any second touch is limited to the single file named above and does not change behavior beyond copy/docs. (None chosen.)
- [X] No secrets, `.env` files, or generated build artifacts are included.
- [X] A teammate can review the diff in under 10 minutes without product-context deep dives.

## Verification plan (how I will know it worked)
1. `git status` / `git branch` show I am on `docs/first-contribution-gonzaloburga-cs` with only expected files modified (`CONTRIBUTORS.md`, plus this plan if not already committed).
2. Open `CONTRIBUTORS.md` and confirm my row/section renders as plain Markdown (name, `gonzaloburga-cs`, "Onboarding engineer").
3. UI touch was not included: skip `npm run dev`.
4. Skim `git diff` and confirm nothing outside the likely-files table appears.

## Risks and mitigations
- Risk: Agent expands scope into app core. Mitigation: refuse diffs that touch files not listed above; re-prompt with the out-of-scope list.
- Risk: Editing default branch by mistake. Mitigation: check `git branch` before every edit session (must be `docs/first-contribution-gonzaloburga-cs`).
- Risk: Creating extra onboarding files “while we are here.” Mitigation: optional second touch is none; next-step notes file is not this PR.

## Definition of done for this planning step
- [x] Feature branch created from updated default branch.
- [x] This plan file saved at `docs/onboarding/first-contribution-plan.md` with all sections filled (no angle-bracket placeholders left).
- [x] Ready to implement in the next step without re-deciding scope.
