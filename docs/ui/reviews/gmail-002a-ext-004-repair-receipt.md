# GMAIL-002A-EXT-004 Repair Receipt

## Date

2026-06-15

## Branch

`ui-002/framework-derived-static-preview`

## Commit SHA

`b2a4b568c0ce59b629ef2a6da8f65a42e7375ca3`

## Scope

Repair history sync safety issues from CATCHUP-REVIEW-001 (EXT4-001, EXT4-002, EXT4-003):

- **EXT4-001** — `messagesDeleted` no longer adds thread IDs to `removedThreadIds`; only message IDs are removed from the index.
- **EXT4-002** — when history pagination stops on `maxPages` with a remaining `nextPageToken`, `lastHistoryId` is not advanced; payload reports `paused: true` and emits a `paused` receipt with `stoppedReason: maxPages`.
- **EXT4-003** — `removeFromMailIndex` prunes thread rows whose `messages` array becomes empty after message removal.

## Excluded scope

Account factory / sync UI polish (ACC-SYNC-UI-001), preview fixture account migration, CSS/layout changes, framework backfeed (`xi-io.net#239`), merge prep, owner UI-003E proof, live OAuth history proof.

## Files changed

- `tools/gmail/lib/metadata-sync.js`
- `tools/gmail/lib/local-mail-index.js`
- `tools/gmail/lib/adapter.js`
- `tools/gmail/test/history-sync.mjs`
- `docs/ui/reviews/gmail-002a-ext-004-repair-receipt.md`
- `docs/ui/reviews/catchup-review-001-ext004-gcal-converge-peer-review.md` (review commit SHA correction)
- `docs/product/03-sprint-slice-plan.md`
- `docs/product/06-compliance-validation-index.md`
- `TODO.md`

## Product UI code changed

**no**

## EXT4-001 message delete safety

**pass** — `collectHistoryMutations()` records `removedMessageIds` only for `messagesDeleted`; `removedThreadIds` stays empty unless explicit thread removal is added later.

## EXT4-002 pagination cursor safety

**pass** — `runHistorySync()` updates `historyState.lastHistoryId` only when pagination completes (`!isPaused`); paused runs keep `endHistoryId` at `startHistoryId` and emit `paused` receipt.

## EXT4-003 empty thread pruning

**pass** — `removeFromMailIndex()` filters threads with zero messages after partial deletes; tests cover single-message delete, partial thread delete, and final prune.

## Tests / checks result

| Check | Result |
| --- | --- |
| history-sync.mjs | pass |
| npm run check | pass (this pass) |
| git diff --check | pass (this pass) |

## Generated data committed

**no**

## body read / draft / send / mutation

**blocked**

## PR draft state

**draft** — PR #12 stays draft until CATCHUP-REVIEW-002 and owner gates clear.

## Owner proof state

UI-003E **not passed**.

## Live history proof

**deferred** — structural/unit pass only until operator OAuth reconnect + bounded history run.

## Next recommended pass

**CATCHUP-REVIEW-002** — peer review EXT-004 repair only (blocks framework backfeed).

## Decision value

`GMAIL_002A_EXT_004_REPAIR_PASS_PENDING_CATCHUP_REVIEW_002`
