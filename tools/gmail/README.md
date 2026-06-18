# Gmail Local Adapter (GMAIL-002B)

Local-only Gmail metadata/read-only adapter. No send, no draft write, no mutation. Body
reads require explicit `GMAIL_ACCESS_MODE=readonly` reconnect and still export redacted
local snapshots only.

## Setup

```bash
cd tools/gmail
npm install
```

Place OAuth client JSON at `secrets/gmail-oauth-client.json` (repo gitignored). Redirect URI must include `http://127.0.0.1:8787/oauth2callback`.

## Commands

```bash
npm run check
node cli.js status
node cli.js connect          # loopback OAuth; tokens → data/token.json (gitignored, 0600)
node cli.js profile
node cli.js labels
node cli.js labels-counts
node cli.js drafts-metadata --max 10
node cli.js search-metadata --query "in:inbox" --max 5
node cli.js export-metadata-snapshot --max 25
node cli.js export-readonly-body-snapshot --max 5
node cli.js wipe
node cli.js blocked gmail.messages.getBody
```

## Rules

- Tokens: `tools/gmail/data/token.json` only — never localStorage or repo; token files are
  written owner-only (`0600`) under an owner-only data directory.
- Receipts: `tools/gmail/receipts/` (gitignored) — no private payloads.
- Owner approval required before primary-account metadata smoke.
- Export commands print summary metadata by default. Full snapshots are written to gitignored
  files and only appear on stdout with explicit `--include-payload`.
- Gmail `snippet` is treated as sensitive provider metadata: allowed only inside gitignored
  local snapshots or sanitized samples, never as committed live proof.
- See `docs/providers/gmail/` for policies.
