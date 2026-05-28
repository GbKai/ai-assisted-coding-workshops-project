# Next Step: Task 1 — Add & Display Tasks

## Where You Are

Fresh start. The extension loads with a hard-coded list of sample tasks in `popup.js` so you can see the UI.
The `addTodo`, `loadState`, and `saveState` functions are stubs — nothing persists yet.

## What You'll Build

Three features, one at a time:

1. **Add a task** — wire up the form so typing text and clicking Add creates a new todo item
2. **Persist tasks** — implement `loadState()` and `saveState()` using `chrome.storage.local`
3. **Render the list** — implement `renderList()` to display each todo as an `<li>`

By the end, tasks survive popup close and reopen.

## Learning Objectives

- Writing precise prompts in a real project context
- Configuring GitHub Copilot with `.github/copilot-instructions.md`
- Iterating on AI-generated code
- Recognising how prompt specificity affects output quality

## Suggested Steps

1. Open Chrome and load the extension unpacked from the project root (`chrome://extensions` → Developer mode → Load unpacked)
2. Click the extension icon — verify the popup opens and shows the sample tasks
3. Read `CONVENTIONS.md` — especially the "Working with GitHub Copilot" section
4. Read `.github/copilot-instructions.md` to see what context Copilot has, then update it to describe the actual project stack
5. Implement **`addTodo(text)`** first — create the todo object and push it to `state.todos`
6. Wire up the form submit in `initHandlers()` to call `addTodo`
7. Implement **`saveState()`** using `chrome.storage.local.set`
8. Implement **`loadState()`** using `chrome.storage.local.get` — replace the hard-coded todos
9. After each step — reload the extension and verify it works before moving on

## Prompting Tips

Try three levels of specificity across the three features and notice how the results differ:

- **`addTodo`** — very specific prompt (see the example in `PROMPTS.md`)
- **`saveState`** — medium specificity: _"Save state.todos to chrome.storage.local using STORAGE_KEY"_
- **`loadState`** — open: _"I want tasks to survive popup close"_

## Self-Check

Before moving on, verify:
- [ ] Type a task and click Add — it appears in the list
- [ ] Close and reopen the popup — the task is still there
- [ ] Add 3 tasks — all three appear in order
- [ ] Empty input → Add does nothing
- [ ] You can explain at least one decision Copilot made that you would have done differently

## What's Next

After completing Task 1, read `TASKS.md` for the Task 2 brief.

## Estimated Time

~1.5 hours
