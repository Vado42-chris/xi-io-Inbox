# RUNTIME-001 — Gmail Local Runtime Provider Service

## Status

```text
Type: implementation plan (docs only — do not implement in RUNTIME-NORTHSTAR-001)
Blocked by: ARCH-004 formal PASS (provisional Tauri decision captured)
Depends on: tools/gmail adapter (GMAIL-002A–EXT-004), RUNTIME-NORTHSTAR-001
Receipt target: docs/ui/reviews/runtime-001-gmail-provider-service-receipt.md (future)
```

## Goal

Promote existing Gmail CLI adapter capabilities into a **Tauri-side Gmail runtime
provider** so the product UI queries runtime commands and local stores — not
manual JSON import files.

## In scope

- Tauri project skeleton (`src-tauri/` + hosted web UI)
- Rust command surface, e.g.:
  - `gmail_connect()` — OAuth loopback (port policy aligned with CLI or runtime-owned)
  - `gmail_disconnect()` / `gmail_wipe_local()`
  - `gmail_sync_status()` — mirrors `tools/gmail/lib/sync-status.js`
  - `gmail_sync_metadata(job, limits)` — label-scoped poll sync
  - `gmail_sync_history()` — historyId incremental with fallback
  - `gmail_list_threads(account, label, paging)` — from runtime mail index
  - `gmail_get_thread(thread_id)` — metadata + optional gated body pointer
- Local mail index store (promote `local-mail-index.js` semantics to Rust or embed via sidecar phase 1)
- Sync receipts written to runtime store → Activity projection
- Token vault in app data directory (gitignored; never web localStorage)

## Out of scope (RUNTIME-001)

- Send, draft write, label/archive/trash/spam mutation
- Browser OAuth or tokens in static preview
- Body read unless explicit readonly gate flag + operator scope escalation path
- Gmail Pub/Sub push
- Removing static preview harness or `tools/gmail` CLI (CLI remains operator/debug tool until parity proven)
- UI copy mass-change (RUNTIME-002)

## Migration strategy

Phase A — **Sidecar parity** (lowest risk):

1. Tauri command spawns controlled `tools/gmail` subprocess OR links Rust port of adapter modules.
2. Runtime reads/writes app-data paths (not `public/data/`).
3. UI invokes `invoke('gmail_sync_status')` instead of `fetch('./data/gmail-metadata.local.json')`.

Phase B — **Native Rust provider** (target):

1. Port OAuth, metadata sync, index, history sync to Rust crates.
2. Retire subprocess bridge; keep CLI as thin wrapper for operators.

## Data contract (UI-facing)

Runtime exposes normalized thread records compatible with existing preview view-models:

```text
threadId, accountId, mailbox, unread, sender, subject, receivedAt, snippet,
metadataOnly, providerSource: 'gmail-runtime', syncState, lastSyncedAt
```

Body fields appear only when readonly body gate passes and runtime store contains redacted body.

## Security

- Scopes: `gmail.metadata` default; `gmail.readonly` only via explicit gate
- Fail closed on schema violations (reuse snapshot schema rules)
- No tokens in logs, receipts, or UI payloads

## Acceptance criteria

- [ ] Tauri app launches and serves existing web UI shell
- [ ] Connect Gmail via runtime OAuth loopback stores token in app data only
- [ ] Sync populates runtime mail index without manual file copy to `public/data/`
- [ ] UI can call runtime status command and receive connected/syncing/last-sync states
- [ ] Draft write, send, mutation commands absent or hard-blocked with receipts
- [ ] Static preview path still works unchanged for CI (`npm run check`)

## Estimate

2–4 agent passes after ARCH-004 formal PASS (sidecar parity first).
