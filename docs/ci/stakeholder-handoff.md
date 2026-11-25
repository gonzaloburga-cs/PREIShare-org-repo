# PREIshare Sprint 6 — Stakeholder Handoff

**Audience:** PREIshare product owners, tech leads, and reviewers
**Sprint goal:** A shared check on every pull request, plus AI help that does not replace a person’s decision
**Date:** 2026-11-17
**Author:** Gonzalo Burga

This note describes only what is already in `.github/workflows/pr-ci.yml` and `docs/ci/e2e-verification-log.md`. It does not add a deploy, a live database check, or any secret.

---

## 1. Client story recap (why we did this)

Before this work, each person had to remember to install dependencies and run the project checks on their own computer. Two computers could disagree. A broken change could reach `main` because opening a pull request did not start a shared check. Reviewers spent time asking “does it build?” instead of asking whether the change is right for the product.

**What changed:** The repository now contains a GitHub Actions workflow named **PR CI**. It is set to run when someone opens or updates a pull request that targets `main`. The same five commands run every time: install, typecheck, build, lint, and test. A person still decides whether the change is right and whether to merge it.

That live run has not happened yet. The verification on 2026-11-17 found no pull request and no Actions run on `gonzaloburga-cs/PREIShare-org-repo`. The same commands were run locally, and they passed. Pushing straight to `main` does not start this workflow.

**Source notes:** `docs/ci/pr-pain-and-goals.md`, `docs/ci/pipeline-design.md`, `docs/ci/e2e-verification-log.md`

---

## 2. What is automated on every pull request

The workflow file says GitHub should do the following on each pull request into `main`. Verification did not watch GitHub do it. The local run of the same commands is in section 6.

| Stage | What runs | Where defined |
| --- | --- | --- |
| Trigger | A pull request targeting `main`, when it is opened, updated with new commits, or reopened | `.github/workflows/pr-ci.yml` |
| Setup | Check out the code, set up Node 24, install from `package-lock.json` with `npm ci`. npm’s download cache is turned on. | same file |
| Quality gates | Typecheck, then production build, then lint, then test. Lint is the TypeScript check again (`tsc --noEmit --pretty false`). Test is Node’s built-in runner on `src/lib/embeddings/text.test.ts` (three tests). | same file and `docs/ci/ci-scripts-notes.md` |
| Overlapping runs | If new commits land on the same pull request, the older run is canceled | `concurrency` in the workflow |
| Failure behavior | If one of those commands fails, the check is red. There is no “keep going anyway” switch. A red check does **not** block the merge button until an admin turns on branch protection. | workflow, plus `docs/ci/branch-protection-checklist.md` |

**Plain-language summary for stakeholders:**

If install, types, the production build, the TypeScript lint, or those three tests break, the pull request should show a failed check once GitHub has actually run the workflow. The author should fix the pull request. They should not ignore a red check. A green check means those commands passed. It does not mean the product change is approved.

**What CI does not do:**

- It does not deploy the site.
- It does not apply database migrations or seed listings.
- It does not call Supabase or the embedding provider.
- It does not store or print secret values. No API keys are in the workflow file.
- It does not approve the pull request or press merge.
- It does not run a browser test.
- It does not fail because `npm` printed a vulnerability count. On the local install, npm reported 52 advisories, including 2 critical, and the install still succeeded.

`docs/ci/pipeline-design.md` is older than the workflow. It still says lint and test are missing. The workflow and `docs/ci/ci-scripts-notes.md` are the current list.

---

## 3. What humans still decide

| Decision | Owner | Why it stays human |
| --- | --- | --- |
| Approve, request changes, or merge | A named reviewer | A green check only means the five commands passed |
| Whether the screen and the product change are right | Reviewer | The workflow does not judge the dashboard |
| Auth, who can read a listing, and the service-role key | Reviewer | The verification log’s sample review asked who may call property search. The tests do not answer that |
| Where secrets live | Maintainer | Keys stay out of the workflow, the pull request text, and chat tools |
| Turning on “required checks” and “up to date before merging” | A repo admin | That is a GitHub setting. The checklist is written. It is not turned on |
| Whether to add a new kind of check later | Tech lead | A new linter, a live database test, or a dependency audit would be a separate decision. This sprint did not add them |

**AI-assisted review boundary:**

Reviewers may paste a prompt from `docs/ci/ai-pr-review-prompts.md` to get a summary, a list of risks, or questions. In the verification trial, the risk prompt asked questions about the service-role search path and did not say the change was approved or safe to merge. The human decision recorded there was to ask for more information, not to merge. AI output is advice. Only a person may approve or merge.

---

## 4. How to enable branch protection (operator checklist)

Admins should follow `docs/ci/branch-protection-checklist.md`. The settings to turn on are:

1. Protect `main`. No other branch is in the pipeline design.
2. Require the check named `Install, typecheck, build, lint, and test` before merge. Do not require a check named `quality`. GitHub may show it under the workflow name **PR CI**. Confirm the exact string on a real pull request before saving the setting. No pull request has shown it yet.
3. Require the branch to be up to date before merging, so the last green run includes the latest `main`.
4. Require at least one human review.
5. Do not put Supabase or embedding secrets into the pull-request workflow to force a check to pass.
6. Do not require a deploy job. This workflow does not have one.

