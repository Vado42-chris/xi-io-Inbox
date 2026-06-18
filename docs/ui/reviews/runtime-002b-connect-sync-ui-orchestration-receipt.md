# RUNTIME-002B — Connect/Sync UI Orchestration Receipt

## Date

2026-06-10

## Branch

`ui-002/framework-derived-static-preview`

## Commit SHA

`a0c010fe64596413d1ec07cc7a2be0d2f2740f01`

## Scope

Narrow connect/sync UI orchestration after RUNTIME-002A peer review PASS:

- Separate live capability ACL (`allow-gmail-runtime-sync`)
- JS bridge orchestration helpers gated to Tauri runtime
- Minimal Settings → Accounts actions: Connect Gmail, Sync now, Sync history
- Post-sync runtime mail index reload
- Safe runtime error states (corrupt index does not crash init)
- Static preview JSON fallback unchanged outside Tauri

## Excluded scope

- RUNTIME-002B-PEER-REVIEW (next gate)
- RUNTIME-002C refresh loop + operator OAuth proof
- Mail UI polish
- GitHub / Ibal
- Body read, draft write, send, archive/delete/label mutation, automation execution
- Operator OAuth end-to-end proof claim
- UI-003E claim / PR ready-for-review
- Demo-removal WIP (remains stashed)

## Files changed

| Area | Files |
| --- | --- |
| Capability split | `src-tauri/permissions/allow-gmail-runtime-sync.toml`, `src-tauri/capabilities/default.toml`, generated ACL schemas |
| JS bridge | `public/src/runtime/gmail-runtime-bridge.js` |
| UI orchestration | `public/inbox-preview.js` |
| Checks/docs | `scripts/runtime-002b-model-check.mjs`, `package.json`, `docs/architecture/runtime-store-boundary-v1.md`, governance docs, this receipt |

## Product UI code changed

**Yes** — minimal orchestration only (Settings → Accounts runtime actions, runtime status panel, status badge copy). No Mail layout redesign.

## Capability split result

**Pass**

| Permission | Commands allowed |
| --- | --- |
| `allow-gmail-runtime-read` (unchanged) | `runtime_store_boundary`, `gmail_provider_mail_index` |
| `allow-gmail-runtime-sync` (new) | `gmail_provider_connect`, `gmail_provider_sync_metadata`, `gmail_provider_sync_history`, `gmail_provider_sync_status`, `gmail_provider_mail_index`, `runtime_store_boundary` |

Main window capability includes both permissions. Body/draft/send/mutation/GitHub/automation commands remain absent.

## JS bridge orchestration result

**Pass**

- `safeInvokeRuntime()` gates all invoke paths
- Added: `getRuntimeStatus`, `getRuntimeSyncStatus`, `connectGmailProvider`, `syncGmailMetadata`, `syncGmailHistory`, `refreshRuntimeMail`
- Static preview returns structured `{ ok: false, mode: 'static-preview' }` without invoke

## Connect UI result

**Pass**

- Tauri mode: Connect Gmail triggers `gmail_provider_connect` via bridge
- Static preview: retains CLI connect steps alert (no runtime invoke)

## Sync UI result

**Pass**

- Sync now → bounded `gmail_provider_sync_metadata` (`inbox_recent` default)
- Sync history → `gmail_provider_sync_history` when `historyId` present; disabled otherwise with honest copy

## Post-sync refresh result

**Pass**

- Successful connect/sync calls `reloadRuntimeMailIndexAfterSync()` → `refreshRuntimeMail()` → applies sync status + mail index

## Static fallback result

**Pass**

- `npm run dev` unchanged; JSON import paths preserved
- `isTauriRuntime()` gates all runtime orchestration UI/actions

## Error handling result

**Pass**

- `safeInvokeRuntime()` catches invoke failures
- Corrupt/invalid mail index sets `runtimeOrchestration.indexError` without throwing from `init()`
- Static fallback remains available outside Tauri

## Egress gate result

**Unchanged** — body read gated; draft write, send, mutation, automation execution blocked.

## Live OAuth proof status

**Not claimed** — connect/sync commands wired; operator end-to-end OAuth proof deferred to RUNTIME-002C.

## Validation result

| Check | Result |
| --- | --- |
| `npm run check:runtime002b` | Pass |
| `npm run check:runtime002a` | Pass |
| `npm run check:runtime001` | Pass |
| `npm run check` (full) | Pass |
| `cargo test --manifest-path src-tauri/Cargo.toml` | Pass (14 tests) |
| `cargo build --manifest-path src-tauri/Cargo.toml` | Pass |
| `git diff --check` | Pass |

## PR #12 draft state

**Draft**

## UI-003E state

**Not passed**

## Next recommended pass

**RUNTIME-002B-PEER-REVIEW** — verify capability split, orchestration scope, post-sync refresh, error handling, and no accidental egress/body/draft/send exposure before RUNTIME-002C.

## Decision value

```text
RUNTIME_002B_PASS_READY_FOR_RUNTIME_002B_PEER_REVIEW
```

Connect/sync UI orchestration complete. Peer review gates refresh loop + operator proof (RUNTIME-002C).
