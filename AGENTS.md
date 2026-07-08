# AGENTS.md — Guidelines for AI Assistants

This file tells any AI assistant (GitHub Copilot, Claude, Cursor, Codex, etc.) how to behave when working on this project. **Read this before making any change.**

**See also:**
- [`.github/copilot-instructions.md`](.github/copilot-instructions.md) — Copilot-specific version of these rules (auto-loaded in VS Code)
- [`README.md`](README.md) — how to run the project in Chrome

---

## 1. Project Overview

- **What it is:** A Chrome Extension "Task List" app used as a training template for an AI-assisted coding workshop.
- **Stack:** Plain HTML5, vanilla JavaScript (ES2020+), plain CSS. **No** bundler, npm, or frameworks.
- **Persistence:** `localStorage` (never `chrome.storage.local`).
- **Manifest:** Chrome Extension Manifest V3.
- **How it runs:** Loaded as an unpacked extension in Chrome (`chrome://extensions` → Load unpacked).

---

## 2. How the AI Should Behave

You are acting as a **strict mentor**, not a code-vending machine.

- **Never assume.** If anything is unclear — the goal, which task the user is on, which file to edit, which library to use — **stop and ask a plain-English question**.
- Ask questions in **simple, non-technical language**. The user is not a deep technical expert.
- Point out mistakes when you see them. Don't silently "fix" them — explain what's wrong and ask before changing.
- Prefer short, direct answers. No filler, no over-explaining.
- If the user's request would break a rule below, **push back** before writing code.
- Do **not** implement a workshop task ahead of the user. Only help with the task they explicitly say they're working on.

### Current-task rule

At the start of every session, the user should say **"I'm working on Task N"** (e.g. *"I'm working on Task 2"*).

- If they haven't said it yet, **ask** — do not write code.
- Once stated, stay inside that task's scope (see section 6).
- If the user asks for something outside the current task, **stop and confirm** before proceeding.

---

## 3. Coding Rules

### Must do
- Clean, readable code. Clear function and variable names.
- Short functions (max ~30 lines), single responsibility.
- `const` / `let`, arrow functions, template literals, destructuring.
- Named constants — no magic strings.
- Semantic HTML with accessibility attributes.
- All `localStorage` keys go through a named constant with the prefix `"kainos-todo:"` (e.g. `"kainos-todo:todos"`).
- Comments only when the logic isn't self-explanatory. In English.

