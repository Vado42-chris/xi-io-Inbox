# GMAIL-002B Live Proof Receipt

## Date

2026-06-12 (pass 5 — metadata phase verification attempt)

## Branch

`ui-002/framework-derived-static-preview`

## Commit SHA

`PENDING`

## Scope

GMAIL-002B-LIVE-PROOF — operator validation of **separate** metadata and read-only body gates against real local Gmail OAuth. Proof/receipt only.

## Excluded scope

GMAIL-002C · GMAIL-002D · UI-012D · Gmail mutation · browser OAuth · committed real mail · Owner UI-003E

## Files changed

- `docs/ui/reviews/gmail-002b-live-proof-receipt.md`
- `docs/product/gmail-002-real-email-ingress-plan.md`
- `tools/gmail/lib/oauth-loopback.js`, `tools/gmail/lib/adapter.js` (port-in-use operator message)
- `TODO.md`

## Product UI code changed

**no**

## OAuth client present

**yes** — `secrets/gmail-oauth-client.json` gitignored

## OAuth configured

**no (pass 5)** — `test -f tools/gmail/data/token.json` → **fail**; `status` → `connected: false`

### Token persistence proof

| Step | Pass 5 result |
| --- | --- |
| `test -f tools/gmail/data/token.json` | **fail** — file absent |
| Fresh `node cli.js status` | **fail** — `connected: false`, `tokenScopes: []` |
| Token survives new CLI invocation | **not tested** — no token on disk |

Connect must complete callback and write token before metadata proof can start.

### Token root-cause analysis

| Cause | Evidence | Verdict |
| --- | --- | --- |
| Wipe/disconnect | No `wipe`/`disconnect` run in agent sessions | unlikely |
| Wrong workspace path | Same repo path throughout | ruled out |
| Failed callback / timeout | Multiple `connect` attempts timed out without callback | **likely** |
| Stale listener on `:8787` | `EADDRINUSE` observed pass 3; **process not identified** | probable, not proven |
| Permissions on `data/` | Directory writable; no token file ever created | not primary |
| Antigravity transient token | Reported success; not present on subsequent checks | **likely** (never persisted or lost before shared workspace) |

**Overall:** token missing because **connect did not complete successfully** (timeout and/or port conflict). Exact Antigravity wipe unknown.

**Canonical connect (never paste auth URLs in docs — `state` is ephemeral CSRF):**

```bash
cd "/media/chrishallberg/Storage 22/999_Work/003_Projects/017_xi-io_inbox/tools/gmail"
node cli.js connect
```

### OAuth consent app

**unknown / operator must confirm** — GCP project `273926245217`, client created 2026-06-12. Assume **Testing** mode until verified. Confirm `hallberg1974@gmail.com` is an allowed test user. Record unverified-app warning if Google shows one during connect.

## Readonly scope available

**no** — no token. Metadata and readonly are **separate gates** ([Google Gmail scopes](https://developers.google.com/workspace/gmail/api/auth/scopes)):

- **Metadata phase:** default connect → `gmail.metadata` only → profile, labels, metadata snapshot (no bodies)
- **Readonly phase:** after metadata proof → `GMAIL_ACCESS_MODE=readonly node cli.js connect` → `gmail.readonly` (restricted scope; local/private proof only unless Google verification/security assessment completed for any public/distributed use)

## Metadata proof result

**blocked (pass 5)** — no token; `profile`, `labels-counts`, `export-metadata-snapshot` not run

### Metadata proof checklist (required for pass)

| Step | Pass 5 | Required for pass |
| --- | --- | --- |
| Token on disk | fail | pass |
| `profile` succeeds | skipped | pass |
| `labels-counts` succeeds | skipped | pass |
| `export-metadata-snapshot --max 25` | skipped | pass |
| Copy to `public/data/gmail-metadata.local.json` | skipped | pass |
| Preview import / reload | skipped | pass |
| Fixture Inbox:3 vs real account:0 mismatch resolved | skipped | pass |
| Browser honest: local snapshot, not live Gmail | skipped | pass |
| Body/draft/send/mutation blocked | fail-closed OK | pass |

## Body-gate proof result

**pass (fail-closed)** — without token; no `mail.google.com`

## Body-read proof result

**blocked** — no token; **no arbitrary mailbox read** — proof requires operator-selected low-risk `messageId`/`threadId`, not default newest-inbox export

## Preview import proof result

**blocked** — no `public/data/gmail-metadata.local.json`

### Post-import verification checklist (required when metadata exists)

- Real account (`hallberg1974@gmail.com`) shows **nonzero** threads
- Status label shows **Metadata-only · local snapshot** (not Fixture preview)
- Fixture demo threads **not mixed** with real account counts (no global Inbox:3 while account Inbox:0)
- Draft/send/mutation remain blocked

## Selected message policy result

**pass** — agents must not export body from newest 1–5 messages by default

## Redaction proof result

**not run (live)** — unit tests pass; live redaction after readonly phase only

## Generated files ignore result

**pass**

## Secrets status

**pass** — nothing staged

## Token status

**absent (proof)** / **gitignored path OK**

## Broad scope blocked result

**pass**

## Draft write / send / mutation blocked

**pass** (fail-closed CLI)

## Real data committed

**no**

## npm run check result

**pass** (pass 4)

## git diff --check result

**pass**

## Gmail CLI checks result

**pass (fail-closed)** + improved `EADDRINUSE` message with `lsof` instructions (no silent process kill)

## PR draft state

**draft**

## Failure pattern (troubleshooting)

```text
OAuth client present
Gmail API enabled
token missing
metadata snapshot missing
local import file missing
preview remains fixture-driven
```

**Fix order:** metadata connect → profile → labels-counts → export-metadata-snapshot → copy to gitignored local import → verify preview → optional readonly reconnect → body proof on selected message only.

**Port `:8787` in use:** `lsof -i :8787` → stop **only** stale xi-io connect listener → rerun `node cli.js connect`. Do not kill unrelated processes.

## Remaining blockers

- Complete metadata-phase OAuth connect
- Metadata export + preview import + fixture-mix verification
- Optional readonly phase with selected message + redaction proof
- Dependabot · Bugbot · Pass 55 · Owner proof until UI-012F

## Next recommended pass

Finish **GMAIL-002B-LIVE-PROOF metadata phase** first. Do not start UI-012D, GMAIL-002C, or owner proof.

## Decision value

`GMAIL_002B_LIVE_PROOF_PARTIAL_OAUTH_OR_SAFE_MESSAGE_REQUIRED`

## Verification log

| Pass | Token | Metadata export | Preview real data | Decision |
| --- | --- | --- | --- | --- |
| initial | no | blocked | fixture | partial |
| follow-up | transient | blocked (API disabled) | fixture | partial |
| pass 3 | no | blocked | fixture | partial |
| pass 4 | no | blocked | fixture | partial |
| pass 5 | no | blocked (no token) | fixture | partial |
