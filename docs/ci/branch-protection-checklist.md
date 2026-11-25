# Branch protection checklist (PREIshare PR CI)

## Purpose

Connect the automated green/red signal from `.github/workflows/pr-ci.yml` to merge policy on protected branches. This document is for maintainers with admin access. Contributors without admin rights prepare and verify the checklist only.

This file does not turn on branch protection. No one with admin access applied these settings as part of writing the checklist.

## Protected branches

`docs/ci/pipeline-design.md` names one merge target: `main`. Do not add another branch here unless that design doc lists it.

- [ ] Protect `main`

## Required status checks

After the workflow has run at least once on a pull request, GitHub shows the check name. The workflow name is `PR CI`. The job id is `ci`. The job `name` is `Install, typecheck, build, lint, and test`. Require that job name, not the example name `quality` and not the id `ci`, unless a real pull-request check run shows a different string.

- [ ] Require status checks to pass before merging
- [ ] Required check name: `Install, typecheck, build, lint, and test` (often listed as `PR CI / Install, typecheck, build, lint, and test`)
- [ ] Turn on “Require branches to be up to date before merging” so the last green run includes the latest `main`, not an older base

## What CI already enforces (automated)

These are the steps in `.github/workflows/pr-ci.yml`, in order:

- Dependency install (`npm ci`)
- Typecheck (`npm run typecheck`)
- Production build (`npm run build`)
- Lint (`npm run lint`, which runs `tsc --noEmit --pretty false`)
- Tests (`npm run test`, Node’s built-in runner, not a browser suite)

The workflow runs on `pull_request` to `main` for `opened`, `synchronize`, and `reopened`. A new commit on an open pull request is `synchronize`, so CI runs again. `cancel-in-progress: true` cancels the older run for that same pull request.

## What humans still own (not optional)

- [ ] At least one human review and approval before merge
- [ ] AI-assisted review prompts are helpers only. They never approve, merge, or replace a human. Do not auto-merge because an AI comment says the change looks good.
- [ ] Secret handling, row-level security, auth, and whether the change matches the product stay outside a green CI check

## What not to require yet

- [ ] Do not require optional or flaky jobs that are not in `pr-ci.yml`
- [ ] Do not require a deploy or production job on pull requests. This workflow does not deploy.
- [ ] Do not store Supabase or embedding secrets in the pull-request workflow just to make a check pass

## Readiness sign-off

- [ ] Workflow file path: `.github/workflows/pr-ci.yml`
- [ ] Triggers: `pull_request` to `main` (`opened`, `synchronize`, `reopened`)
- [ ] Concurrency: cancel in-progress runs for the same pull request when new commits land
- [ ] Maintainer who can edit branch protection: __________________
- [ ] Date verified against a real PR check run: __________________

## Notes for Sprint 6 handoff

A red required check should block merge. A green check means install, typecheck, build, lint, and test passed. It does not mean product review is done. Learners who cannot change repository settings stop after this checklist is written and reviewed.

## Enforcement record

This section was added after the existing checklist. The sections above stay in this file. They describe the rules we intended. This section records what GitHub actually saved. Branch protection is a GitHub website setting, not code. Writing this file does not turn a rule on. A rule that did not save is not enforced. Do not describe it as on.

- Date: 2026-11-25
- GitHub user who tried: gonzaloburga-cs
- Repository visibility seen on the repo page: public
- Could open Settings and change rules: yes, I am an admin
- Screen used: ruleset
- Branch name pattern: main
- Paid upgrade: No paid GitHub upgrade was purchased.

### Intended rules versus what saved

Approver role: Gonzalo Burga (`gonzaloburga-cs`), the human reviewer. Merger role: Gonzalo Burga (`gonzaloburga-cs`), the maintainer. Those two jobs are the same person. Approval count from `docs/ci/pr-approval-roles.md`: at least 1. The AI assistant is not an approver.

- Require a pull request before merging. Wanted: yes. Result: saved. What I saw after refresh: the branch ruleset was Enabled, and this rule was still saved.
- Human approvals before merge. Count and approver roles from `docs/ci/pr-approval-roles.md`: at least 1 approval from Gonzalo Burga (`gonzaloburga-cs`), the human reviewer. The AI assistant is not an approver. Result: saved. What I saw after refresh: the branch ruleset was Enabled, and this approval requirement was still saved.
- Required status check from the existing workflow `.github/workflows/pr-ci.yml`. Exact check name selected: `Install, typecheck, build, lint, and test`. No new workflow was added. Result: saved. What I saw after refresh: that check name was the one selected, and the requirement was still saved on the Enabled ruleset.
- Who may merge, from `docs/ci/pr-approval-roles.md`: Gonzalo Burga (`gonzaloburga-cs`), the maintainer. Did GitHub limit merge to those people? could not set. This limit is not enforced by GitHub.

### Gaps

The three rules that were attempted — require a pull request, at least one human approval, and the status check `Install, typecheck, build, lint, and test` — saved, and the ruleset was Enabled after refresh.

- Restricting who can merge was not set. The ruleset screen did not get a limit to Gonzalo Burga (`gonzaloburga-cs`). GitHub does not enforce that limit.
- `docs/ci/pr-approval-roles.md` says Gonzalo Burga must not be the only human who approves, or merge alone, when the change touches privacy, sign-in, or money. That limit was not saved in GitHub. It is not enforced by the ruleset.
- “Require branches to be up to date before merging” is an intended rule in the checklist above. It was not reported as saved after refresh. This record does not treat it as enforced.

### What humans still do

People still follow `docs/ci/human-judgment-checklist.md` and `docs/ci/ai-review-orchestration.md` before merge, including when GitHub did not save the rule. The sample review in `docs/ci/sample-pr-review/critique-and-prompt-revision.md` is advice only and is not a required status check. The AI assistant does not approve or merge. The existing pr-ci workflow remains the only automated check this record tried to require.
