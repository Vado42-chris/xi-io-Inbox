# RUNTIME-NORTHSTAR-001 — Connected Operations Cockpit

## Status

```text
Type: product direction capture (docs only).
Supersedes as user-facing product intent when documents conflict with
"static preview + JSON import" as the destination model.
ARCH-004 formal PASS recorded: ARCH_004_PASS_TAURI_LOCAL_RUNTIME_PRIMARY (2026-06-10).
Next implementation slice: RUNTIME-001 (Gmail runtime provider service).
Receipt: docs/ui/reviews/runtime-north-star-001-connected-runtime-capture-receipt.md
Companion: docs/architecture/arch-004-runtime-host-decision.md
Formal closeout: docs/ui/reviews/arch-004-tauri-runtime-host-formal-decision-receipt.md
```

## Product correction

**xi-io Inbox is intended to become a connected local operations cockpit**, not a
metadata snapshot browser.

The user operates mail, calendar signals, tasks, GitHub notifications, and Ibal
proposals from one local-first command center. Providers are **live runtime
services** behind the UI. Egress (draft write, send, label/archive mutation,
GitHub repo mutation) remains gated and receipted — but **ingress and read paths
must feel connected**, not like manual file import.

## What the product target is

| Capability | Target |
| --- | --- |
| Gmail | Live in-app sync, thread list, reading pane from local runtime store |
| GitHub | Live notifications/issues ingress; Ibal proposes tasks/actions |
| Calendar | Live read metadata from runtime provider (staged after Gmail spine) |
| Ibal | Reads provider events/receipts; proposes actions; does not silently mutate |
| Receipts | Audit trail for connect, sync, blocked egress, and future confirmed actions |

## What the current branch actually is

The `ui-002/framework-derived-static-preview` line built a **development scaffold**:

```text
Static preview UI  →  reads JSON files  ←  CLI exports  ←  Gmail/GitHub APIs
```

That scaffold was useful for:

- UI shape, navigation, and scope lens (Option B north star)
- Privacy gates, draft-only egress, and honest blocked states
- Gmail metadata adapter proof (`tools/gmail`)
- Sync status, mail index, historyId logic, and Activity receipts
- Compliance index and provider gate vocabulary

It is **not** the finished product experience. Agents optimizing Mail UI polish,
account factory UX, or JSON import ergonomics are optimizing the scaffold, not
the destination.

## Scaffold vs product (explicit)

| Layer | Scaffold (keep) | Product target (build next) |
| --- | --- | --- |
| UI shell | `public/inbox-preview.js` static preview | Tauri-hosted web UI calling runtime commands |
| Gmail data | `gmail-metadata.local.json` manual import | Runtime Gmail provider → local store → UI binding |
| OAuth | `tools/gmail` CLI loopback; tokens in gitignored store | Tauri-side OAuth loopback; tokens in OS/runtime secure store |
| Sync | Operator CLI + file copy + page refocus refresh | Background poll sync ([Gmail sync guide](https://developers.google.com/workspace/gmail/api/guides/sync)) |
| GitHub | Blocked integration cards | Runtime GitHub provider ([notifications API](https://docs.github.com/en/rest/activity/notifications)) |
| Bodies | Optional readonly body snapshot file import | Runtime body read behind explicit gate |
| Send/draft/mutation | Blocked in Tier 1 preview | Later egress slices with approval + receipts |

## CLI adapter status

`tools/gmail` and `tools/gcal` are **prototypes for local runtime providers**, not
the final user workflow.

Existing assets to promote (not discard):

- Metadata sync, label jobs, pagination, mail index, sync status, historyId sync
- OAuth loopback, token store, wipe, receipts, body gate, redaction schema
- Provider contract and compliance mappings

The next move is a **runtime service contract** (Tauri commands + managed state),
not more manual export-to-`public/data/` steps.

## OAuth and token policy

- **Browser OAuth in the static preview remains blocked.** Tokens must not live in
  `localStorage`, fixtures, or committed JSON.
- **Desktop OAuth loopback** on `127.0.0.1` / `[::1]` is the preferred connect path
  for the Tauri runtime ([Google native app OAuth](https://developers.google.com/identity/protocols/oauth2/native-app)).
- GitHub auth must respect endpoint constraints (notifications vs App tokens); design
  in GITHUB-001 before UI implies live GitHub.

## Sync policy

- **Gmail push (Pub/Sub `watch`) is deferred.** Google documents push for backend
  servers; installed/desktop apps should use poll-based sync
  ([Gmail push guide](https://developers.google.com/workspace/gmail/api/guides/push)).
- **`historyId` incremental sync** (EXT-004) is the correct poll spine once hosted
  in the runtime provider.
- Pub/Sub renewal (≤7 days) is unnecessary overhead before local runtime is proven.

## Egress gate policy (unchanged)

Even in the connected product:

- Draft write, send, archive/delete/label mutation remain **explicit later slices**
  (GMAIL-002C/D, EGRESS-001).
- GitHub repo mutation remains blocked until GITHUB egress gate passes.
- Ibal proposes; human confirms; receipts record confirmed actions.

## Ibal role

Ibal reads **provider events and receipts** from the local runtime store and
proposes next safe actions (summarize, draft, task, calendar hold). Ibal must not
silently connect providers, mutate mail, or mutate repositories.

## Future UI copy states (plan only — do not mass-change preview copy in this slice)

| State | Meaning |
| --- | --- |
| Not connected | No runtime provider session for this account |
| Connect Gmail / Connect GitHub | Runtime OAuth/connect flow available |
| Connected | Provider authenticated; store initialized |
| Syncing | Poll/history sync in progress |
| Last synced | Timestamp from runtime sync receipt |
| Reconnect required | Token expired or revoked |
| Local runtime unavailable | Tauri provider not running or command failed |
| Static preview fixture mode | Dev harness only; not connected product |
| Body read gated | Metadata connected; body scope not granted |
| Draft / send / mutation blocked | Egress gate active (honest) |

Preview copy that says "local snapshot · not live Gmail" remains accurate for the
**scaffold** until RUNTIME-002 binds the UI to the runtime store. Then replace
with connected-state copy above.

## Framework backfeed posture

When exporting patterns to `xi-io.net#239`:

- Export **provider receipt/event model**, OAuth/token separation, egress gates,
  and staged scope map.
- Do **not** export manual JSON import as the final framework integration pattern.
- Label static preview bridge as **scaffold**; label Tauri runtime provider as
  **next-phase target**.

See addendum in `docs/product/framework-backfeed-001-inbox-to-xi-io-net-239-packet.md`.

## Next slices (implementation order)

| ID | Goal |
| --- | --- |
| ARCH-004 | **Formal PASS** — Tauri local desktop runtime primary (`ARCH_004_PASS_TAURI_LOCAL_RUNTIME_PRIMARY`) |
| RUNTIME-001 | **Next implementation slice** — Gmail runtime provider service (Tauri/Rust; promote CLI logic) |
| RUNTIME-002 | Gmail live store + UI binding (replace JSON import path) |
| GITHUB-001 | GitHub notifications/issues ingress plan + runtime provider |
| IBAL-001 | Ibal proposal layer over provider events |
| EGRESS-001 | Controlled draft/write/send/mutation approval gates |

## Decision value

```text
RUNTIME_NORTHSTAR_001_CONNECTED_COCKPIT_CAPTURED
```
