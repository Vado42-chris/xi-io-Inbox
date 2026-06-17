# RUNTIME-002B — Peer Review Receipt

## Date

2026-06-17

## Branch

`ui-002/framework-derived-static-preview`

## Reviewed commit SHA

`1779b3a5cd63673b06c4399c02feaa86f41cc492`

## Scope

Independent narrow peer review of the committed RUNTIME-002B connect/sync UI orchestration before
RUNTIME-002C refresh loop + operator OAuth proof. Review used Ollama governance draft
(`runtime-002b-ollama-peer-review-draft.md`) plus agent validation on a clean tree.

## Excluded scope

- RUNTIME-002C refresh loop + operator OAuth proof
- Mail UI polish
- GitHub / Ibal product wiring
- Body read, draft write, send, archive/delete/label mutation, automation execution
- Operator OAuth end-to-end proof claim (deferred to RUNTIME-002C owner runbook)
- UI-003E claim / PR ready-for-review
- Demo-removal WIP (remains stashed)

## Files reviewed

| File | Focus |
| --- | --- |
| `src-tauri/permissions/allow-gmail-runtime-read.toml` | Read-only command ACL |
| `src-tauri/permissions/allow-gmail-runtime-sync.toml` | Live connect/sync ACL |
| `src-tauri/capabilities/default.toml` | Main window capability binding |
| `public/src/runtime/gmail-runtime-bridge.js` | Bridge orchestration + invoke gate |
| `public/inbox-preview.js` | Runtime orchestration UI handlers (extracted windows) |
| `scripts/runtime-002b-model-check.mjs` | Structural guard alignment |
| `docs/ui/reviews/runtime-002b-connect-sync-ui-orchestration-receipt.md` | Scope alignment |
| `docs/architecture/runtime-store-boundary-v1.md` | Store + command contract |
| `package.json` | check:runtime002b wiring |

## Capability split result

**Pass**

- ACLs correctly separated: `allow-gmail-runtime-read` (read-only) and `allow-gmail-runtime-sync` (live commands)
- Live commands (`gmail_provider_connect`, `gmail_provider_sync_metadata`, `gmail_provider_sync_history`) excluded from read permission
- Main window capability binds both permissions
- No forbidden commands (body/draft/send/mutation/GitHub/automation) in either permission set

## JS bridge orchestration result

**Pass**

- `safeInvokeRuntime()` gates all runtime invokes with static-preview fallback
- Required helpers present: `getRuntimeStatus`, `getRuntimeSyncStatus`, `connectGmailProvider`, `syncGmailMetadata`, `syncGmailHistory`, `refreshRuntimeMail`
- Tauri runtime gate (`isTauriRuntime()`) enforced before invoke

## Connect UI result

**Pass**

- `runRuntimeGmailConnect()` triggers `gmail_provider_connect` in Tauri only
- Static preview retains CLI instructions without runtime invoke

## Sync UI result

**Pass**

- `runRuntimeGmailSyncNow()` calls bounded `gmail_provider_sync_metadata` (`inbox_recent`)
- `runRuntimeGmailSyncHistory()` gated by `runtimeHistorySyncAvailable()` / stored `historyId`
- Honest disabled copy when history sync unavailable

## Post-sync refresh result

**Pass**

- `reloadRuntimeMailIndexAfterSync()` calls `refreshRuntimeMail()` after successful connect/sync
- `applyRuntimeRefreshBundle()` applies boundary, sync status, and mail index to UI state

## Static fallback result

**Pass**

- `npm run dev` unchanged; JSON import paths preserved
- `isTauriRuntime()` gates all runtime orchestration UI/actions

## Error handling result

**Pass**

- `safeInvokeRuntime()` structures invoke failures
- Corrupt/invalid mail index sets `runtimeOrchestration.indexError` without crashing init
- Static fallback remains available outside Tauri

## Egress gate result

**Pass**

- No body read, draft write, send, mutation, GitHub, or automation commands exposed
- Runtime store boundary egress gates unchanged

## Validation result

| Check | Result |
| --- | --- |
| `npm run check:runtime002b` | Pass |
| `npm run check:runtime002a` | Pass |
| `npm run check:runtime001` | Pass |
| `npm run check:ollama-peer-review` | Pass |
| `cargo test --manifest-path src-tauri/Cargo.toml` | Pass (14 tests) |
| `git diff --check` | Pass |

## Blocking findings

None.

## Non-blocking findings

1. Monolith extraction: runtime orchestration remains in `inbox-preview.js` — continue strangler migration to `public/src/runtime/*`.
2. TypeScript typing for `runtimeOrchestration` deferred until component extraction (UI-003E+ / north-star).

## Next recommended pass

**RUNTIME-002C** — minimal poll refresh loop + operator OAuth proof runbook (owner human gate).

## Decision value

```text
RUNTIME_002B_PEER_REVIEW_PASS_READY_FOR_RUNTIME_002C
```

Connect/sync UI orchestration verified on committed SHA. Safe to start RUNTIME-002C refresh loop + operator proof packaging.

Reviewer: Ollama governance draft + agent validation (`npm run peer-review:ollama -- --slice runtime-002b --write`)