**Status after verification:** [x] Not enabled yet  /  [ ] Enabled on main

**Evidence:** `docs/ci/e2e-verification-log.md`. The maintainer line and the “date verified against a real PR check run” line in the checklist are still blank.

---

## 5. Known limits and risks (honest scope)

| Limit | Impact | Recommended next action |
| --- | --- | --- |
| No pull request has triggered the workflow | Nobody can point to a green or red check on GitHub yet. Canceling an older run is written in the file and has not been seen | Open one pull request into `main` and read the Actions tab |
| Branch protection is off | A failing check does not stop someone from merging | An admin uses the checklist. Writing the checklist did not change the setting |
| Tests cover three embedding-text cases only | A green test does not prove search, sign-in, or database rules | Keep reviewing those by hand. Do not add live Supabase calls or secrets to this pull-request job to make the suite look larger |
| `npm ci` can print vulnerability warnings and still pass | A green install is not a promise that every dependency advisory is closed | Leave that as a warning unless the team later chooses a separate audit rule. Do not treat `npm audit fix --force` as part of this check |
| `docs/ci/pipeline-design.md` still says lint and test are missing | Someone reading only that doc will think the job stops after the build | Use the workflow and `docs/ci/ci-scripts-notes.md` for the commands that run today |
| A push directly to `main` does not start PR CI | The shared check runs for pull requests into `main` | Use a pull request when the change should be checked |

No flaky test was observed. The local test run was 3 passed, 0 failed. No mock database and no preview environment were added.

---

## 6. Verification snapshot

From `docs/ci/e2e-verification-log.md` on 2026-11-17, repo `gonzaloburga-cs/PREIShare-org-repo`, branch `main`:

- **Pull request opened / workflow triggered on GitHub:** no. The Actions list had zero runs. There is no run link.
- **Expected steps ran in order on a laptop:** yes. Windows, Node v24.12.0, npm. Order: `npm ci`, `npm run typecheck`, `npm run build`, `npm run lint`, `npm run test`. Each exited successfully.
- **Intentional failure experiment:** no. Nothing was broken on purpose to watch a red check.
- **AI review prompt trial:** yes. Prompt 2 (risk flags) stayed advisory. The person did not treat it as approval.
- **Blockers found:** GitHub has not executed the workflow; branch protection is not on; the exact check name has not been seen in GitHub’s list; the automated tests do not cover search, auth, or Supabase.

**Gate recorded in the log:** credible with known gaps. Safe to hand off with those caveats.

---

## 7. Artifact index (where everything lives)

| Artifact | Purpose |
| --- | --- |
| `docs/ci/pr-pain-and-goals.md` | Why the team wanted a shared pull-request check |
| `docs/ci/project-ci-inventory.md` | Which commands existed when the design was written, and which steps need secrets |
| `docs/ci/pipeline-design.md` | Early design. Lint and test are out of date in this file |
| `.github/workflows/pr-ci.yml` | The workflow GitHub will run |
| `docs/ci/ci-scripts-notes.md` | The five commands, in order, and how to run them locally |
| `docs/ci/branch-protection-checklist.md` | Settings an admin still has to turn on |
| `docs/ci/ai-pr-review-prompts.md` | Prompts that help a person read. They do not merge |
| `docs/ci/e2e-verification-log.md` | What was actually checked on 2026-11-17 |
| `docs/ci/stakeholder-handoff.md` | This note |

---

## 8. What should roll into the next Sprint 6 topic

1. Open a real pull request into `main`, confirm **PR CI** runs, and copy the check name GitHub shows.
2. Have an admin turn on branch protection with that check name, “up to date before merging,” and at least one human review. Confirm a red check blocks merge.
3. Leave secrets, deploys, migrations, and live Supabase calls out of pull-request CI unless the team makes a separate decision and a safe setup exists.
4. Bring `docs/ci/pipeline-design.md` in line with the workflow so it no longer says lint and test are missing.
5. After one or two real pull requests, adjust the AI prompts if they miss useful questions. Keep the rule that only a human may approve or merge.
6. Keep the service-role property search on the human review list until someone shows who may call it. The current tests do not cover that path.

---

## 9. One-paragraph executive summary

PREIshare now has a pull-request workflow that installs dependencies, checks types, builds the app, runs the TypeScript lint, and runs three small tests. Those commands passed on a Windows laptop with Node 24. GitHub has not run them yet, because no pull request was opened during verification, and branch protection is not on, so a red check would not block merge today. AI prompts can help a reviewer notice risks, and the trial prompt did not approve or merge anything. Production deploy, database changes, and secret keys stay out of this check. Admins should turn on branch protection only after a real pull request shows the check name `Install, typecheck, build, lint, and test`.

## Topic 2: AI review overlay on the finished CI gate

