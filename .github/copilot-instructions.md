# AI Assistant Guidelines for This Project

## Stack
- Plain HTML5, vanilla JavaScript (ES2020+), plain CSS (no framework)
- No bundler, no npm, no frameworks
- Persistence: `localStorage` (NOT `chrome.storage.local`)
- Runs as a Chrome Extension (Manifest V3)

## Code Standards
- Write CLEAN, READABLE code with clear function and variable names
- Keep functions short (max ~30 lines), single responsibility
- Comment only where logic isn't self-explanatory, in English
- Use const/let, arrow functions, template literals, destructuring
- No magic strings — use named constants
- Use semantic HTML with proper accessibility attributes

## What NOT to Do
- Don't add libraries via npm or CDN without explicit request
- Don't introduce TypeScript, React, or other frameworks
- Don't use `chrome.storage.local` — use plain `localStorage` in every page (`popup.html`, `options.html`, `index.html`). Keys always use the `"kainos-todo:"` prefix via a named constant.
- Don't add a backend, database, or proxy (Task 5 is an exception — BYOK direct API call)
- Don't over-engineer — simplicity wins over flexibility

## File Structure
- `popup.html` — extension popup UI; all CSS is inlined in `<style>`
- `popup.js` — all popup logic: state, render functions, event handlers
- `options.html` — settings page for API key
- `options.js` — settings page logic
- `manifest.json` — Chrome Extension manifest (Manifest V3)
- `localStorage` keys: always via a named constant, prefix `"kainos-todo:"` (e.g. `"kainos-todo:todos"`)

## Working Pattern
- Keep state in a single `state` object
- Separate DOM updates from business logic
- Render functions read state, never compute it
- Event handlers update state, then call `render()`
- Use event delegation on `#todo-list` — do not attach listeners inside render functions
