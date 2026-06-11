# Gmail Local Adapter (GMAIL-001C)

Local-only Gmail **metadata** adapter. No send, no draft write, no bodies by default.

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
node cli.js connect          # loopback OAuth; tokens → data/token.json (gitignored)
node cli.js profile
node cli.js labels
node cli.js labels-counts
node cli.js drafts-metadata --max 10
node cli.js search-metadata --query "in:inbox" --max 5
node cli.js wipe
node cli.js blocked gmail.messages.getBody
```

## Rules

- Tokens: `tools/gmail/data/token.json` only — never localStorage or repo.
- Receipts: `tools/gmail/receipts/` (gitignored) — no private payloads.
- Owner approval required before primary-account metadata smoke.
- See `docs/providers/gmail/` for policies.
