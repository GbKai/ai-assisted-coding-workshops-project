const CARD_VALUES = ['1', '2', '3', '5', '8', '13', '?', '☕'];

const STORAGE_KEYS = {
  THEME: 'scrumPoker:theme',
  NICKNAME: 'scrumPoker:nickname',
  VOTE_COUNT: 'scrumPoker:voteCount',
};

const state = {
  selectedCard: null,
  isRevealed: false,
  isDarkMode: false,
  nickname: '',
  voteCount: 0,
};

// ── Persistence helpers ──────────────────────────────────────────────────────

function loadFromStorage() {
  const theme = localStorage.getItem(STORAGE_KEYS.THEME);
  state.isDarkMode = theme === 'dark';

  state.nickname = localStorage.getItem(STORAGE_KEYS.NICKNAME) || '';

  const storedCount = localStorage.getItem(STORAGE_KEYS.VOTE_COUNT);
  state.voteCount = storedCount ? parseInt(storedCount, 10) : 0;
}

function saveTheme() {
  localStorage.setItem(STORAGE_KEYS.THEME, state.isDarkMode ? 'dark' : 'light');
}

function saveNickname() {
  localStorage.setItem(STORAGE_KEYS.NICKNAME, state.nickname);
}

function saveVoteCount() {
  localStorage.setItem(STORAGE_KEYS.VOTE_COUNT, String(state.voteCount));
}

// ── Actions ──────────────────────────────────────────────────────────────────

function selectCard(value) {
  if (state.isRevealed) return;
  state.selectedCard = state.selectedCard === value ? null : value;
  render();
}

function reveal() {
  if (!state.selectedCard || state.isRevealed) return;
  state.isRevealed = true;
  state.voteCount += 1;
  saveVoteCount();
  render();
}

function reset() {
  state.selectedCard = null;
  state.isRevealed = false;
  render();
}

function toggleDarkMode() {
  state.isDarkMode = !state.isDarkMode;
  saveTheme();
  render();
}

function updateNickname(value) {
  state.nickname = value.trim();
  saveNickname();
  render();
}

// ── Render helpers ───────────────────────────────────────────────────────────

function renderTheme() {
  document.documentElement.classList.toggle('dark', state.isDarkMode);

  const btn = document.getElementById('btn-dark-mode');
  if (!btn) return;
  btn.textContent = state.isDarkMode ? '☀ Light' : '☾ Dark';
  btn.setAttribute('aria-pressed', String(state.isDarkMode));
  btn.setAttribute('aria-label', state.isDarkMode ? 'Switch to light mode' : 'Switch to dark mode');
}

function renderNickname() {
  const input = document.getElementById('nickname-input');
  if (input && input !== document.activeElement) {
    input.value = state.nickname;
  }

  const display = document.getElementById('nickname-display');
  if (!display) return;
  if (state.nickname) {
    display.textContent = `Voting as: ${state.nickname}`;
    display.hidden = false;
  } else {
    display.textContent = '';
    display.hidden = true;
  }
}

function renderVoteCounter() {
  const el = document.getElementById('vote-count');
  if (!el) return;
  el.textContent = state.voteCount;
}

function renderCards() {
  const grid = document.getElementById('card-grid');
  grid.innerHTML = CARD_VALUES.map(value => {
    const isSelected = state.selectedCard === value;
    const selectedClass = isSelected ? ' selected' : '';
    const disabledAttr = state.isRevealed ? 'disabled aria-disabled="true"' : '';

    return `
      <button
        onclick="selectCard('${value}')"
        aria-label="Vote ${value} story points"
        aria-pressed="${isSelected}"
        ${disabledAttr}
        class="poker-card${selectedClass}"
      >
        ${value}
      </button>
    `;
  }).join('');
}

function renderResult() {
  const el = document.getElementById('result');
  if (!state.isRevealed || !state.selectedCard) {
    el.innerHTML = '';
    return;
  }
  el.innerHTML = `
    <div class="result-inner">
      <p class="result-label">Your vote</p>
      <div class="revealed-card" aria-label="Revealed vote: ${state.selectedCard}">
        ${state.selectedCard}
      </div>
      <div class="result-confirmed">
        <div class="result-dot"></div>
        <span>Story points confirmed</span>
      </div>
    </div>
  `;
}

function renderButtons() {
  const btn = document.getElementById('btn-reveal');
  btn.disabled = !state.selectedCard || state.isRevealed;
}

function render() {
  renderTheme();
  renderNickname();
  renderVoteCounter();
  renderCards();
  renderResult();
  renderButtons();
}

// ── Event listeners ──────────────────────────────────────────────────────────

document.getElementById('btn-reveal').addEventListener('click', reveal);
document.getElementById('btn-reset').addEventListener('click', reset);
document.getElementById('btn-dark-mode').addEventListener('click', toggleDarkMode);
document.getElementById('nickname-input').addEventListener('input', e => updateNickname(e.target.value));

// ── Init ─────────────────────────────────────────────────────────────────────

loadFromStorage();
render();
