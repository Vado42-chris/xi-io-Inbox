# GMAIL-002A-EXT-001 Peer Review Receipt

## Date

2026-06-10

## Branch

`ui-002/framework-derived-static-preview`

## Reviewed commit

`4470db2754f0a81589198173f5acff4d5205634a` (slice); branch HEAD `350bdec` at review time

## Files inspected

- `tools/gmail/lib/metadata-sync.js`
- `tools/gmail/lib/adapter.js` (`fetchPaginatedMetadata`, `fetchLabelThreadsPaginated`, `runMetadataSync`, `resolveSyncLabelJobs`, `metadataListParams`)
- `tools/gmail/lib/receipts.js` (`writeSyncReceipt`)
- `tools/gmail/cli.js`
- `tools/gmail/test/metadata-sync.mjs`, `metadata-guards.mjs`, `body-gate.mjs`
- `docs/ui/reviews/gmail-002a-ext-001-metadata-pagination-receipt.md`
- `docs/product/gmail-002a-ext-sync-roadmap.md`

## Metadata scope contract verdict

**pass** — Pagination uses `paginateListParams()` with `labelIds[]` and optional `pageToken` only; throws if `q` would be present. RECON-GMAIL-001 `metadataListParams()` fail-closed behavior preserved. Tests assert no `q` and unsupported query rejection.

## Pagination verdict

**pass** — `fetchLabelThreadsPaginated()` passes `pageToken` into `users.threads.list`, continues on `nextPageToken`, stops on `maxPages`, `maxThreads`, or absent `nextPageToken`. Progress via `writeSyncReceipt` `pageFetched` events. No unbounded loop.

**tracked debt:** `list-threads` / `list-messages` CLI still call single-page `gmailThreadsListMetadata` (not paginated). Primary sync path (`sync-metadata`, `export-metadata-snapshot`) uses paginated fetch — acceptable for EXT-001 scope.

## Label job verdict

**pass** — Presets `inbox_recent`, `unread`, `starred`, `sent_recent`; plus `--label`, `--mailbox`, safe `--query in:<alias>`. Default resolves to INBOX only; no all-mail backfill.

## Snapshot compatibility verdict

**pass** — Required metadata snapshot fields unchanged; sync progress recorded in `warnings[]` strings only. No preview `schemaVersion` / localStorage changes.

## Receipts/events verdict

**pass** — Events implemented: `planned`, `started`, `pageFetched`, `labelComplete`, `paused`, `completed`, `failed`, `bodyWithheld`, `draftWriteBlocked`, `sendBlocked`, `mutationBlocked`.

## CLI behavior verdict

**pass** — `sync-plan`, `sync-metadata`, `--dry-run`, `--plan`, `--max-pages`, `--max`, `--max-messages`, `--label`, `--mailbox`, `--job` documented; general Gmail search unavailable under metadata scope.

## Live proof status verdict

**pass (contract)** / **blocked (live pagination)** — Implementation receipt correctly states live pagination **not run** due to expired OAuth credentials. Prior GMAIL-002B metadata proof (25-thread snapshot) remains valid. Reconnect: `cd tools/gmail && node cli.js connect`.

## Safety gates verdict

**pass** — Body read gated; draft/send/mutation blocked; no secrets or real mail data staged. Verified `blocked gmail.drafts.send` returns `blocked: true`.

## Tests/checks result

| Check | Result |
| --- | --- |
| npm run check | pass |
| git diff --check | pass |
| metadata-sync.mjs | pass |
| metadata-guards.mjs | pass |
| body-gate.mjs | pass |
| sync-plan CLI | pass |

## Owner point of order — Ibal

**acknowledged** — Ibal in preview is **placeholder/shell only** (`preview_only`, fixture proposals). UI-005H must **not** be treated as product-complete. TODO updated with `IBAL-001` blocker; real concierge/model routing remains future work.

## Blockers before EXT-002

- Live pagination re-proof after OAuth reconnect (operator, not code)
- Owner UI-003E, ARCH-004 unchanged

## Required fixes

None for EXT-001 code contract.

## Decision value

`GMAIL_002A_EXT_001_PEER_REVIEW_PASS_READY_FOR_EXT_002`

## Next recommended pass

**GMAIL-002A-EXT-002** — local mail index storage (still no `historyId`).