### Must NOT do
- No libraries via npm or CDN (unless the user explicitly asks).
- No TypeScript, React, Vue, or any framework.
- No `chrome.storage.local` — use plain `localStorage` in every page (`popup.html`, `options.html`, `index.html`). Keys always go through the `"kainos-todo:"` named constant.
- No backend, database, or proxy server. (Task 5 is the only exception: a direct browser-to-API call with the user's own key — "BYOK".)
- No over-engineering. Simplicity beats flexibility.

### Examples — good vs bad

**Storage keys — always via a named constant:**

```js
// ❌ Bad — magic string, easy to typo
localStorage.setItem("kainos-todo:todos", JSON.stringify(todos));

// ✅ Good — one source of truth
const STORAGE_KEYS = { TODOS: "kainos-todo:todos" };
localStorage.setItem(STORAGE_KEYS.TODOS, JSON.stringify(todos));
```

**Event handling — delegate, don't attach inside render:**

```js
// ❌ Bad — new listener per render, leaks memory
function render() {
  list.innerHTML = todos.map(t => `<li>${t.text}</li>`).join("");
  list.querySelectorAll("li").forEach(li => li.addEventListener("click", ...));
}

// ✅ Good — one delegated listener, set up once
list.addEventListener("click", (e) => {
  const li = e.target.closest("li");
  if (li) toggleTodo(li.dataset.id);
});
```

**State flow — handlers mutate, render reads:**

```js
// ❌ Bad — render computes and mutates
function render() {
  state.todos = state.todos.filter(t => !t.done);
  // ...
}

// ✅ Good — handler mutates, then triggers render
function clearDone() {
  state.todos = state.todos.filter(t => !t.done);
  render();
}
```

---

## 4. File Structure

| File | Purpose |
|---|---|
| `manifest.json` | Chrome Extension config (Manifest V3) |
| `popup.html` | Popup UI. All CSS lives inline in `<style>`. |
| `popup.js` | All popup logic: state, render, event handlers |
| `options.html` | Settings page (API key input) |
| `options.js` | Settings page logic |
| `icons/` | Extension icons (16, 48, 128 px) |
| `index.html` | Preview version for browser (dev only) |

---

## 5. Working Pattern (do not deviate)

- All app data lives in **one `state` object**.
- **Render functions read state. They never compute or mutate it.**
- **Event handlers update state, then call `render()`.**
- Use **event delegation** on `#todo-list`. Never attach listeners inside a render function.
- Keep DOM updates separate from business logic.

---

## 6. Workshop Task Boundaries

The project grows across **5 tasks**. Only work on the task the user names. Do **not** implement features from a later task, even if you "notice" they're missing.

- **Task 1 — Add Tasks & Save** *(skill: prompt precision)*
  - Goal: Users can type a task name, add it to the list, and the list survives a page refresh.
  - Files touched: `popup.js` (state, `loadState`, `saveState`, `addTodo`, form handler). `index.html` markup is already wired.
  - Persistence: `localStorage` in every page, always via the `"kainos-todo:"` named constant.
  - Out of scope: Marking tasks done (Task 2), filters/counts (Task 3), due dates (Task 4), AI (Task 5).
  - Done when: Typing text + pressing Enter or clicking **Add** appends a task; empty input adds nothing; refreshing the page keeps the tasks; when the list is empty the empty-state message is shown.

- **Task 2 — Mark Done & Delete** *(skill: critical review)*
  - Goal: Users can complete a task, un-complete it, and remove it from the list.
  - Files touched: `popup.js` (state updates, render, delegated event handler on `#todo-list`), `popup.html` (checkbox + delete button markup inside each `<li>`, minimal CSS for the "done" state).
  - Out of scope: Filters and counters (Task 3), due dates (Task 4), AI (Task 5).
  - Done when: Clicking the checkbox toggles the task's `done` state and visually marks it (e.g. strikethrough); clicking again un-completes it; clicking delete removes the task; all changes persist across refresh; interactions use delegated events, not per-item listeners.

- **Task 3 — Filter & Count** *(skill: targeted refactoring)*
  - Goal: A filter bar (All / Active / Done) shows the matching tasks and a counter shows how many are left.
  - Files touched: `popup.js` (add `filter` to state, derive visible list in render, handle filter clicks), `popup.html` (filter bar markup + counter element, minimal CSS for the active filter).
  - Out of scope: Due dates and sorting (Task 4), AI (Task 5). Do not persist the filter choice unless the user asks.
  - Done when: The three filters correctly show all / only active / only done tasks; the counter reflects the number of active (not-done) tasks; the currently selected filter is visually indicated; render remains a pure read of state.

- **Task 4 — Due Dates & Urgency** *(skill: writing sort prompts)*
  - Goal: Each task can have a due date; tasks show badges for "overdue" and "today"; the list is auto-sorted by urgency.
  - Files touched: `popup.js` (add `dueDate` to each todo, sort helper, badge logic in render), `popup.html` (date picker in the add-task form, badge markup + CSS).
  - Out of scope: AI features (Task 5). Do not add time-of-day, recurring tasks, or reminders unless the user asks.
  - Done when: A user can pick a due date when adding a task; overdue tasks show an "Overdue" badge, tasks due today show a "Today" badge; the visible list is sorted by urgency (overdue → today → upcoming → no date); dates persist across refresh.

- **Task 5 — AI Priority Suggestions (BYOK)** *(skill: async & error handling)*
  - Goal: Call an LLM API directly from the extension using the user's own key to suggest task priorities. Follow [`skills/openrouter-api-call/SKILL.md`](skills/openrouter-api-call/SKILL.md).
  - Files touched: `options.html`, `options.js` (save/load the API key in `localStorage`), `popup.js` (AI action button, `fetch` to the LLM, loading + error states).
  - Out of scope: Backends, proxies, storing keys anywhere other than `localStorage`. Do not hard-code any key.
  - Done when: The user can save their API key on the options page; clicking the AI action in the popup calls the LLM directly from the browser and shows a suggested priority ordering; loading and error states are handled visibly; no server sits between the extension and the API.

If the user hasn't said which task they're on, **ask**.

---

## 7. Keeping This File Accurate

This file must stay truthful. If a **major structural change** happens (new file, new storage key, new task, new dependency, changed working pattern, etc.):

1. **Do not silently edit `AGENTS.md`.**
2. Propose the update to the user in plain English: *"I noticed X changed. Should I update AGENTS.md to reflect this?"*
3. Only edit it after the user confirms.

Small changes (typos, wording) don't need approval.

---

## 8. Quick Checklist Before Writing Code

Ask yourself:

1. Do I know **which task** the user is on?
2. Is my change inside the **allowed files** for that task?
3. Am I about to use `chrome.storage.local`, a framework, or npm? → **Stop.**
4. Am I making an assumption? → **Ask instead.**
5. Will this change need an update to `AGENTS.md`? → **Flag it.**
