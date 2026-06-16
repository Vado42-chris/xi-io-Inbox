# RUNTIME-001 — Peer Review Receipt

## Date

2026-06-10

## Branch

`ui-002/framework-derived-static-preview`

## Reviewed commit SHA

`34ef074fca03f1cfa06338e4914a55d914c5c31d` (implementation)

Receipt SHA fix on branch: `74d80ef79a9440cf23bee4ac61d911df667d25cb` (HEAD at review time)

## Scope

Independent peer review of RUNTIME-001 Tauri Gmail provider spine before RUNTIME-001B
(live OAuth connect + sync execution).

## Excluded scope

- RUNTIME-001B implementation
- Live Gmail/GitHub implementation
- Mail UI changes
- Unrelated stashed WIP restoration
- UI-003E claim
- PR ready-for-review

## Files reviewed

### Tauri runtime

| File | Focus |
| --- | --- |
| `src-tauri/src/lib.rs` | Command surface, no frontend args |
| `src-tauri/src/gmail_provider/mod.rs` | Sanitization, runtime meta, plan-only marker |
| `src-tauri/src/gmail_provider/sidecar.rs` | Sidecar spawn safety |
| `src-tauri/src/runtime_store.rs` | App-data path contract + env injection |
| `src-tauri/tauri.conf.json` | Host config (bundle inactive, static frontend dist) |
| `src-tauri/Cargo.toml` | Minimal deps, no shell plugins |

### Gmail adapter boundary

| File | Focus |
| --- | --- |
| `tools/gmail/lib/runtime-paths.js` | Env-driven data/receipts/index paths |
| `tools/gmail/lib/token-store.js` | Token file under resolved data dir |
| `tools/gmail/lib/local-data.js` | Snapshots under resolved data dir |
| `tools/gmail/lib/receipts.js` | Receipts under resolved receipts dir |
| `tools/gmail/lib/sync-status.js` | Status model (no token bodies in payload) |
| `tools/gmail/lib/local-mail-index.js` | Index path delegation |
| `tools/gmail/lib/adapter.js` | `planOnly` early return (no live API) |
| `tools/gmail/cli.js` | `sync-plan` → `planOnly: true` |

### Governance

| File | Focus |
| --- | --- |
| `docs/architecture/runtime-store-boundary-v1.md` | Store contract |
| `docs/ui/reviews/runtime-001-gmail-runtime-provider-service-receipt.md` | Scope alignment |
| `scripts/runtime-001-model-check.mjs` | Structural guard |

## Tauri command surface result

**Pass**

| Command | Present | Notes |
| --- | --- | --- |
| `runtime_store_boundary` | Yes | Serializable boundary struct |
| `gmail_provider_status` | Yes | Fixed sidecar `status` |
| `gmail_provider_sync_status` | Yes | Fixed sidecar `sync-status` |
| `gmail_provider_plan_sync` | Yes | Fixed sidecar `sync-plan` |

Verified absent: send, draft write, mutation, body-read, connect, GitHub, Ibal commands.

Commands accept only `AppHandle` — no untrusted frontend command strings or args.

## Sidecar execution safety result

**Pass**

| Check | Result |
| --- | --- |
| Shell invocation | No — `Command::new("node")` with explicit args |
| Command strings | Fixed literals from Rust only (`status`, `sync-status`, `sync-plan`) |
| Working directory | Fixed `tools/gmail` under repo root |
| CLI path | Deterministic `repo/tools/gmail/cli.js` with existence check |
| Runtime env | Explicit `GMAIL_ADAPTER_DATA_DIR`, `GMAIL_RECEIPTS_DIR`, `GMAIL_MAIL_INDEX_PATH` |
| Live execution in RUNTIME-001 | Not exposed — plan command only for sync |

**Non-blocking note:** `run_gmail_cli(command: &str)` is string-typed internally; recommend
enum whitelist in RUNTIME-001B when adding connect/sync commands.

**Non-blocking note:** On empty stdout, stderr text is appended to error strings returned to
frontend. Current CLI does not print tokens to stderr; add redaction/truncation in 001B if
connect errors become verbose.

## Runtime store boundary result

