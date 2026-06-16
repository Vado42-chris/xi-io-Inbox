# RUNTIME-001B — Peer Review Receipt

## Date

2026-06-10

## Branch

`ui-002/framework-derived-static-preview`

## Reviewed commit SHA (runtime spine)

`53c038bd982764f52d0cb3b7fc658dea75e6472e` (RUNTIME-001B implementation)

Branch HEAD at review time: `6463b31ec3aa05e5e747d8aadb5c1d273954d206` (receipt SHA chain only; no runtime Rust changes after 001B)

## Scope

Independent narrow peer review of RUNTIME-001B live Gmail execution commands before any UI
`invoke()` binding. Verifies command exposure, sidecar allowlist, bounded sync args, runtime
path isolation, deep redaction, stderr/stdout hardening, egress gate preservation, and Gmail
sync semantics alignment.

## Excluded scope

- RUNTIME-002 / RUNTIME-002A / RUNTIME-002B / RUNTIME-002C implementation
- Live OAuth operator proof (still operator-required)
- Mail UI polish, demo-removal WIP, Add account nav (uncommitted UI changes out of scope)
- GitHub / Ibal
- UI-003E claim / PR ready-for-review

## Files reviewed

### Tauri runtime (001B delta)

| File | Focus |
| --- | --- |
| `src-tauri/src/lib.rs` | Live command registration; typed sync request structs |
| `src-tauri/src/gmail_provider/mod.rs` | Connect/sync-metadata/sync-history wiring; runtime meta |
| `src-tauri/src/gmail_provider/sidecar.rs` | `SidecarCommand` enum allowlist; spawn safety |
| `src-tauri/src/gmail_provider/redaction.rs` | Deep redaction; stderr truncation; tokenStorage rewrite |
| `src-tauri/src/gmail_provider/args.rs` | Job allowlist; page/thread caps |
| `src-tauri/src/runtime_store.rs` | App-data path contract; sidecar env injection |
| `src-tauri/tauri.conf.json` | `withGlobalTauri: true`; static `frontendDist`; bundle inactive |

### Gmail adapter boundary

| File | Focus |
| --- | --- |
| `tools/gmail/lib/sync-status.js` | `resolveTokenStorageLabel()` for runtime env |
| `tools/gmail/lib/adapter.js` | Live metadata/history sync; historyId fallback semantics |
| `tools/gmail/cli.js` | Subcommand surface; sync-history entry |
| `scripts/runtime-001-model-check.mjs` | Structural guard for 001B commands + allowlist |

### Governance

| File | Focus |
| --- | --- |
| `docs/ui/reviews/runtime-001b-live-gmail-runtime-execution-receipt.md` | Scope alignment |
| `docs/architecture/runtime-store-boundary-v1.md` | Store + command contract |

## Tauri command surface result

**Pass**

| Command | Live execution | Frontend-controlled args | Notes |
| --- | --- | --- | --- |
| `runtime_store_boundary` | n/a | None | Read-only boundary struct |
| `gmail_provider_status` | Sidecar read | None | Fixed `status` |
| `gmail_provider_sync_status` | Sidecar read | None | Fixed `sync-status` |
| `gmail_provider_plan_sync` | Plan only | None | No live API |
| `gmail_provider_connect` | Yes | None | Desktop OAuth loopback via sidecar |
| `gmail_provider_sync_metadata` | Yes | Bounded `job`, `max_pages`, `max_threads` | Rust clamps before spawn |
| `gmail_provider_sync_history` | Yes | Bounded `job`, `max_pages`, `max_threads` | Delegates EXT-004 CLI semantics |

Verified absent: send, draft write, mutation, body-read escalation, wipe, GitHub, Ibal, mail-index read (deferred to RUNTIME-002A).

## Sidecar allowlist result

**Pass**

- `SidecarCommand` enum is the only path to CLI subcommand strings.
- Allowlist: `status`, `sync-status`, `sync-plan`, `connect`, `sync-metadata`, `sync-history`.
- `SidecarCommand::parse("wipe")` rejects with explicit error (unit test).
- No frontend-provided subcommand strings reach `Command::arg()`.
- Spawn uses `Command::new("node")` without shell — no `sh -c`.

## Sync argument bounds result

**Pass**

| Control | Default | Cap |
| --- | --- | --- |
| `--max-pages` | 1 | 10 |
| `--max` (threads) | 25 | 500 |
| `--job` | `inbox_recent` | Allowlist: `inbox_recent`, `unread`, `starred`, `sent_recent` |

Unknown jobs rejected in Rust before sidecar spawn (unit test).

## Runtime path isolation result

**Pass**

All sidecar invocations set:

