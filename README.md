# Kainos Task List — Workshop Template

Training template for an AI-Assisted Coding workshop. The project is a **Chrome Extension Task List app** that grows across 5 tasks, each adding a new layer while practising AI-assisted coding with GitHub Copilot and Claude.

---

## Prerequisites

Install **before** the workshop:

1. **VS Code** — https://code.visualstudio.com/
2. **GitHub Copilot** — subscription or trial required
   (Ctrl+Shift+X → search "GitHub Copilot" → install both Copilot + Copilot Chat)
3. **Google Chrome** — latest version
4. **OpenRouter API key** — needed for Task 5 only:
   - Create a free account at https://openrouter.ai/
   - Generate an API key at https://openrouter.ai/keys
   - Free tier gives access to several models
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
| `manifest.json` | Chrome Extension manifest (Manifest V3). Declares the popup, options page and OpenRouter host permission. |
| `index.html` | Popup UI (referenced by `manifest.json`). Also opens directly in a browser as a standalone preview. |
| `popup.js` | Application logic — state, render, event handlers. |
| `options.html` | Settings page — OpenRouter API key input. |
| `options.js` | Settings logic — loads and saves the API key in `localStorage`. |
| `icons/` | Extension icons. Only `icon.svg` is checked in; generate PNGs (see note below) if you want a custom toolbar icon. |
| [`AGENTS.md`](AGENTS.md) | Rules that apply to any AI assistant working on this project |
| `.github/copilot-instructions.md` | Copilot-specific rules (auto-loaded in VS Code) |
| [`.github/agents/`](.github/agents) | Custom agents you can pick from the VS Code agent selector |
| [`skills/`](skills) | Reusable procedures the AI pulls in only when relevant |

> **Icons note (optional):** The extension loads fine without PNG icons — Chrome will show a default puzzle piece in the toolbar. To add a real icon, generate `icons/icon16.png`, `icons/icon48.png`, and `icons/icon128.png` (e.g. via [favicon.io](https://favicon.io/favicon-generator/)) and add an `icons` field to `manifest.json` referencing them. A reference SVG is provided in `icons/icon.svg`.

---

## AI Assistant Setup

This template ships with three layers of AI customisation. They're what makes an AI assistant behave consistently and safely inside this project.

- **Always-on rules** — [`AGENTS.md`](AGENTS.md) and [`.github/copilot-instructions.md`](.github/copilot-instructions.md). Loaded automatically on every prompt; define what the AI must/must-not do (no npm, no frameworks, storage-key conventions, etc.).
- **Skills** — [`skills/`](skills). Reusable procedures the AI pulls in only when the task matches. Currently:
  - `grilling` — stress-test a plan with one-question-at-a-time interrogation
  - `merge-pull-request` — safe PR merge lifecycle
  - `work-github-issue` — pick up an issue, branch, PR, close
  - `openrouter-api-call` — how to call OpenRouter for Task 5
- **Custom agents** — [`.github/agents/`](.github/agents). Specialist agents selectable from the VS Code agent picker. Currently:
  - `Code Reviewer` — read-only reviewer that reports in plain English for non-technical readers

If any of this is unfamiliar, that's fine — you'll be introduced to it during the workshop.

---

## Workshop Plan

| Task | What you build |
|---|---|
| Task 1 | Add tasks & persist with `localStorage` |
| Task 2 | Mark done & delete with event delegation |
| Task 3 | Filter bar (All / Active / Done) & task counter |
| Task 4 | Due dates, urgency badges & sorting |
| Task 5 | AI priority suggestions via OpenRouter API |

---

## Branches and Checkpoints

Each task branch is a starting point — it contains completed code from all previous tasks. If you get stuck or run out of time, simply switch to the next branch and continue from there.

| Branch | State |
|---|---|
| `task-1` | Starting point for Task 1 (template with stubs) |
| `task-2` | Task 1 complete — starting point for Task 2 |
| `task-3` | Tasks 1–2 complete — starting point for Task 3 |
| `task-4` | Tasks 1–3 complete — starting point for Task 4 |
| `task-5` | Tasks 1–4 complete — starting point for Task 5 |
| `final` | All 5 tasks complete |

> **Can't finish a task?** No problem — the next branch has it done for you. Just `git stash`, checkout the next branch, and keep going.

### Git Workflow

```bash
git checkout task-1        # start here

git checkout -b my-task-1  # your working branch
# … code with Copilot …
git add . && git commit -m "feat: add and display todos with localStorage"

# Stuck? Check the next branch for a working reference:
git stash                  # save your work
git checkout task-2        # has Task 1 already done
```

---

## Technical Requirements

- Browser: **Google Chrome** (required — extension APIs are Chrome-specific)
- VS Code with GitHub Copilot
- Internet connection (GitHub Copilot, OpenRouter API for Task 5)

---

## Support

Run into setup problems? Contact the instructor **before** the workshop day.
