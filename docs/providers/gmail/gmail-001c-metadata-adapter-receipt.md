# GMAIL-001C Receipt

## Date

2026-06-10

## Branch

`ui-002/framework-derived-static-preview`

## Commit SHA

`pending-commit`

## Scope

Local Gmail metadata-only adapter CLI in `tools/gmail/`: loopback OAuth, token file storage (gitignored), profile/labels/counts/drafts-metadata/search-metadata, blocked body/send/draft-write methods.

## Excluded scope

- Product UI (`public/inbox-preview.*`)
- Gmail account connect smoke (no owner OAuth client in repo)
- Message body read
- Draft create/update
- Send
- Real account data in committed fixtures

## Files created

- `tools/gmail/package.json`
- `tools/gmail/package-lock.json`
- `tools/gmail/cli.js`
- `tools/gmail/lib/adapter.js`
- `tools/gmail/lib/response.js`
- `tools/gmail/lib/token-store.js`
- `tools/gmail/lib/receipts.js`
- `docs/providers/gmail/gmail-001c-metadata-adapter-receipt.md`

## Files updated

- `tools/gmail/README.md`
- `tools/gmail/.gitignore`
- `docs/product/04-build-readiness-gates.md`
- `docs/product/06-compliance-validation-index.md`
- `TODO.md`

## Validation

| Check | Result |
| --- | --- |
| `npm run check` (root) | pass |
| `npm run check` (tools/gmail) | pass |
| `node cli.js status` | pass (not connected) |
| `node cli.js blocked gmail.messages.getBody` | pass (blocked) |
| product UI code changed | no |
| OAuth implemented | yes (local CLI) |
| Gmail account connected | no (no secrets) |
| message bodies read | no |
| drafts written | no |
| send enabled | no |
| token storage | yes (`data/token.json` gitignored) |
| `secrets/` staged | no |

## Privacy decision

Adapter ready for owner metadata smoke after `secrets/gmail-oauth-client.json` + explicit owner approval. CLI output stays local; do not commit API responses.

## Next recommended pass

1. Owner places OAuth client JSON in `secrets/` and runs `node cli.js connect` + `labels-counts` (metadata smoke).
2. **UI-009A** — Add Account wizard shell wired to adapter status (no tokens in preview UI).
3. **xi-io.net#239** — backfeed provider adapter contract (optional 0–1 pass).

## Decision value

```text
GMAIL_001C_IMPL_PASS_METADATA_ADAPTER_READY_OWNER_CREDENTIALS_REQUIRED
```
