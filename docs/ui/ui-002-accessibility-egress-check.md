# UI-002 Accessibility and Egress Check

## Purpose

Record the accessibility and controlled-egress status for the first static Inbox UI preview.

## Scope

Files added for preview:

```text
public/index.html
public/inbox-preview.css
public/inbox-preview.js
public/data/inbox-events.preview.json
package.json
```

## Framework derivation

The preview adapts `xi-io.net` Workbench UI patterns:

- rail / stream / context layout
- selected event card state
- status pills
- warning banner
- evidence/context/action panels
- keyboard card selection
- preview-safe action language

## Accessibility checks

- [x] Top preview shell has `aria-label`.
- [x] Left rail has `aria-label`.
- [x] Stream has `aria-label`.
- [x] Context panel has `aria-label`.
- [x] Warning banner uses `role="status"` and `aria-live="polite"`.
- [x] Event cards are keyboard focusable with `tabindex="0"`.
- [x] Enter and Space select event cards.
- [x] Selected event card exposes `aria-current`.
- [x] Empty stream state is plain language.
- [x] Responsive single-column layout exists for narrow screens.

## Egress checks

- [x] Preview data only.
- [x] No provider connection exists.
- [x] No send/forward/delete runtime action exists.
- [x] Blocked action buttons are disabled.
- [x] Draft-only language appears in the context action panel.
- [x] External send, forward, delete, and disclosure remain blocked in copy.

## Remaining limitations

- No automated browser test exists yet.
- Static check only validates file presence.
- Visual proof still needs local preview or screenshot.
- Direct framework package import is not available yet.
- `xi-io.net#235` still needs a reusable UI consumer contract.

## Decision value

`UI_002_ACCESSIBILITY_EGRESS_CHECK_RECORDED_PREVIEW_ONLY`
