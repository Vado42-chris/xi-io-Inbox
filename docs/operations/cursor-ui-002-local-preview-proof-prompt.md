# Cursor Prompt: UI-002 Local Preview Proof

## Purpose

Use this prompt to verify the first static `xi-io Inbox` preview locally before PR #12 leaves draft.

## Current framework state

The framework UI consumer contract is now merged in `xi-io.net#238`, with stable direct export/package promotion tracked separately in `xi-io.net#239`.

This means the adapted-copy/static-preview path is allowed for this proof, but direct framework package import is still future work and must not be claimed complete.

## Paste into Cursor

```text
You are working on `UI-002` for `xi-io Inbox`.

Goal: verify the static framework-derived Inbox preview without connecting any provider or adding runtime email behavior.

Framework state:
- `xi-io.net#238` merged the Workbench UI consumer contract.
- `xi-io.net#235` is closed as completed.
- `xi-io.net#239` tracks future stable direct export/package work.
- For this PR, adapted-copy/static-preview remains the correct path.

Read first:
1. `docs/ui/framework-ui-adoption.md`
2. `docs/ui/inbox-framework-component-map.md`
3. `docs/ui/ui-002-static-preview-plan.md`
4. `docs/ui/ui-002-accessibility-egress-check.md`
5. `docs/ui/ui-002-local-proof-status.md`
6. `docs/reviews/pr-12-self-review.md`
7. `TODO.md`

Critical rules:
- Do not connect Gmail or any email provider.
- Do not add send, forward, delete, or external disclosure behavior.
- Do not replace the rail / stream / context pattern with a new local UI shell.
- Do not weaken draft-only egress language.
- Do not claim direct framework package reuse is complete.
- Do not mark visual proof complete unless the preview is actually opened locally.
- Do not mark PR #12 ready for review unless the evidence receipt is recorded.

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
- no network/provider request is required for preview rendering
- adapted-copy/source-note language remains consistent with the merged framework contract

Evidence to record in `docs/ui/ui-002-local-proof-status.md`:

```text
Date:
Machine:
Branch:
Commit SHA:
npm run check result:
npm run dev result:
Local URL opened:
Browser:
Console errors:
Rail / stream / context verified: yes | no
Click selection verified: yes | no
Keyboard selection verified: yes | no
Warning banner verified: yes | no
Privacy/sensitive state verified: yes | no
Blocked action state verified: yes | no
No provider data verified: yes | no
No provider/network call required: yes | no
Screenshot captured: yes | no
Result: PASS | FAIL | BLOCKED
Notes:
```

Expected final response:

```text
UI-002 local proof result: PASS | FAIL | BLOCKED
Commit SHA:
Static check:
Dev server:
Visual proof:
Accessibility smoke check:
Draft-only egress check:
Provider safety check:
Screenshot/evidence:
Next action:
```

If PASS:
- update `docs/ui/ui-002-local-proof-status.md`
- update `TODO.md`
- update `docs/reviews/pr-12-self-review.md`
- mark PR #12 ready for review only after the evidence is committed

If FAIL or BLOCKED:
- record the failure/blocker in `docs/ui/ui-002-local-proof-status.md`
- keep PR #12 draft
- do not add runtime behavior to make the proof pass
```

## Decision value

`CURSOR_UI_002_LOCAL_PREVIEW_PROOF_PROMPT_READY_AFTER_FRAMEWORK_CONTRACT_MERGE`
