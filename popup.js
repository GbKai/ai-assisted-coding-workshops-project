const STORAGE_KEY = 'kainos-todo:todos';

const FILTERS = {
  ALL: 'all',
  ACTIVE: 'active',
  DONE: 'done',
};

const URGENCY = {
  OVERDUE: 0,
  TODAY: 1,
  UPCOMING: 2,
  NO_DATE: 3,
  DONE: 4,
};

const state = {
  todos: [],
  filter: FILTERS.ALL,
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

function addTodo(text, dueDate = null) {
  const trimmed = text.trim();
  if (!trimmed) return;

  state.todos.push({
    id: crypto.randomUUID(),
    text: trimmed,
    done: false,
    createdAt: new Date().toISOString(),
    dueDate: dueDate || null,
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
  if (!Object.values(FILTERS).includes(filter)) return;
  if (state.filter === filter) return;
  state.filter = filter;
  render();
}

function getVisibleTodos() {
  const filtered = filterTodos(state.todos, state.filter);
  return sortByUrgency(filtered);
}

function filterTodos(todos, filter) {
  switch (filter) {
    case FILTERS.ACTIVE: return todos.filter(t => !t.done);
    case FILTERS.DONE:   return todos.filter(t =>  t.done);
    default:             return todos;
  }
}

// Local YYYY-MM-DD (matches the value produced by <input type="date">).
function todayIso() {
  return new Date().toLocaleDateString('en-CA');
}

function getUrgency(todo) {
  if (todo.done)      return URGENCY.DONE;
  if (!todo.dueDate)  return URGENCY.NO_DATE;
  const today = todayIso();
  if (todo.dueDate < today)  return URGENCY.OVERDUE;
  if (todo.dueDate === today) return URGENCY.TODAY;
  return URGENCY.UPCOMING;
}

function sortByUrgency(todos) {
  return [...todos].sort((a, b) => {
    const ua = getUrgency(a);
    const ub = getUrgency(b);
    if (ua !== ub) return ua - ub;
    if (a.dueDate && b.dueDate) return a.dueDate.localeCompare(b.dueDate);
    return 0;
  });
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

  const urgency = getUrgency(todo);
  if (urgency === URGENCY.OVERDUE || urgency === URGENCY.TODAY) {
    const badge = document.createElement('span');
    const isOverdue = urgency === URGENCY.OVERDUE;
    badge.className = isOverdue ? 'due-badge overdue' : 'due-badge today';
    badge.textContent = isOverdue ? 'Overdue' : 'Today';
    li.append(badge);
  }

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
  const buttons = document.querySelectorAll('#filter-bar .filter-btn');
  for (const btn of buttons) {
    btn.classList.toggle('active', btn.dataset.filter === state.filter);
  }
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
    const due   = document.getElementById('todo-due');
    addTodo(input.value, due.value || null);
    input.value = '';
    due.value = '';
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

  // Delegated handler for filter-bar clicks
  document.getElementById('filter-bar').addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    setFilter(btn.dataset.filter);
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
