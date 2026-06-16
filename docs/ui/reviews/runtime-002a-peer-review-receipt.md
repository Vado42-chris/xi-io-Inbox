# RUNTIME-002A — Peer Review Receipt

## Date

2026-06-10

## Branch

`ui-002/framework-derived-static-preview`

## Reviewed commit SHA

`1092e45e4398f3246d21adc0769349eebb9c80ad`

## Scope

Independent narrow peer review of the committed RUNTIME-002A read-only runtime mail index
bridge before any RUNTIME-002B connect/sync UI orchestration. Review used the pushed commit
as source truth; unrelated local demo-removal WIP was stashed before validation.

## Excluded scope

- RUNTIME-002B / RUNTIME-002C implementation
- Live OAuth operator proof
- Mail UI polish, demo-removal WIP, Add account nav
- GitHub / Ibal
- Body read, draft write, send, mutation, automation execution
- UI-003E claim / PR ready-for-review
- Unstaged demo-removal WIP (`public/data/inbox-events.preview.json`, `public/inbox-preview.css`, acc check scripts)

## Files reviewed

| File | Focus |
| --- | --- |
| `src-tauri/src/gmail_provider/mail_index.rs` | Read path, schema validation, projection, redaction |
| `src-tauri/src/gmail_provider/mod.rs` | `mail_index` export wiring |
| `src-tauri/src/lib.rs` | Command registration vs capability boundary |
| `src-tauri/src/runtime_store.rs` | App-data path contract |
| `src-tauri/src/gmail_provider/redaction.rs` | Deep redaction reuse |
| `src-tauri/capabilities/default.toml` | Main window capability binding |
| `src-tauri/permissions/allow-gmail-runtime-read.toml` | Read-only command ACL |
| `src-tauri/tauri.conf.json` | Main window label, `withGlobalTauri` |
| `public/src/runtime/gmail-runtime-bridge.js` | Tauri detection + invoke gate |
| `public/inbox-preview.js` | Runtime load path, thread preference, status badge |
| `scripts/runtime-002a-model-check.mjs` | Structural guard |
| `docs/ui/reviews/runtime-002a-mail-index-read-bridge-receipt.md` | Scope alignment |
| `docs/architecture/runtime-store-boundary-v1.md` | Store + command contract |
| `package.json` | `check:runtime002a`, `tauri:dev` workflow |

## Read command result

**Pass**

- `gmail_provider_mail_index` exists and delegates to `mail_index::read_mail_index`.
- Reads only from `{app_data_dir}/runtime/gmail-provider/data/mail-index.json` via `runtime_store::boundary_for_app`.
- No sidecar spawn, no Gmail API calls, no connect/sync invocation.
- Projects thread headers only; omits top-level `messages` array from UI payload.
- Strips body/forbidden message fields before return (`project_strips_message_bodies_and_forbidden_fields` test).
- Missing file returns `empty_mail_index_envelope()` (not an error).

## Schema validation result

**Pass**

- Validates `schemaVersion: 1`, `source: local-gmail-cli`, `mode: metadata-index`.
- Requires `threads` and `messages` arrays in stored index file.
- Unsupported schema/source/mode/shape returns `Err` (fail closed).
- Returned envelope shape is stable for UI binding (`schemaVersion`, `source`, `mode`, `accounts`, `threads`, `warnings`, `blockedCapabilities`, `runtimeProvider`).

## Runtime path isolation result

**Pass**

- Path resolved only through Tauri `app_data_dir` + fixed runtime subpaths.
- No reads from `public/data`, repo-tracked adapter data, or browser storage.
- Static preview fallback remains separate (`isTauriRuntime()` gate; `npm run dev` unchanged).

## Redaction result

**Pass**

- `sanitize_provider_envelope()` applied after projection.
- Existing deep-redaction tests cover nested token removal.
- Projection allowlists header keys before redaction, preventing body fields from entering payload.
- Error strings are generic parse/validation messages; no raw file contents returned.

## Capability ACL result

**Pass**

- `src-tauri/permissions/allow-gmail-runtime-read.toml` allowlists **only**:
  - `runtime_store_boundary`
  - `gmail_provider_mail_index`
- Connect/sync/status/plan commands are registered in Rust but **not** granted to the main webview capability.
- `src-tauri/capabilities/default.toml` binds `allow-gmail-runtime-read` to window label `main`.
- `tauri.conf.json` defines `main` window with `withGlobalTauri: true`.
- Generated ACL manifests match the permission file.

## JS bridge / static fallback result

**Pass**

- `isTauriRuntime()` checks `window.__TAURI__?.core?.invoke` before any invoke.
- Bridge calls only `runtime_store_boundary` and `gmail_provider_mail_index`.
- No connect/sync/body/draft/send/mutation invoke paths in JS.
- `loadRuntimeMailArtifacts()` runs only in Tauri init; static preview keeps JSON fetch path.
- `inboxThreads()` prefers runtime index when threads exist; otherwise falls back to existing snapshot/fixture paths.
- `environmentStatusBadge()` distinguishes `Runtime · Local · …` from preview copy.

## Validation result

Review performed on clean tree after stashing unrelated demo-removal WIP.

| Check | Result |
| --- | --- |
| `npm run check:runtime002a` | Pass |
| `npm run check:runtime001` | Pass |
| `cargo test --manifest-path src-tauri/Cargo.toml` | Pass (14 tests) |
| `cargo build --manifest-path src-tauri/Cargo.toml` | Pass |
| `git diff --check` | Pass |
| `npm run check` (full) | **Pass** (clean tree; route-smoke pass) |

## Unrelated WIP status

**Stashed before review**

```text
git stash push -m "pre-runtime-002a-peer-review unrelated demo-removal WIP"
```

Stash includes: `public/data/inbox-events.preview.json`, `public/inbox-preview.css`, `scripts/acc-001-model-check.mjs`, `scripts/acc-sync-ui-001-model-check.mjs`.

Working tree during review matched remote HEAD `1092e45`.

## PR #12 draft state

**Draft** (open, unmerged)

## UI-003E state

**Not passed**

## Blocking findings

None.

## Non-blocking findings

1. **Corrupt index JS handling:** Invalid/corrupt on-disk index returns `Err` from Rust (correct fail-closed). `loadRuntimeMailArtifacts()` does not catch invoke rejection; a corrupt runtime index could reject `init()` instead of falling back to snapshots. Recommend hardening in a small follow-up before or during RUNTIME-002B orchestration.
2. **002B capability split still required:** Connect/sync commands exist in the invoke handler but remain ACL-blocked. RUNTIME-002B must add a separate capability permission; do not expand `allow-gmail-runtime-read`.
3. **Prior `SidecarCommand::parse` dead_code warning** remains in `cargo test` output (pre-existing, not introduced by 002A).

## Next recommended pass

**RUNTIME-002B** — connect/sync UI orchestration only:

- Wire connect + bounded sync triggers from UI
- Add separate capability ACL for live commands (not read capability)
- Live-state copy and post-sync refresh hook points
- Still no Mail polish, GitHub, Ibal, egress mutations, or operator OAuth proof (002C)

## Decision value

```text
RUNTIME_002A_PEER_REVIEW_PASS_READY_FOR_RUNTIME_002B
```

Read-only runtime mail index bridge, capability ACL, and static fallback verified on committed SHA. Safe to start RUNTIME-002B orchestration slice.
