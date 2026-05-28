const API_KEY_STORAGE_KEY = 'kainos-todo:apiKey';

function loadApiKey() {
  // TODO Task 5: read API key from chrome.storage.local
  // Populate #api-key-input with the stored value (if any)
}

function saveApiKey(key) {
  // TODO Task 5: save key to chrome.storage.local under API_KEY_STORAGE_KEY
  // Show a confirmation message in #save-status ("API key saved ✓")
  // Clear the message after 2 seconds
}

document.getElementById('settings-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const key = document.getElementById('api-key-input').value.trim();
  // TODO Task 5: call saveApiKey(key)
});

loadApiKey();
