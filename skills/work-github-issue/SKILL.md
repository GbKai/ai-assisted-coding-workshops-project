---
name: work-github-issue
description: End-to-end workflow for working on a GitHub issue in this project. Use when the user asks to "work on issue #N", "implement issue #N", "fix issue #N", "start on that issue", or references an issue URL from github.com. Covers: reading the issue, creating a branch, implementing, opening a PR that auto-closes the issue, merging, and cleaning up. Delegates the merge step to the `merge-pull-request` skill.
---

# Work a GitHub Issue

Complete lifecycle for picking up an issue and landing a merged PR that closes it.

## When to use this skill

Use when the user asks to:
- "Work on issue #N" / "implement #N" / "fix #N" / "do the XSS one"
- Reference an issue URL (e.g. `https://github.com/<owner>/<repo>/issues/N`)
- "Start on that issue" after listing issues

Do **not** use for:
- Creating new issues (that's a separate `gh issue create` call)
- Triaging/labelling issues (needs no skill)
- Answering "what's in issue #N" (a plain `gh issue view #N` is enough)

---

## Prerequisites — check before starting

1. `gh` CLI is authenticated (`gh auth status`).
2. Working tree is clean (`git status`) — **if not, stop and ask the user how to handle uncommitted changes.**
3. Currently on the default branch (`main` unless the user says otherwise), up to date with origin.
4. Default repo is set (`gh repo set-default` if needed).
5. Issues tab is enabled on the fork/repo (if not, tell the user before proceeding).

If any prerequisite fails, **stop and surface it** — do not paper over it with `git stash` or `--force` unless the user explicitly asks.

---

## Steps

### 1. Read the issue

```bash
gh issue view <N> --json number,title,labels,body,state
```

Confirm:
- The issue is **open** — refuse to work on `closed` issues without explicit user confirmation.
- The acceptance criteria are clear enough to implement. If not, stop and ask the user to clarify.
- The scope is not larger than one PR. If it is, propose splitting into sub-issues first.

### 2. Plan and get user approval

Before writing code, **summarise back to the user**:
- What the issue is asking for (in plain English, 1–3 sentences)
- Which files you'll touch
- The commit message and branch name you'll use
- Any decisions the user needs to make (options, trade-offs)

Wait for approval. Do **not** skip this step even if the issue looks obvious.

### 3. Create a branch

Naming convention:

| Issue type | Branch prefix | Example |
|---|---|---|
| Bug / security | `fix/` | `fix/xss-task-rendering` |
| Workshop task | `task-N/` | `task-2/mark-done-delete` |
| New feature | `feat/` | `feat/manifest-v3-shell` |
| Chore / tooling | `chore/` | `chore/eslint-prettier-config` |
| Docs | `docs/` | `docs/agents-md-update` |

```bash
git checkout -b <prefix>/<short-slug>
```

Keep slugs lowercase, hyphenated, and short (< 40 chars).

### 4. Implement

- Follow every rule in `AGENTS.md` and `.github/copilot-instructions.md`.
- If the issue conflicts with a project rule, **stop and flag it** — do not silently violate the rule.
- Keep the change scoped to what the issue's acceptance criteria demand. No drive-by refactors.
- If a related skill exists (e.g. `openrouter-api-call` for API work), follow it.

### 5. Verify

Before committing:
- Run the app in the browser preview and verify each acceptance-criterion item.
- If the issue has a security element (e.g. XSS), craft a **negative test** that would have triggered the bug before the fix and confirm it no longer does.
- If you added or changed persistence, verify data survives a page reload.

### 6. Commit

Use Conventional Commits. **Include `Closes #N` in the commit body** — GitHub uses this to auto-close the issue when the PR merges.

```
<type>(<scope>): <short summary>

<body — what changed and why, wrapped at ~72 chars>

Closes #<N>

Provenance: <upstream reference if any>
```

Types: `fix`, `feat`, `chore`, `docs`, `refactor`, `test`. Scope is optional but useful (e.g. `security`, `task-1`, `tooling`).

### 7. Push and open the PR

```bash
git push -u origin <branch>
gh pr create \
  --base main \
  --head <branch> \
  --title "<same as commit summary>" \
  --body  "Closes #<N>.

<what changed>

## Verified
<bullet list of manual checks>

<optional provenance line>"
```

**Every PR body must contain `Closes #<N>`** (or `Fixes #<N>` / `Resolves #<N>`). This is what closes the issue on merge.

### 8. Merge

Delegate to the **`merge-pull-request`** skill for:
- Checking `mergeable` / `mergeStateStatus`
- Choosing merge strategy (default: `--squash`)
- Deleting the branch
- Local cleanup (`git checkout main && git pull && git remote prune origin`)

Do **not** duplicate that skill's logic here.

### 9. Confirm closure

```bash
gh issue view <N> --json state,closedAt
```

Expected: `"state": "CLOSED"`. If not, the `Closes #N` reference wasn't picked up — check the PR body/commit message and manually close with `gh issue close <N>`.

### 10. Report back

Give the user a short summary:
- PR link and merge commit SHA
- Issue link (marked closed)
- What changed in one sentence
- What's next (e.g. "backlog now shows N open issues")

---

## Rules & pitfalls

- **Never commit directly on `main`.** Every issue gets its own branch.
- **Never merge without checking mergeability** and (where present) CI + review requirements.
- **Never work multiple issues on the same branch.** One issue → one branch → one PR → one merge.
- **Never rewrite an issue's scope silently.** If the acceptance criteria are wrong or ambiguous, update the issue (or ask the user to) *before* implementing.
- **Never close an issue manually** if a merged PR should have closed it — investigate why the reference didn't work.
- **Never use `git push --force` on a shared branch.** Use `--force-with-lease` on your own PR branch only.
- **Stay in scope.** Additional problems spotted during implementation → **file new issues**, don't fold them in.
- **Respect `AGENTS.md`.** If the issue's technical notes conflict with project rules, escalate — the rules win unless the user changes them.

---

## See also

- [`../merge-pull-request/SKILL.md`](../merge-pull-request/SKILL.md) — the merge & cleanup procedure this skill delegates to
- [`../../AGENTS.md`](../../AGENTS.md) — project rules that constrain every implementation
