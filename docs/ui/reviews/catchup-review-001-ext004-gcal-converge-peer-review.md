# CATCHUP-REVIEW-001 Peer Review — EXT-004, GCAL-001, CONVERGE-001

## Date

2026-06-10

## Branch / remote truth

```text
Repo: Vado42-chris/xi-io-Inbox
Branch: ui-002/framework-derived-static-preview
PR: #12 (draft, unmerged)
Remote HEAD reviewed: 0d3619f
Review commit: `5635b9baaa82b069adbc1918a0487b1c3bbbdec8`
```

## Reviewer role

ChatGPT-style implementation peer review (owner checkpoint). **Not** live OAuth proof.

## Validation run (this pass)

| Check | Result |
| --- | --- |
| `git rev-parse HEAD` | `0d3619f` (matches origin) |
| `npm run check` | **pass** (route-table, route-smoke, gmail incl. history-sync, gcal) |

## 1. GMAIL-002A-EXT-004 — historyId incremental sync

**Receipt:** `gmail-002a-ext-004-history-sync-receipt.md` @ `3281645`

### Verified present

- `runHistorySync()` — `users.history.list`, bounded pagination, gate receipts
- `collectHistoryMutations()` / `isHistoryIdNotFoundError()`
- Index upsert/remove, `setHistoryState`, full-sync fallback on missing/404 cursor
- `sync-history` CLI, tests (`history-sync.mjs`), preview history cursor row
- Full metadata sync persists `historyState` after success

### Findings

| ID | Severity | Finding |
| --- | --- | --- |
| EXT4-001 | **High (live proof)** | `messagesDeleted` adds `threadId` to `removedThreadIds`; `removeFromMailIndex` then drops the **entire thread** when only one message was deleted in a multi-message thread. Index can lose valid messages. |
| EXT4-002 | **Medium (live proof)** | History cursor advances to profile `historyId` even when pagination stops on `maxPages` while `nextPageToken` remains — mutations on later pages are skipped until manual full sync. |
| EXT4-003 | Low | Empty thread shells possible after partial message removal if thread row not pruned. |
| EXT4-004 | Info | Live OAuth / history list not exercised in CI; deferred appropriately. |

### Decision

```text
GMAIL_002A_EXT_004_PEER_REVIEW_PARTIAL_FIXES_BEFORE_LIVE_PROOF
```

**Safe in draft PR** as bounded scaffold. **Not safe for operator live history sync at scale** until EXT4-001 (required) and EXT4-002 (recommended) are repaired and re-reviewed.

### Required repair (EXT-004-REPAIR)

1. On `messagesDeleted`, remove **message ids only**; do not add `threadId` to `removedThreadIds` unless the provider signals thread deletion.
2. Do not advance `historyState.lastHistoryId` when sync stopped due to `maxPages` with a remaining `nextPageToken` (or emit explicit `paused` receipt).

---

## 2. GCAL-001 — Google Calendar read-only import

**Receipt:** `gcal-001-calendar-readonly-import-receipt.md` @ `1ee37a7`

### Verified present

- `tools/gcal/` adapter — `calendar.readonly` scope, separate loopback port **8788**
- Token isolation (`tools/gcal/data/token.json`), blocked write method guard
- Snapshot schema rejects attendees/tokens/conference fields
- CLI export + preview import (`gcal-events.sample.json`), `check:gcal001`
- Event write / calendar mutation remain blocked in preview

### Findings

| ID | Severity | Finding |
| --- | --- | --- |
| GCAL-001 | Info | Live OAuth export not validated in CI — deferred, acceptable. |
| GCAL-002 | Low | Second OAuth client path (`secrets/gcal-oauth-client.json`) — operator must not reuse Gmail client JSON without Calendar scope. Documented in README. |

### Decision

```text
GCAL_001_PEER_REVIEW_PASS_LIVE_PROOF_DEFERRED
```

---

## 3. UI-CONVERGE-001 — route table + module skeleton

**Receipt:** `ui-converge-001-route-table-receipt.md` @ `a74d442`

### Verified present

- `public/src/shell/route-table.js` — PRIMARY_NAV, mail workbench sub-views, workspace↔lane↔hash, scope-lens lanes
- Preview imports route table; inline `PRODUCT_LEVEL_NAV` removed
- `check:route-table` + `route-smoke.mjs` pass
- No working lanes deleted; drafts/approvals remain `#/inbox` sub-views

### Findings

| ID | Severity | Finding |
| --- | --- | --- |
| CONV-001 | Low | `contextNavOwner: 'renderHomeContextNav'` is metadata-only — no such renderer exists (home uses related-suite zone). Harmless until enforced. |
| CONV-002 | Info | Monolith still owns all renderers; extraction debt unchanged (ui-016c tracked). |

### Decision

```text
UI_CONVERGE_001_PEER_REVIEW_PASS
```

---

## Combined gate

```text
DO_NOT_START_FRAMEWORK_BACKFEED_YET
```

Framework backfeed (`xi-io.net#239`) must wait until:

1. **GMAIL-002A-EXT-004-REPAIR** completes and is peer-reviewed (blocks exporting sync patterns)
2. GCAL-001 and CONVERGE-001 passes accepted (done above)

## Owner gates (unchanged)

- **UI-003E** — human only; not passed
- **PR #12** — remains **draft**; no merge-prep claims
- **IBAL-001**, **ARCH-004** — open

## Recommended next passes

| Order | Pass |
| --- | --- |
| 1 | **GMAIL-002A-EXT-004-REPAIR** (EXT4-001, EXT4-002) |
| 2 | Re-run **CATCHUP-REVIEW-002** on repair only |
| 3 | **FRAMEWORK-BACKFEED-001** (only after repair pass) |
| — | UI-003E owner visual proof (parallel, human) |

## Decision value

`CATCHUP_REVIEW_001_COMPLETE_DO_NOT_BACKFEED`
