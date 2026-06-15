# CATCHUP-REVIEW-002 Peer Review — GMAIL-002A-EXT-004-REPAIR

## Date

2026-06-15

## Branch / remote truth

```text
Repo: Vado42-chris/xi-io-Inbox
Branch: ui-002/framework-derived-static-preview
PR: #12 (draft, unmerged)
Remote HEAD reviewed: eea905b7d13a8cd664d1e886c0958dd61ecb0072
Repair commit: b2a4b568c0ce59b629ef2a6da8f65a42e7375ca3
Receipt commit: eea905b7d13a8cd664d1e886c0958dd61ecb0072
Review commit: (this document — pending commit)
```

## Reviewer role

Cursor implementation peer review (owner checkpoint). **Not** live OAuth proof.

## Validation run (this pass)

| Check | Result |
| --- | --- |
| `git rev-parse HEAD` | `eea905b` (matches origin) |
| Repair scope files | `metadata-sync.js`, `local-mail-index.js`, `adapter.js`, `history-sync.mjs` only in `b2a4b56` |
| Account factory WIP | **not** in repair commits; stashed as `ACC-SYNC-UI-001` |
| `npm run check` | **pass** (route-table, route-smoke, gmail incl. history-sync, gcal) |

## Scope under review

**GMAIL-002A-EXT-004-REPAIR** only — fixes for CATCHUP-REVIEW-001 findings EXT4-001, EXT4-002, EXT4-003.

**Receipt:** `gmail-002a-ext-004-repair-receipt.md`

## Findings verification

| ID | Prior severity | Repair verification | Status |
| --- | --- | --- | --- |
| EXT4-001 | High | `collectHistoryMutations()` no longer adds `threadId` from `messagesDeleted`; only `removedMessageIds` populated. Test asserts `removedThreadIds === []`. | **fixed** |
| EXT4-002 | Medium | `runHistorySync()` sets `isPaused = Boolean(pageToken)` after bounded loop; updates `historyState.lastHistoryId` only when `!isPaused`; returns `endHistoryId: storedStart` when paused; emits `paused` receipt with `stoppedReason: maxPages`. | **fixed** |
| EXT4-003 | Low | `removeFromMailIndex()` filters threads with `.filter((thread) => thread.messages.length > 0)` after message removal; tests cover partial delete and final prune. | **fixed** |
| EXT4-004 | Info | Live OAuth / multi-page history still not exercised in CI — remains deferred. | **accepted deferral** |

## Residual notes (non-blocking)

| ID | Severity | Finding |
| --- | --- | --- |
| EXT4-R01 | Info | `sync-status.js` success events still center on `historyComplete` / `completed`; a paused history run surfaces `stoppedReason` via receipt details but is not a first-class operator banner — acceptable for draft; improve in ACC-SYNC-UI-001 or EXT-003 follow-up if needed. |
| EXT4-R02 | Info | On non-paused complete runs, cursor still advances to profile `historyId` (not last history record id) — pre-existing behavior; acceptable when pagination completes within bounds. |

## Decision

```text
GMAIL_002A_EXT_004_REPAIR_PEER_REVIEW_PASS_STRUCTURAL
LIVE_HISTORY_PROOF_STILL_DEFERRED
```

**Safe in draft PR** for bounded incremental history sync scaffold. **Operator live history proof at scale** still requires OAuth reconnect + controlled `--max-pages` exercise (owner/operator).

## Combined gate (updated)

```text
FRAMEWORK_BACKFEED_001_MAY_START
PR_12_REMAINS_DRAFT
DO_NOT_MERGE_UNTIL_UI_003E
```

Framework backfeed (`xi-io.net#239`) may start **export/doc sync only** — not PR merge, not live OAuth claims.

## Owner gates (unchanged)

- **UI-003E** — human only; not passed
- **PR #12** — remains **draft**; no merge-prep claims
- **IBAL-001**, **ARCH-004** — open

## Recommended next passes

| Order | Pass |
| --- | --- |
| 1 | **FRAMEWORK-BACKFEED-001** — xi-io.net `#239` (sync patterns export) |
| 2 | **ACC-SYNC-UI-001** — account factory (separate slice; stash exists locally) |
| — | UI-003E owner visual proof (parallel, human) |
| — | Live OAuth history proof (operator, after reconnect) |

## Decision value

`CATCHUP_REVIEW_002_EXT_004_REPAIR_PASS`
