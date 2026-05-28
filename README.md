# Scrum Poker — Workshop Template

Training template for an AI-Assisted Coding workshop. The project grows alongside the theory across 4 tasks, each adding a new layer to the application.

---

## Prerequisites

Install **before** the workshop:

1. **VS Code** — https://code.visualstudio.com/
2. **Live Server extension** in VS Code  
   (Ctrl+Shift+X → search "Live Server" → install by Ritwick Dey)
3. **GitHub Copilot** — subscription or trial required  
   (Ctrl+Shift+X → search "GitHub Copilot" → install both Copilot + Copilot Chat)
4. **Anthropic API key** — needed for Task 4 only:
   - Create an account at https://console.anthropic.com/
   - Add credit (minimum $5 — Task 4 uses ~$0.50–1.00)
   - **Set a spending limit** in the console to avoid surprises
5. **GitHub account** — for forking the repo

---

## Running the Project

1. Clone the repo: `git clone <url>`
2. Open the folder in VS Code
3. Right-click `index.html` → **"Open with Live Server"**  
   (or click **"Go Live"** in the bottom-right status bar)
4. Browser opens at `http://127.0.0.1:5500`
5. Done ✅

No `npm install`, no bundler, no configuration.

---

## Project Structure

| File / Folder | Purpose |
|---|---|
| `index.html` | Page structure |
| `app.js` | Application logic |
| `data/sample-stories.json` | Sample user stories for Task 2 |
| `_NEXT.md` | **Read this first** — tells you what to build on this branch |
| `TASKS.md` | Full description of all 4 workshop tasks |
| `CONVENTIONS.md` | Code conventions + working-with-AI tips |
| `PROMPTS.md` | Prompt library (filled in during the workshop) |
| `.github/copilot-instructions.md` | AI context file for GitHub Copilot |

---

## Workshop Plan

See `TASKS.md` for full task descriptions.

| Task | Duration | What you build |
|---|---|---|
| Task 1 | ~2h | Dark mode · Nickname · Vote counter |
| Task 2 | ~2–3h | User stories · Backlog CRUD · Navigation |
| Task 3 | ~3–4h | Session history · Statistics · Chart |
| Task 4 | ~3h | AI feature in the app (BYOK pattern) |

---

## Branches and Checkpoints

Each task has a reference implementation on a dedicated branch:

| Branch | State |
|---|---|
| `main` | Starting point — hello world |
| `task-1-complete` | After Task 1 |
| `task-2-complete` | After Task 2 |
| `task-3-complete` | After Task 3 |
| `task-4-complete` | Final state |

### How to Use Checkpoints

**Standard flow:** start on `main`, read `_NEXT.md`, do Task 1 on your own branch, continue forward. Your code evolves.

**Stuck?** Switch to `task-X-complete`, compare with your code, learn, continue.

**Fell behind?** Switch to the latest complete checkpoint and carry on — you won't be left behind.

### Git Workflow

```bash
git checkout main          # start here
cat _NEXT.md               # read the brief

git checkout -b my-task-1  # your working branch
# … code with Copilot …
git add . && git commit -m "feat: dark mode, nickname, vote counter"

# Compare with reference:
git checkout task-1-complete
# Read, learn, then move on

git checkout -b my-task-2
cat _NEXT.md               # new brief
```

---

## Technical Requirements

- Browser: Chrome / Firefox / Edge (latest)
- VS Code with Live Server
- Internet connection (Tailwind CDN, GitHub Copilot, Anthropic API for Task 4)

---

## Support

Run into setup problems? Contact the instructor **before** the workshop day.