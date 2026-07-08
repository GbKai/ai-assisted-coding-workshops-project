const STORAGE_KEY = 'kainos-todo:todos';
const API_KEY_STORAGE_KEY = 'kainos-todo:apiKey';
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const OPENROUTER_MODEL = 'openai/gpt-4o-mini';

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

const PRIORITIES = ['high', 'medium', 'low'];

const state = {
  todos: [],
  filter: FILTERS.ALL,
  aiLoading: new Set(),
  aiError: null,
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

function formatDueDate(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return '';
  const date = new Date(y, m - 1, d);
  const opts = y === new Date().getFullYear()
    ? { day: 'numeric', month: 'short' }
    : { day: 'numeric', month: 'short', year: 'numeric' };
  return date.toLocaleDateString(undefined, opts);
}

function setPriority(id, priority) {
  const todo = state.todos.find(t => t.id === id);
  if (!todo) return;
  todo.priority = priority;
  saveState();
  render();
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

  const date = document.createElement('span');
  date.className = todo.dueDate ? 'todo-date' : 'todo-date empty';
  date.textContent = todo.dueDate ? formatDueDate(todo.dueDate) : '—';
  li.append(date);

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

  if (!todo.done) {
    const aiBtn = document.createElement('button');
    aiBtn.type = 'button';
    aiBtn.className = 'btn-ai';
    aiBtn.title = 'Suggest priority with AI';
    const loading = state.aiLoading.has(todo.id);
    aiBtn.disabled = loading;
    if (loading) {
      const spinner = document.createElement('span');
      spinner.className = 'ai-spinner';
      aiBtn.append(spinner);
    } else {
      aiBtn.textContent = 'AI';
    }
    li.append(aiBtn);
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

function renderAiError() {
  const el = document.getElementById('ai-error');
  if (!el) return;
  if (state.aiError) {
    el.textContent = state.aiError;
    el.hidden = false;
  } else {
    el.textContent = '';
    el.hidden = true;
  }
}

function render() {
  renderList();
  renderEmptyState();
  renderFilterBar();
  renderStats();
  renderAiError();
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
    } else if (e.target.closest('.btn-ai')) {
      suggestPriority(id);
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

// ── AI Feature (Task 5) ──────────────────────────────────

async function suggestPriority(id) {
  const todo = state.todos.find(t => t.id === id);
  if (!todo || state.aiLoading.has(id)) return;

  const apiKey = localStorage.getItem(API_KEY_STORAGE_KEY);
  if (!apiKey) {
    state.aiError = 'No API key saved. Open Settings to add one.';
    render();
    return;
  }

  state.aiLoading.add(id);
  state.aiError = null;
  render();

  try {
    const priority = await fetchPrioritySuggestion(todo.text, apiKey);
    state.aiLoading.delete(id);
    setPriority(id, priority);
  } catch (err) {
    state.aiLoading.delete(id);
    state.aiError = err.message;
    render();
  }
}

async function fetchPrioritySuggestion(text, apiKey) {
  const prompt =
    'Rate this task as "high", "medium", or "low" priority. ' +
    'Reply with exactly one word.\n\nTask: ' + text;

  let response;
  try {
    response = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: [{ role: 'user', content: prompt }],
      }),
    });
  } catch {
    throw new Error('Network error. Check your connection.');
  }

  if (response.status === 401) throw new Error('Invalid API key. Check Settings.');
  if (response.status === 429) throw new Error('Rate limited. Try again shortly.');
  if (!response.ok)            throw new Error(`Request failed (${response.status}).`);

  const data = await response.json();
  const raw = data.choices?.[0]?.message?.content?.trim().toLowerCase() ?? '';
  const priority = PRIORITIES.find(p => raw.includes(p));
  if (!priority) throw new Error('Unexpected response from model.');
  return priority;
}

// ── Boot ───────────────────────────────────────────────────────

loadState();
initHandlers();
