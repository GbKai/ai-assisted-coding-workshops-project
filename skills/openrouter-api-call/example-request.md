# Example Request & Response

A minimal, working example of an OpenRouter chat completion call. Reference only — copy the pattern, not the values.

## Request

```http
POST https://openrouter.ai/api/v1/chat/completions
Authorization: Bearer sk-or-v1-...redacted...
Content-Type: application/json

{
  "model": "openai/gpt-4o-mini",
  "messages": [
    { "role": "system", "content": "You help organise a to-do list." },
    { "role": "user",   "content": "Suggest 3 tasks for a productive Monday." }
  ]
}
```

## Response (trimmed)

```json
{
  "id": "gen-abc123",
  "model": "openai/gpt-4o-mini",
  "choices": [
    {
      "message": {
        "role": "assistant",
        "content": "1. Plan the week\n2. Clear inbox\n3. Deep-work block"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": { "prompt_tokens": 24, "completion_tokens": 18, "total_tokens": 42 }
}
```

## What to read from the response

- `choices[0].message.content` — the text to show the user.
- `usage.total_tokens` — optional, for cost display.
- `finish_reason` — if not `"stop"`, warn the user (e.g. `"length"` means truncated).
