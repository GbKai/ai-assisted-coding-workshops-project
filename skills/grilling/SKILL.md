---
name: grilling
description: Grill the user relentlessly about a plan or design. Use when the user wants to stress-test a plan before building, or uses any 'grill' trigger phrases.
---

# Grill the Plan

## When to use this skill

Use this skill when the user asks to:
- "Grill me on this plan / design / idea."
- "Poke holes in this before I build it."
- "Stress-test this plan."
- Any variation using the words **grill**, **interrogate**, **stress-test**, or **poke holes**.

Do **not** use this skill for:
- General coding questions or implementation help.
- Reviewing code that already exists (use the Code Reviewer agent instead).

---

## How to run it

Interview the user relentlessly about every aspect of the plan until you reach a shared understanding. Walk down each branch of the design tree, resolving dependencies between decisions one-by-one. For each question, provide your recommended answer.

Ask the questions **one at a time**, waiting for feedback on each question before continuing. Asking multiple questions at once is bewildering.

If a *fact* can be found by exploring the codebase, look it up rather than asking the user. The *decisions*, though, are theirs — put each one to them and wait for their answer.

Do **not** enact the plan until the user confirms shared understanding has been reached.

---

## Rules

- One question per turn. No batching.
- Every question comes with your recommended answer and a one-line reason.
- Prefer codebase lookups over questions for anything factual.
- Never start implementing until the user explicitly confirms the plan is settled.
