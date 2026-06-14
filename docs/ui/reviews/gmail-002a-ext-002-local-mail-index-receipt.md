# GMAIL-002A-EXT-002 Local Mail Index Receipt

## Date

2026-06-14

## Branch

`ui-002/framework-derived-static-preview`

## Commit SHA

`214a9bfd996cfdc66cdc27b959c7c39d99158705`

## Scope

Local mail index storage, privacy-aware message merging (preserves body-gate fields: `sanitizedPlainText`, `sanitizedBodyPreview`, `bodyAvailable`, `redactionNotes`), label-based query filtering, pagination (limit, offset), sorting, CLI integration (`query-index` sub-command), and full unit test coverage.

## Excluded scope

historyId sync (EXT-004), sync status UI (EXT-003), body read, draft write, send, mutation, GCAL, product UI.

## Files changed / created

- `tools/gmail/lib/local-mail-index.js` (Created)
- `tools/gmail/test/mail-index.mjs` (Created)
- `tools/gmail/lib/adapter.js` (Modified to export index functions and hook upsertToMailIndex into sync completion)
- `tools/gmail/cli.js` (Modified to support query-index subcommand)
- `tools/gmail/package.json` (Modified check script to include new files)
- `TODO.md` (Modified to check off EXT-002)

## Product UI code changed

**no**

## PR body reconciliation check

**pass** — PR #12 draft state preserved.

## MAIL-001 status

**pass** (code); owner visual review pending.

## Live metadata proof status

**pass** (metadata updates are written to `data/mail-index.json` upon successful metadata sync jobs).

## Local Index Structure

**pass** — Mail index stores threads and messages separately in a gitignored local JSON file at `tools/gmail/data/mail-index.json`.

## Privacy-aware Merging

**pass** — Incremental upserts merge new message metadata (e.g. updated labels) with existing indexed message objects, explicitly retaining privacy-sanitized text fields generated under the body-gate (e.g. `sanitizedPlainText`, `sanitizedBodyPreview`, `bodyAvailable`, `redactionNotes`).

## Index Query Results

**pass** — Supports query filtering by `labelId` with sorting (recent-first desc or oldest-first asc), limit/offset pagination, and total thread count reporting.

## CLI Query subcommand

**pass** — `node cli.js query-index [--label ID] [--max N] [--offset N] [--sort asc|desc]` is operational.

## Tests / checks result

| Check | Result |
| --- | --- |
| mail-index.mjs | pass |
| metadata-sync.mjs | pass |
| metadata-guards.mjs | pass |
| body-gate.mjs | pass |
| npm run check | pass |
| git status | pass (clean working directory aside from local changes) |

## Generated data committed

**no** (data/ is gitignored)

## body read / draft / send / mutation

**blocked** — body-gate security boundaries strictly preserved.

## PR draft state

**draft**

## Owner proof state

UI-013C direction PASS; UI-003E **not passed**.

## Remaining blockers

- GMAIL-002A-EXT-003 sync status UI / Activity receipts
- GMAIL-002A-EXT-004 historyId incremental sync
- Owner UI-003E, ARCH-004

## Next recommended pass

**GMAIL-002A-EXT-003** — sync status UI + Activity receipts.

## Decision value

`GMAIL_002A_EXT_002_PASS_READY_FOR_STATUS_UI`
