# Review response notes — first PREIshare PR

## PR under review
- Branch name: `docs/first-contribution-gonzaloburga-cs`
- PR title (after any edits): `docs: add Gonzalo Burga to CONTRIBUTORS.md`
- Link or local identifier: https://github.com/EdTechForLearning/PREIShare-org-repo/pull/9
- Related files: CONTRIBUTORS.md, docs/onboarding/pr-description.md, docs/onboarding/first-contribution-notes.md, docs/onboarding/review-response-notes.md

## Simulated reviewer setup
- Tool used (chat-assistant / coding-agent): coding-agent (Cursor), acting as PREIshare mentor reviewer
- What context I pasted for the reviewer: PR description (`docs/onboarding/pr-description.md`), summary of `CONTRIBUTORS.md`, notes from `docs/onboarding/first-contribution-notes.md`; asked for 3–5 comments covering scope, PR clarity, verification evidence, and commit/message hygiene, each labeled blocking or non-blocking
- Date of simulation: 2026-09-07

## Feedback received

### Comment 1
- **Theme:** scope
- **Blocking?** no
- **Reviewer said:** Plan/notes say the shippable change is `CONTRIBUTORS.md` only, but the PR also adds three onboarding docs. Still docs-only (no `src/` or lockfiles). Do not delete those files for this first PR; **name all four paths** in the PR description so “intended files” is explicit. Do not expand into README or app code.
- **My decision:** accept-now
- **Why:** The extra files are tutorial/portfolio artifacts. Reviewers need an explicit file list. That is a description fix, not a scope cut.
- **Action taken:** edit PR description (`docs/onboarding/pr-description.md`) — added **Intended files** listing all four paths
- **Evidence:** commit `2640b03` `Address review: list PR files, refresh notes, link GitHub handle`. New section lists `CONTRIBUTORS.md`, `docs/onboarding/first-contribution-plan.md`, `docs/onboarding/first-contribution-notes.md`, `docs/onboarding/pr-description.md`.

### Comment 2
- **Theme:** PR clarity
- **Blocking?** yes
- **Reviewer said:** “Formatted like neighbors” is wrong because `CONTRIBUTORS.md` is new (no neighbor rows). Test plan step 1 (“only the expected path(s)”) never lists those paths. Update `docs/onboarding/pr-description.md` and the GitHub PR body so they match; list the four files; drop “neighbors.”
- **My decision:** accept-now
- **Why:** Blocking. The Files changed tab and the written test plan disagree until the expected paths are named.
- **Action taken:** edit PR description — dropped “neighbors”; test plan step 1 names the four paths. GitHub PR body should be pasted to match (human step).
- **Evidence:** commit `2640b03`. Reviewer checklist now says “new file; row is accurate (name, handle, date, role)”. Test plan step 1 quotes the four paths.

### Comment 3
- **Theme:** verification
- **Blocking?** yes
- **Reviewer said:** `first-contribution-notes.md` “Final diff summary” is stale. It omits `first-contribution-plan.md` and `pr-description.md`. The “only in-scope files” checkbox is misleading vs the plan’s original `CONTRIBUTORS.md`-only in-scope list. Refresh the notes to match Files changed and explain why extra onboarding files are in the PR.
- **My decision:** accept-now
- **Why:** Blocking. Notes claim to be the verification record; they must match the real diff.
- **Action taken:** edit `docs/onboarding/first-contribution-notes.md` — four-path final diff, why extra tutorial docs are in the PR, honest checklist
- **Evidence:** commit `2640b03`. Final diff summary now lists all four paths and states the extra three are onboarding/tutorial artifacts.

