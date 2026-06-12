# GMAIL-002B Live Proof Receipt

## Date

2026-06-12 (pass 3 verification)

## Branch

`ui-002/framework-derived-static-preview`

## Commit SHA

`4632f15b1ec7727a609715ca2acacd18342f7c0d`

## Scope

GMAIL-002B-LIVE-PROOF — operator validation of metadata + read-only body pipeline against real local Gmail OAuth.

## Excluded scope

GMAIL-002C draft write · GMAIL-002D send · UI-012D · Gmail mutation · browser OAuth · committed real mail · Owner UI-003E

## Files changed

Docs/receipt only (no product UI unless proof-blocking bug found).

## Product UI code changed

**no**

## OAuth client present

**yes** — `secrets/gmail-oauth-client.json` gitignored

## OAuth configured

**no (pass 3)** — `tools/gmail/data/token.json` **absent**; `node cli.js status` → `connected: false`

Prior transient connect (Antigravity) did not persist token on this workspace.

## Readonly scope available

**no (pass 3)** — no token; `GMAIL_ACCESS_MODE=readonly body-gate-status` → *OAuth token missing*

## Metadata proof result

**blocked** — cannot run `profile`, `labels-counts`, or `export-metadata-snapshot` without token. Gmail API enablement (operator confirmed) not verifiable until reconnect.

## Body-gate proof result

**pass (fail-closed)** — default mode blocks body read; readonly env blocks with token missing; no `mail.google.com`

## Body-read proof result

**blocked** — no token; no operator-selected safe message; no arbitrary mail read

## Preview import proof result

**blocked** — `public/data/gmail-metadata.local.json` and `gmail-body.local.json` absent

## Selected message policy result

**pass** — no sensitive mail read without operator selection

## Redaction proof result

**not run (live)** — unit tests pass via `npm run check`; live redaction unproven until readonly export

## Generated files ignore result

**pass** — `secrets/`, `tools/gmail/data`, `tools/gmail/receipts` gitignored; nothing staged

## Secrets status

**pass** — no OAuth client or tokens staged

## Token status

**pass (security)** / **absent (proof)** — token path gitignored; file missing

## Broad scope blocked result

**pass**

## Draft write blocked result

**pass** — `blocked gmail.drafts.create` → true

## Send blocked result

**pass** — `blocked gmail.users.messages.send` → true

## Mutation blocked result

**pass** — `blocked gmail.users.messages.modify` → true

## Real data committed

**no**

## npm run check result

**pass** (2026-06-12 pass 3)

## git diff --check result

**pass**

## Gmail CLI checks result

**pass (fail-closed)** — status, body-gate-status, blocked methods; live API calls blocked on missing token

## PR draft state

**draft**

## Remaining blockers

1. **Operator must complete `node cli.js connect`** and persist token locally
2. Metadata export + copy to `public/data/gmail-metadata.local.json`
3. Optional readonly body export with `GMAIL_ACCESS_MODE=readonly` + low-risk message selection
4. Preview refresh / Settings → Import metadata snapshot
5. Dependabot disabled · Bugbot triage · Pass 55 unverified · Owner proof blocked until UI-012F

## Operator unblock sequence

```bash
cd tools/gmail
node cli.js connect                    # approve in browser → token saved
node cli.js profile
node cli.js labels-counts
node cli.js export-metadata-snapshot --max 25
cp data/metadata-snapshot.json ../public/data/gmail-metadata.local.json
# reload preview (auto-loads local file on init)

# Optional readonly (after metadata proof):
GMAIL_ACCESS_MODE=readonly node cli.js connect   # if token lacks readonly
GMAIL_ACCESS_MODE=readonly node cli.js body-gate-status
GMAIL_ACCESS_MODE=readonly node cli.js export-readonly-body-snapshot --max 1 --max-messages 1
cp data/body-snapshot.json ../public/data/gmail-body.local.json
```

Never commit tokens, client JSON, or snapshot files.

## Next recommended pass

Re-run **GMAIL-002B-LIVE-PROOF** immediately after OAuth connect + metadata export. **UI-012D** only after live proof pass or explicit owner deferral.

## Decision value

`GMAIL_002B_LIVE_PROOF_PARTIAL_OAUTH_OR_SAFE_MESSAGE_REQUIRED`

## Verification log

| Pass | OAuth client | Token | Gmail API | Metadata export | Decision |
| --- | --- | --- | --- | --- | --- |
| 2026-06-12 initial | no | no | n/a | blocked | partial |
| 2026-06-12 follow-up | yes | yes (transient) | disabled | blocked | partial |
| 2026-06-12 pass 3 | yes | **no** | operator says enabled | blocked | partial |
