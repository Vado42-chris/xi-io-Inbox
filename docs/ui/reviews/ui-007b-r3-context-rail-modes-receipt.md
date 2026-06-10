# UI-007B-R3 Context Rail Command Modes Receipt

## Date

2026-06-10

## Branch

`ui-002/framework-derived-static-preview`

## Commit SHA

(recorded at commit)

## Scope

Stage-aware context command rail:

| Mode | Trigger |
| --- | --- |
| thread | Inbox thread selected |
| draft | Draft selected in Drafts view |
| batch | Approval Queue mailbox view |
| sent | Receipts lane |

Commands primary; context/evidence collapsed under `<details>`.

## Excluded

UI-007C send simulation, file/project rail modes, owner UI-003E PASS.

## Results

| Check | Result |
| --- | --- |
| Thread mode commands | pass |
| Draft mode + pre-send checks | pass |
| Batch approve all queued | pass (send blocked) |
| Sent mode on Receipts lane | pass (preview) |
| Evidence collapsed | pass |
| `npm run check` | pass |

## Decision

```text
UI_007B_R3_PASS_CONTEXT_RAIL_MODES_READY
```

## Next pass

UI-007C — send-event dry-run wiring and post-send plan preview.
