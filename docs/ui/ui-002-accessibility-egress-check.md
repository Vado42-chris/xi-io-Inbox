# UI-002 Accessibility and Egress Check

## Purpose

Record the accessibility and controlled-egress status for the first static Inbox UI preview.

## Current review result

```text
Technical render smoke proof: passed locally
Owner/framework UX review: failed on 2026-06-09
Owner visual polish review: failed on 2026-06-10
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

- [x] Unified xi-io app shell skeleton is present.
- [x] Inbox lane has first-pass account, smart-view, thread, draft, evidence, and egress-gate content.
- [x] Calendar lane has first-pass agenda, proposal, conflict, reminder/source, and receipt content.
- [x] Tasks lane has first-pass status board, due/source, linked-reference, and next-action content.
- [x] Extensions lane has first-pass provider/tool/local-server/framework-export gate and secret-boundary content.
- [x] Ibal orchestration lane has first-pass priority, next-action, unresolved-item, blocker, synthesis, and what-changed content.
- [x] Receipts/audit lane has first-pass ledger, proposal, draft, gate-change, proof, runtime-evidence placeholder, and blocked-event content.
- [x] Provider gates are explicit before real data/actions.
- [x] Automations proposal/dry-run lane has first-pass template, trigger, approval, dry-run, disabled-status, and receipt-requirement content.
- [x] Navigation creates clear lanes and workpaths.
- [x] UI-003C Inbox lane has selectable static threads, selected-thread context, sanitized timeline summaries, evidence refs, blocked attachments, draft proposal content, and lane-aware inspector updates.
- [x] UI-003D keyboard smoke preserves focus after Inbox thread selection with Enter and Space.
- [ ] Framework visual language/product quality owner review for the redesigned shell is not complete.

UI-003D established technical readiness for owner/framework visual review only. Owner screenshot review on 2026-06-10 failed the visual polish standard, so UI-004 polish work is required before visual proof can pass.

## Egress checks

- [x] Preview data only.
- [x] No provider connection exists.
- [x] No send/forward/delete runtime action exists.
- [x] Blocked action buttons are disabled.
- [x] Draft-only language appears in the context action panel.
- [x] External send, forward, delete, and disclosure remain blocked in copy.
- [x] UI-003C Inbox smoke confirmed 16 disabled controls, disabled search/command placeholder, and 0 external requests.
- [x] UI-003D desktop/mobile readiness smoke confirmed 8 or more disabled egress controls per route and 0 external requests.

## Egress acceptance criteria for redesign

A replacement preview must preserve all egress checks and additionally show:

- draft creation path,
- provider gate before real account connection,
- receipt/audit trail for confirmed safe actions,
- Ibal recommendation as proposal only,
- blocked send/forward/delete/disclose actions until explicit future policy permits them.

## Remaining limitations

- UI-003A route switching smoke proof passed.
- UI-003B route switching smoke proof passed with 9 lanes, 2 or more sections per lane, lane-aware inspector state, 8 or more disabled egress controls per route, and 0 external requests.
- UI-003C Inbox smoke proof passed with 3 selectable threads, 5 Inbox sections, selected-thread inspector updates, 16 disabled controls, disabled search/command placeholder, and 0 external requests.
- UI-003D readiness smoke passed across 18 route/viewport checks at 1440x950 and 390x844, with no horizontal overflow detected.
- Static check only validates file presence.
- Previous visual/product review failed for the old shell.
- Current redesigned shell visual polish review failed on 2026-06-10.
- Local proof must not be marked complete until the redesigned shell passes owner/framework UX review.
- Direct framework package import is not available yet.
- `xi-io.net#239` must be treated as a real framework export blocker.

## Decision value

`UI_002_ACCESSIBILITY_EGRESS_STATIC_GUARDS_PRESENT_PRODUCT_UX_REVIEW_FAILED`
