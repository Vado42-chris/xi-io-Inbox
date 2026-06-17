# UI-PEER-REVIEW-FIX-BATCH-001 — Mail owner-mode receipt

## Record

| Field | Value |
| --- | --- |
| Date | 2026-06-17 |
| Branch | `ui-002/framework-derived-static-preview` |
| Commit SHA | `eacb4199eb3cc152c674c1815ee4cb173aaa54b7` |
| PR | #12 (draft, unmerged) |

## Source peer-review docs

- `docs/ui/reviews/peer-review/UI-PEER-REVIEW-RUNBOOK.md`
- `docs/ui/reviews/peer-review/UI-PEER-REVIEW-GLOBAL-FINDINGS.md` (B2, B3, B6, B7)
- `docs/ui/reviews/peer-review/UI-PEER-REVIEW-002-mail.md`
- `docs/ui/reviews/peer-review/component-drift-register.md`
- `docs/ui/reviews/peer-review/owner-vs-scaffold-mode.md`

## Scope

Mail workspace owner-mode P0/P1 cleanup only:

1. Single setup guide (no repeated scaffold banners; no CLI in primary copy)
2. Message-first reading pane (snippet/body forward; metadata demoted)
3. Slim inspector rail when a thread is selected; hidden when idle
4. Owner thread list layout (single-column rows; unread dot)
5. Activity ledger table text overlap fix (shared component; Mail-related receipts)

## Excluded scope

Calendar, Tasks, Home, Account drawer, Ibal, Integrations, runtime/provider changes, component extraction, merge prep, UI-003E PASS claim.

## Files changed

| Path | Change |
| --- | --- |
| `public/inbox-preview.js` | Owner setup guide, reading pane, inspector rail, thread rows, env badge on Mail |
| `public/inbox-preview.css` | Owner message view, inspector grid, thread rows, activity table overflow |
| `scripts/route-smoke.mjs` | Owner Mail UX smoke expectations |
| `docs/ui/reviews/peer-review/UI-PEER-REVIEW-002-mail.md` | Status + fix batch notes |
| `TODO.md` | FIX-BATCH-001 tracking |
| `docs/ui/reviews/peer-review/UI-PEER-REVIEW-FIX-BATCH-001-mail-owner-mode-receipt.md` | This receipt |

## Product UI code changed

**Yes** — `public/inbox-preview.js` and `public/inbox-preview.css`.

## Results

| Area | Result |
| --- | --- |
| Mail setup guide | One card only when action needed; partial-import warn with primary CTA; no CLI in owner primary copy; compact browser note hidden when threads loaded |
| Reading pane | Owner message preview with snippet-first layout; honesty note retained; blocked send/draft demoted to Advanced |
| Inspector / right rail | Hidden when no thread; thread-only slim actions + Advanced details when selected; Related suite removed from owner Mail |
| Scaffold noise | Owner sidebar preserved; demo fixture nav still hidden via existing OWNER_MAIL_UX path |
| Runtime / scaffold copy | Honest preview/desktop lines; shorter Mail env badge; scaffold mode unchanged via `showWorkflowScaffold` |

## Egress gate status

Unchanged — draft write preview only; send, forward, delete, label/archive mutation, provider execution remain blocked. No fake message bodies added.

## Validation

| Command | Result |
| --- | --- |
| `npm run check:quick` | pass |
| `npm run check` | pass (includes route-smoke owner Mail path) |
| `npm run check:runtime002a` | pass |
| `npm run check:runtime001` | pass |
| `cargo test --manifest-path src-tauri/Cargo.toml` | pass |
| `cargo build --manifest-path src-tauri/Cargo.toml` | pass |
| `git diff --check` | pass (no conflict markers) |

## PR #12 draft state

Open, draft, unmerged — not marked ready for review.

## UI-003E state

**NOT passed** — owner visual proof at `:4488` still required before merge prep.

## Remaining Mail P0/P1 (after batch)

| ID | Finding | Status |
| --- | --- | --- |
| Owner retest | Screenshots / eyes on Mail at `:4488` | Pending owner |
| G-P0-004 | Status repetition on non-Mail surfaces | Out of scope this batch |
| B4 | Global button/radius token enforcement | Deferred |
| Compose sheet | Send blocked row still in compose (tertiary) | Acceptable; not primary reading path |

## Next recommended fix batch

**UI-PEER-REVIEW-FIX-BATCH-002 — Account drawer owner-mode cleanup** (owner preference over Home).

## Decision value

`UI_PEER_REVIEW_FIX_BATCH_001_PASS_READY_FOR_OWNER_MAIL_REVIEW`

Owner Mail review at `:4488` is safe to begin. Do not claim UI-003E PASS until owner completes the UI-003E runbook.
