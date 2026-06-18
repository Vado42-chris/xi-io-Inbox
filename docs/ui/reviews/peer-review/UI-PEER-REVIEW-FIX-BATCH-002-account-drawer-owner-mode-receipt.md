# UI-PEER-REVIEW-FIX-BATCH-002 — Account drawer owner-mode receipt

## Record

| Field | Value |
| --- | --- |
| Date | 2026-06-17 |
| Branch | `ui-002/framework-derived-static-preview` |
| Commit SHA | `bfc9caf3d7b250bdd3aa20f87681286923e03a2b` |
| PR | #12 (draft, unmerged) |

## Source peer-review docs

- `docs/ui/reviews/peer-review/UI-PEER-REVIEW-009-account-drawer.md`
- `docs/ui/reviews/peer-review/UI-PEER-REVIEW-GLOBAL-FINDINGS.md` (G-P0-004, G-P1-004, G-P1-203, G-P1-204)
- `docs/ui/reviews/peer-review/owner-vs-scaffold-mode.md`
- `docs/product/framework-backfeed-002-fix-batch-001-mail-owner-mode-packet.md` (pattern reference)

## Scope

Account drawer and Settings → Accounts owner-mode cleanup only:

1. Owner Account drawer — avatar, email once, connection status, one setup path
2. Primary connect/sync/add actions without CLI-primary copy
3. Operator import/wipe/sync-status panels demoted to Advanced (drawer + Settings accounts)
4. Status dedupe on topbar Account chip and drawer header
5. Receipt dedupe in drawer Advanced

## Excluded scope

Mail workspace (beyond shared owner/scaffold flag), Calendar, Home, Ibal, Integrations, runtime/provider changes, UI-003E PASS, merge-prep, framework export promotion.

## Files changed

| Path | Change |
| --- | --- |
| `public/inbox-preview.js` | `OWNER_ACCOUNT_UX`, owner drawer, owner Settings accounts pane, scaffold toolbar extraction |
| `public/inbox-preview.css` | Account owner drawer + setup guide styles |
| `scripts/route-smoke.mjs` | Owner-mode blocked-copy assertion parity |
| `docs/ui/reviews/peer-review/owner-vs-scaffold-mode.md` | Document `OWNER_ACCOUNT_UX` |
| `docs/ui/reviews/peer-review/UI-PEER-REVIEW-009-account-drawer.md` | Status update |
| `docs/ui/reviews/peer-review/UI-PEER-REVIEW-FIX-BATCH-002-account-drawer-owner-mode-receipt.md` | This receipt |

## Product UI code changed

**Yes** — `public/inbox-preview.js` and `public/inbox-preview.css`.

## Results

| Area | Result |
| --- | --- |
| Account setup guide | One card when connect/sync/add needed; no CLI in primary drawer copy |
| Connect/sync/trust surface | Primary actions: Connect, Sync, Add account, Account settings link |
| Drawer header | Email shown once; single status chip + honest copy line |
| Operator noise | Import/wipe/CLI/sync-status grid moved to Advanced; scaffold toolbar preserved for agents |
| Settings → Accounts | Owner-simple header + primary actions; operator tools in Advanced details |
| Topbar Account chip | Short owner status (`Connected`, `Saved mail`, `Not connected`, etc.) |
| Receipt spam | Deduped receipts in drawer Advanced only |
| Scaffold mode | Full drawer/settings scaffold restored via `showWorkflowScaffold = true` |

## Egress gate status

Unchanged — send, draft write, provider mutation remain blocked. No fake connected/live-mail claims.

## Validation

| Command | Result |
| --- | --- |
| `npm run check:quick` | pass |
| `npm run check` | pass |
| `npm run check:runtime002a` | pass (via full check) |
| `npm run check:runtime001` | pass (via full check) |
| `npm run gate:runtime002c` | pass |
| `cargo test --manifest-path src-tauri/Cargo.toml` | pass |
| `cargo build --manifest-path src-tauri/Cargo.toml` | pass |
| `git diff --check` | pass |

## PR #12 draft state

Open, draft, unmerged — not marked ready for review.

## UI-003E state

**NOT passed** — owner visual proof at `:4488` still required before merge prep.

## Remaining Account P0/P1 (after batch)

| ID | Finding | Status |
| --- | --- | --- |
| Owner retest | Account drawer + Settings accounts at `:4488` | Pending owner |
| G-P0-004 | Status repetition on non-Account surfaces | Out of scope |
| Runtime sync scheduler | Periodic history sync not wired | Runtime slice (forbidden this batch) |

## Next recommended fix batch

**UI-PEER-REVIEW-FIX-BATCH-003 — Home owner-mode cleanup** — next implementation batch after Mail/Account owner retest (review/classification for remaining pages continues in parallel).

## Decision value

`UI_PEER_REVIEW_FIX_BATCH_002_PASS_READY_FOR_OWNER_ACCOUNT_REVIEW`

Owner Account drawer review at `:4488` is safe to begin. Do not claim UI-003E PASS until owner completes the UI-003E runbook.
