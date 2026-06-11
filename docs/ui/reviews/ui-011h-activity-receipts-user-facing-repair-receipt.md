# UI-011H Activity Receipts User-Facing Repair Receipt

## Date

2026-06-10

## Branch

`ui-002/framework-derived-static-preview`

## Commit SHA

`(pending commit)`

## Scope

Activity / Receipts user-facing repair per `docs/product/ui-011a-product-capability-gap-matrix.md` (CAP-ACT-002–008, CAP-EVD-004/007, cross-area linkage).

## Excluded scope

- UI-011I+ slices
- UI-012 visual polish
- Owner UI-003E
- Real export file write / cloud upload
- Provider runtime

## Source matrix references

- CAP-ACT-002 Audit subtitle — “Receipts and audit trail” subtitle on Activity view
- CAP-ACT-004 Account/source filters — secondary filters (area, type, scope, outcome, search)
- CAP-ACT-005 Source object links — open-source drill-down to Mail, Drafts, Calendar, Tasks, Automations, Extensions, Settings
- CAP-ACT-006 Blocked explanation — blocked reason in detail panel
- CAP-ACT-007 Export packet — preview-blocked Export Activity Packet button + gate copy
- CAP-ACT-008 Build evidence separated — build/fixture rows under Build evidence tab; developer details in disclosure
- CAP-EVD-004 Evidence packet — export placeholder with storage gate explanation
- CAP-EVD-007 Chain of custody — receipt id, event type, risk, gate in detail panel

## Files changed

- `public/inbox-preview.js` — schema v10, unified activity feed, filters, detail panel, source links
- `public/inbox-preview.css` — activity two-column layout, detail grid, secondary filters
- `public/data/inbox-events.preview.json` — Activity lane title/summary
- `docs/ui/reviews/ui-011h-activity-receipts-user-facing-repair-receipt.md`
- `TODO.md`

## Product UI code changed

**yes**

## Activity naming result

Primary user-facing label **Activity** with subtitle “Receipts and audit trail — what happened, what was proposed, what was blocked, and why.” Underlying receipt objects preserved in code/storage.

## Receipts/audit mapping result

Unified `collectUnifiedActivityEntries()` aggregates receipts from drafts, inbox, calendar, tasks, automations, extensions, settings, sentEvents, evidence, and fixture ledger (build scope).

## Filters result

Primary tabs (Your activity, Proposals, Blocked, Simulated sends, Build evidence, All) plus secondary scope/outcome chips, source area select, action type select, and search.

## Activity detail result

Detail panel shows title, status, timestamp, account, source object, explanation, blocked reason, receipt metadata, risk, gate, safe next step, source link, export placeholder.

## Source links result

openActivitySource extended for draft, thread, calendar proposal, task/story, automation rule, extension provider/install, settings gate.

## Blocked reason result

Plain-language blockedReason on detail panel for blocked outcomes and send/export gates.

## Advanced/build evidence disclosure result

Build/fixture rows scoped to Build evidence filter; commit SHA / slice / validation in collapsible “Build evidence (developer)” details only.

## Export packet placeholder result

Export Activity Packet control disabled with explanation; no file write or cloud upload.

## Evidence/artifact relation result

Evidence items appear as activity entries with storage-blocked reason and story source link.

## Cross-area linkage result

Existing lane “Open Activity” actions preserved; Activity feed ingests cross-namespace receipts.

## Storage result

Canonical key `xiioInbox.preview.state` only. Schema **v10** adds activity filter fields and `selectedEntryId`. v9→v10 migration preserves prior activity state.

## schemaVersion

**10**

## localStorage keys used

- `xiioInbox.preview.state` (canonical envelope only)

## UI-011B–G regression result

All prior lanes preserved. `npm run check` pass.

## Accessibility result

Activity rows and filter chips are buttons with aria-selected/aria-pressed; detail labels in text; export disabled with title explanation.

## Keyboard/focus result

Activity rows keyboard selectable; inspector focus sync for selected entry.

## Safety/egress result

No credentials, export write, or provider runtime. Export and cloud paths remain blocked.

## Provider/runtime/platform result

Tier 1 preview only. Gmail browser not connected.

## Route smoke result

| Check | Result |
| --- | --- |
| Default app load | 200 |
| Activity JS markers | pass |
| Fixture JSON fetch | 200 same-origin |
| External network requests | **0** |
| Preview server stopped | yes |

## Same-origin fixture fetch result

`public/data/inbox-events.preview.json` at `127.0.0.1:4488` — pass.

## Remaining blockers

- Real Activity packet export — blocked until storage/redaction gates
- Owner UI-003E blocked until UI-011I + UI-012F
- xi-io.net framework freshness backfeed — parallel docs pass after UI-011I

## Next recommended pass

**UI-011I** — Settings residual / cross-product cleanup

## Decision value

```text
UI_011H_PASS_ACTIVITY_REPAIR_READY_FOR_SETTINGS_CLEANUP
```
