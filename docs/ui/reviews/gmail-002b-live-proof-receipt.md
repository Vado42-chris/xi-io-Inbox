# GMAIL-002B Live Proof Receipt

## Date

2026-06-12 (pass 6 — cwd-aware operator paths)

## Branch

`ui-002/framework-derived-static-preview`

## Commit SHA

`1f4a95103535fc01e7b9f4d83a5b81739dda6a40`

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

**yes (2026-06-13)** — `test -f data/token.json` → pass; `node cli.js status` → `connected: true`, metadata scope granted

### Token persistence proof

| Step | Result |
| --- | --- |
| `test -f data/token.json` | pass (gitignored) |
| Fresh `node cli.js status` | pass |
| Token survives `npm run check` | pass (after wipe-test fix) |

### Token root-cause analysis (historical)

| Cause | Evidence | Verdict |
| --- | --- | --- |
| Wipe/disconnect | No `wipe`/`disconnect` run in agent sessions | unlikely |
| Wrong workspace path | Same repo path throughout | ruled out |
| Failed callback / timeout | Multiple `connect` attempts timed out without callback | **likely** |
| Stale listener on `:8787` | `EADDRINUSE` observed pass 3; **process not identified** | probable, not proven |
| Spurious callback probe | Bare hit to `/oauth2callback` without OAuth params aborted connect (**fixed pass 7**) | proven for operator session error |
| Permissions on `data/` | Directory writable; no token file ever created | not primary |
| Antigravity transient token | Reported success; not present on subsequent checks | **likely** (never persisted or lost before shared workspace) |

**Overall:** token missing because **connect did not complete successfully** (timeout and/or port conflict). Exact Antigravity wipe unknown.

**Canonical connect (never paste auth URLs — `state` is ephemeral CSRF):**

```bash
cd "/media/chrishallberg/Storage 22/999_Work/003_Projects/017_xi-io_inbox/tools/gmail"
node cli.js connect
```

### Operator commands (cwd-aware)

**From repo root:**

```bash
cd "/media/chrishallberg/Storage 22/999_Work/003_Projects/017_xi-io_inbox"
test -f tools/gmail/data/token.json && echo OK
node tools/gmail/cli.js status
node tools/gmail/cli.js profile
node tools/gmail/cli.js labels-counts
node tools/gmail/cli.js export-metadata-snapshot --max 25
cp tools/gmail/data/metadata-snapshot.json public/data/gmail-metadata.local.json
```

**From `tools/gmail` (same session after connect):**

```bash
cd "/media/chrishallberg/Storage 22/999_Work/003_Projects/017_xi-io_inbox/tools/gmail"
test -f data/token.json && echo OK
node cli.js status
node cli.js profile
node cli.js labels-counts
node cli.js export-metadata-snapshot --max 25
cp data/metadata-snapshot.json ../../public/data/gmail-metadata.local.json
```

Do **not** run `test -f tools/gmail/data/token.json` while cwd is already `tools/gmail` — that resolves to a non-existent nested path.

### If OAuth browser says success but token is still missing

Run immediately from `tools/gmail`:

```bash
pwd
ls -la data
test -d data && test -w data && echo "data writable"
node cli.js status
find .. -name token.json -print
```

- If `find` locates `token.json` elsewhere → token-path mismatch bug (record path).
- If no token exists → callback did not complete or adapter did not write token.
- **Do not** curl or open `http://localhost:8787/oauth2callback` while `connect` is running — bare requests used to abort connect with *OAuth callback missing state parameter* (fixed in adapter pass 7).

### OAuth consent app

**unknown / operator must confirm** — GCP project `273926245217`, client created 2026-06-12. Assume **Testing** mode until verified. Confirm test user on consent screen. Record unverified-app warning if Google shows one during connect.

## Metadata proof result

**pass (2026-06-13)** — metadata-only gate proven after `metadataListParams` fix (metadata scope cannot use search `q`; uses `labelIds: ['INBOX']`)

| Step | Result |
| --- | --- |
| `profile` | pass |
| `labels-counts` | pass — 124 labels |
| `export-metadata-snapshot --max 25` | pass — 25 threads, 50 messages, no bodies |
| Copy to `public/data/gmail-metadata.local.json` | pass — gitignored |
| Preview auto-load | pass — metadata replaces fixture inbox list |
| Body/draft/send/mutation blocked | pass (fail-closed) |

## Preview import proof result

**pass** — local metadata file present; `inboxThreads()` prefers metadata snapshot over fixtures

## Token status

**present (proof)** / **gitignored path OK**

## Decision value

`GMAIL_002B_LIVE_PROOF_PASS_METADATA_READY_FOR_UI_012D_OR_GMAIL_002C`

Readonly body proof remains a **separate optional gate**.

## Verification log

| Pass | Token | Metadata export | Preview real data | Decision |
| --- | --- | --- | --- | --- |
| pass 6 | no | blocked | fixture | partial |
| 2026-06-13 | yes | pass | local snapshot | **metadata pass** |

### Agent prep note

Uncommitted adapter fixes: `metadataListParams`, wipe-test token preservation. External divorce email catalog + Google Sheet tracked as `VAL-EXT-001` for post-ingress validation only — not LIVE-PROOF evidence.

## Readonly scope available

**no (not requested)** — metadata token only. Readonly is a separate gate after metadata pass.

## Body-gate proof result

**pass (fail-closed)** — no `mail.google.com`

## Body-read proof result

**blocked (optional phase)** — requires `GMAIL_ACCESS_MODE=readonly` reconnect + operator-selected message only

## Selected message policy result

**pass** — agents must not export body from newest 1–5 messages by default

## Redaction proof result

**not run (live)** — unit tests pass; live redaction after readonly phase only

## Generated files ignore result

**pass**

## Secrets status

**pass** — nothing staged

## Broad scope blocked result

**pass**

## Draft write / send / mutation blocked

**pass** (fail-closed CLI)

## Real data committed

**no**

## npm run check result

**pass** (2026-06-13)

## PR draft state

**draft**

## Remaining blockers

- Optional readonly body phase + redaction proof
- UI-012E → UI-012F → Owner UI-003E
- Dependabot · Bugbot · Pass 55

## Next recommended pass

**UI-012E** accessibility/contrast polish (after owner accepts MAIL-001 and UI-012D).
