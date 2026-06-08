# Cursor Prompt: UI-001 Framework UI Adoption

## Purpose

Use this prompt before creating any `xi-io Inbox` runtime UI.

The goal is to reuse or adapt mature `xi-io.net` framework UI components instead of inventing a new local Inbox UI system.

## Paste into Cursor

```text
You are working on `UI-001` for `xi-io Inbox`.

Goal: adopt or adapt the mature `xi-io.net` framework UI components before implementing any Inbox runtime UI.

Read first:
1. `docs/ui/framework-ui-adoption.md`
2. `docs/ui/inbox-framework-component-map.md`
3. `TODO.md`
4. `Vado42-chris/xi-io.net/public/workbench-event-components.js`
5. `Vado42-chris/xi-io.net/public/workbench-event-runtime.js`
6. `Vado42-chris/xi-io.net/public/github-management-components.js`

Critical rules:
- Do not create a new Inbox-only UI shell first.
- Do not create new card/table/status/action patterns before testing framework reuse.
- Do not bypass draft-only egress.
- Do not style destructive actions as casual actions.
- Preserve no-silent-green status language.
- Preserve accessibility labels, keyboard selection, selected state, and plain-language empty states.
- If direct reuse is impractical, document why and adapt the framework pattern with source notes.

First implementation target:
Create a static Inbox UI preview using framework-derived patterns only.

Required shell:
- left rail = accounts/providers/filters
- center stream = message events/thread events/action proposals
- right context = selected thread/evidence/draft/actions/receipts

Required components:
- account/provider rail
- stream view selector
- quick filters
- thread/event card
- selected-thread context panel
- evidence/source refs panel
- draft-only action panel
- warning/status banner
- no-silent-green status pills
- next safe action panel

Before code changes:
1. Identify whether direct import from framework files is possible.
2. If not, document adapted-copy reason.
3. Confirm all runtime actions remain preview-safe.
4. Add or update a UI evidence note.
5. Update `TODO.md`.

Expected final response:

```text
UI-001 result: PASS | BLOCKED
Framework components reused/adapted:
Direct reuse possible: yes | no
If no, reason:
Runtime egress blocked: yes
Accessibility checks included: yes
Next action:
```
```

## Decision value

`CURSOR_UI_001_FRAMEWORK_UI_ADOPTION_PROMPT_READY`
