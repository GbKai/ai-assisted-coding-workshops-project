const CARD_VALUES = ['1', '2', '3', '5', '8', '13', '?', '☕'];

const state = {
  selectedCard: null,
  isRevealed: false,
};

function selectCard(value) {
  if (state.isRevealed) return;
  state.selectedCard = state.selectedCard === value ? null : value;
  render();
}

function reveal() {
  if (!state.selectedCard || state.isRevealed) return;
  state.isRevealed = true;
  render();
}

function reset() {
  state.selectedCard = null;
  state.isRevealed = false;
  render();
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
  renderCards();
  renderResult();
  renderButtons();
}

document.getElementById('btn-reveal').addEventListener('click', reveal);
document.getElementById('btn-reset').addEventListener('click', reset);

render();
