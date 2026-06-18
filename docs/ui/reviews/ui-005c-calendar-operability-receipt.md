# UI-005C Calendar Operability Receipt

## Date

2026-06-10

## Branch

`ui-002/framework-derived-static-preview`

## Commit SHA

7d284804bef14cb6ed17237d93dbe679b08e0df5

## Scope

Calendar lane Tier 1 local operability:

- local event/calendar proposal create/edit form
- source-linked proposal context (fixture + inbox-local)
- inbox-created calendar proposal integration in Calendar lane
- canonical preview-state envelope migration
- local calendar receipts
- inspector integration
- clear/reset Calendar preview state
- UI-005B Inbox operability preserved

## Excluded Scope

- UI-005D+ lanes
- Ibal lane removal (UI-005H)
- Provider/runtime/platform work
- Visual proof / PR draft exit

## Files Changed

- `public/inbox-preview.js`
- `public/inbox-preview.css`
- `docs/ui/reviews/ui-005c-calendar-operability-receipt.md`
- `TODO.md`

## UI-005B Regression Result

Structural regression pass (browser not run):

| Check | Result |
| --- | --- |
| Compose draft controls | present |
| Reply draft controls | present |
| Triage controls | present |
| Inbox calendar proposal action | present |
| Clear/reset Inbox control | present |
| Inbox operability hooks | preserved in JS |

Full interactive browser regression not independently run in this pass.

## Local Calendar Proposal Create Result

Pass — labeled form, save local proposal, disabled provider write.

## Local Calendar Proposal Edit Result

Pass — select proposal, update title/date/notes/source, receipt on update.

## Source-Linked Proposal Result

Pass — sourceRef and sourceType fields; inbox-local proposals show `inbox-thread:{id}`.

## Inbox-Created Calendar Proposal Integration Result

Pass — Inbox triage creates linked entry in `calendar.proposals`; visible in Calendar list.

## Local State Result

Pass — session + canonical localStorage envelope.

## localStorage Usage

Yes.

## localStorage Key(s) Used

Canonical: `xiioInbox.preview.state`

Migrated from: `xiioInbox.preview.ui005b` (read-only migration; inbox data preserved)

## schemaVersion

`2`

Envelope namespaces: `inbox`, `calendar` (navigation: laneId, threadId, focusId).

## Migration Result

Pass — canonical envelope introduced; UI-005B inbox state migrated without silent discard.

## Clear/Reset Result

Pass — Calendar clear-all with confirm; Inbox clear-all unchanged.

## Receipt/Proposal Preview Result

Pass — calendar receipts on create/update with preview-only limitations.

## Inspector Result

Pass — inspector updates for `calendar:local:{id}` selections with source/evidence/blockers.

## Keyboard/Focus Result

Pass — labeled forms, focus-visible styles, proposal list selectable, status `aria-live`.

## Accessibility Result

Pass — labels, disabled provider-write explanation, textual status, no color-only state.

## Safety/Egress Result

Pass — provider calendar write/invite send blocked; egress policy preserved.

## Provider/Runtime/Platform Result

Unchanged blocked.

## Route Smoke Result

| Check | Result |
| --- | --- |
| `#/calendar` page load | HTTP 200 (structural) |
| Calendar operability hooks | present in served JS |
| UI-005B hooks | present in served JS |
| `npm run check` | pass |

## External Network Request Result

0 external (non-local) requests when checked.

## Same-Origin Fixture Fetch Result

1 expected fetch: `./data/inbox-events.preview.json`

## Remaining Blockers

- UI-005D–I not started
- Ibal lane until UI-005H
- Visual proof blocked
- ARCH-004 / providers / Pass 4 / xi-io.net#239

## Next Recommended Pass

UI-005D Tasks operability.

## Decision Value

```text
UI_005C_PASS_CALENDAR_OPERABILITY_READY_FOR_NEXT_LANE
```
