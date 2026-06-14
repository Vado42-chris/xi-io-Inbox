# GMAIL-002A-EXT-004 History Sync Receipt

## Date

2026-06-10

## Branch

`ui-002/framework-derived-static-preview`

## Commit SHA

`PENDING`

## Scope

Gmail `historyId` incremental sync via `users.history.list`, local index upsert/remove, stored history cursor on full metadata sync, full-sync fallback when startHistoryId missing or invalid (404).

## Excluded scope

GCAL-001, body read, draft write, send, mutation, SQLite/LMDB storage, owner UI-003E proof, merge prep, live OAuth proof.

## Files changed

- `tools/gmail/lib/metadata-sync.js` (`collectHistoryMutations`, `isHistoryIdNotFoundError`)
- `tools/gmail/lib/local-mail-index.js` (`setHistoryState`, `removeFromMailIndex`)
- `tools/gmail/lib/adapter.js` (`runHistorySync`; persist history after full sync)
- `tools/gmail/lib/receipts.js` (history receipt events)
- `tools/gmail/lib/sync-status.js` (history cursor in status model)
- `tools/gmail/cli.js` (`sync-history`)
- `tools/gmail/test/history-sync.mjs` (new)
- `tools/gmail/test/metadata-sync.mjs` (history helpers)
- `public/inbox-preview.js` (history Activity titles + status panel row)
- `public/data/gmail-sync-status.sample.json` (historyState fixture)
- `scripts/gmail-002a-ext-004-model-check.mjs` (new)
- `package.json`, `tools/gmail/package.json`
- `docs/product/gmail-002a-ext-sync-roadmap.md`
- `docs/product/06-compliance-validation-index.md`
- `docs/product/03-sprint-slice-plan.md`
- `TODO.md`

## Product UI code changed

**yes** — History cursor row in Gmail sync status panel; Activity titles for history sync receipt events.

## History sync result

**pass** — `runHistorySync()` reads stored `historyState.lastHistoryId`, pages `users.history.list`, merges thread metadata into index, removes deleted messages/threads, updates cursor from profile `historyId`, falls back to bounded `runMetadataSync()` when cursor missing or not found.

## CLI support result

**pass** — `node cli.js sync-history [--start-history-id ID] [--no-fallback] [--max-pages N] [--max N]`.

## Privacy/stdout result

**pass** — History receipts store ids/counts only; no tokens or bodies in default output.

## Tests / checks result

| Check | Result |
| --- | --- |
| history-sync.mjs | pass |
| metadata-sync.mjs | pass |
| gmail-002a-ext-004-model-check.mjs | pass |
| npm run check | pass |

## schemaVersion

Preview state schema unchanged: **11**. Mail index envelope unchanged: **1**. Sync status schema unchanged: **1**.

## body read / draft / send / mutation

**blocked**

## Generated data committed

**no** — sample fixture only; operator artifacts remain gitignored.

## Live OAuth proof status

**deferred** — operator reconnect + live `sync-metadata` then `sync-history` required for live history proof.

## PR draft state

**draft**

## Owner proof state

UI-003E **not passed**.

## Next recommended pass

**GCAL-001** — Calendar read-only import.

## Decision value

`GMAIL_002A_EXT_004_PASS_READY_FOR_GCAL`

## Non-blocking caution

JSON mail index remains a bridge scaffold — not final storage architecture for long-term indexed mail.
