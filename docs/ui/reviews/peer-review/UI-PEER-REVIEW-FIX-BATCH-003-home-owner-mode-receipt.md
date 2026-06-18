# UI-PEER-REVIEW-FIX-BATCH-003 — Home owner-mode cleanup receipt

## Date

2026-06-18

## Branch

`ui-002/framework-derived-static-preview`

## Classification source

`docs/ui/reviews/peer-review/UI-PEER-REVIEW-REMAINING-WORKSPACES-CLASSIFICATION-2026-06-18.md`

## Implementation commits

| Commit | Scope |
| --- | --- |
| `99be181` | Add `public/home-owner-mode.js` owner-mode Home overlay |
| `d5c9b25` | Add `public/home-owner-mode.css` overlay styles |
| `11cfc54` | Load Home owner-mode CSS and JS from `public/index.html` |

## Purpose

Remove the worst Home P0 owner-trust issue without touching provider/runtime logic: Home should not present fixture mail as a real urgent priority, and should not force developer/build explanation into the primary owner path.

## Implemented owner-mode changes

| Area | Result |
| --- | --- |
| Fixture attention card | Replaced with neutral `What to do next` owner card. It points to Mail/Account retest instead of promoting the first fixture thread as real urgency. |
| Status / counts | Added one owner status card that explicitly says Home is using local preview data. Counts are shown as preview context, not live priority ranking. |
| Quick actions | Replaced scaffold quick links with owner actions: Mail, Account settings, Tasks, Calendar. |
| Advanced copy | Renamed `How this build works (advanced)` to `Advanced preview details`. |
| Runtime/provider safety | No Gmail provider calls, no send/draft/provider mutation, no runtime bridge changes. |

## Implementation strategy

The main `public/inbox-preview.js` file is large. To keep the cloud change small and reviewable, FIX-BATCH-003 uses a post-render owner-mode overlay:

- `public/home-owner-mode.js` observes rendered Home workspace DOM.
- The overlay only patches `.home-workspace`.
- The patch is idempotent via `data-owner-home-patched`.
- Scaffold recovery remains tied to existing main-preview behavior; no runtime/provider path is altered.

## Owner retest checklist

At `npm run dev` → `http://localhost:4488`:

1. Open Home.
2. Confirm Home no longer promotes the first mail thread as a real urgent priority.
3. Confirm one owner status card explains local preview data.
4. Confirm Mail / Account settings / Tasks / Calendar owner actions are visible.
5. Confirm advanced build copy is behind `Advanced preview details`.
6. Cross-check Mail and Account still render normally.

## Validation

Not run by this agent. GitHub Actions should run because `public/index.html`, `public/home-owner-mode.js`, and `public/home-owner-mode.css` changed.

## Stop lines unchanged

- UI-003E PASS is not claimed.
- PR #12 remains draft.
- MERGE-PREP-001 remains blocked.
- Framework export promotion remains blocked.
- Provider send, draft write, delete, label/archive, and live provider mutation remain blocked.

## Decision value

```text
UI_PEER_REVIEW_FIX_BATCH_003_PASS_READY_FOR_OWNER_HOME_REVIEW
```
