const STORAGE_KEY = 'kainos-todo:todos';

const state = {
  todos: [],          // [{ id, text, done, createdAt, priority }]
  filter: 'all',      // 'all' | 'active' | 'done'
  aiLoading: false,
};

// ── Persistence ────────────────────────────────────────────────

function loadState() {
  // TODO Task 1: load todos from chrome.storage.local
  // Hint: chrome.storage.local.get(STORAGE_KEY, callback)
  // In the callback: set state.todos, then call render()
  render();
}

function saveState() {
  // TODO Task 1: save state.todos to chrome.storage.local
  // Hint: chrome.storage.local.set({ [STORAGE_KEY]: state.todos })
}

// ── Business logic ─────────────────────────────────────────────

function addTodo(text) {
  // TODO Task 1: create a todo object and add it to state.todos
  // Shape: { id: Date.now(), text: text.trim(), done: false, createdAt: new Date().toISOString(), priority: null }
  // Then: saveState(), render()
}

function toggleTodo(id) {
  // TODO Task 2: find the todo by id, flip its .done property
  // Then: saveState(), render()
}

function deleteTodo(id) {
  // TODO Task 2: remove the todo with matching id from state.todos
  // Then: saveState(), render()
}

function setFilter(filter) {
  // TODO Task 3: update state.filter, then call render()
}

function getVisibleTodos() {
  // TODO Task 3: return state.todos filtered by state.filter
  // 'all' → all todos, 'active' → done === false, 'done' → done === true
  return state.todos;
}

function setPriority(id, priority) {
  // TODO Task 5: find todo by id, set its .priority field
  // Then: saveState(), render()
}

// ── Render ─────────────────────────────────────────────────────

function renderList() {
  // TODO Task 2: generate an <li> for each todo in getVisibleTodos()
  // Each <li> should have:
  //   - class "todo-item" (+ "done" if todo.done)
  //   - data-id attribute
  //   - a checkbox (.todo-checkbox) with checked = todo.done
  //   - a span (.todo-text) with todo.text
  //   - a priority badge if todo.priority is set
  //   - a delete button (.btn-delete)
  //   - an AI button (.btn-ai) with text "✦ Priority" (Task 5)
}

function renderEmptyState() {
  // TODO Task 2: show #empty-state if getVisibleTodos() is empty, hide otherwise
}

function renderFilterBar() {
  // TODO Task 3: add/remove "active" class on filter buttons based on state.filter
}

function renderStats() {
  // TODO Task 3: update #stats text with count of active (not done) todos
}

function render() {
  renderList();
  renderEmptyState();
  renderFilterBar();
  renderStats();
}

// ── Event wiring ───────────────────────────────────────────────

function initHandlers() {
  // TODO Task 1: wire up form submit to call addTodo(todo-input value), clear the input

  // TODO Task 2: use event delegation on #todo-list for:
  //   - checkbox change → toggleTodo(id)
  //   - .btn-delete click → deleteTodo(id)
  //   - .btn-ai click → suggestPriority(id) [Task 5]

  // TODO Task 3: wire filter buttons to call setFilter(button.dataset.filter)

  // Options link
  document.getElementById('options-link').addEventListener('click', (e) => {
    e.preventDefault();
    chrome.runtime.openOptionsPage();
  });
}

// ── AI Feature (Task 5) ────────────────────────────────────────

async function suggestPriority(id) {
  // TODO Task 5:
  // 1. Read API key from chrome.storage.local ('kainos-todo:apiKey')
  // 2. If no key: alert user to open Settings and add their Anthropic API key
  // 3. Set state.aiLoading = true, render()
  // 4. POST to https://api.anthropic.com/v1/messages with:
  //    - model: 'claude-haiku-4-5-20251001'
  //    - max_tokens: 64
  //    - messages: [{ role: 'user', content: <prompt with todo text> }]
  //    - system: 'Respond with ONLY valid JSON: {"priority":"high"|"medium"|"low"}. No other text.'
  // 5. Parse response, call setPriority(id, priority)
  // 6. state.aiLoading = false, render()
  // Handle errors: network failure, missing key, bad JSON response
}

// ── Boot ───────────────────────────────────────────────────────

loadState();
initHandlers();
