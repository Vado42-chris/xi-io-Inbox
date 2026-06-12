# GMAIL-002B Live Proof Receipt

## Date

2026-06-12

## Branch

`ui-002/framework-derived-static-preview`

## Commit SHA

`PENDING`

## Scope

GMAIL-002B-LIVE-PROOF — operator validation of existing metadata + read-only body gate against real local Gmail OAuth when available. Proof/receipt pass only.

## Excluded scope

- GMAIL-002C draft write
- GMAIL-002D send
- UI-012D visual polish
- Gmail mutation
- Browser OAuth
- Committed real mail content
- Owner UI-003E

## Files changed

- `docs/ui/reviews/gmail-002b-live-proof-receipt.md`
- `docs/product/gmail-002-real-email-ingress-plan.md`
- `docs/product/03-sprint-slice-plan.md`
- `docs/product/06-compliance-validation-index.md`
- `TODO.md`

## Product UI code changed

**no**

## OAuth client present

**no** — expected path `secrets/gmail-oauth-client.json` absent (only unrelated `secrets/API Key/openai-api-key.txt` present)

## OAuth configured

**no** — `secretsConfigured: false`, `connected: false`, no token at `tools/gmail/data/token.json`

## Readonly scope available

**no** — cannot connect without OAuth client; `GMAIL_ACCESS_MODE=readonly` reports token missing

## Metadata proof result

**blocked** — `node cli.js profile` fails closed: `OAuth client secrets missing. Place JSON at secrets/gmail-oauth-client.json (gitignored) or set GMAIL_OAUTH_CLIENT_PATH.`

Fail-closed status verified:

- `node cli.js status` → `connected: false`, `secretsConfigured: false`, `bodiesBlocked: true`, draft/send/mutation blocked
- No metadata export run (OAuth unavailable)

## Body-gate proof result

**pass (fail-closed)** — without OAuth:

- Default mode: `bodyReadBlockedReason`: opt-in `GMAIL_ACCESS_MODE=readonly` required
- With `GMAIL_ACCESS_MODE=readonly`: `bodyReadBlockedReason`: OAuth token missing
- `readonlyScopeGranted: false`, `broadScopeBlocked: false`
- Restricted scope notice present for `gmail.readonly`

## Body-read proof result

**blocked** — `node cli.js read-message-body test-message-id` → blocked, no payload, no mail read

No operator-selected safe message (OAuth unavailable; no arbitrary mail read attempted)

## Preview import proof result

**blocked** — no local redacted body snapshot generated; preview import not exercised

## Selected message policy result

**pass** — no arbitrary real mail read; body proof blocked pending OAuth + operator message selection

## Redaction proof result

**not run** — no live body export; unit tests in `tools/gmail/test/body-gate.mjs` remain passing via `npm run check`

## Generated files ignore result

**pass**

- `secrets/` → `.gitignore:2:secrets/`
- `tools/gmail/data/` → `tools/gmail/.gitignore:10:data/`
- `tools/gmail/receipts/` → `tools/gmail/.gitignore:11:receipts/`
- CLI proof generated 12 receipt files under `tools/gmail/receipts/` — all gitignored, unstaged

## Secrets status

**pass** — no secrets staged; OAuth client JSON not in repo

## Token status

**pass** — token path gitignored; token file absent

## Broad scope blocked result

**pass** — status scopes limited to metadata/readonly declarations; no `mail.google.com`

## Draft write blocked result

**pass** — `node cli.js blocked gmail.drafts.create` → `blocked: true`

## Send blocked result

**pass** — `node cli.js blocked gmail.users.messages.send` → `blocked: true`

## Mutation blocked result

**pass** — `node cli.js blocked gmail.users.messages.modify` → `blocked: true`

## Real data committed

**no**

## npm run check result

**pass** (2026-06-12) — includes `check:acc` + gmail adapter tests

## git diff --check result

**pass**

## Gmail CLI checks result

**pass (fail-closed)** — status, body-gate-status (default + readonly env), profile blocked, body read blocked, blocked method guards

## PR draft state

**draft** — PR #12 remains draft

## Remaining blockers

- OAuth client JSON not placed at `secrets/gmail-oauth-client.json`
- Live metadata/profile/labels export not proven
- Live read-only body export + redaction not proven against real mail
- No operator-selected safe message for body proof
- Preview import of live snapshot not proven
- Dependabot disabled
- Bugbot triage pending
- `gmail.readonly` restricted-scope production verification
- Pass 55 bounded metadata alignment unverified
- Owner visual proof blocked until UI-012F

## Operator steps to unblock (local only)

1. Create Google Cloud OAuth client (Desktop/loopback) with redirect `http://127.0.0.1:8787/oauth2callback`
2. Save client JSON to `secrets/gmail-oauth-client.json` (gitignored)
3. `cd tools/gmail && npm install`
4. Metadata proof: `node cli.js connect` → `profile` → `labels-counts` → `export-metadata-snapshot`
5. Read-only proof: `GMAIL_ACCESS_MODE=readonly node cli.js connect` → `body-gate-status` → select low-risk message → `read-message-body <id>` → `export-readonly-body-snapshot --max 1`
6. Preview: copy redacted snapshot to `public/data/gmail-body.local.json` (gitignored) and import in Settings → Accounts
7. Never commit tokens, client JSON, or private body content

Official references:

- [Choose Gmail API scopes](https://developers.google.com/workspace/gmail/api/auth/scopes)
- [Google API Services User Data Policy](https://developers.google.com/terms/api-services-user-data-policy)

## Next recommended pass

Re-run **GMAIL-002B-LIVE-PROOF** after operator OAuth setup and safe message selection. **UI-012D** may proceed only after owner accepts explicit partial live-proof blocker or live proof passes.

## Decision value

`GMAIL_002B_LIVE_PROOF_PARTIAL_OAUTH_OR_SAFE_MESSAGE_REQUIRED`
