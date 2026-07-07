---
name: merge-pull-request
description: How to safely merge a Git branch into the main branch on GitHub via a pull request. Use when the user asks to merge code, open a PR, close a PR, resolve merge conflicts, choose a merge strategy (merge commit vs squash vs rebase), or clean up after merging.
---

# Merge a Pull Request on GitHub

## When to use this skill

Use this skill when the user asks to:
- Merge a branch into `main` (or `master`, `develop`, etc.).
- Open, review, or close a pull request.
- Resolve merge conflicts.
- Choose between merge / squash / rebase.
- Clean up local + remote branches after a merge.

Do **not** use this skill for:
- First-time repo setup (that's `git init` / `gh repo create` territory).
- Complex Git surgery (rebasing shared history, force-pushing to `main`, rewriting published commits) — stop and ask the user before doing any of these.

---

## Prerequisites — check before merging

Confirm all of the following. If any is missing, **stop and tell the user**.

1. The user has the `gh` CLI installed and authenticated (`gh auth status`), **or** they will merge via the GitHub web UI.
2. The working tree is clean (`git status` shows no uncommitted changes).
3. The feature branch is pushed to the remote (`git push -u origin <branch>`).
4. Tests / build / lint pass locally.
5. The target branch (usually `main`) is up to date locally (`git fetch origin`).

---

## Standard Steps

### 1. Make sure everything is committed and pushed

```bash
git status                     # working tree should be clean
git push -u origin <branch>    # push the branch to GitHub
```

### 2. Open a pull request

Prefer the CLI — it's faster and repeatable:

```bash
gh pr create \
  --base main \
  --head <branch> \
  --title "Short, imperative title (e.g. Add task-entry persistence)" \
  --body  "Why this change exists. What it does. How to test."
```

Or open via the web UI: GitHub will suggest the PR after you push.

### 3. Wait for checks and review

```bash
gh pr checks     # CI status
gh pr view --web # open the PR in the browser
```

Do **not** merge until:
- All required status checks are green.
- Required reviewers have approved.
- No unresolved review comments.

### 4. Pick a merge strategy

| Strategy | Use when | Command |
|---|---|---|
| **Squash** (recommended default) | Feature branch has messy WIP commits. One clean commit lands on `main`. | `gh pr merge --squash --delete-branch` |
| **Merge commit** | You want to preserve the branch's individual commits and see the merge point in history. | `gh pr merge --merge --delete-branch` |
| **Rebase** | You want a linear history with all branch commits replayed on top of `main`. Only if the branch is short-lived and hasn't been rebased already. | `gh pr merge --rebase --delete-branch` |

If the user hasn't picked one, **default to squash** and tell them why.

### 5. Clean up after merging

```bash
git checkout main
git pull origin main             # get the freshly merged commit
git branch -d <branch>           # delete the local branch (safe: fails if unmerged)
git remote prune origin          # tidy up stale remote refs
```

`--delete-branch` in step 4 already removes the branch on GitHub, so this step is mainly local cleanup.

---

## Handling merge conflicts

If GitHub flags a conflict, do **not** click "Resolve conflicts" in the web UI unless the change is trivial. Do it locally:

```bash
git checkout <branch>
git fetch origin
git merge origin/main            # or: git rebase origin/main
# ... fix conflicted files, keep the intended behaviour ...
git add <files>
git commit                       # or: git rebase --continue
git push                         # or: git push --force-with-lease (only if you rebased)
```

**Rules while resolving conflicts:**
- Read **both sides** before deciding. Never blindly keep "ours" or "theirs".
- Run tests after resolving, before pushing.
- Use `--force-with-lease`, **never** plain `--force` — the lease protects you from overwriting someone else's push.

---

## Rules & pitfalls

- **Never merge directly to `main` locally and push.** Always go through a PR so history, review, and CI are recorded.
- **Never force-push to `main`** (or any shared long-lived branch).
- **Never delete a branch that hasn't been merged** (`git branch -d` protects you; `git branch -D` bypasses the check — avoid it).
- **Never merge with a red CI** unless you have explicit sign-off and a clear reason.
- If the PR is large, **suggest splitting it** before merging — small PRs are easier to review and revert.
- Prefer **squash** for feature branches; it keeps `main` history readable.

---

## Rollback plan

If a merge breaks `main`:

```bash
# Option A — revert the merge commit (safe, keeps history)
git checkout main
git pull
git revert -m 1 <merge-commit-sha>
git push

# Option B — open a follow-up PR that fixes forward
```

**Do not** `git reset --hard` on `main` and force-push. Ever.

---

## Quick checklist before hitting "Merge"

1. Branch is pushed and PR is open.
2. CI is green.
3. Reviewers approved.
4. No unresolved comments.
5. Merge strategy chosen (default: squash).
6. Branch deletion enabled (`--delete-branch`).
7. Local `main` will be pulled right after.

If any answer is "no", **stop and confirm with the user**.