### Comment 4
- **Theme:** commits
- **Blocking?** no
- **Reviewer said:** Commit `ad23499` (`Add contributors row and first-contribution notes`) names files, not why the team needed my name on `CONTRIBUTORS.md`. Do not rewrite published history unless a maintainer asks. Put the why in the PR body for this PR; next time use a subject like `Add Gonzalo Burga to CONTRIBUTORS.md so the team can review a first onboarding PR`.
- **My decision:** accept-now (document in PR text; do not amend)
- **Why:** The this-PR fix is to state the why in the description. Rewriting `ad23499` would require a history rewrite and force-push.
- **Action taken:** edit `docs/onboarding/pr-description.md` — added **Commit history (comment 4)** with the why and the next-time subject. Did not `git commit --amend` or rebase.
- **Evidence:** local `pr-description.md` **Commit history** section (commit this file with `review-response-notes.md`). `ad23499` message unchanged.

### Comment 5
- **Theme:** other (`CONTRIBUTORS.md` row / link)
- **Blocking?** no
- **Reviewer said:** Row data is accurate and secret-free. Optional: turn `gonzaloburga-cs` into a GitHub profile link. Not required to merge; I still chose to fix now.
- **My decision:** accept-now
- **Why:** Small, safe Markdown improvement; still docs-only.
- **Action taken:** edit `CONTRIBUTORS.md` — GitHub cell is now a profile link
- **Evidence:** commit `2640b03`. Row: `[gonzaloburga-cs](https://github.com/gonzaloburga-cs)`.

## Follow-up commits (if any)
| Commit message | Files touched | Addresses which comment # |
| --- | --- | --- |
| Address review: list PR files, refresh notes, link GitHub handle (`2640b03`) | `CONTRIBUTORS.md`, `docs/onboarding/pr-description.md`, `docs/onboarding/first-contribution-notes.md` | 1, 2, 3, 5 |
| *(next commit)* Document review decisions; state commit-message why in PR description | `docs/onboarding/pr-description.md`, `docs/onboarding/review-response-notes.md` | 4 |

Comment 4: no amend of `ad23499`. Why is documented in `pr-description.md` **Commit history**. This notes file plus the description edit still need to be committed.

## PR description edits (if any)
- Sections changed: Approach + **Intended files**; What reviewers should look at; Test plan; **Commit history (comment 4)**
- Before → after: “formatted like neighbors” / “only the expected path(s)” → explicit four-file list; added why the roster exists and that `ad23499` will not be rewritten
- Why the edit helps a reviewer: Files changed is checkable; commit-message nit is answered without a force-push

## Re-verification checklist
- [x] Still on the same feature branch (not main) — `docs/first-contribution-gonzaloburga-cs`
- [x] Review-fix commit `2640b03` pushed to `origin`; PR #9 should show updated head
- [ ] `docs/onboarding/review-response-notes.md` not committed/pushed yet (do that next on this branch)
- [x] Diff vs `main` is docs-only: `CONTRIBUTORS.md`, `first-contribution-plan.md`, `first-contribution-notes.md`, `pr-description.md` (plus this notes file once committed — then add it to Intended files if the four-path test plan must stay exact)
- [x] No secrets, .env values, or machine-specific paths added
- [x] Manual checks claimed in the PR still pass for the four named files (table renders; no `.env` in diff; no `src/` or lockfiles)
- [x] Blocking comments (2, 3) have a written resolution and file edits in `2640b03`
- [x] Non-blocking items: Comment 4 documented in PR **Commit history** (no amend); Comment 5 fixed in `2640b03`

## Merge-readiness statement
From a beginner-onboarding view, comments 1–3 and 5 are on the branch (`2640b03`). Comment 4 is resolved without rewriting history: the why is in `pr-description.md` **Commit history**. Commit this notes file and the description edit, push the same feature branch, and paste the GitHub PR body. A human mentor should confirm base is still `EdTechForLearning/PREIShare-org-repo` `main` and Files changed stays docs-only.

## What I learned about review culture
- One habit I will keep: label blocking vs non-blocking and only fix blocking items (plus small accepted nits) before merge.
- One mistake I will avoid next time: writing a test plan that says “expected files” without naming them, and leaving verification notes behind the real diff.
