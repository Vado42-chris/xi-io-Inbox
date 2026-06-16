# RUNTIME-001B — Live Gmail Runtime Execution Receipt

## Date

2026-06-10

## Branch

`ui-002/framework-derived-static-preview`

## Commit SHA

Recorded at commit time (see final report).

## Scope

Controlled live Gmail runtime execution on RUNTIME-001 spine:

- Peer-review hardening: sidecar allowlist, deep JSON redaction, stderr/stdout error truncation
- `sync-status` runtime tokenStorage label fix when `GMAIL_ADAPTER_DATA_DIR` is set
- New Tauri commands: connect, sync-metadata, sync-history (bounded defaults)
- Rust unit tests for allowlist, redaction, args, runtime env contract

## Excluded scope

- RUNTIME-002 UI binding
- Mail UI polish
- GitHub / Ibal implementation
- Body read escalation beyond existing gates
- Draft write, send, mail mutation
- Browser OAuth / browser localStorage tokens
- Static preview scaffold removal
- UI-003E claim / PR ready-for-review
- Unrelated stashed WIP

## Files changed

| Area | Files |
| --- | --- |
| Tauri provider | `src-tauri/src/lib.rs`, `gmail_provider/mod.rs`, `sidecar.rs`, `redaction.rs`, `args.rs`, `runtime_store.rs` |
| Gmail adapter | `tools/gmail/lib/sync-status.js` |
| Checks/docs | `scripts/runtime-001-model-check.mjs`, `docs/architecture/runtime-store-boundary-v1.md`, `TODO.md`, `03-sprint-slice-plan.md`, this receipt |

## Product UI code changed

**No**

## New Tauri command surface

| Command | Sidecar | Live execution |
| --- | --- | --- |
| `gmail_provider_connect` | `connect` | Yes (desktop loopback OAuth) |
| `gmail_provider_sync_metadata` | `sync-metadata` | Yes (bounded) |
| `gmail_provider_sync_history` | `sync-history` | Yes (bounded) |

Existing: `runtime_store_boundary`, `gmail_provider_status`, `gmail_provider_sync_status`, `gmail_provider_plan_sync`.

## Sidecar allowlist result

**Pass** — `SidecarCommand` enum allowlists only:

`status`, `sync-status`, `sync-plan`, `connect`, `sync-metadata`, `sync-history`

Unknown commands (e.g. `wipe`) rejected. No frontend-controlled subcommand strings.

## Deep redaction result

**Pass** — Recursive removal of sensitive keys:

`access_token`, `refresh_token`, `id_token`, `token`, `client_secret`, `authorization`, `bearer`, `password`, `secret`

Applied to all command responses via `sanitize_provider_envelope`.

## Stderr/stdout hardening result

**Pass** — Sidecar errors use `format_sidecar_error` + `redact_sensitive_text` + `truncate_error_excerpt` (max 2000 chars). Raw unlimited stderr/stdout not returned.

## Runtime path result

**Pass** — All sidecar invocations set `GMAIL_ADAPTER_DATA_DIR`, `GMAIL_RECEIPTS_DIR`, `GMAIL_MAIL_INDEX_PATH` from `{app_data_dir}/runtime/gmail-provider/`.

## Connect result

**Implemented** — `gmail_provider_connect` invokes sidecar `connect` with runtime env; response deep-redacted.

## Sync metadata result

**Implemented** — Bounded args only (`--job` from allowlist, `--max-pages` default/cap 1/10, `--max` default/cap 25/500).

## Sync history result

**Implemented** — Same bounded arg builder; delegates EXT-004 pause semantics to existing CLI `sync-history`.

## Token policy result

- Tokens stored only under runtime app-data via sidecar env
- Browser localStorage: **blocked**
- Browser OAuth in static preview: **blocked**
- Command responses: sensitive keys removed recursively

## Egress gate result

Unchanged — body read gated; draft/send/mutation/GitHub/automation blocked.

## Browser localStorage result

**No new usage**

## Static preview scaffold status

**Retained unchanged**

## Validation result

| Check | Result |
| --- | --- |
| `npm run check:runtime001` | Pass |
| `npm run check` | Partial — model/static pass; route-smoke may flake (`ERR_INSUFFICIENT_RESOURCES`) |
| `cargo build --manifest-path src-tauri/Cargo.toml` | Pass |
| `cargo test --manifest-path src-tauri/Cargo.toml` | Pass (12 tests) |
| `git diff --check` | Pass |

## Live OAuth proof status

**Deferred / operator-required** — Connect requires operator OAuth client JSON, browser loopback, and human approval. Agent environment did not run live connect. Command wiring, pathing, redaction, and gates validated via unit tests and static checks.

## PR #12 draft state

**Draft** — not ready for review.

## UI-003E state

**Not passed**

## Next recommended pass

1. **RUNTIME-001B-PEER-REVIEW** — narrow review of live execution + redaction before UI binding
2. **RUNTIME-002** — minimal UI binding to runtime status (not Mail polish)

## Decision value

```text
RUNTIME_001B_PASS_READY_FOR_RUNTIME_002_UI_BINDING
```

Live execution commands and hardening complete; live OAuth proof remains operator-required. UI binding gated on RUNTIME-001B peer review per owner workflow.
