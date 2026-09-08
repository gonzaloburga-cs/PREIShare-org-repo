# Pull request description — first PREIshare contribution

**PR URL:** https://github.com/EdTechForLearning/PREIShare-org-repo/pull/9
**Base repository:** EdTechForLearning/PREIShare-org-repo
**Base branch:** main
**Head repository (my fork):** gonzaloburga-cs/PREIShare-org-repo
**Compare branch:** docs/first-contribution-gonzaloburga-cs
**Author:** Gonzalo Burga / gonzaloburga-cs
**Date opened:** 2026-09-07

## Problem
PREIshare had no clear, reviewed onboarding contribution from this engineer yet.
The team needs a small, low-risk change that proves the Git → review → merge path works
for a new teammate without touching product runtime code.

## Approach
- Added a personal entry to `CONTRIBUTORS.md` (new file: name, GitHub handle, date, role in a markdown table).
- Kept the change scoped to documentation only (no app, package, or config runtime edits).
- Followed the plan in `docs/onboarding/first-contribution-plan.md` and implementation notes in
  `docs/onboarding/first-contribution-notes.md`.

## Intended files (this PR)

The Files changed tab should show only these four paths:

1. `CONTRIBUTORS.md` — roster entry (the product change)
2. `docs/onboarding/first-contribution-plan.md` — onboarding plan (tutorial)
3. `docs/onboarding/first-contribution-notes.md` — implementation notes (tutorial)
4. `docs/onboarding/pr-description.md` — this description, kept in the repo for review

## What reviewers should look at
- [ ] `CONTRIBUTORS.md` — new file; row is accurate (name, handle, date, role) and free of secrets
- [ ] Diff contains only the four intended files above (no accidental `.env`, build output, or editor junk)
- [ ] Why this roster exists is stated in **Problem** and **Commit history** below (the original roster commit subject was file-focused; we did not rewrite it)

## Commit history (comment 4)

The team needed my name on `CONTRIBUTORS.md` so reviewers have a named, low-risk first contribution to practice the fork → review → merge path.

- Roster commit `ad23499` subject: `Add contributors row and first-contribution notes` (names files, not why).
- We are **not** amending that commit. The why lives here and in the PR title.
- Next similar change should use a subject like: `Add Gonzalo Burga to CONTRIBUTORS.md so the team can review a first onboarding PR`.

## Test plan
1. Open the Files changed tab and confirm only these four paths appear: `CONTRIBUTORS.md`, `docs/onboarding/first-contribution-plan.md`, `docs/onboarding/first-contribution-notes.md`, `docs/onboarding/pr-description.md`.
2. Skim `CONTRIBUTORS.md` in the PR diff: name/link/role lines render as valid Markdown.
3. Search the diff for tokens, passwords, or local absolute paths — expect none.
4. (Optional) Check out the branch locally and open `CONTRIBUTORS.md` in a Markdown preview.

## Screenshots / notes
No UI screenshots (docs-only change).  
Implementation decisions and verification notes: see `docs/onboarding/first-contribution-notes.md`.

## Checklist before requesting review
- [x] Feature branch is pushed and up to date with this description
- [x] PR title is specific (not “update” or “fixes”)
- [x] Description states problem, approach, and test plan
- [x] I can explain every staged line if a reviewer asks
