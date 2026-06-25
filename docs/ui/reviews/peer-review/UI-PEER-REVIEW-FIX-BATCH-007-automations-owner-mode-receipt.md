# UI-PEER-REVIEW-FIX-BATCH-007 — Automations owner-mode cleanup receipt

## Date

2026-06-19

## Branch

`ui-002/framework-derived-static-preview`

## Classification source

`docs/ui/reviews/peer-review/UI-PEER-REVIEW-005-automations.md`

## Implementation commits

| Commit | Scope |
| --- | --- |
| TBD | Add `public/automations-owner-mode.js` owner-mode Automations overlay |
| TBD | Add `public/automations-owner-mode.css` overlay styles |
| TBD | Load Automations owner-mode CSS and JS from `public/index.html` |

## Human problem fixed

Automations read like an operator scaffold dump: execution-blocked banner, empty rule center, starter templates, action library, rule builder, and receipt detail all competed for attention. That failed the owner review standard for calm default UI and progressive disclosure.

## Implemented owner-mode changes

| Area | Result |
| --- | --- |
| Default surface | One owner status card plus one calm dry-run/status card. |
| Execution messaging | Replaced dominant banner with owner copy: preview only, blocked safely. |
| Rule builder / library | Moved execution banner, toolbar, rules list, reading pane, action library, templates, and rule sheet behind `Advanced automation details`. |
| Proof language | Uses `Proof saved` user language; full proof notes deferred to Activity. |
| Scaffold recovery | Overlay disables when `showWorkflowScaffold === true`. |
| Provider safety | No automation execution, provider writes, or runtime mutation paths changed. |

## Implementation strategy

Uses the same post-render owner overlay strategy as Home, Ibal, Calendar, and Tasks:

- `public/automations-owner-mode.js` observes the rendered Automations workspace.
- It only patches `.automations-workspace`.
- It is idempotent via `data-owner-automations-patched`.
- Underlying operator scaffold remains available in Advanced and scaffold mode.

## Owner retest checklist

At `npm run dev` → `http://localhost:4488`:

1. Open Automations.
2. Confirm default view is one status card and one dry-run/status card — not rule builder sprawl.
3. Confirm `Preview only · blocked safely` is visible.
4. Confirm rules, templates, action library, dry-run internals, and rule forms are behind `Advanced automation details`.
5. Confirm opening Advanced still allows local dry-run preview and rule editing.
6. Toggle scaffold mode and confirm operator/scaffold detail can still be recovered.

## Validation

`npm run check:quick` — pass (this agent pass).

## Stop lines unchanged

- UI-003E PASS is not claimed.
- PR #12 remains draft.
- MERGE-PREP-001 remains blocked.
- Framework export promotion remains blocked.
- Automation execution and provider mutation remain blocked.

## Decision value

```text
UI_PEER_REVIEW_FIX_BATCH_007_PASS_READY_FOR_OWNER_AUTOMATIONS_REVIEW
```
