# FRAMEWORK-BACKFEED-001 — Inbox → xi-io.net `#239` Freshness Packet

## Date

2026-06-15

## Direction

Two-way freshness record:

1. **Out:** reviewed Inbox patterns now eligible for framework export planning (`xi-io.net#239`).
2. **In:** framework consumer contract obligations unchanged — adapted copy with source notes until stable export path is decided.

## Source consumer state

```text
Repo: Vado42-chris/xi-io-Inbox
Branch: ui-002/framework-derived-static-preview
PR: #12 (draft, unmerged)
Source HEAD: fa78f8efb3a8c0cb8e0a1ac0ae39f90d343eaee5
Framework issue: Vado42-chris/xi-io.net#239
```

## Peer-reviewed receipts (export-eligible evidence)

| Slice | Receipt | Review gate | Commit |
| --- | --- | --- | --- |
| UI-CONVERGE-001 | `ui-converge-001-route-table-receipt.md` | CATCHUP-REVIEW-001 pass | `a74d442` |
| GMAIL-002A-EXT-001–004 + REPAIR | sync roadmap + repair receipts | CATCHUP-REVIEW-002 pass (structural) | `b2a4b56`, `1089c82` |
| GCAL-001 | `gcal-001-calendar-readonly-import-receipt.md` | CATCHUP-REVIEW-001 pass | `1ee37a7` |
| Governance | `catchup-review-002-ext004-repair-peer-review.md` | allows backfeed start | `1089c82` |

## Patterns now eligible for framework consideration

### UI / navigation (`XiRouteTable` candidate)

- `public/src/shell/route-table.js` — `ROUTE_TABLE_VERSION`, `PRIMARY_NAV`, workspace↔lane↔hash mapping.
- Mail workbench sub-view model (`MAIL_WORKBENCH_SUB_VIEWS`).
- Scope-lens lane pattern (`scopeLens: true` on Mail, Calendar, Tasks, Activity).
- Validation: `scripts/route-table-check.mjs`, `scripts/route-smoke.mjs`, `check:route-table`.

### Gmail staged ingress (provider pattern, repo-local impl)

Document as **consumer adapter pattern**, not framework runtime:

1. Metadata-first (`gmail.metadata` scope, no `q` under metadata tier).
2. Local JSON mail index bridge (`tools/gmail/lib/local-mail-index.js`).
3. Sync status + Activity receipts (`tools/gmail/lib/sync-status.js`, `receipts.js`).
4. `historyId` incremental sync with bounded pagination, pause cursor on `maxPages`, full-sync fallback on invalid cursor (post EXT-004-REPAIR).
5. Default blocked: body read (unless readonly gate), draft write, send, provider mutation.

Evidence: `tools/gmail/provider-contract.md`, `docs/product/gmail-002a-ext-sync-roadmap.md`, `docs/product/06-compliance-validation-index.md`.

### GCAL read-only import (separate adapter pattern)

- Separate package `tools/gcal/`, separate OAuth loopback port **8788**, separate token store.
- Read-only snapshot schema; attendee/token/conference fields rejected.
- Preview import only; calendar write/mutation blocked in UI.

Evidence: `gcal-001-calendar-readonly-import-receipt.md`.

### Receipt-first governance

- Slice receipts under `docs/ui/reviews/` with scope / excluded scope / checks / decision value.
- Peer review packets (CATCHUP-REVIEW-001/002) gate framework export and merge prep.
- Compliance index maps requirements → evidence artifacts.

### Blocked provider-write default

- Preview and CLI adapters emit gate receipts (`bodyWithheld`, `draftWriteBlocked`, `sendBlocked`, `mutationBlocked`).
- Consumer contract alignment: `workbench-ui-consumer-contract-v1.md`.

## RUNTIME-NORTHSTAR-001 addendum (2026-06-15)

**Do not export the static JSON import bridge as the final product integration pattern.**

| Export to framework | Do not export |
| --- | --- |
| Provider receipt/event model | Manual `public/data/*.local.json` import as final UX |
| OAuth/token/browser separation | Browser OAuth in static preview |
| Staged Gmail scope map (metadata → readonly → compose → send) | "Local snapshot product" framing |
| Egress gate vocabulary | Pub/Sub push as default desktop sync |
| Poll-based `historyId` sync contract | CLI-only as final user workflow |

**Next-phase target for framework docs:** Tauri (or equivalent) **runtime provider**
pattern — UI invokes local commands; providers write to runtime stores.

Static preview bridge remains valid as **scaffold / CI harness** only.

See: `docs/product/runtime-north-star-001-connected-operations-cockpit.md`,
`docs/architecture/arch-004-runtime-host-decision.md`.

## Patterns explicitly withheld (do not export yet)

| Pattern | Reason |
| --- | --- |
| ACC-SYNC-UI-001 account factory | Local stash only; no receipt; not branch truth |
| UI-003E owner visual proof | Human gate not passed |
| IBAL-001 real concierge | Placeholder shell only |
| Gmail draft write / send | Gates blocked; not proven |
| Live OAuth / history proof | Operator-deferred |
| ARCH-004 runtime decision | Provisional Tauri capture complete; formal PASS pending (`arch-004-runtime-host-decision.md`) |
| SQLite/LMDB storage | Not decided; JSON index bridge only |
| Monolith renderers / ui-016c debt | Extraction incomplete |

## Stable export path questions for `#239`

Framework owner must still decide:

1. **Package vs static export vs pattern library** for `XiRouteTable`, mail workbench shell, context rail modes.
2. **Provider patterns** stay repo-local adapters; framework should document contracts only (`XiProviderGate`), not ship Gmail/GCal OAuth.
3. **Fixture expectations** — preview schema **11** (`xiioInbox.preview.state`); sync status JSON bridge paths documented in consumer repo.
4. **Validation** — consumer `npm run check` + route-table + provider nested checks; framework adds freshness diff hooks later.
5. **Accessibility** — skip link, focus rings, blocked-action grammar verified in UI-003E packet but **owner PASS pending**.
6. **Migration** — adapted copy → direct import only after `#239` export path decision; preserve blocked runtime-write default.

## Consumer obligations (unchanged)

Until `#239` resolves export path:

```text
framework source: docs/framework/workbench-ui-consumer-contract-v1.md
consumer path: public/inbox-preview.js + public/src/shell/route-table.js
reason direct reuse not practical: no stable package/import path
local divergence: Inbox mail workbench, Gmail/GCal adapters, fixture schema 11
validation command: npm run check
follow-up framework issue: xi-io.net#239
```

## Related framework docs to update

- `docs/framework/inbox-ui-consumer-freshness-note.md` — add FRAMEWORK-BACKFEED-001 section.
- `xi-io.net#239` — comment linking packet + withheld patterns.

## Decision value

`FRAMEWORK_BACKFEED_001_INBOX_PACKET_READY_FOR_XI_IO_NET_239`
