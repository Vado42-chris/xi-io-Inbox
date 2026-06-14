# GMAIL-002A-EXT-002 Peer Review Receipt

## Date

2026-06-14

## Branch

`ui-002/framework-derived-static-preview`

## Reviewed commit

`bae5fcdd9c607ae87f388dc9b980434b232e21df` (EXT-002 slice); branch HEAD `1080a53` at review time

## Reviewer

ChatGPT peer-review agents (owner-verified branch inspection)

## Files inspected

- `tools/gmail/lib/local-mail-index.js`
- `tools/gmail/lib/adapter.js` (`runMetadataSync` upsert hook)
- `tools/gmail/cli.js` (`query-index`)
- `tools/gmail/test/mail-index.mjs`
- `docs/ui/reviews/gmail-002a-ext-002-local-mail-index-receipt.md`

## Upsert hook placement verdict

**pass** — `runMetadataSync()` skips `planOnly` / `dryRun`, fetches paginated metadata, writes completion receipts, then calls `upsertToMailIndex()` before optional snapshot export.

## Privacy merge intent verdict

**pass (intent)** — merge helpers preserve body-gate fields when metadata-only sync updates labels/status.

## EXT-001 contract preservation verdict

**pass** — metadata sync remains label-scoped with pagination guards; no `q` under `gmail.metadata`.

## Findings

| ID | Severity | Finding | Required fix |
| --- | --- | --- | --- |
| EXT2-001 | Critical | Tests delete/write real operator index path | Test-only path injection / temp harness |
| EXT2-002 | High | Corrupt index fails open to empty | Fail closed on parse/schema errors |
| EXT2-003 | High | Direct write to index file | Temp file + atomic rename |
| EXT2-004 | High | No schema/account envelope | Add `schemaVersion`, provenance, accounts |
| EXT2-005 | Medium-high | `query-index` may print body preview fields | Default metadata summary only |
| EXT2-006 | Medium | No account filtering | Add `accountEmail`/`accountId` support |
| EXT2-007 | Medium | Receipt overclaims readiness | Defer EXT-003 until repair pass |

## JSON scaffold verdict

**pass (temporary)** — JSON index acceptable as scaffold only until status UI / multi-account requirements mature.

## Live proof verdict

**blocked** — OAuth reconnect + live sync persistence not re-verified at EXT-002 review time.

## Safety gates verdict

**pass** — body read, draft write, send, mutation remain blocked.

## Decision value

```text
GMAIL_002A_EXT_002_PEER_REVIEW_PARTIAL_FIXES_REQUIRED
```

## Next recommended pass

**GMAIL-002A-EXT-002-REPAIR** — local mail index safety repair. Do **not** start EXT-003 until repair receipt passes.
