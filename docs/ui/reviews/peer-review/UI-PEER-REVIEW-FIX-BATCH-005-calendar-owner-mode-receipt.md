# UI-PEER-REVIEW-FIX-BATCH-005 — Calendar owner-mode cleanup receipt

## Date

2026-06-18

## Branch

`ui-002/framework-derived-static-preview`

## Human review source

`docs/ui/reviews/peer-review/UI-PEER-REVIEW-HUMAN-OPERATOR-MAP-2026-06-18.md`

## Classification source

`docs/ui/reviews/peer-review/UI-PEER-REVIEW-REMAINING-WORKSPACES-CLASSIFICATION-2026-06-18.md`

## Implementation commits

| Commit | Scope |
| --- | --- |
| `54f8e14` | Add `public/calendar-owner-mode.js` owner-mode Calendar overlay |
| `3d70cf5` | Add `public/calendar-owner-mode.css` overlay styles |
| `bdbf79a` | Load Calendar owner-mode CSS and JS from `public/index.html` |

## Human problem fixed

Calendar had too many owner-facing surfaces competing at once: provider warning, toolbar, week strip, month grid, day agenda, reading pane, proposal detail, conflict preview, and provider-write warnings.

That failed the human review standard for:

- Owner-first clarity
- One primary action
- Progressive disclosure
- Trust honesty
- Provider safety

## Implemented owner-mode changes

| Area | Result |
| --- | --- |
| Month-first view | Month grid remains the primary owner surface. |
| Provider warning | Replaced primary provider warning with a calmer Calendar setup/status card. |
| Week strip | Moved behind `Advanced calendar details`. |
| Day agenda | Moved behind `Advanced calendar details` until needed. |
| Reading/detail pane | Moved behind `Advanced calendar details`. |
| New event action | Copy changed to `New local event` to preserve provider-write honesty. |
| Scaffold recovery | Overlay disables when `showWorkflowScaffold === true`. |
| Provider safety | No calendar provider writes, invites, runtime sync, or mutation paths were changed. |

## Implementation strategy

The main `public/inbox-preview.js` Calendar renderer is large and interleaves provider, month, week, day, proposal, and receipt surfaces. To keep the change narrow and reviewable, FIX-BATCH-005 uses the same post-render owner overlay strategy as Home and Ibal:

- `public/calendar-owner-mode.js` observes the rendered Calendar workspace.
- It only patches `.calendar-workspace`.
- It is idempotent via `data-owner-calendar-patched`.
- It preserves scaffold recovery through `showWorkflowScaffold`.

## Owner retest checklist

At `npm run dev` → `http://localhost:4488`:

1. Open Calendar.
2. Confirm the month grid is the main thing on screen.
3. Confirm the page does not lead with fixture account or provider-write noise.
4. Confirm `New local event` is honest and does not imply provider calendar write.
5. Confirm week strip, day agenda, details, proposal/conflict/provider detail are behind `Advanced calendar details`.
6. Confirm existing Calendar interactions still work when a day/event is selected.
7. Toggle scaffold mode and confirm operator/scaffold detail can still be recovered.

## Validation

Not run by this agent. GitHub Actions should run because `public/index.html`, `public/calendar-owner-mode.js`, and `public/calendar-owner-mode.css` changed.

## Stop lines unchanged

- UI-003E PASS is not claimed.
- PR #12 remains draft.
- MERGE-PREP-001 remains blocked.
- Framework export promotion remains blocked.
- Provider send, draft write, delete, label/archive, calendar write, and live provider mutation remain blocked.

## Decision value

```text
UI_PEER_REVIEW_FIX_BATCH_005_PASS_READY_FOR_OWNER_CALENDAR_REVIEW
```