- `GMAIL_ADAPTER_DATA_DIR` → `{app_data_dir}/runtime/gmail-provider/data`
- `GMAIL_RECEIPTS_DIR` → `{app_data_dir}/runtime/gmail-provider/receipts`
- `GMAIL_MAIL_INDEX_PATH` → `{app_data_dir}/runtime/gmail-provider/data/mail-index.json`

Static preview `public/data/*.local.json` path unchanged. Tokens intended for runtime app-data only when Tauri env is set.

## Deep redaction result

**Pass**

- Recursive removal of sensitive keys: `access_token`, `refresh_token`, `id_token`, `token`, `client_secret`, `authorization`, `bearer`, `password`, `secret`.
- Applied to all command envelopes via `sanitize_provider_envelope`.
- `scopeState` token presence flags stripped.
- `tokenStorage` labels rewritten from CLI-era copy to `runtime-app-data (gitignored)` when nested value references `tools/gmail/data`.
- Error paths use `format_sidecar_error` + `redact_sensitive_text` + `truncate_error_excerpt` (max 2000 chars).

Unit tests cover nested token removal, bearer masking, and truncation.

## Stderr/stdout hardening result

**Pass**

- Empty stdout → error path; stderr redacted/truncated, not returned raw.
- JSON parse failures → truncated redacted message; raw stdout not forwarded.
- Failed exit with parsed `error` field → structured sidecar error string only.

## Tauri capabilities / command exposure result

**Pass — capability ACL is a mandatory UI-binding gate (RUNTIME-002A+)**

- RUNTIME-001B left custom commands registered but with **no UI `invoke()`** and **no committed capability ACL**.
- UI binding must not call runtime commands until an explicit capability file allowlists those commands.
- RUNTIME-002A adds read-only ACL (`runtime_store_boundary`, `gmail_provider_mail_index` only).
- RUNTIME-002B must add separate capability entries for live connect/sync commands — never implicit full access.

## Gmail sync semantics result

**Pass**

- Full metadata sync populates local mail index (`runMetadataSync` → `fetchPaginatedMetadata`).
- `sync-history` delegates to adapter historyId incremental path with fallback when history state expires (Gmail partial sync guidance).
- Body withheld receipts emitted on live sync path (`bodyWithheld`, `draftWriteBlocked`, `sendBlocked`, `mutationBlocked`).
- Pub/Sub push correctly out of scope (poll spine only).

## Egress gate preservation result

**Pass**

| Gate | Status |
| --- | --- |
| Body read | Gated |
| Draft write | Blocked |
| Send | Blocked |
| Mail mutation | Blocked |
| GitHub mutation | Blocked |
| Automation execution | Blocked |
| Browser OAuth in static preview | Blocked |
| Browser localStorage tokens | Blocked |

## Validation result

| Check | Result |
| --- | --- |
| `npm run check:runtime001` | **Pass** |
| `cargo test --manifest-path src-tauri/Cargo.toml` | **Pass** (12 tests) |
| `cargo build --manifest-path src-tauri/Cargo.toml` | **Pass** (prior 001B receipt) |

## Live OAuth proof status

**Deferred / operator-required** — unchanged from 001B receipt. Peer review validates wiring, bounds, and redaction only; not a substitute for operator connect proof (RUNTIME-002C).

## PR #12 draft state

**Draft** — not ready for review.

## UI-003E state

**Not passed**

## Blocking findings

**None.**

## Non-blocking follow-ups (by slice)

| ID | Item |
| --- | --- |
| RUNTIME-002A | Add explicit Tauri capabilities ACL before any `invoke()` |
| RUNTIME-002A | Add read-only `gmail_provider_mail_index` (or equivalent) — no sidecar spawn required |
| RUNTIME-002A | JS runtime bridge + static fallback; `tauri dev` npm script |
| RUNTIME-002B | Wire connect/sync commands from UI; capability entries for live execution only |
| RUNTIME-002C | Operator OAuth proof + minimal refresh loop |
| 001B-R01 | Sidecar depends on `node` on PATH — document in operator runbook |
| 001B-R02 | Sync-status payloads may include filesystem artifact paths (not secrets) — acceptable for operator/debug |

## Next recommended pass

**RUNTIME-002A** — Runtime mail index read + minimal Tauri bridge (read-only). Do **not** start broad RUNTIME-002 as one pass.

Split after 002A:

- **RUNTIME-002B** — connect/sync orchestration + live-state copy
- **RUNTIME-002C** — minimal UI refresh loop + operator proof

## Decision value

```text
RUNTIME_001B_PEER_REVIEW_PASS_READY_FOR_RUNTIME_002A
```

Live execution hardening reviewed; no blocking issues. UI binding may begin with narrow read-only RUNTIME-002A after owner accepts this receipt.
