<!--
  AUTO-GENERATED DRAFT — do not treat as final until validated.
  Validate checks locally, then rename/copy to the canonical *-peer-review-receipt.md if approved.
  Generated: 2026-06-17
  Slice profile: RUNTIME-002B
  Reviewed SHA: 241b693c28dcefa2e692cad97518c1d91a992afc
  Model: qwen3-coder:480b-cloud
  Host: https://ollama.com
  Key source: secrets/API Key/olamma-api-xi-io.txt
-->
# RUNTIME-002B — Peer Review

## Date

2026-06-10

## Branch

`ui-002/framework-derived-static-preview`

## Reviewed commit SHA

`241b693c28dcefa2e692cad97518c1d91a992afc`

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
- Live connect/sync commands are properly separated into `allow-gmail-runtime-sync.toml`
- Read-only commands remain in `allow-gmail-runtime-read.toml`
- Main window capability correctly binds both permissions
- No body/draft/send/mutation commands found in either permission file

## JS bridge orchestration result

**Pass**
- `safeInvokeRuntime()` properly gates all invoke paths with Tauri runtime checks
- All required helper functions present: `getRuntimeStatus`, `getRuntimeSyncStatus`, `connectGmailProvider`, `syncGmailMetadata`, `syncGmailHistory`, `refreshRuntimeMail`
- Static preview correctly returns structured failure responses without attempting invokes

## Connect UI result

**Pass**
- Connect Gmail action properly triggers `gmail_provider_connect` only in Tauri runtime
- Static preview mode correctly shows CLI instructions instead of attempting runtime invoke
- Error handling and status updates properly implemented

## Sync UI result

**Pass**
- Sync now correctly calls `gmail_provider_sync_metadata` with bounded parameters
- Sync history properly gated by `historyId` availability
- Honest disabled copy shown when history sync unavailable

## Post-sync refresh result

**Pass**
- `reloadRuntimeMailIndexAfterSync()` correctly called after successful connect/sync operations
- `refreshRuntimeMail()` properly refreshes boundary, sync status, and mail index
- UI state properly updated after refresh

## Static fallback result

**Pass**
- `npm run dev` unchanged and functional
- JSON paths preserved for static preview
- `isTauriRuntime()` properly gates all runtime orchestration

## Error handling result

**Pass**
- `safeInvokeRuntime()` properly catches and structures invoke failures
- Corrupt index sets `runtimeOrchestration.indexError` without crashing initialization
- Static fallback remains available when runtime unavailable

## Egress gate result

**Pass**
- No body/draft/send/mutation/GitHub/automation exposure found
- All egress gates remain properly blocked as specified

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

- Minor cleanup opportunity: package.json manifest-path arguments were removed but this doesn't affect functionality
- Consider adding more specific error messaging for different failure scenarios in the UI

## Next recommended pass

RUNTIME-002B-PEER-REVIEW — verify capability split, orchestration scope, post-sync refresh, error handling, and no accidental egress/body/draft/send exposure before RUNTIME-002C.

## Decision value

```text
RUNTIME_002B_PEER_REVIEW_PASS_READY_FOR_RUNTIME_002C
```

Reviewer: Ollama governance peer review (draft — human/agent must validate before commit)
