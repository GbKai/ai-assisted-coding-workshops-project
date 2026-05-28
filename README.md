# Kainos Task List — Workshop Template

Training template for an AI-Assisted Coding workshop. The project is a **Chrome Extension Task List app** that grows across 5 tasks, each adding a new layer while practising AI-assisted coding with GitHub Copilot and Claude.

---

## Prerequisites

Install **before** the workshop:

1. **VS Code** — https://code.visualstudio.com/
2. **GitHub Copilot** — subscription or trial required
   (Ctrl+Shift+X → search "GitHub Copilot" → install both Copilot + Copilot Chat)
3. **Google Chrome** — latest version
4. **Anthropic API key** — needed for Task 5 only:
   - Create an account at https://console.anthropic.com/
   - Add credit (minimum $5 — Task 5 uses ~$0.10–0.30)
   - **Set a spending limit** in the console to avoid surprises
5. **GitHub account** — for forking the repo

---

## Running the Project

No `npm install`, no bundler, no Live Server needed. The app runs as a Chrome Extension.

1. Clone the repo: `git clone <url>`
2. Open Chrome and go to `chrome://extensions`
3. Enable **Developer mode** (toggle in the top-right corner)
4. Click **Load unpacked** and select the project root folder
5. The Kainos Task List icon appears in the Chrome toolbar — click it to open the popup
6. Done

**After every code change:** click the refresh icon (↺) on the extension tile in `chrome://extensions`, then reopen the popup.

**Debugging:** right-click the popup → **Inspect** → Console tab.

---

## Project Structure

| File / Folder | Purpose |
|---|---|
| `manifest.json` | Chrome Extension configuration (Manifest V3) |
| `popup.html` | Popup UI — structure + all CSS (Kainos theme) |
| `popup.js` | Application logic — all function stubs for Tasks 1–5 |
| `options.html` | Settings page — Anthropic API key input |
| `options.js` | Settings logic — stubs for Task 5 |
| `icons/` | Extension icons (16, 48, 128 px) |
| `NEXT.md` | **Read this first** — tells you what to build on this branch |
| `TASKS.md` | Full description of all 5 workshop tasks |
| `CONVENTIONS.md` | Code conventions + working-with-AI tips |
| `PROMPTS.md` | Prompt library (filled in during the workshop) |
| `.github/copilot-instructions.md` | AI context file for GitHub Copilot |

> **Icons note:** Generate `icons/icon16.png`, `icons/icon48.png`, and `icons/icon128.png` before loading the extension. Use [favicon.io](https://favicon.io/favicon-generator/) or any icon tool. A reference SVG is provided in `icons/icon.svg`.

---

## Workshop Plan

See `TASKS.md` for full task descriptions.

| Task | Duration | What you build |
|---|---|---|
| Task 1 | ~1.5h | Add & display TODOs · `chrome.storage` persistence |
| Task 2 | ~1.5h | Complete & delete · Empty state · Event delegation |
| Task 3 | ~1.5h | Filter bar (All / Active / Done) · Task counter |
| Task 4 | ~2h | Reorder tasks (move up / down) · Keyboard shortcuts |
| Task 5 | ~2h | AI priority suggestions via Claude API (BYOK) |

---

## Branches and Checkpoints

Each task has a reference implementation on a dedicated branch:

| Branch | State |
|---|---|
| `main` | Starting point — skeleton with stubs |
| `task-1-complete` | After Task 1 |
| `task-2-complete` | After Task 2 |
| `task-3-complete` | After Task 3 |
| `task-4-complete` | After Task 4 |
| `task-5-complete` | Final state |

### Git Workflow

```bash
git checkout main          # start here
cat NEXT.md                # read the brief

git checkout -b my-task-1  # your working branch
# … code with Copilot …
git add . && git commit -m "feat: add and display todos with chrome.storage"

# Compare with reference:
git checkout task-1-complete
# Read, learn, then move on

git checkout -b my-task-2
cat NEXT.md                # new brief
```

---

## Technical Requirements

- Browser: **Google Chrome** (required — extension APIs are Chrome-specific)
- VS Code with GitHub Copilot
- Internet connection (GitHub Copilot, Anthropic API for Task 5)

---

## Support

Run into setup problems? Contact the instructor **before** the workshop day.
