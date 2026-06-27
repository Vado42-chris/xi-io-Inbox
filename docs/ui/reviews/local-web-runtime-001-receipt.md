# LOCAL-WEB-RUNTIME-001 — Local web command center receipt

## Date

2026-06-19

## Branch

`ui-002/framework-derived-static-preview`

## Product decision (owner)

```text
Yes — local web app + backend is v1; browser is the product.
```

```text
STRATEGY (owner, 2026-06-26) — DO NOT PIVOT HOST MODE YET

Product path remains:
http://127.0.0.1:8788 → local backend → Gmail OAuth/token/sync → local index → browser UI

Do not build a new desktop app, Flatpak, or Tauri fork now.
Tauri may become a packaging shell later — same runtime spine, not a replacement architecture.

v1 sync is near-real-time background sync (startup + interval + focus + manual repair), not Gmail Pub/Sub push.
Blockers are runtime ownership, token path, sync freshness, and observability — not “web vs desktop.”

Qwen-AgentWorld: investigation only — see docs/ai/qwen-agentworld-provider-001-investigation.md
Do not implement until LOCAL-WEB-RUNTIME-001 PASS and separate slice approval.
```

`:4488` static preview is **Demo/CI only**. Live mail proof uses **local web runtime**.

## Architecture

```text
Browser UI on localhost:8788
→ local backend API (server/local-web-runtime.mjs)
→ OAuth callback + token store (~/.xiio/inbox/gmail-provider)
→ Gmail REST read-only sync (tools/gmail adapter)
→ local mail index
→ UI reads /api/mail/*
```

## Slices landed (initial pass)

| Slice | Result |
| --- | --- |
| 001A | Backend skeleton + `/api/health` |
| 001B | `/api/gmail/oauth/start` + `/api/gmail/oauth/callback` |
| 001C | Connect → automatic metadata sync |
| 001D | Startup/interval sync via `history.list` when `historyId` exists |
| 001E | UI detects local web runtime and reads backend mail state |

## Commands

```bash
cd "/media/chrishallberg/Storage 22/999_Work/003_Projects/017_xi-io_inbox"
npm run setup:gmail   # first run
npm run local:web     # product runtime — browser at http://127.0.0.1:8788
npm run dev           # demo/CI only — NOT live mail
```

## OAuth setup

Register redirect URI in Google Cloud Console:

```text
http://127.0.0.1:8788/api/gmail/oauth/callback
```

Or set `XIIO_GMAIL_OAUTH_REDIRECT_URI` to match your OAuth client JSON.

Data path (default):

```text
XIIO_DATA_DIR=~/.xiio/inbox
```

## API surface

| Endpoint | Purpose |
| --- | --- |
| `GET /api/health` | Runtime mode probe |
| `GET /api/gmail/oauth/start` | Begin OAuth |
| `GET /api/gmail/oauth/callback` | OAuth callback + initial sync |
| `GET /api/mail/status` | Connection + last checked |
| `GET /api/mail/accounts` | Connected accounts |
| `GET /api/mail/threads` | Mail index threads |
| `GET /api/mail/threads/:id/body` | Selected-thread read-only body hydration |
| `GET /api/mail/labels` | Gmail label/account metadata |
| `POST /api/mail/sync` | Manual repair sync |

## Process rule (locked)

```text
No owner review of live mail on :4488.
Live mail proof requires npm run local:web.
:4488 is static layout/demo/CI only.
```

## Stop lines

```text
No send/archive/delete/label mutation
No provider write actions live in owner proof
No Pub/Sub
No Group B promotion
No Activity B6 / Integrations IA / big features
No GitHub scaffold until LOCAL_WEB_RUNTIME_001_OWNER_PROOF: PASS
Tauri is subordinate — not primary proof path
```

## Parallel work captured (not active)

```text
NAV-POLISH-001 / BRAND-SHELL-POLISH-001 — owner reviewed; see docs/ui/polish/brand-001-shell-lock.md
MOTION-SYSTEM-001 — tokens + shell wiring (001B); full audit after Gmail PASS; see docs/ui/polish/motion-system-001-design-note.md
LOCAL-WEB-RUNTIME-001G — live sync + hydration state model (in tree, pending owner proof)
LOCAL-WEB-RUNTIME-001H — Gmail labels/account metadata + selected body hydration completion (in tree, pending owner proof)
IBAL-DENOISE-RESPONSE-001 — point-by-point de-noise/response interview (spec only; see docs/product/ibal-denoise-response-001-spec.md)
GitHub L1 workspace strategy — acknowledged; see docs/product/github-workspace-l1.md (implement after Gmail PASS)
```

**Active gate only:** LOCAL-WEB-RUNTIME-001 owner proof at http://127.0.0.1:8788 — do not fork to GitHub scaffold.

## Decision token

```text
LOCAL_WEB_RUNTIME_001_LANDED_PENDING_OWNER_PROOF
```

**Do not commit until owner proof is recorded below.**

## OAuth security shape (pre-commit audit)

| Control | Status | Notes |
| --- | --- | --- |
| Loopback redirect `http://127.0.0.1:8788/api/gmail/oauth/callback` | Required | Must match Google Cloud authorized URI exactly or `redirect_uri_mismatch` |
| `state` parameter (CSRF) | **Present** | `generateOAuthState` + `validateOAuthState` in `server/gmail-oauth.mjs` |
| PKCE (`code_challenge` / verifier) | **Present** | `generatePkcePair` in `tools/gmail/lib/oauth-loopback.js`; verifier stored server-side with `state`; exchanged on callback |
| Tokens in server filesystem | **Yes** | `~/.xiio/inbox/gmail-provider/data/token.json` — not browser `localStorage` |

