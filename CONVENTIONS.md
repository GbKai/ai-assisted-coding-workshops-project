# Project Conventions

## Git Workflow
- Conventional commits: `feat:`, `fix:`, `refactor:`, `docs:`, `style:`, `chore:`
- Feature branches: `feature/task-1-storage`, `feature/task-2-complete-delete`
- Merge to main after completing each task

## Naming
- Functions: camelCase, verbs — `addTodo`, `toggleTodo`, `deleteTodo`
- Variables: camelCase, nouns — `visibleTodos`, `activeCount`
- Constants: UPPER_SNAKE_CASE — `STORAGE_KEY`, `API_KEY_STORAGE_KEY`
- `chrome.storage.local` keys: always via a named constant, prefix `"kainos-todo:"`

---

## Working with GitHub Copilot — Best Practices

### Effective Prompts

**BE SPECIFIC** — include where, what technology, and what the expected outcome is:
> "Implement `loadState()` in `popup.js` using `chrome.storage.local.get` with `STORAGE_KEY`. In the callback, populate `state.todos` from the stored value (default to an empty array), then call `render()`."

**NOT:**
> "save the todos"

---

**PROVIDE CONTEXT** — reference the exact file and function:
> "Update the `toggleTodo` function in `popup.js` to flip `todo.done`, call `saveState()`, then call `render()`."

**NOT:**
> "make the checkbox work"

---

**DEFINE CRITERIA** — state validation rules and UX behaviour explicitly:
> "Add input validation: trim whitespace, ignore empty strings, max 200 characters. Show nothing if empty — do not add a blank task."

**NOT:**
> "add validation"

---

### Anti-Patterns to Avoid
- ❌ `"make it better"` — Copilot doesn't know what "better" means to you
- ❌ `"fix the bugs"` — specify which bug and what the expected behaviour is
- ❌ `"add everything needed"` — you'll get 500 lines of unwanted code
- ❌ `"just do it"` — Copilot will invent something you won't like

### Workflow with GitHub Copilot
1. Read the brief in `NEXT.md`
2. Write a user story for the feature (yourself or ask Copilot Chat to help)
3. Ask Copilot Chat for an implementation plan (3–5 steps, code optional)
4. Accept the plan or refine it
5. Implement step by step — **not** everything at once
6. Verify each step works in the extension before moving on
7. Add successful prompts to `PROMPTS.md`
