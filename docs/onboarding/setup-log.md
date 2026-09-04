# PREIshare team orientation notes

Author: Gonzalo Burga

Date: 2026-09-03

## 0. Team repository of record

- **Team repo (upstream):** https://github.com/EdTechForLearning/PREIShare-org-repo
- **My fork:** https://github.com/gonzaloburga-cs/PREIShare-org-repo
- I contribute by forking this repo and opening pull requests from my fork. I do not push to the team repo directly.

## 1. Product mission (my words)

PREIShare is used for real-estate to gather information about the market. I will join the team by setting up my environment and landing a small reviewed pull request. 


## 2. Everyday collaboration → engineering workflow

This is the same pattern as sharing a document or presentation and waiting for a review before it is final.

| Everyday picture | PREIShare engineering parallel 

| --- | --- |

| The official shared file the whole group uses | The shared project on the team repository (the default branch) 

| My own draft that I can edit without changing the official file | My separate line of work with one small change 

| Saving versions and leaving a short note about what I changed | A written history of the change, with a clear description 

| Asking a peer to look it over before it is published | Opening a pull request (PR) so someone can review it 

| The peer says it looks good, then we publish | Review passes, then the change can be accepted 

I am not listing Git commands here. Step 2 of the tutorial teaches those. This table is only the human picture: who drafts, who reviews, and when the change becomes official.

## 3. Actors in a pull-request workflow

- **The person proposing a change (me):** I pick a tiny, safe change, do it on my own line of work, describe it in writing, and answer review questions.
- **The shared project:** The team repository is the official copy. I do not edit that official copy directly.
- **The review:** A teammate (or a simulated reviewer for this course) checks that the change is small, correct, and easy to understand.
- **The moment the change is accepted:** After review, the pull request can be accepted. That is when my draft becomes part of the shared project.

## 4. First-PR definition of done (beginner-safe)

A definition of done is a checklist the team agrees on before starting work. The checklist is a list of things that must be true before the work is considered finished. Every item on the checklist must be checked off, or the work is still incomplete.

My first reviewed pull request is finished only when every item below is true:

1. **The change is small.** 
2. **The work is on a separate line of work.** 
3. **The change is described in a commit message.** 
4. **Someone reviews it before it is accepted.** 
5. **Every box on this list is checked off.**

If any box is unchecked, the first PR is not done.

## 5. Out of scope for the first PR

These are not part of the first contribution, even if they seem helpful:

- Large rewrites or “fix everything while I am here” edits
- Secrets, passwords, production credentials, or real customer data
- Tooling or product work that I cannot yet explain to a teammate in plain speech

## 6. How I will use AI on this team

I will use a chat assistant as a writing coach, not as the author of record. I bring my own mission sentence and my own definition-of-done bullets. The assistant helps me structure them. Then I rewrite any sentence I could not explain to a teammate.

I will not paste secrets into AI tools. I will not keep AI wording I cannot explain. AI tools should eventually understand this specific repo, but that setup comes after I can say what PREIShare is, who is in the pull-request loop, and what “first PR done” means.

## 7. Prepare the machine

- GitHub username: gonzaloburga-cs
- Team repo (upstream) URL: https://github.com/EdTechForLearning/PREIShare-org-repo
- My fork URL: https://github.com/gonzaloburga-cs/PREIShare-org-repo
- Close path (`pwd`): /Users/gonzaloburga/projects/PREIShare-org-repo
- Clone succeeded: YES

## 8. Command output
**git --version:** git version 2.50.1 (Apple Git-155)

```test
git config user.name: Gonzalo Burga 

git config user.email: gonzalo.burga11@gmail.com

git remote -v: 
origin  https://github.com/gonzaloburga-cs/PREIShare-org-repo.git (fetch)
origin  https://github.com/gonzaloburga-cs/PREIShare-org-repo.git (push)
upstream        https://github.com/EdTechForLearning/PREIShare-org-repo.git (fetch)
upstream        https://github.com/EdTechForLearning/PREIShare-org-repo.git (push)

Default branch: main 

git status: On branch main
Your branch is up to date with 'origin/main'.

nothing to commit, working tree clean

### Checklist
- Accounts — PASS
- Git identity — PASS
- PREIShare fork — PASS
- Clone path recorded and clone succeeded — PASS
- origin = my fork — PASS
- upstream = team repo — PASS
- Default branch — PASS
- git status clean — PASS
