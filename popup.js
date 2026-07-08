const STORAGE_KEY = 'kainos-todo:todos';

const state = {
  todos: [],
  filter: 'all',
  aiLoading: false,
};

// ── Persistence ────────────────────────────────────────────────

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) state.todos = parsed;
    } catch {
      // corrupt data — ignore and start fresh
    }
  }
  render();
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.todos));
}

// ── Business logic ────────────────────────────────

function addTodo(text) {
  const trimmed = text.trim();
  if (!trimmed) return;

  state.todos.push({
    id: crypto.randomUUID(),
    text: trimmed,
    done: false,
    createdAt: new Date().toISOString(),
    priority: null,
  });

  saveState();
  render();
}

function toggleTodo(id) {
  const todo = state.todos.find(t => t.id === id);
  if (!todo) return;
  todo.done = !todo.done;
  saveState();
  render();
}

function deleteTodo(id) {
  const before = state.todos.length;
  state.todos = state.todos.filter(t => t.id !== id);
  if (state.todos.length === before) return;
  saveState();
  render();
}

function setFilter(filter) {
}

function getVisibleTodos() {
  return state.todos;
}

function setPriority(id, priority) {
}

// ── Render ─────────────────────────────────────────────────────

function renderList() {
  const list = document.getElementById('todo-list');
  const visible = getVisibleTodos();

  list.replaceChildren();
  for (const todo of visible) {
    list.append(createTodoItem(todo));
  }
}

function createTodoItem(todo) {
  const li = document.createElement('li');
  li.className = todo.done ? 'todo-item done' : 'todo-item';
  li.dataset.id = todo.id;

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'todo-checkbox';
  checkbox.checked = todo.done;
  li.append(checkbox);

  const text = document.createElement('span');
  text.className = 'todo-text';
  text.textContent = todo.text;
  li.append(text);

  if (todo.priority) {
    const badge = document.createElement('span');
    badge.className = `priority-badge priority-${todo.priority}`;
    badge.textContent = todo.priority;
    li.append(badge);
  }

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'btn-delete';
  deleteBtn.title = 'Delete';
  deleteBtn.textContent = '✕';
  li.append(deleteBtn);

  return li;
}

function renderEmptyState() {
  const empty = document.getElementById('empty-state');
  empty.style.display = getVisibleTodos().length === 0 ? 'block' : 'none';
}

function renderFilterBar() {
}

function renderStats() {
  const total  = state.todos.length;
  const done   = state.todos.filter(t => t.done).length;
  const active = total - done;

  document.getElementById('stats').textContent = `${active} task${active !== 1 ? 's' : ''} left`;

  const bar = document.getElementById('progress-bar');
  if (bar) bar.style.width = (total === 0 ? 0 : Math.round((done / total) * 100)) + '%';

  const countEl = document.getElementById('task-count');
  if (countEl) countEl.textContent = total === 0 ? '' : `${done} / ${total} done`;
}

function render() {
  renderList();
  renderEmptyState();
  renderFilterBar();
  renderStats();
}

// ── Event wiring ───────────────────────────────────────────────

function initHandlers() {

  // Add task via form submit (covers both Enter key and Add button)
  document.getElementById('add-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.getElementById('todo-input');
    addTodo(input.value);
    input.value = '';
    input.focus();
  });

  // Delegated handler for checkbox toggles and delete-button clicks
  document.getElementById('todo-list').addEventListener('click', (e) => {
    const li = e.target.closest('.todo-item');
    if (!li) return;
    const { id } = li.dataset;

    if (e.target.matches('.todo-checkbox')) {
      toggleTodo(id);
    } else if (e.target.closest('.btn-delete')) {
      deleteTodo(id);
    }
  });

  // Options link
  document.getElementById('options-link').addEventListener('click', (e) => {
    e.preventDefault();
    window.open('options.html');
  });
}

// ── AI Feature (Task 5) ────────────────────────────────────────

async function suggestPriority(id) {
}

// ── Boot ───────────────────────────────────────────────────────

loadState();
initHandlers();
