# RUNTIME-001 — Gmail Runtime Provider Service Receipt

## Date

2026-06-10

## Branch

`ui-002/framework-derived-static-preview`

## Commit SHA

`34ef074fca03f1cfa06338e4914a55d914c5c31d`

## Scope

First implementation slice after ARCH-004 formal PASS:

- Tauri runtime skeleton (`src-tauri/`)
- Gmail provider sidecar commands wrapping `tools/gmail/cli.js`
- Runtime store boundary (app-data paths via env contract)
- `tools/gmail/lib/runtime-paths.js` for runtime-owned data/receipts/index paths
- Static model check `scripts/runtime-001-model-check.mjs`
- Architecture doc `docs/architecture/runtime-store-boundary-v1.md`

## Excluded scope

- Live Gmail sync execution (deferred **RUNTIME-001B**)
- Runtime OAuth connect command (deferred RUNTIME-001B)
- Mail UI polish / reading pane / column resize
- GitHub ingress
- Ibal proposal layer
- Draft write, send, mail mutation
- Body read unless already-gated CLI path (not exposed as new runtime command)
- Browser OAuth / browser localStorage tokens
- Removal of static preview or JSON import scaffold
- ACC-SYNC-UI-001 stash work
- Merge prep / PR ready-for-review
- UI-003E owner PASS claim

## Files changed

| Area | Files |
| --- | --- |
| Tauri runtime | `src-tauri/Cargo.toml`, `Cargo.lock`, `tauri.conf.json`, `build.rs`, `src/main.rs`, `src/lib.rs`, `src/runtime_store.rs`, `src/gmail_provider/*`, `icons/*` |
| Gmail sidecar paths | `tools/gmail/lib/runtime-paths.js`, `token-store.js`, `local-data.js`, `receipts.js`, `sync-status.js`, `local-mail-index.js`, `package.json` |
| Checks / scripts | `scripts/runtime-001-model-check.mjs`, root `package.json` |
| Docs / tracking | `docs/architecture/runtime-store-boundary-v1.md`, `TODO.md`, `docs/product/03-sprint-slice-plan.md`, this receipt |
| Gitignore | `.gitignore` (`src-tauri/target/`) |

## Product UI code changed

**No** — `public/inbox-preview.js` untouched.

## Tauri command surface

| Command | Sidecar | Purpose |
| --- | --- | --- |
| `runtime_store_boundary` | n/a (Rust) | Returns runtime path contract + egress gate summary |
| `gmail_provider_status` | `status` | Provider connection/gate status; tokens stripped before return |
| `gmail_provider_sync_status` | `sync-status` | Sync status from runtime-owned store |
| `gmail_provider_plan_sync` | `sync-plan` | Plan-only sync preview; **no live API execution** |

Each Gmail response includes `runtimeProvider` metadata with `liveSyncExecution: deferred-runtime-001b`.

## Gmail provider status result

- Sidecar reuses existing CLI adapter semantics (metadata-only gates, blocked send/draft/mutation).
- OAuth tokens never returned to frontend payloads.
- `tokenStorage` rewritten to `runtime-app-data (gitignored)` in sanitized envelopes.

## Runtime store boundary result

Runtime-owned paths under `{app_data_dir}/runtime/gmail-provider/`:

- `data/` — tokens, index, snapshots (via `GMAIL_ADAPTER_DATA_DIR`)
- `receipts/` — sync/connect audit rows (via `GMAIL_RECEIPTS_DIR`)
- `data/mail-index.json` — mail index (via `GMAIL_MAIL_INDEX_PATH`)

Documented in `docs/architecture/runtime-store-boundary-v1.md`.

## CLI parity / reuse result

**Sidecar parity (Phase A).** Rust commands spawn `node tools/gmail/cli.js` with runtime env vars.
No large adapter rewrite. Existing metadata sync, index, sync-status, and plan logic preserved.

## OAuth / token policy result

- Browser OAuth: **blocked** (unchanged)
- Browser localStorage tokens: **blocked** (unchanged)
- Runtime store: filesystem app-data only
- Tauri responses: token fields removed before UI exposure

## Egress gate result

Preserved and surfaced in `runtime_store_boundary`:

```text
body_read: gated
draft_write: blocked
send: blocked
mutation: blocked
github_mutation: blocked
automation_execution: blocked
```

## Browser localStorage result

No new localStorage usage. No provider tokens written to browser storage.

## Static preview scaffold status

**Retained unchanged.** JSON import bridge and static preview checks remain for CI/harness.

## Validation result

- `npm run check` — see final report (route-smoke may flake)
- `npm run check:runtime001` — pass
- `cargo build --manifest-path src-tauri/Cargo.toml` — pass
- `cargo test --manifest-path src-tauri/Cargo.toml` — pass (2 unit tests)
- `git diff --check` — pass

## PR #12 draft state

**Remains draft.** Not marked ready for review.

## UI-003E state

**Not passed** — human gate unchanged.

## Next recommended pass

1. **RUNTIME-001B** — runtime OAuth connect + live metadata/history sync execution commands
2. **RUNTIME-002** — minimal UI binding to runtime status (not Mail polish)

## Decision value

```text
RUNTIME_001_PARTIAL_MORE_PROVIDER_SERVICE_REQUIRED
```

Spine and command wiring proven; live sync/connect execution intentionally deferred to RUNTIME-001B before connected-product UI binding.

## Self review

| Question | Answer |
| --- | --- |
| Tauri command surface wired? | Yes |
| Runtime store separate from browser? | Yes |
| CLI semantics reused? | Yes (sidecar) |
| Live Gmail in one pass? | No (by design) |
| Static preview removed? | No |
| Gates preserved? | Yes |