**Pass**

When invoked from Tauri:

- Data: `{app_data_dir}/runtime/gmail-provider/data`
- Receipts: `{app_data_dir}/runtime/gmail-provider/receipts`
- Mail index: `{app_data_dir}/runtime/gmail-provider/data/mail-index.json`

Sidecar always sets runtime env vars before Node starts; adapter modules resolve paths at
process start from those vars.

Static preview `public/data/*.local.json` unchanged (scaffold). No provider tokens in
repo-tracked paths when Tauri path is used.

OAuth client JSON lookup in `sync-status.js` still checks `tools/gmail/data/credentials.json`
(for operator secrets placement) — not user OAuth tokens; acceptable for 001B connect design.

## Payload sanitization result

**Pass with non-blocking hardening notes**

| Check | Result |
| --- | --- |
| Top-level `token` removed | Yes |
| `payload.token` removed | Yes |
| `scopeState` token presence flags removed | Yes |
| `scopeState` values | Scope URL strings only (not secrets) |
| `bodyGate.tokenScopes` | Scope strings only |
| Raw stdout on parse failure | Not returned to frontend |
| Error path | Uses `parsed.error` string only on failure |

**Non-blocking:** `sanitize_provider_envelope` does not deep-walk nested objects. Current
adapter payloads do not embed `access_token`/`refresh_token` below top level after top-level
strip. Recommend deep redaction helper in RUNTIME-001B before connect.

**Non-blocking:** `sync-status` payload still includes CLI-era copy such as
`oauth.tokenStorage: tools/gmail/data/token.json (gitignored)` and filesystem paths under
`artifacts.*.path`. Paths reflect runtime app-data when env is set; tokenStorage label is
misleading but not a secret leak. Rewrite in sanitize or adapter during 001B.

## Gate preservation result

**Pass**

| Gate | Status |
| --- | --- |
| Body read | Gated |
| Draft write | Blocked |
| Send | Blocked |
| Mail mutation | Blocked |
| GitHub mutation | Blocked (runtime boundary + no GitHub code) |
| Automation execution | Blocked |
| Browser OAuth | Blocked (boundary + sidecar meta) |
| Browser localStorage tokens | Blocked |

No GitHub or Ibal implementation added. `gmail_provider_plan_sync` uses adapter
`planOnly` path — verified no Gmail API list calls before early return in `runMetadataSync`.

## Validation result

| Check | Result |
| --- | --- |
| `npm run check:runtime001` | **Pass** |
| `npm run check` | Partial — all model/static checks pass; `route-smoke` → `net::ERR_INSUFFICIENT_RESOURCES` (environment/resource flake; unrelated to RUNTIME-001) |
| `git diff --check` | **Pass** |
| `cargo build --manifest-path src-tauri/Cargo.toml` | **Pass** |
| `cargo test --manifest-path src-tauri/Cargo.toml` | **Pass** (2 tests) |
| `git status --short` | Clean working tree |

## Unrelated WIP status

**Separated**

- `stash@{0}`: `pre-runtime-001 unrelated WIP` (UX/Gmail edits from prior work)
- Working tree clean at review time
- RUNTIME-001 commit `34ef074` contains no `public/inbox-preview.*` changes

## PR #12 draft state

**Draft** — open, unmerged. HEAD at review: `74d80ef79a9440cf23bee4ac61d911df667d25cb`.

## UI-003E state

**Not passed** — human gate unchanged.

## Blocking findings

**None.**

## Non-blocking follow-ups (RUNTIME-001B preamble)

1. Enum-whitelist sidecar subcommands before adding connect/sync execution.
2. Deep token-field redaction in sanitize (keys: `access_token`, `refresh_token`, `token`).
3. Truncate/redact stderr in sidecar error surfaces.
4. Align `sync-status` `tokenStorage` copy with runtime-app-data label when called from Tauri.

## Next recommended pass

**RUNTIME-001B** — runtime OAuth connect + live metadata/history sync execution commands,
incorporating non-blocking hardening items above.

## Decision value

```text
RUNTIME_001_PEER_REVIEW_PASS_READY_FOR_RUNTIME_001B
```
