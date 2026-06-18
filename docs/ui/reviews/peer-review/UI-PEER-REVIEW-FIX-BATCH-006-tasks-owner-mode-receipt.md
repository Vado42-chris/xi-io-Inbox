# UI-PEER-REVIEW-FIX-BATCH-006 — Tasks owner-mode cleanup receipt

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
| `8d81e4f` | Add `public/tasks-owner-mode.js` owner-mode Tasks overlay |
| `832f38a` | Add `public/tasks-owner-mode.css` overlay styles |
| `c08d22e` | Load Tasks owner-mode CSS and JS from `public/index.html` |

## Human problem fixed

Tasks read like a product-management/backlog surface instead of a personal task surface. Epics, stories, bugs, acceptance criteria, evidence, project selector, board controls, and provider sync copy competed with the basic owner job: see what needs doing and add a task.

That failed the human review standard for:

- Owner-first clarity
- Accessibility and cognition
- Progressive disclosure
- Consistent product model
- Provider safety

## Implemented owner-mode changes

| Area | Result |
| --- | --- |
| Personal tasks first | Added an owner `Your tasks` card before the planning scaffold. |
| Empty state | If no personal tasks are visible, Tasks explains that backlog/scaffold detail lives in Advanced. |
| Primary action | Keeps `New task` as the owner action. |
| PM/backlog scaffold | Moves project selector, Planning/Board toggle, epics, stories, bugs, evidence, and detail grid behind `Advanced task planning details`. |
| Provider warning | Replaced the primary provider warning with a calmer local-preview setup/status card. |
| Scaffold recovery | Overlay disables when `showWorkflowScaffold === true`. |
| Provider safety | No external task provider sync, issue tracker mutation, evidence upload, or provider write path was changed. |

## Implementation strategy

The main `public/inbox-preview.js` Tasks renderer interleaves personal tasks, PM planning, user stories, bugs, evidence, provider status, and board controls. To keep the change narrow and reviewable, FIX-BATCH-006 uses the same post-render owner overlay strategy as Home, Ibal, and Calendar:

- `public/tasks-owner-mode.js` observes the rendered Tasks workspace.
- It only patches `.tasks-workspace`.
- It is idempotent via `data-owner-tasks-patched`.
- It preserves scaffold recovery through `showWorkflowScaffold`.

## Owner retest checklist

At `npm run dev` → `http://localhost:4488`:

1. Open Tasks.
2. Confirm Tasks starts with an owner-facing `Your tasks` card, not epics/stories/bugs.
3. Confirm `New task` is the obvious primary action.
4. Confirm project selector, Planning/Board toggle, epics, stories, bugs, evidence, and backlog detail are behind `Advanced task planning details`.
5. Confirm external task sync and tracker/evidence upload still read as blocked.
6. Confirm creating/editing a local task still opens the existing local task form.
7. Toggle scaffold mode and confirm operator/scaffold detail can still be recovered.

## Validation

Not run by this agent. GitHub Actions should run because `public/index.html`, `public/tasks-owner-mode.js`, and `public/tasks-owner-mode.css` changed.

## Stop lines unchanged

- UI-003E PASS is not claimed.
- PR #12 remains draft.
- MERGE-PREP-001 remains blocked.
- Framework export promotion remains blocked.
- Provider send, draft write, delete, label/archive, calendar write, task provider sync, issue tracker mutation, evidence upload, and live provider mutation remain blocked.

## Decision value

```text
UI_PEER_REVIEW_FIX_BATCH_006_PASS_READY_FOR_OWNER_TASKS_REVIEW
```
