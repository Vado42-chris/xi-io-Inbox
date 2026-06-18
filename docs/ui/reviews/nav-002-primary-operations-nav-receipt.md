# NAV-002 Primary Operations Navigation Receipt

## Date

2026-06-13

## Branch

`cursor/gmail-harden-5e1b`

## Scope

Restore the primary operations IA after discovery showed Calendar, Tasks, and Home were
demoted by shell cleanup.

## Implemented

- Primary nav is now `Home | Mail | Calendar | Tasks | Automations | Activity | Integrations`.
- `Plan`, `Drafts`, and `Approvals` are no longer top-level product nav items.
- Mail contextual rail keeps Mail accounts, Drafts, and Approvals as sub-views.
- Calendar has its own contextual rail.
- Tasks has its own contextual rail for Planning, Board, Epics, Stories, Bugs, and Evidence.
- Route smoke now fails if Home/Mail/Calendar/Tasks/Automations/Activity/Integrations are
  missing from primary nav, if `Plan` returns as a primary nav item, or if the primary nav
  wraps into multiple rows.
- Topbar spacing was tightened so `Integrations` remains visible on the same primary nav row
  at the desktop walkthrough viewport.

## Not implemented in this slice

- SCOPE-001 shared account scope lens UI and selectors.
- `accountId` migration for calendar proposals and work items.
- Provider-connected calendar/task sync.
- GitHub management surface.

Those remain separate slices so NAV-002 does not claim capability proof it did not build.

## Self peer review

| Question | Answer |
| --- | --- |
| Best path? | Yes. This restores the owner/product IA without rewriting lane internals. |
| Correct fix vs different approach? | Correct bounded slice: nav and routing first, scope/data model next. |
| Truncation? | No. Calendar, Tasks, Home, and Plan dissolution are documented and tested. |
| Hallucination? | No provider or account-scope capability is claimed; incomplete work is explicit. |
| Duplicated work? | Reduced top-level duplication by keeping Drafts/Approvals inside Mail and Plan concepts inside Tasks. |
| Silent failure? | Route smoke now encodes the primary nav contract so this regression cannot pass unnoticed. |

## Validation

```text
git diff --check
npm run check:quick
npm run check
```

## Walkthrough evidence

`/opt/cursor/artifacts/nav_002_final_primary_nav_walkthrough.mp4`

## Decision value

`NAV_002_PRIMARY_OPERATIONS_NAV_RESTORED_SCOPE_LENS_NEXT`

