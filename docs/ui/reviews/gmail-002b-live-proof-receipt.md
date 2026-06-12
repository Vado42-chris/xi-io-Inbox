# GMAIL-002B Live Proof Receipt

## Date

2026-06-12

## Branch

`ui-002/framework-derived-static-preview`

## Commit SHA

`da7607b3b4a9a1a93dba97d8e9ae507ac3a421fb`

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

**yes** (2026-06-12 follow-up) — `secrets/gmail-oauth-client.json` present and gitignored

## OAuth configured

**yes** (2026-06-12 follow-up) — `connected: true`, token at `tools/gmail/data/token.json` (gitignored, not staged)

## Readonly scope available

**yes on token** — token includes `gmail.readonly` and `gmail.metadata`; body read still requires `GMAIL_ACCESS_MODE=readonly` at runtime (fail-closed opt-in)

## Metadata proof result

**blocked (2026-06-12 follow-up)** — OAuth OK; Gmail API disabled in Google Cloud project `273926245217`:

```text
Gmail API has not been used in project 273926245217 before or it is disabled.
Enable: https://console.developers.google.com/apis/api/gmail.googleapis.com/overview?project=273926245217
```

`profile` and `labels-counts` fail until API enabled (propagation may take a few minutes after Enable).

Prior pass (2026-06-12 initial): **blocked** — OAuth client absent.

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

- **Gmail API not enabled** in Google Cloud project `273926245217` (blocks profile, labels, snapshots)
- Live metadata/profile/labels export not yet proven (waiting on API enable)
- Live read-only body export + redaction not yet proven against real mail
- Preview import of live snapshot not yet proven
- Dependabot disabled
- Bugbot triage pending
- `gmail.readonly` restricted-scope production verification
- Pass 55 bounded metadata alignment unverified
- Owner visual proof blocked until UI-012F

## Operator steps to unblock (local only)

0. **Enable Gmail API** for project `273926245217`: https://console.developers.google.com/apis/api/gmail.googleapis.com/overview?project=273926245217 — wait 2–5 minutes after Enable
1. OAuth client already at `secrets/gmail-oauth-client.json` ✓
2. Token already at `tools/gmail/data/token.json` ✓
3. Metadata proof: `node cli.js profile` → `labels-counts` → `export-metadata-snapshot --max 5`
4. Copy export to `public/data/gmail-metadata.local.json` (gitignored) and import in preview Settings → Accounts
5. Read-only proof: `GMAIL_ACCESS_MODE=readonly node cli.js body-gate-status` → `export-readonly-body-snapshot --max 1 --max-messages 1`
6. Copy redacted body snapshot to `public/data/gmail-body.local.json` (gitignored) and import in Settings
7. Never commit tokens, client JSON, or private body content

Official references:

- [Choose Gmail API scopes](https://developers.google.com/workspace/gmail/api/auth/scopes)
- [Google API Services User Data Policy](https://developers.google.com/terms/api-services-user-data-policy)

## Next recommended pass

Re-run **GMAIL-002B-LIVE-PROOF** after operator OAuth setup and safe message selection. **UI-012D** may proceed only after owner accepts explicit partial live-proof blocker or live proof passes.

## Decision value

`GMAIL_002B_LIVE_PROOF_PARTIAL_OAUTH_OR_SAFE_MESSAGE_REQUIRED`

## Verification log

| When | Check | Result |
| --- | --- | --- |
| 2026-06-12 initial | OAuth client | absent |
| 2026-06-12 follow-up | OAuth client + token | present, gitignored |
| 2026-06-12 follow-up | `node cli.js status` | `connected: true`, metadata+readonly scopes on token |
| 2026-06-12 follow-up | `node cli.js profile` | blocked — Gmail API disabled in GCP project 273926245217 |
| 2026-06-12 follow-up | `node cli.js labels-counts` | same Gmail API disabled error |
