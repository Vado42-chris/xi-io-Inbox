# RUNTIME-002A — Mail Index Read Bridge Receipt

## Date

2026-06-10

## Branch

`ui-002/framework-derived-static-preview`

## Scope

Narrow read-only runtime bridge before connect/sync UI orchestration:

- `gmail_provider_mail_index` Tauri command (read runtime store; no sidecar spawn)
- Schema validation + thread-header projection + deep redaction
- Explicit Tauri capability ACL for read commands only
- Minimal JS bridge (`public/src/runtime/gmail-runtime-bridge.js`)
- Preview detects Tauri vs static preview; loads runtime index when available
- `tauri:dev` npm script documented in package.json

## Excluded scope

- `gmail_provider_connect`, sync orchestration, refresh loop (RUNTIME-002B/002C)
- Operator OAuth proof
- Mail UI polish
- GitHub / Ibal
- Body read, draft write, send, mutation, automation execution
- UI-003E claim / PR ready-for-review
- Unrelated demo-removal / Add account WIP beyond bridge wiring

## Files changed

| Area | Files |
| --- | --- |
| Tauri read command | `src-tauri/src/gmail_provider/mail_index.rs`, `mod.rs`, `lib.rs` |
| Capabilities ACL | `src-tauri/capabilities/default.toml`, `permissions/allow-gmail-runtime-read.toml`, `tauri.conf.json` |
| JS bridge | `public/src/runtime/gmail-runtime-bridge.js`, `public/inbox-preview.js` |
| Checks/docs | `scripts/runtime-002a-model-check.mjs`, `package.json`, this receipt |

## Capability exposure result

**Pass**

Main window capability `allow-gmail-runtime-read` allowlists **only**:

- `runtime_store_boundary`
- `gmail_provider_mail_index`

Live execution commands (`connect`, `sync-metadata`, `sync-history`) are **not** in the capability ACL.

## Read command result

**Pass**

- Reads `{app_data_dir}/runtime/gmail-provider/data/mail-index.json`
- Missing file → empty envelope (no error)
- Validates `schemaVersion: 1`, `source: local-gmail-cli`, `mode: metadata-index`
- Projects thread headers only; omits top-level `messages` array from UI payload
- Strips body/forbidden message fields before return
- Applies `sanitize_provider_envelope` (deep redaction)

## JS bridge result

**Pass**

- `isTauriRuntime()` gates `invoke()` usage
- Static preview (`npm run dev`) unchanged — still uses local JSON fetch path
- Tauri init calls `loadRuntimeMailArtifacts()` before static local JSON loads
- `inboxThreads()` prefers runtime mail index when present

## Egress gate result

Unchanged — body read gated; draft/send/mutation blocked.

## Validation result

| Check | Result |
| --- | --- |
| `npm run check:runtime002a` | Pass (after run) |
| `npm run check:runtime001` | Pass (after run) |
| `cargo test --manifest-path src-tauri/Cargo.toml` | Pass (after run) |
| `npm run dev` static preview | Unchanged path |

## Operator proof

**Not in scope** — live OAuth/sync proof remains RUNTIME-002C.

## PR #12 draft state

**Draft**

## UI-003E state

**Not passed**

## Next recommended pass

**RUNTIME-002A-PEER-REVIEW** — verify read command schema validation, capability scope, runtime path isolation, redaction, static fallback behavior, and no accidental connect/sync/body/egress exposure.

**RUNTIME-002B** — connect/sync orchestration (not started until 002A peer review PASS).

## Decision value

```text
RUNTIME_002A_PASS_READY_FOR_PEER_REVIEW
```

Read-only runtime mail index bridge and capability ACL complete. Peer review gates connect/sync UI wiring (RUNTIME-002B).
