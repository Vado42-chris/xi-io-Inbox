# Runtime Store Boundary v1

## Status

```text
Slice: RUNTIME-001
Host: Tauri local desktop runtime (ARCH_004_PASS_TAURI_LOCAL_RUNTIME_PRIMARY)
Implementation: sidecar parity phase (tools/gmail CLI invoked from Rust commands)
```

## Purpose

Define where xi-io Inbox provider data lives in the connected product runtime, and
what must never enter the static browser surface.

## Store layers

| Layer | Location | Role |
| --- | --- | --- |
| Static preview fixtures | `public/data/*.sample.json`, empty preview JSON | CI/harness only; not product tokens |
| Static preview operator imports | `public/data/*.local.json` (gitignored) | Scaffold bridge; not final product workflow |
| CLI default adapter store | `tools/gmail/data/`, `tools/gmail/receipts/` | Operator/debug default when env unset |
| **Runtime provider store** | `{app_data_dir}/runtime/gmail-provider/` | Product target for tokens, index, receipts |

Tauri resolves `{app_data_dir}` via `AppHandle::path().app_data_dir()`.

## Runtime Gmail provider paths

Under `{app_data_dir}/runtime/gmail-provider/`:

```text
data/
  token.json              OAuth refresh/access (0600, never browser localStorage)
  mail-index.json         Metadata thread/message index
  metadata-snapshot.json  Optional export artifact
  readonly-body-snapshot.json  Only when readonly body gate passes
receipts/
  receipt-*.json          Connect/sync audit rows (no tokens/bodies)
```

## Sidecar environment contract

Tauri Gmail commands set these env vars before invoking `tools/gmail/cli.js`:

| Variable | Purpose |
| --- | --- |
| `GMAIL_ADAPTER_DATA_DIR` | Runtime-owned data directory |
| `GMAIL_RECEIPTS_DIR` | Runtime-owned receipt directory |
| `GMAIL_MAIL_INDEX_PATH` | Runtime mail index file path |

Implementation: `tools/gmail/lib/runtime-paths.js`, `src-tauri/src/runtime_store.rs`.

## Forbidden in browser surface

- OAuth tokens in `localStorage`, `sessionStorage`, or committed JSON
- Browser OAuth redirect handling in static preview
- Provider send/draft/mutation from preview without egress gates
- Treating manual JSON import as the connected product data path

## Allowed Tauri command surface (RUNTIME-001B)

| Command | Sidecar | Behavior |
| --- | --- | --- |
| `runtime_store_boundary` | n/a (Rust) | Returns runtime path contract + gate summary |
| `gmail_provider_status` | `status` | Provider status; deep-redacted payload |
| `gmail_provider_sync_status` | `sync-status` | Sync status from runtime store |
| `gmail_provider_plan_sync` | `sync-plan` | Plan-only; no live API execution |
| `gmail_provider_connect` | `connect` | Desktop OAuth loopback; tokens in app-data only |
| `gmail_provider_sync_metadata` | `sync-metadata` | Bounded live metadata sync (default pages 1, max 25) |
| `gmail_provider_sync_history` | `sync-history` | Bounded live history sync (CLI EXT-004 semantics) |
| `gmail_provider_mail_index` | n/a (Rust read) | Read-only runtime mail index; thread headers only |

Sidecar allowlist only: `status`, `sync-status`, `sync-plan`, `connect`, `sync-metadata`, `sync-history`.

## Egress gates (unchanged)

```text
body_read: gated
draft_write: blocked
send: blocked
mutation: blocked
github_mutation: blocked
automation_execution: blocked
```

## Migration notes

- RUNTIME-001B adds connect + bounded live sync commands with sidecar allowlist and deep redaction.
- RUNTIME-001B-PEER-REVIEW gates RUNTIME-002A (read bridge), not broad UI binding.
- RUNTIME-002A adds read-only mail index command + minimal Tauri JS bridge + capabilities ACL.
- RUNTIME-002B wires connect/sync orchestration; RUNTIME-002C adds refresh loop + operator proof.
- Product path replaces `fetch('./data/*.local.json')` incrementally; static preview remains for CI.

## Related docs

- `docs/architecture/arch-004-runtime-host-decision.md`
- `docs/product/runtime-001-gmail-provider-service-plan.md`
- `tools/gmail/provider-contract.md`
