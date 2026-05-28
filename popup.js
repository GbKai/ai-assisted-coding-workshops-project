const STORAGE_KEY = 'kainos-todo:todos';

const state = {
  todos: [
    // TODO Task 1: remove these hardcoded todos and load from chrome.storage.local instead
    { id: 1, text: 'Listen carefully to the trainer 🎧', done: true, createdAt: '2026-01-01T09:00:00.000Z', priority: null },
    { id: 2, text: 'Stop asking ChatGPT, use Copilot instead', done: false, createdAt: '2026-01-01T10:00:00.000Z', priority: null },
    { id: 3, text: 'Actually read the prompt before hitting Enter', done: false, createdAt: '2026-01-01T11:00:00.000Z', priority: null },
    { id: 4, text: 'Work hard on tasks (yes, all 5 of them)', done: false, createdAt: '2026-01-01T12:00:00.000Z', priority: null },
  ],
  filter: 'all',
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
  // TODO Task 3: add filter logic for 'active' and 'done'
  return state.todos;
}

function setPriority(id, priority) {
  // TODO Task 5: find todo by id, set its .priority field
  // Then: saveState(), render()
}

// ── Render ─────────────────────────────────────────────────────

function renderList() {
  const list = document.getElementById('todo-list');
  const visible = getVisibleTodos();
  list.innerHTML = visible.map(todo => `
    <li class="todo-item${todo.done ? ' done' : ''}" data-id="${todo.id}">
      <input class="todo-checkbox" type="checkbox" ${todo.done ? 'checked' : ''} />
      <span class="todo-text">${todo.text}</span>
      ${todo.priority ? `<span class="priority-badge priority-${todo.priority}">${todo.priority}</span>` : ''}
      <button class="btn-delete" title="Delete">✕</button>
    </li>
  `).join('');
  // TODO Task 2: wire checkbox and delete button via event delegation in initHandlers()
}

function renderEmptyState() {
  const empty = document.getElementById('empty-state');
  empty.style.display = getVisibleTodos().length === 0 ? 'block' : 'none';
}

function renderFilterBar() {
  // TODO Task 3: add/remove "active" class on filter buttons based on state.filter
}

function renderStats() {
  const active = state.todos.filter(t => !t.done).length;
  document.getElementById('stats').textContent = `${active} task${active !== 1 ? 's' : ''} left`;
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
