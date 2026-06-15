# GMAIL-002: Real Gmail Ingress Plan (Staged)

## Purpose

Move from fixture-only static preview toward **real product mail metadata** using least-privilege Gmail API scopes, local adapter boundaries, and explicit gates for body read, draft write, and send.

Official scope reference: [Choose Gmail API scopes | Google for Developers](https://developers.google.com/workspace/gmail/api/auth/scopes)

## Principles

1. **Narrowest scope possible** — request only scopes required for the current gate ([Google scope guidance](https://developers.google.com/workspace/gmail/api/auth/scopes)).
2. **Tokens outside browser preview** — OAuth and refresh tokens in OS keychain or gitignored local store; never `localStorage` / repo / fixtures.
3. **Honest UI** — browser preview does not imply connected Gmail until adapter receipts confirm sync.
4. **Receipts for every gate** — connect, sync, blocked escalation, and wipe events are Activity-visible.
5. **No broad `mail.google.com`** unless a documented, reviewed need exists.

## Scope map (Google-documented)

| Scope | Google classification | xi-io use |
| --- | --- | --- |
| `https://www.googleapis.com/auth/gmail.metadata` | Restricted; metadata-only | **GMAIL-002A** labels, thread/message IDs, headers, counts, snippets where API allows |
| `https://www.googleapis.com/auth/gmail.readonly` | Restricted; read messages/settings | **GMAIL-002B** read-only body gate only |
| `https://www.googleapis.com/auth/gmail.compose` | Sensitive; create/send drafts | **GMAIL-002C** local draft write (no send) |
| `https://www.googleapis.com/auth/gmail.send` | Sensitive; send only | **GMAIL-002D** send after approval |
| `https://mail.google.com/` | Restricted; full mailbox | **Blocked** for this app |

Prior art: `docs/providers/gmail/gmail-001b-local-oauth-adapter-plan.md`, `gmail-001c-metadata-adapter-receipt.md`.

---

## GMAIL-002A — Metadata bridge — **complete** (2026-06-10)

## GMAIL-002A-HARDEN — Adapter hardening — **complete** (2026-06-12)

Receipt: `docs/ui/reviews/gmail-002a-hardening-receipt.md`

- CI explicitly runs `npm ci` in `tools/gmail` before `npm run check`
- Root `npm run setup:gmail` for local bootstrap; `check:gmail` fails closed if dependencies missing
- OAuth connect: state validation, redirect URI port alignment, timeout, server close on all paths
- Wipe: token + snapshot + receipts + generated data files; `wipe --dry-run`
- Expanded metadata guard tests and snapshot schema validation

## GMAIL-002A — Metadata bridge detail (2026-06-10)

**Goal:** Expose real account metadata to the app via existing local Gmail CLI/OAuth adapter.

Receipt: `docs/ui/reviews/gmail-002a-real-gmail-metadata-ingress-receipt.md`
Provider doc: `docs/providers/gmail/gmail-002a-metadata-bridge.md`

### Allowed

- Local adapter (`tools/gmail`) OAuth loopback connect
- `gmail.profile.get`, labels, thread IDs, message IDs, headers
- Unread counts, label counts, list metadata, snippets **if returned without body scope**
- Redacted metadata cache outside repo
- Activity receipts: connect started, connect success/fail, metadata sync, gate viewed

### Blocked

- Message body read
- Draft create/update
- Send
- Browser OAuth or tokens in preview bundle
- Writing fixtures/screenshots/logs with live mail content

### App surfacing (post-bridge)

- **Integrations → Email → Gmail** shows metadata-only status from adapter receipts
- **Mail → Accounts** lists real account identity when CLI connect verified
- Environment badge may add **Metadata bridge** only when receipt proves adapter sync — not by default in static preview

### Exit criteria

- Adapter status API consumed by preview or sibling shell (read-only bridge file/IPC — design in GMAIL-002A receipt)
- Owner-visible honest states unchanged for body/draft/send
- NAV-001 shell needs no structural rework

---

## GMAIL-002B — Read-only body gate — **complete** (2026-06-12)

Receipt: `docs/ui/reviews/gmail-002b-read-only-body-gate-receipt.md`  
Provider doc: `docs/providers/gmail/gmail-002b-readonly-body-gate.md`

- Operator opt-in via `GMAIL_ACCESS_MODE=readonly` + OAuth reconnect
- `gmail.readonly` only; restricted scope documented
- Redacted body read/export CLI + preview import
- Draft write, send, mutation remain blocked

## GMAIL-002B-LIVE-PROOF — Operator live proof — **metadata pass** (2026-06-13)

Receipt: `docs/ui/reviews/gmail-002b-live-proof-receipt.md`

Decision: `GMAIL_002B_LIVE_PROOF_PASS_METADATA_READY_FOR_UI_012D_OR_GMAIL_002C`

### Two separate proof gates

1. **Metadata phase (first)** — default `node cli.js connect` requests `gmail.metadata` only ([scope docs](https://developers.google.com/workspace/gmail/api/auth/scopes)). Then: `profile` → `labels-counts` → `export-metadata-snapshot --max 25` → copy to gitignored `public/data/gmail-metadata.local.json` → verify preview (no fixture mixing).
2. **Readonly body phase (optional, after metadata pass)** — `GMAIL_ACCESS_MODE=readonly node cli.js connect` for `gmail.readonly` (**restricted scope** — local/private proof only unless Google verification/security assessment completed for public use). Body export only for **operator-selected** low-risk message/thread ID — never default newest-inbox batch.

### Canonical operator connect

Never paste OAuth URLs into docs/PR/receipts — `state` is one-time CSRF. Always:

```bash
cd "/media/chrishallberg/Storage 22/999_Work/003_Projects/017_xi-io_inbox/tools/gmail"
node cli.js connect
```

After browser approval, verify from the **same directory**:

```bash
test -f data/token.json && echo OK
node cli.js status
```

Only when `connected: true`, run metadata export (still from `tools/gmail`):

```bash
node cli.js profile
node cli.js labels-counts
node cli.js export-metadata-snapshot --max 25
cp data/metadata-snapshot.json ../../public/data/gmail-metadata.local.json
```

**From repo root** (equivalent):

```bash
test -f tools/gmail/data/token.json && echo OK
node tools/gmail/cli.js status
node tools/gmail/cli.js export-metadata-snapshot --max 25
cp tools/gmail/data/metadata-snapshot.json public/data/gmail-metadata.local.json
```

### If OAuth success but token missing

From `tools/gmail`: `pwd` · `ls -la data` · `test -w data` · `node cli.js status` · `find .. -name token.json -print`

### Token missing root cause (pass 4–6)

Likely: connect callback never completed (timeout) and/or stale listener on port `8787` (`EADDRINUSE`). Antigravity transient token not persisted to shared workspace. Wipe/disconnect not observed. Path mismatch ruled out.

### Troubleshooting: fixture-driven preview

```text
OAuth client present → Gmail API enabled → token missing → snapshot missing → import missing → preview shows fixtures
```

Port conflict: `lsof -i :8787` — stop **only** stale xi-io connect listener; do not kill unrelated processes.

- Live metadata proof **complete** (2026-06-13 receipt). Readonly body phase remains optional/separate.

### Future validation fixture — divorce email catalog (blocked)

**ID:** `VAL-EXT-001` · **Status:** blocked until GMAIL-002B-LIVE-PROOF metadata phase passes

A separate operator project (outside this repo) is cataloguing Gmail metadata into a **Google Sheet** for divorce/legal workflow. That work is **not** part of LIVE-PROOF and must not block or replace the canonical connect → export → preview sequence above.

**After data ingress is complete**, capture from that external project for xi-io validation:

| Artifact | Use in xi-io |
| --- | --- |
| Gmail metadata fields / labels used in catalog | Compare against `export-metadata-snapshot` schema and preview thread mapping |
| Google Sheet column schema and row shape | Future render/import test case — ensure UI can represent cataloged dimensions honestly |
| Sample redacted rows (never commit live mail) | Regression fixture for metadata-only display and label counts |

**Rules:** same Gmail account may be in use elsewhere — keep OAuth tokens, exports, and scopes scoped per project; do not treat external catalog output as LIVE-PROOF evidence until peer-reviewed through the canonical operator path; optional post-ingress validation only.

## GMAIL-002B — Read-only body gate (detail)

**Goal:** Explicit operator/user approval before `gmail.readonly`.

### Allowed (after gate pass)

- Scope escalation workflow with receipt
- Local cache with redaction policy (`gmail-001b-redaction-and-fixture-policy.md`)
- Read-only body display in controlled surface

### Blocked

- Draft write
- Send
- Automatic scope upgrade without receipt + settings gate

---

## GMAIL-002C — Draft write gate

**Goal:** Local draft creation/update via `gmail.compose` **without send**.

### Allowed (after gate pass)

- Create/update drafts in Gmail
- Approval queue linkage (local + provider draft IDs)
- Receipts for draft write attempts and blocks

### Blocked

- Send
- Silent provider mutation

---

## GMAIL-002D — Send gate

**Goal:** Send only after approval, receipts, undo/error handling, and owner proof.

### Allowed (after gate pass)

- `gmail.send` or send-via-compose path per security review
- Approval receipt required per message
- Undo/send-error handling where feasible

### Blocked until proof

- Batch send without per-message approval
- Owner visual proof (UI-003E) still required before merge-ready product claim

---

## GMAIL-002A-EXT — paginated sync (split; do not implement as one slice)

After **RECON-GMAIL-001** contract repair, implement in order:

| Slice | Scope | Out of scope |
| --- | --- | --- |
| **GMAIL-002A-EXT-001** | Metadata pagination (`pageToken`), label-scoped sync jobs, fail-closed query contract | local index DB, historyId, UI sync status |
| **GMAIL-002A-EXT-002** | Local mail index storage (JSON scaffold; safety repair before status UI) | historyId incremental sync |
| **GMAIL-002A-EXT-002-REPAIR** | Index safety: test isolation, fail-closed load, atomic writes, envelope, account filters, safe query output | sync status UI, historyId |
| **GMAIL-002A-EXT-003** | Sync status UI + Activity receipts (per-label progress, backfill state) | provider writes |
| **GMAIL-002A-EXT-004** | `historyId` incremental sync + full-sync fallback when startHistoryId out of range ([Gmail sync guide](https://developers.google.com/workspace/gmail/api/guides/sync)) | send, draft write, mutation |

**RECON-GMAIL-001** (source-of-truth + adapter contract repair) must pass before EXT-001.

---

## Relationship to NAV-001

NAV-001 corrected shell placement for account status and Integrations taxonomy so GMAIL-002A can land without another navigation refactor.

## Non-goals (all GMAIL-002 stages)

- Replacing Thunderbird Android spine (ARCH-002/003)
- Hosted multi-tenant OAuth in static GitHub Pages preview
- Broad mailbox scope (`mail.google.com`)

## Tracking

| Stage | Depends on | Receipt target |
| --- | --- | --- |
| GMAIL-002A | NAV-001 pass | `docs/ui/reviews/gmail-002a-real-gmail-metadata-ingress-receipt.md` |
| GMAIL-002A-HARDEN | GMAIL-002A pass | `docs/ui/reviews/gmail-002a-hardening-receipt.md` |
| GMAIL-002B | GMAIL-002A-HARDEN pass | `docs/ui/reviews/gmail-002b-read-only-body-gate-receipt.md` |
| RECON-GMAIL-001 | GMAIL-002B-LIVE-PROOF metadata pass | `docs/ui/reviews/recon-gmail-001-source-truth-contract-repair-receipt.md` |
| GMAIL-002A-EXT-001 | RECON-GMAIL-001 pass | `docs/ui/reviews/gmail-002a-ext-001-metadata-pagination-receipt.md` |
| GMAIL-002A-EXT-002 | EXT-001 pass | TBD |
| GMAIL-002C | GMAIL-002B stable | TBD |
| GMAIL-002D | Approval + UI-003E path | TBD |
