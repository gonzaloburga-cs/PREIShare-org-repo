# PREIshare onboarding handoff

**Author:** Gonzalo Burga / gonzaloburga-cs  
**Date:** 2026-09-07  
**Branch / PR:** `docs/first-contribution-gonzaloburga-cs` — https://github.com/EdTechForLearning/PREIShare-org-repo/pull/9  
**Audience:** mentor, future self, sprint lead

## 1. Stakeholder summary (plain language)

I completed PREIshare engineering onboarding for Sprint 1 (dev environment and AI tooling). I forked the team repository, cloned my fork, wired up origin and upstream, verified my local toolchain, configured Cursor-style project rules and agent memory, mapped the repo well enough to choose a safe first contribution, and opened a small pull request that follows the team’s Git and review habits. PREIshare remains a real-estate intelligence product; this work does not ship a product feature—it proves I can join the team workflow safely.

**Definition of done met:**
- [x] Fork created, local clone of my fork, both remotes and toolchain verified (see setup log)
- [x] AI rules / project memory in place and smoke-tested
- [x] First contribution implemented and committed on a feature branch
- [x] PR opened and review feedback addressed

Simulated mentor review is recorded in `docs/onboarding/review-response-notes.md`. TODO: confirm a human mentor has reviewed on GitHub and that the live PR #9 body matches `docs/onboarding/pr-description.md`.

## 2. Deliverables index (what exists and where)

| Artifact | Path | Why it matters |
| --- | --- | --- |
| Team orientation notes | docs/onboarding/setup-log.md | Mission, workflow, first-PR definition of done (orientation is in setup-log) |
| Setup log | docs/onboarding/setup-log.md | Auditable proof of accounts, fork, Git identity, clone, remotes |
| Repo map | docs/onboarding/repo-map.md | Safe contribution surfaces (single package, `src/`, config) |
| AI tooling verification | docs/onboarding/ai-tooling-verification.md | Evidence agents respect PREIshare stack/conventions |
| Project rules | .cursor/rules/preishare.mdc | Persistent IDE-agent constraints |
| Agent memory entrypoint | AGENTS.md | Cross-tool project context for coding-agents |
| First contribution plan | docs/onboarding/first-contribution-plan.md | Scoped plan before code |
| Contribution notes | docs/onboarding/first-contribution-notes.md | What changed and why |
| Contributors credit | CONTRIBUTORS.md | Visible first contribution surface |
| PR description | docs/onboarding/pr-description.md | Reviewer-facing summary |
| Review response notes | docs/onboarding/review-response-notes.md | How feedback was handled |
| This handoff | docs/onboarding/onboarding-handoff.md | Single entry point for mentors |

## 3. Environment and toolchain snapshot

Copy only facts you verified in setup-log.md (do not invent versions):

- OS: Mac
- Git user.name / user.email configured: yes
- Node / package manager versions: TODO (not recorded in setup-log.md)
- origin (my fork) URL: https://github.com/gonzaloburga-cs/PREIShare-org-repo.git
- upstream (team repo) URL: https://github.com/EdTechForLearning/PREIShare-org-repo
- Install/build/test commands run and result: TODO (setup-log records clone, remotes, and `git status` clean; it does not record `npm install`, `npm run dev`, `npm run build`, or tests)
- Blockers hit and how resolved: upstream was first set to `EdTeachForLearning` (404); corrected with `git remote set-url` to `EdTechForLearning`. First push of the feature branch needed `git push --set-upstream origin docs/first-contribution-gonzaloburga-cs` (plain `git push` failed until tracking existed). Extra `git commit` while the tree was already clean produced “nothing to commit.”

## 4. AI tooling posture

