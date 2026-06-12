# GMAIL-002B Read-Only Body Gate

## Scope escalation (operator opt-in)

Default adapter mode remains **metadata-only** (`gmail.metadata`).

Read-only body access requires:

1. `export GMAIL_ACCESS_MODE=readonly`
2. `npm run setup:gmail` (if needed)
3. `node cli.js connect` (requests `gmail.readonly` in addition to metadata scopes)
4. Body commands (`read-message-body`, `export-readonly-body-snapshot`)

Official reference: [Choose Gmail API scopes | Google for Developers](https://developers.google.com/workspace/gmail/api/auth/scopes)

| Scope | GMAIL-002B |
| --- | --- |
| `gmail.metadata` | default metadata mode |
| `gmail.readonly` | **allowed when opted in** — restricted scope |
| `gmail.compose` | **blocked** until GMAIL-002C |
| `gmail.send` | **blocked** until GMAIL-002D |
| `mail.google.com` | **blocked** |

**Restricted scope notice:** `gmail.readonly` requires Google Cloud verification for production/public apps.

## CLI commands

```bash
npm run setup:gmail
node cli.js body-gate-status
node cli.js read-message-body <messageId>          # readonly mode + OAuth
node cli.js read-thread-bodies <threadId> --max 5
node cli.js export-readonly-body-snapshot --max 5 --max-messages 10
node cli.js redact-body-snapshot --in ./data/readonly-body-snapshot.json
node cli.js blocked gmail.messages.getBody
node cli.js blocked gmail.users.messages.send
```

## Preview import

- Local (gitignored): `public/data/gmail-body.local.json`
- Sample (committed, synthetic): `public/data/gmail-body.sample.json`
- Settings → Accounts → **Import read-only body snapshot**
- Browser preview never performs OAuth or stores tokens.

## Redaction

Exports strip HTML/remote resources, cap preview length, exclude attachments/raw payloads/tokens.

## Still blocked

Draft write, send, label/archive/trash/spam mutation, browser OAuth, broad scopes.