Google installed-app guidance: loopback redirect, `state` for CSRF, PKCE recommended for native/loopback clients.

## Process lock

```text
Live mail proof = http://127.0.0.1:8788 only (npm run local:web)
Static UI proof = :4488 only (npm run dev — Demo/CI)
No commit before LOCAL_WEB_RUNTIME_001_OWNER_PROOF: PASS
No Activity B6, Integrations IA, Group B, or big features until proof passes
```

## Owner proof (required before commit)

**Run order (owner-reviewed).** Stop stale `:8788` before start — we hit `EADDRINUSE` once; do not skip.

**1. Stop stale `:8788` server if needed:**

```bash
lsof -iTCP:8788 -sTCP:LISTEN -n -P
kill <PID>   # only if a stale node process is listed
lsof -iTCP:8788 -sTCP:LISTEN -n -P   # should return nothing
```

**2. Start fresh runtime:**

```bash
cd "/media/chrishallberg/Storage 22/999_Work/003_Projects/017_xi-io_inbox"
npm run local:web
```

Startup log **must** show:

```text
Token path: /home/chrishallberg/.xiio/inbox/gmail-provider/data/token.json
```

**3. Hard refresh:** http://127.0.0.1:8788 — **not** `:4488`.

**4. Connect Gmail** from the UI or:

```text
http://127.0.0.1:8788/api/gmail/oauth/start
```

Use a **fresh** OAuth flow — do not refresh an old callback URL.

**5. Verify token ownership:**

```bash
ls -la ~/.xiio/inbox/gmail-provider/data/token.json
curl -s http://127.0.0.1:8788/api/health | python3 -m json.tool
```

Expected: `"tokenPresentAtRuntimePath": true`

**6. Verify product behavior:**

- Live inbox loads
- Status: Connected · last checked · background refresh on
- One selected thread body loads read-only
- Reply/Send/archive/delete/label provider writes remain blocked
- Refresh now remains secondary repair only

**7. Owner records:**

```text
LOCAL_WEB_RUNTIME_001_OWNER_PROOF: PASS
```

or

```text
LOCAL_WEB_RUNTIME_001_OWNER_PROOF: FAIL
```

with exact step and evidence.

`tokenPresentAtRuntimePath: false` is expected **only before** Connect. After a fresh Connect it must be `true`, and one message body must load.

**No commit until PASS. No push. No GitHub scaffold. No Group B. No Activity B6. No Integrations IA. No CloudHQ. No provider egress.**

### Checklist (receipt table)
| --- | --- |
| 1 | `/api/health` returns OK |
| 2 | Browser UI loads from local web runtime (8788), not static `:4488` |
| 3 | Connect Gmail opens OAuth (fresh flow — do not reuse old callback URLs) |
| 4 | OAuth callback succeeds on `127.0.0.1:8788` (no `invalid_grant`; PKCE `codeVerifier` fix in tree) |
| 5 | `~/.xiio/inbox/gmail-provider/data/token.json` exists; `tokenPresentAtRuntimePath: true` |
| 6 | Runtime does **not** depend on `tools/gmail/data/token.json` |
| 7 | Initial read-only metadata sync runs automatically after connect |
| 8 | Live inbox headers populate without manual repair |
| 9 | Click **one thread** → read-only **body text loads** (`GMAIL_ACCESS_MODE=readonly`) |
| 10 | Status: Connected · last checked · background refresh on |
| 11 | Close/reopen reuses token + startup sync |
| 12 | Focus or ~60s interval triggers incremental sync |
| 13 | No live send/archive/delete/label write |
| 14 | `:4488` remains Demo/CI only |

Record:

```text
LOCAL_WEB_RUNTIME_001_OWNER_PROOF: PASS | FAIL
Reviewed by: Chris
Notes:
Evidence:
```

## LOCAL-WEB-RUNTIME-001H owner proof (read-only runtime only)

```text
LOCAL_WEB_RUNTIME_001H_OWNER_PROOF: PASS FOR READ-ONLY RUNTIME ONLY
Reviewed by: Chris
Date: 2026-06-27
Evidence: owner screenshot + agent /api/mail/status and body endpoint verification on http://127.0.0.1:8788
```

**PASS means:** Gmail connects; token scope healthy (`gmail.readonly` yes, `gmail.metadata` no); live metadata sync; labels/account metadata sync; selected body hydrates read-only; live threads stay in local-web reading pane (not fixture preview); provider writes remain blocked.

**PASS does not mean:** draft, send, reply, receive/freshness smoke, Ibal response workflow, multi-account IA, Microsoft/GitHub parity, or full Inbox product completion. Provider egress remains blocked and is not part of 001H.

## After PASS only

Two commits (preferred):

1. `LOCAL-WEB-RUNTIME-001H: prove read-only Gmail runtime`
2. Capture-only planning docs (provider/desktop/Ibal/mail IA)

Keep separate: FIX-BATCH-009, Group B docs, shell proof records, motion/brand polish, egress slices.

Owner proof block (legacy):

```text
LOCAL_WEB_RUNTIME_001_OWNER_PROOF: PASS | FAIL
Reviewed by:
Notes:
Evidence:
```
