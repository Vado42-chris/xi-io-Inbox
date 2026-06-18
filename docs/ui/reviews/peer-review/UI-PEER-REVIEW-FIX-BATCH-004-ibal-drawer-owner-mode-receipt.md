# UI-PEER-REVIEW-FIX-BATCH-004 — Ibal drawer owner-mode dedupe receipt

## Date

2026-06-18

## Branch

`ui-002/framework-derived-static-preview`

## Classification source

- `docs/ui/reviews/peer-review/UI-PEER-REVIEW-REMAINING-WORKSPACES-CLASSIFICATION-2026-06-18.md`
- `docs/ui/reviews/peer-review/UI-PEER-REVIEW-008-ibal-drawer.md`

## Implementation commits

| Commit | Scope |
| --- | --- |
| `5167fb377778653853e0718111babb1462854dae` | `public/ibal-owner-mode.js`, `public/ibal-owner-mode.css`, `public/index.html`, receipt, governance |

## Purpose

Reduce Ibal drawer AI/scaffold noise for owners: one prompt path, deduped proposal display, owner-safe mail context copy, and no redundant Ask Ibal affordances while the drawer is open.

## Implemented owner-mode changes

| Area | Result |
| --- | --- |
| Prompt path | Concierge prompt styled as primary input surface at top of drawer |
| Selected proposal dedupe | Hides duplicate selected proposal when the same card already appears in chat |
| Mail context copy | Engineer mail-context string replaced with owner-safe preview copy |
| Proposal cards | Hides criteria/meta grids in owner drawer (title + recommendation + save remain) |
| Redundant Ask Ibal | Hides `[data-ibal-action="toggle-open"]` while drawer is open; topbar toggle remains |
| Scaffold noise | Local receipts + clear control moved behind Advanced in drawer |
| Runtime/provider safety | No Gmail provider calls, no send/draft/provider mutation, no runtime bridge changes |

## Implementation strategy

Post-render overlay (same pattern as FIX-BATCH-003 Home):

- `public/ibal-owner-mode.js` observes rendered Ibal concierge DOM
- Patches `#ibalConciergeDrawer` only, idempotent via `data-owner-ibal-patched`
- Disabled when `state.settings.userPrefs.showWorkflowScaffold === true`

## Owner retest checklist

At `npm run dev` → `http://localhost:4488`:

1. Open Ibal from topbar **Ask Ibal**.
2. Confirm prompt/input is the primary surface at the top of the drawer.
3. Confirm mail context line is owner-readable (not engineer fixture copy).
4. Ask Ibal or use an existing proposal — confirm chat does not duplicate the same proposal card in **Selected proposal**.
5. Confirm reading-pane / inspector **Ask Ibal** buttons hide while drawer is open.
6. Confirm receipts and clear control are under **Advanced** in the drawer.
7. Toggle scaffold (`showWorkflowScaffold = true`) — full drawer scaffold should return.

## Validation

| Command | Result |
| --- | --- |
| `npm run check:quick` | pass |

## Stop lines unchanged

- UI-003E PASS is not claimed.
- PR #12 remains draft.
- MERGE-PREP-001 remains blocked.
- Framework export promotion remains blocked.
- Provider send, draft write, delete, label/archive, and live provider mutation remain blocked.

## Decision value

```text
UI_PEER_REVIEW_FIX_BATCH_004_PASS_READY_FOR_OWNER_IBAL_REVIEW
```