The topic 1 record above stays in force. Continuous integration is already done. The GitHub Actions workflow at `.github/workflows/pr-ci.yml` already installs, typechecks, builds, lints, and tests on pull requests. This section does not rebuild that workflow, the prompt pack, or the live site. It tells stakeholders how human review sits on top of that finished gate.

### Decision log: why humans remain the approvers

Approval and merge stay with the humans named in the roles file. Gonzalo Burga (`gonzaloburga-cs`) is the human reviewer and the maintainer who may merge. Those two jobs are the same person. A passing CI run cannot judge these four risks. The AI may comment. A person must decide.

| Risk | Why a human must decide | Artifact that supports the person |
| --- | --- | --- |
| Sign-in | A sponsor signs in with email and password so only that person reaches their own dashboard. A change can pass the commands and still let the wrong person in. | Roles file and human-judgment checklist |
| Money | Charges, payments, and money records are outside this dashboard work. An AI comment must not accept them. | Human-judgment checklist |
| Privacy | The practice review planted a privacy mistake on purpose. The human judged the advisor notes with the checklist. The assistant did not approve or merge, and the sample stayed unmerged. | Checklist and critique file |
| Product intent | A change can pass the commands and still drift from this purpose: PREIshare is the team's shared view of real-estate market information. | Overlay brief and checklist |

### Sprint 7 next actions

These items are already done and working. Do not list them as missing, unbuilt, or work to create.

- The pull-request CI workflow is done and running. Do not rebuild `.github/workflows/pr-ci.yml`.
- The AI review prompt pack, which is the system instruction, is done. Do not treat `docs/ci/ai-pr-review-prompts.md` as unwritten.
- The existing Production site is already live on the current Vercel Hobby project at `https://prei-share-org-repo-chi.vercel.app`. Do not create a new hosting project. Later confirmation uses that same public URL.
- Keep merge decisions with the humans named in the roles file. The AI remains an advisor.
- On future pull requests, follow the runbook and the human checklist.
- If the GitHub plan later allows a rule that is only documented today, apply it from the branch-protection checklist. Until then, leave that honest gap recorded. The gap does not mean CI was never built.

### What the AI review can and cannot do

The AI review can:

- Suggest findings on a pull request, in the required output shape from the system instruction.
- Help a human reviewer look faster. It is an advisor only.

The AI review cannot:

- Approve a pull request.
- Merge a pull request.
- Replace a human decision about sign-in, money, privacy, or product intent.
- Count as a required GitHub status check or a required reviewer.

A green CI check is evidence the commands passed. It is not permission to merge.

### Where to read the overlay

Do not look for a second handoff file. Start with the overview, then open the piece you need.

| Piece | Path | What a stakeholder uses it for |
| --- | --- | --- |
| Overlay overview | `docs/ci/ai-review-overlay-brief.md` | Why this review layer exists |
| Who may approve and who may merge | `docs/ci/pr-approval-roles.md` | Humans only; the AI is an advisor |
| System instruction and output shape | `docs/ci/ai-pr-review-prompts.md` | How the AI must answer |
| Human-judgment checklist | `docs/ci/human-judgment-checklist.md` | Sign-in, money, privacy, and product intent |
| Review runbook | `docs/ci/ai-review-orchestration.md` | The same sequence every time |
| Sample critique and prompt revision | `docs/ci/sample-pr-review/critique-and-prompt-revision.md` | What the practice review taught us |
| Branch-protection record | `docs/ci/branch-protection-checklist.md` | What GitHub actually saved |
| Practice sample | `docs/ci/samples/README.md` | The planted privacy sample; not app code |

### Branch protection: enforced now versus only documented

Copied from `docs/ci/branch-protection-checklist.md`. This handoff does not change GitHub settings.

#### Enforced on this repository now

- Require a pull request before merging. The enforcement record marks this saved on an Enabled ruleset for `main`.
- At least 1 human approval before merge, from Gonzalo Burga (`gonzaloburga-cs`), the human reviewer. The AI assistant is not an approver. The enforcement record marks this saved.
- The status check `Install, typecheck, build, lint, and test` from `.github/workflows/pr-ci.yml`. No new workflow was added. The enforcement record marks this saved.

#### Documented but not enforced on this plan

- Restricting who may merge to Gonzalo Burga (`gonzaloburga-cs`), the maintainer. The enforcement record says this could not be set, so GitHub does not enforce it.
- Gonzalo Burga must not be the only human who approves, or merge alone, when the change touches privacy, sign-in, or money. `docs/ci/pr-approval-roles.md` states that limit. The enforcement record says it was not saved.
- Require branches to be up to date before merging. The checklist intended this rule. The enforcement record says it was not reported as saved after refresh, so this handoff does not treat it as enforced.

The AI assistant is not a required approver and is not a required status check.

### Sample privacy pull request

The practice pull request with one planted privacy mistake was not merged. The practice files stay under `docs/ci/samples/` for learning. They are not live member-facing code. Sprint 7 must not merge that sample.

### What stakeholders should remember

The automatic checks stay required evidence. The person who approves is still a person. The sample privacy change was not merged.
