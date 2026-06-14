# GMAIL-002A-EXT Sync Roadmap

## Why EXT exists

GMAIL-002B-LIVE-PROOF validated metadata ingress with a **25-thread snapshot**. That is sufficient for proof, not product-scale mail. EXT extends the metadata bridge with pagination and label-scoped jobs before any local index or historyId work.

## Metadata-only constraints

- Scope: `gmail.metadata` only by default.
- Gmail `users.threads.list` **`q` search is unavailable** under metadata scope.
- Use **`labelIds[]`**, **`pageToken`**, **`nextPageToken`**, and **`maxResults`** only.
- Unsupported query strings must **fail closed** (RECON-GMAIL-001).

## Backfill policy

| Allowed default | Blocked default |
| --- | --- |
| Recent-first INBOX via label job | All-mail unbounded crawl |
| Explicit `--max-pages` and `--max` limits | Silent full mailbox export |
| Label-scoped jobs (INBOX, UNREAD, STARRED, SENT) | General Gmail search |
| Metadata headers/snippets only | Bodies in metadata sync |

## Slice map

| Slice | Delivers |
| --- | --- |
| **GMAIL-002A-EXT-001** | Pagination + label jobs + CLI plan/dry-run + sync receipts |
| **GMAIL-002A-EXT-002** | Local mail index (JSON scaffold; safety repair required before status UI) |
| **GMAIL-002A-EXT-002-REPAIR** | Index test isolation, fail-closed load, atomic writes, envelope, account filters, safe query output |
| **GMAIL-002A-EXT-003** | Sync status in Activity + operator progress UI |
| **GMAIL-002A-EXT-004** | `historyId` incremental sync + full-sync fallback |

## CLI (EXT-001)

```bash
node cli.js sync-plan --job inbox_recent --max-pages 2 --max 50
node cli.js sync-metadata --dry-run --mailbox inbox
node cli.js sync-metadata --job inbox_recent --max-pages 1 --max 25 --out data/metadata-snapshot.json
node cli.js export-metadata-snapshot --max-pages 2 --max 50
node cli.js sync-status
node cli.js sync-status --out ../public/data/gmail-sync-status.local.json
node cli.js sync-history --max-pages 1 --max 25
```

## Snapshot compatibility

Paginated exports keep the existing metadata snapshot schema (`mode: metadata-only`). Sync progress is recorded in `warnings[]` strings and CLI/sync receipts — no preview `schemaVersion` change in EXT-001.

## Remaining blockers

- Module skeleton + route-table contract (CONVERGE-001)
- Body read remains gated (GMAIL-002B)
- Draft/send/mutation blocked (GMAIL-002C/D)
- Owner UI-003E not passed
