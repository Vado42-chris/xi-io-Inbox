# GMAIL-002A: Metadata Bridge (Local CLI + Preview Import)

## Adapter verification (2026-06-10)

| Property | Value |
| --- | --- |
| OAuth client path | `secrets/gmail-oauth-client.json` (repo gitignored) or `GMAIL_OAUTH_CLIENT_PATH` |
| Token storage | `tools/gmail/data/token.json` (gitignored) |
| Receipts | `tools/gmail/receipts/` (gitignored) |
| Snapshot export | `tools/gmail/data/metadata-snapshot.json` (gitignored) |
| Preview import (local) | `public/data/gmail-metadata.local.json` (gitignored) |
| Preview import (sample) | `public/data/gmail-metadata.sample.json` (sanitized, committed) |

## Scopes (least privilege)

Official reference: [Choose Gmail API scopes | Google for Developers](https://developers.google.com/workspace/gmail/api/auth/scopes)

| Scope | GMAIL-002A |
| --- | --- |
| `openid`, `email` | account identity |
| `https://www.googleapis.com/auth/gmail.metadata` | **allowed** — labels, headers, IDs, counts, snippets |
| `gmail.readonly` | **blocked** until GMAIL-002B |
| `gmail.compose` | **blocked** until GMAIL-002C |
| `gmail.send` | **blocked** until GMAIL-002D |
| `mail.google.com` | **blocked** |

## CLI commands

```bash
cd tools/gmail
npm run setup:gmail   # from repo root: npm run setup:gmail
npm run check         # from repo root: npm run check (includes check:gmail)
node cli.js status
node cli.js connect   # OAuth with state validation + timeout (local operator only)
node cli.js wipe --dry-run
node cli.js wipe
node cli.js profile
node cli.js list-labels
node cli.js labels-counts
node cli.js list-threads --max 10
node cli.js list-messages --max 10
node cli.js thread-metadata <threadId>
node cli.js export-metadata-snapshot --max 25 --max-messages 50
node cli.js blocked gmail.messages.getBody
node cli.js blocked gmail.drafts.send
```

## Metadata snapshot format

See exported JSON from `export-metadata-snapshot`. Required top-level fields:

- `accountEmail`, `generatedAt`, `source: local-gmail-cli`, `mode: metadata-only`
- `labels`, `counts`, `threads`, `messages`
- `warnings`, `blockedCapabilities`

Forbidden in snapshot: bodies, attachments, raw payloads, OAuth tokens.

## Preview import gate

1. Operator exports snapshot via CLI (requires local OAuth).
2. Copy to `public/data/gmail-metadata.local.json` **or** use committed sample for demo.
3. In preview: Settings → Accounts → **Import metadata snapshot**.
4. Browser never holds OAuth tokens. Import is a read of same-origin JSON only.

UI states distinguish fixture preview, metadata snapshot, browser not connected, and blocked body/draft/send.

## Blocked in GMAIL-002A

- Message body read
- Draft write / send
- Provider label/archive/delete mutations
- Browser OAuth
- Live sync claims without verified bridge output

## Receipt

`docs/ui/reviews/gmail-002a-real-gmail-metadata-ingress-receipt.md`
