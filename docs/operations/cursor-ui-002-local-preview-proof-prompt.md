# Cursor Prompt: UI-002 Local Preview Proof

## Purpose

Use this prompt to verify the first static `xi-io Inbox` preview locally before PR #12 leaves draft.

## Paste into Cursor

```text
You are working on `UI-002` for `xi-io Inbox`.

Goal: verify the static framework-derived Inbox preview without connecting any provider or adding runtime email behavior.

Read first:
1. `docs/ui/framework-ui-adoption.md`
2. `docs/ui/inbox-framework-component-map.md`
3. `docs/ui/ui-002-static-preview-plan.md`
4. `docs/ui/ui-002-accessibility-egress-check.md`
5. `TODO.md`

Critical rules:
- Do not connect Gmail or any email provider.
- Do not add send, forward, delete, or external disclosure behavior.
- Do not replace the rail / stream / context pattern with a new local UI shell.
- Do not weaken draft-only egress language.
- Do not mark visual proof complete unless the preview is actually opened locally.

Commands:

```bash
npm run check
npm run dev
```

Open:

```text
http://localhost:4488
```

Verify:

- page loads without console errors
- left rail shows preview accounts and views
- center stream shows preview events
- right context shows selected thread context
- clicking cards updates selected context
- keyboard Tab reaches event cards
- Enter or Space selects focused event cards
- warning banner is visible
- sensitive/privacy status is visible where expected
- send/runtime actions are blocked or disabled
- no real provider data appears

Evidence to record:

```text
Date:
Machine:
Branch:
Commit SHA:
npm run check result:
Local URL opened:
Browser:
Console errors:
Rail / stream / context verified: yes | no
Keyboard selection verified: yes | no
Blocked action state verified: yes | no
Screenshot captured: yes | no
Result: PASS | FAIL | BLOCKED
Notes:
```

Expected final response:

```text
UI-002 local proof result: PASS | FAIL | BLOCKED
Commit SHA:
Static check:
Visual proof:
Accessibility smoke check:
Draft-only egress check:
Next action:
```
```

## Decision value

`CURSOR_UI_002_LOCAL_PREVIEW_PROOF_PROMPT_READY`
