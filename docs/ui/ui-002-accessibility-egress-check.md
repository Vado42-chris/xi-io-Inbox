# UI-002 Accessibility and Egress Check

## Purpose

Record the accessibility and controlled-egress status for the first static Inbox UI preview.

## Current review result

```text
Technical render smoke proof: passed locally
Owner/framework UX review: failed on 2026-06-09
Merge readiness: blocked
```

The current preview has basic static accessibility and egress guardrails, but that is not enough. It fails product-level information architecture and framework UX review.

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

Adapted-copy compliance is not sufficient when the result does not express the full xi-io product architecture.

Direct framework export/package reuse remains blocked by:

```text
xi-io.net#239
```

## Static accessibility checks

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

## Product IA / framework UX checks

- [ ] Unified xi-io app shell is present.
- [ ] Inbox lane is clear and email-client-like.
- [ ] Calendar lane is clear and schedulable.
- [ ] Tasks lane is clear and trackable.
- [ ] Extensions lane is clear for providers/tools/add-ons.
- [ ] Ibal orchestration surface is explicit.
- [ ] Receipts/audit surface is explicit.
- [ ] Provider gates are explicit before real data/actions.
- [ ] Automations creation path is clear.
- [ ] Navigation creates clear lanes and workpaths.
- [ ] Framework visual language feels like xi-io, not a generic dashboard.

## Egress checks

- [x] Preview data only.
- [x] No provider connection exists.
- [x] No send/forward/delete runtime action exists.
- [x] Blocked action buttons are disabled.
- [x] Draft-only language appears in the context action panel.
- [x] External send, forward, delete, and disclosure remain blocked in copy.

## Egress acceptance criteria for redesign

A replacement preview must preserve all egress checks and additionally show:

- draft creation path,
- provider gate before real account connection,
- receipt/audit trail for confirmed safe actions,
- Ibal recommendation as proposal only,
- blocked send/forward/delete/disclose actions until explicit future policy permits them.

## Remaining limitations

- No automated browser test exists yet.
- Static check only validates file presence.
- Current visual/product review failed.
- Local proof must not be marked complete for current preview.
- Direct framework package import is not available yet.
- `xi-io.net#239` must be treated as a real framework export blocker.

## Decision value

`UI_002_ACCESSIBILITY_EGRESS_STATIC_GUARDS_PRESENT_PRODUCT_UX_REVIEW_FAILED`
