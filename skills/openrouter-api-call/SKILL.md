---
name: openrouter-api-call
description: How to call the OpenRouter LLM API directly from the Chrome extension using the user's own API key (BYOK). Use when the user is working on Task 5 or asks about wiring the AI action button, calling an LLM, or sending prompts to OpenRouter.
---

# OpenRouter API Call (BYOK)

## When to use this skill

Use this skill when:
- The user is on **Task 5** of the workshop.
- The user asks how to call an LLM, wire up the AI button, or send a request to OpenRouter.
- The user asks about handling the API key in the extension.

Do **not** use this skill for anything else. Storing the key on the options page is normal `chrome.storage.local` work — no skill needed.

---

## Prerequisites — check before writing code

1. The user has already saved their OpenRouter API key on the options page.
2. The key is stored in `chrome.storage.local` under a named constant (e.g. `STORAGE_KEYS.API_KEY = "kainos-todo:api-key"`).
3. `manifest.json` has `"host_permissions": ["https://openrouter.ai/*"]`.

If any of these are missing, **stop and tell the user** — do not silently add them.

---

## Steps

### 1. Read the key from storage

```js
const { [STORAGE_KEYS.API_KEY]: apiKey } = await chrome.storage.local.get(STORAGE_KEYS.API_KEY);
if (!apiKey) {
  // Show the user a friendly message pointing them to the options page.
  return;
}
```

### 2. Call the API

```js
const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    model: "openai/gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  }),
});
```

### 3. Handle errors before parsing

- `401` → key is invalid or missing. Tell the user to check the options page.
- `429` → rate-limited. Ask the user to wait or switch model.
- Network fail → offline or blocked. Show a plain-English error.

### 4. Parse and render

```js
const data = await response.json();
const reply = data.choices?.[0]?.message?.content ?? "";
```

Render the reply in the popup — do not `alert()`, do not `console.log()` in production code paths.

---

## Rules & pitfalls

- **Never log the API key.** Not in `console.log`, not in error messages, not in analytics.
- **Never send the key to any other server.** BYOK means browser → OpenRouter, nothing in between.
- **Never hardcode a key** in the source, even a test one.
- **Never use `localStorage`** — always `chrome.storage.local`.
- **Never add a proxy or backend** to hide the key. The whole point of Task 5 is direct BYOK.
- Keep the model name in a named constant so it can be swapped without hunting through the code.

---

## See also

- [`example-request.md`](example-request.md) — a full request/response example
- [`../../AGENTS.md`](../../AGENTS.md) — Task 5 scope and boundaries
