const API_KEY_STORAGE_KEY = 'kainos-todo:apiKey';

function loadApiKey() {
  const key = localStorage.getItem(API_KEY_STORAGE_KEY);
  if (key) document.getElementById('api-key-input').value = key;
}

function saveApiKey(key) {
  if (key) {
    localStorage.setItem(API_KEY_STORAGE_KEY, key);
    showStatus('Saved');
  } else {
    localStorage.removeItem(API_KEY_STORAGE_KEY);
    showStatus('Cleared');
  }
}

function showStatus(text) {
  const el = document.getElementById('save-status');
  el.textContent = text;
  setTimeout(() => { el.textContent = ''; }, 2000);
}

document.getElementById('settings-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const key = document.getElementById('api-key-input').value.trim();
  saveApiKey(key);
});

loadApiKey();
