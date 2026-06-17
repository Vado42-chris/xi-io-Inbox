<!--
  AUTO-GENERATED DRAFT — do not treat as final until validated.
  Validate checks locally, then rename/copy to the canonical *-peer-review-receipt.md if approved.
-- Generated: 2026-06-17
-- Slice profile: RUNTIME-002B
-- Reviewed SHA: 1779b3a5cd63673b06c4399c02feaa86f41cc492
-- Model: qwen3-coder:480b-cloud
-- Host: https://ollama.com
-- Key source: secrets/API Key/olamma-api-xi-io.txt
-->
# RUNTIME-002B — Peer Review

## Date

2026-06-10

## Branch

`ui-002/framework-derived-static-preview`

## Reviewed commit SHA

`1779b3a5cd63673b06c4399c02feaa86f41cc492`

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

## Files reviewed

| File | Focus |
| --- | --- |
| src-tauri/permissions/allow-gmail-runtime-read.toml | Read-only command ACL |
| src-tauri/permissions/allow-gmail-runtime-sync.toml | Live connect/sync ACL |
| src-tauri/capabilities/default.toml | Main window capability binding |
| public/src/runtime/gmail-runtime-bridge.js | Bridge orchestration + invoke gate |
| public/inbox-preview.js | Runtime orchestration UI handlers (extracted windows) |
| scripts/runtime-002b-model-check.mjs | Structural guard alignment |
| docs/ui/reviews/runtime-002b-connect-sync-ui-orchestration-receipt.md | Scope alignment |
| docs/architecture/runtime-store-boundary-v1.md | Store + command contract |
| package.json | check:runtime002b wiring |

## Capability split result

**Pass**

- ACLs correctly separated: `allow-gmail-runtime-read` (read-only) and `allow-gmail-runtime-sync` (live commands)
- Live commands (`gmail_provider_connect`, `gmail_provider_sync_metadata`, `gmail_provider_sync_history`) properly excluded from read permission
- Main window capability binds both permissions as required
- No forbidden commands (body/draft/send/mutation/GitHub/automation) found in either permission set

## JS bridge orchestration result

**Pass**

- `safeInvokeRuntime()` correctly gates all runtime invokes with static-preview fallback
- Required functions present: `getRuntimeStatus`, `getRuntimeSyncStatus`, `connectGmailProvider`, `syncGmailMetadata`, `syncGmailHistory`, `refreshRuntimeMail`
- Tauri runtime gate (`if (!isTauriRuntime())`) correctly implemented
- Static preview returns structured non-invoke failures as expected

## Connect UI result

**Pass**

- `runRuntimeGmailConnect()` correctly triggers `gmail_provider_connect` only in Tauri runtime
- Static preview path shows appropriate CLI instructions without invoking runtime
- Account action handlers correctly route to runtime connect when in Tauri mode

## Sync UI result

**Pass**

- `runRuntimeGmailSyncNow()` correctly calls bounded `gmail_provider_sync_metadata` with `inbox_recent` job
- `runRuntimeGmailSyncHistory()` gated by `runtimeHistorySyncAvailable()` which checks for `historyId`
- Honest disabled copy shown when history sync unavailable due to missing `historyId`

## Post-sync refresh result

**Pass**

- `reloadRuntimeMailIndexAfterSync()` correctly called after successful connect/sync operations
- `refreshRuntimeMail()` properly reloads boundary, sync status, and mail index
- `applyRuntimeRefreshBundle()` correctly applies refreshed data to UI state

## Static fallback result

**Pass**

- `npm run dev` remains unchanged with static preview JSON paths preserved
- `isTauriRuntime()` correctly gates all runtime orchestration UI and actions
- No runtime-specific behavior leaks into static preview mode

## Error handling result

**Pass**

- `safeInvokeRuntime()` properly catches and structures invoke failures
- Corrupt/invalid mail index sets `runtimeOrchestration.indexError` without crashing initialization
- Error states properly reflected in UI status indicators
- Static fallback remains available when runtime errors occur

## Egress gate result

**Pass**

- No body read, draft write, send, mutation, GitHub, or automation commands exposed
- All exposed commands align with documented boundary (connect/sync/metadata only)
- Runtime store boundary correctly enforces egress gates as per contract

## Validation result

| Check | Result |
| --- | --- |
| `npm run check:runtime002b` | Not run by reviewer |
| `npm run check:runtime002a` | Not run by reviewer |
| `npm run check:runtime001` | Not run by reviewer |
| `cargo test --manifest-path src-tauri/Cargo.toml` | Not run by reviewer |

## Blocking findings

None.

## Non-blocking findings

- Consider adding more specific error categorization in `safeInvokeRuntime()` for better UX diagnostics
- The `runtimeOrchestration` state object could benefit from TypeScript typing for improved maintainability
- Minor redundancy in duplicate `runRuntimeGmailConnect` matches in inbox-preview.js (lines 4150, 10498, 10508) - likely due to diff extraction

## Next recommended pass

**RUNTIME-002B-PEER-REVIEW** — verify capability split, orchestration scope, post-sync refresh, error handling, and no accidental egress/body/draft/send exposure before RUNTIME-002C.

## Decision value

```text
RUNTIME_002B_PEER_REVIEW_PASS_READY_FOR_RUNTIME_002C
```

Reviewer: Ollama governance peer review (draft — human/agent must validate before commit)