- Rules file purpose (one sentence): from `.cursor/rules/preishare.mdc` — always-apply constraints for stack, safe edit surfaces, secrets, smallest-diff, and agent workflow.
- AGENTS.md purpose (one sentence): short human-and-agent memory for what PREIshare is, scripts that exist, `docs/onboarding/`, and plan → small diff → verify; points at `preishare.mdc`.
- Smoke-test prompt used and whether the agent correctly named stack pieces (TypeScript, TanStack Start, React, Supabase, PostgreSQL, pgvector): four prompts in `docs/onboarding/ai-tooling-verification.md` (ST1 structure, ST2 secrets, ST3 scope, ST4 stack). All **pass**. ST4 named TypeScript, React, TanStack Start, Router, Vite, Tailwind, npm, and planned Supabase/PostgreSQL/pgvector as **not in the tree**.
- Context gaps found and fixes applied (link to ai-tooling-verification.md): “No gaps; all four passed on first run.” See `docs/onboarding/ai-tooling-verification.md`.

## 5. First contribution and review outcome

- Plan goal (from first-contribution-plan.md): add myself as a new contributor in `CONTRIBUTORS.md` so the team can practice review on a small first PR.
- Files touched (e.g. CONTRIBUTORS.md, notes): `CONTRIBUTORS.md`; `docs/onboarding/first-contribution-plan.md`; `docs/onboarding/first-contribution-notes.md`; `docs/onboarding/pr-description.md`; `docs/onboarding/review-response-notes.md` (plus this handoff when committed).
- PR title and link: `docs: add Gonzalo Burga to CONTRIBUTORS.md` — https://github.com/EdTechForLearning/PREIShare-org-repo/pull/9
- Review-style feedback received (summary): simulated mentor review — name all PR files (scope); drop “neighbors” and list paths in the test plan (blocking clarity); refresh stale notes diff (blocking verification); roster commit `ad23499` does not state why (non-blocking; document in PR text, do not amend); optional GitHub profile link in `CONTRIBUTORS.md`.
- Changes made in response: `2640b03` listed files, refreshed notes, linked handle; later commit documented review decisions and commit-history why in `pr-description.md`. No amend of `ad23499`.
- Merge readiness: ready with follow-ups — accepted file fixes are on the branch; TODO: human GitHub review; TODO: live PR body matches `pr-description.md`; `pr-description.md` Intended files still lists four paths while the branch also has `review-response-notes.md` (and this handoff if added).

## 6. Open risks and environment gaps

List anything a mentor should know before assigning feature work:

1. No in-repo Supabase/PostgreSQL/pgvector; `.cursorrules` mentions `lib/supabase.ts` which is not in the clone. Do not invent env or migrations.
2. Full test suite not run — setup-log has no `npm test`; `package.json` has no `test` script. AI smoke checks only (ST1–ST4).
3. PR #9 still awaiting **human** GitHub review (simulation is what `review-response-notes.md` records).
4. Blank scaffold: `src/lib/user.ts` returns `null`; README is still the TanStack starter. No CI (`.github/` not in repo-map).

If none, write "None known" and state what you would re-verify on day one of the next sprint.

## 7. Decisions log (for stakeholders)

| Decision | Choice | Rationale |
| --- | --- | --- |
| First contribution surface | `CONTRIBUTORS.md` | Low risk, visible, matches onboarding plan |
| Branch naming | `docs/first-contribution-gonzaloburga-cs` | Kind of work + handle; feature branch, not `main` |
| AI tool category used most | coding-agent (Cursor) | Could read `docs/onboarding/`, `src/`, and rules in-repo for map, smoke tests, and the first PR |

## 8. Next-sprint preview (what this unlocks)

The next sprint topic can assume:

1. **Trusted local environment** — clone + toolchain documented in setup-log.md; re-run only if OS or versions change.
2. **AI alignment** — .cursor/rules/preishare.mdc and AGENTS.md exist; extend rules when new packages appear, do not start from zero.
3. **Git habit** — feature branch → small commits → PR → respond to review is practiced once end-to-end.
4. **First PR path** — merge-ready or merged onboarding contribution; feature work should use the same PR quality bar.

**Explicitly out of scope until later:** large product features, production deployments, and database migrations you have not been trained on yet.

## 9. Ask for mentor

- Questions still open: When does product UI replace the starter? Where should tests live? Is `src/lib/user.ts` returning `null` intentional? Confirm `lib/supabase.ts` is future work. Has a human reviewed PR #9?
- Review of this handoff requested: yes
- Preferred follow-up time or channel: TODO

---

*End of handoff. Keep this file updated if merge status or env gaps change before the next sprint starts.*
