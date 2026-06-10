# UI-007B-R2 Drafts and Approval Queue Receipt

## Date

2026-06-10

## Branch

`ui-002/framework-derived-static-preview`

## Commit SHA

(recorded at commit)

## Scope

First-class draft objects in `xiioInbox.preview.state` schemaVersion 3:

- `drafts.items[]` with status and `approval_state`
- v2→v3 migration from `composeDraft` / `replyDrafts`
- Drafts and Approval Queue list + editor panes
- Submit for approval, approve for send (blocked), return to drafts, delete
- Draft receipts in `drafts.receipts`

## Excluded

UI-007B-R3 context rail modes, send simulation (UI-007C), batch approve, provider/runtime, owner UI-003E PASS.

## Results

| Check | Result |
| --- | --- |
| Schema v3 `drafts` namespace | pass |
| v2 migration | pass |
| Drafts view lists draft objects | pass |
| Approval queue lists queued/approved | pass |
| Send blocked in Tier 1 | pass |
| `npm run check` | pass |

## Decision

```text
UI_007B_R2_PASS_DRAFT_OBJECTS_AND_APPROVAL_QUEUE_READY
```

## Next pass

UI-007B-R3 — stage-aware context rail command modes.
