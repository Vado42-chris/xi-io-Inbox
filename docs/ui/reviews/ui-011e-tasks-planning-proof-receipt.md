# UI-011E Tasks Planning Proof Receipt

## Date

2026-06-11

## Branch

`ui-002/framework-derived-static-preview`

## Commit SHA

`PENDING_COMMIT`

## Scope

Tasks / Epics / Stories / Bugs / Backlog proof per `docs/product/ui-011a-product-capability-gap-matrix.md` (CAP-TASK-001–012).

## Excluded scope

- UI-011F+ slices
- UI-012 visual polish implementation
- Owner UI-003E visual proof
- External issue tracker mutation
- Cloud evidence upload
- Provider task sync

## Source matrix references

- CAP-TASK-001 Project — project selector + fixture seed
- CAP-TASK-002 Epic — epic list panel
- CAP-TASK-003 User story — story list + detail
- CAP-TASK-004 Bug — create bug from story form
- CAP-TASK-005 Requirement — requirement field on stories/bugs
- CAP-TASK-006 Acceptance criteria — AC list with pass/fail/blocked/pending
- CAP-TASK-007 Backlog — kanban Backlog column + story statuses
- CAP-TASK-008 Sprint/waterfall phase — phase on project/story
- CAP-TASK-009 Status/priority — labeled status controls
- CAP-TASK-010 Source links — mail/draft/calendar open actions
- CAP-TASK-011 Evidence — artifact placeholder + storage blocked
- CAP-TASK-012 Kanban board — board view with stories + tasks

## Files changed

- `public/inbox-preview.js` — schema v7, planning namespaces, planning workspace, bugs, evidence
- `public/inbox-preview.css` — planning grid, AC, evidence, provider banner styles
- `docs/ui/reviews/ui-011e-tasks-planning-proof-receipt.md`
- `TODO.md`

## Product UI code changed

**yes**

## Project/backlog result

Project selector with seeded `xi-io Inbox preview`; Planning/Board toggle; kanban columns Backlog → Done with fixture + local tasks + stories.

## Epic result

Epic panel lists mail workflow + planning spine epics with status/priority; selection filters stories.

## User story result

Story list under epic; detail shows requirement, phase, priority, status controls, source links.

## Bug creation result

Create bug from story sheet with requirement/AC refs, observed/expected/actual, severity/priority; external tracker blocked.

## Requirements result

Requirement text on stories and bugs (`REQ-INBOX-001`, etc.).

## Acceptance criteria result

AC list with textual state labels; pass/fail/blocked/pending toggle buttons per criterion.

## Status update result

Story/bug/task status buttons for backlog, ready, active, blocked, review, done-preview with receipts.

## Evidence/artifact result

Evidence panel with local placeholder, storage blocked banner, add artifact action, export packet placeholder.

## Source email/draft/calendar linkage result

Story detail opens mail thread, draft, calendar proposal; kanban cards show source links.

## Activity/receipt linkage result

Task receipts on status/bug/evidence actions; expected receipts listed; Open Activity navigates to receipts lane.

## Storage result

Canonical key `xiioInbox.preview.state` only. Schema **v7** adds `projects`, `planning`, `bugs`, `evidence` namespaces. v6→v7 migrates legacy task statuses.

## schemaVersion

**7**

## localStorage keys used

- `xiioInbox.preview.state` (canonical envelope only)

## UI-011B regression result

Mail baseline preserved. `npm run check` pass.

## UI-011C regression result

Drafts + Approval Queue preserved.

## UI-011D regression result

Calendar grid + proposals preserved.

## Accessibility result

Epic/story/bug buttons keyboard reachable; aria-pressed on selection; status/AC labels in text; provider/tracker blocked explained.

## Keyboard/focus result

Planning rows and kanban cards are buttons with focus-visible styles.

## Safety/egress result

No credentials, OAuth, secrets, or private bodies stored. External tracker and cloud upload blocked.

## Provider/runtime/platform result

No provider connect or platform claims. Tier 1 preview only.

## Route smoke result

| Check | Result |
| --- | --- |
| Default app load | 200 |
| Tasks planning JS markers | pass |
| Fixture JSON fetch | 200 same-origin |
| External network requests | **0** |
| Preview server stopped after smoke | yes |

## Same-origin fixture fetch result

`public/data/inbox-events.preview.json` at `127.0.0.1:4488` — pass.

## Remaining blockers

- CAP-TASK-013 full Activity drill-down deferred to UI-011H
- Real provider/external tracker sync blocked by gates
- Owner UI-003E blocked until UI-011I + UI-012F

## Next recommended pass

**UI-011F** — Automations visual builder + reusable action library

## Decision value

```text
UI_011E_PASS_TASKS_PLANNING_READY_FOR_AUTOMATIONS_BUILDER
```
