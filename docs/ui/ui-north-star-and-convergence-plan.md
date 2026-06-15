# UI North Star and Convergence Plan

## Status

```text
Type: amended operational convergence plan.
Review source: docs/ui/reviews/app-peer-review-plan-alignment-2026-06-13.md.
Ratification receipt: docs/ui/reviews/ui-north-star-ratification-2026-06-13.md.
Supersedes as current direction when documents conflict:
  docs/ui/ui-003-unified-app-shell-architecture.md
  docs/ui/ui-005-human-operable-shell-architecture.md
  docs/ui/ui-007-draft-workbench-architecture.md
Companion: docs/operations/multi-agent-orchestration.md
```

## Verified diagnosis

- The product branch contains a static preview and Gmail adapter; `main` does not.
- `public/inbox-preview.js` carries app shell, state, migrations, renderers, event handlers,
  Gmail snapshot import, and route handling in one file.
- `public/inbox-preview.css` carries global tokens and page-specific layout rules in one file.
- Top product nav, hash lanes, and contextual left-rail state are not derived from one route
  table.
- Mail, Drafts, and Approvals share `#/inbox`; those workspaces are not independently
  deep-linkable.
- NAV-001 corrected shell clutter but over-collapsed Calendar and Tasks under `Plan`.
- Calendar and Tasks do not yet have the same global/per-account scope lens as Mail.
- Older plans still describe lane-first Ibal and pre-NAV-001 shell assumptions.

## Canonical product model

The amended model is Option B: mail workbench spine plus primary capability destinations.

```text
Received message = input.
Draft = work artifact.
Send = event boundary.
Receipt = audit artifact.
Calendar, Tasks, Automations, Activity/Receipts, Integrations = primary capability destinations.
Files, Projects, Epics, Stories, Bugs = contextual views or object types within capabilities.
Ibal = concierge and command entry, not a lane.
```

Human operation comes first. AI proposes, explains, drafts, cites evidence, and identifies
blockers. AI does not send, delete, forward, archive, disclose, publish, deploy, connect
providers, or execute automations by default.

## Canonical information architecture

```text
Persistent top bar:
  identity, workspace/account, provider/privacy status, command entry, Ibal button

Primary product nav:
  Home, Mail, Calendar, Tasks, Automations, Activity, Integrations

Mail Workbench inner flow:
  Inbox -> Drafts -> Approvals -> Sent / Receipts

Shared scope lens:
  All accounts -> account -> project/workspace, reused by Mail, Calendar, Tasks, Activity

Ibal:
  concierge drawer and command entry only
```

Settings remains an account/system utility, not level-1 product navigation.

## Remove or fold without demoting primary destinations

| Remove as top-level destination | Fold into |
| --- | --- |
| `Plan` lane | Tasks and draft-linked planning views |
| `Epics`, `Stories`, `Bugs` | Tasks as types/views, or provider-backed issue integration later |
| `Evidence` | contextual inspector/details panel |
| duplicate `Activity` surfaces | one Activity / Receipts ledger |
| `Ibal` lane / `#/ibal` route | Ibal drawer and command entry |
| Home bottom tabs | primary nav + Home overview cards |

Do not demote Calendar or Tasks into `Plan`. Calendar and Tasks are primary user
destinations for a multi-account operations app.

## Shared account scope model

Mail, Calendar, Tasks, and Activity must share one scope lens:

```text
Scope: All accounts | <account>
```

Account-level views are filtered projections of the same objects, not duplicate stores or
duplicate routes. Calendar proposals and work items need stable account fields:

```text
id, accountId, workspaceId, sourceRef, sourceType, status, title
```

Initial routes should support:

```text
#/calendar
#/calendar?account=<accountId>
#/tasks
#/tasks?account=<accountId>
```

`accountLabel` strings are display copy only; selectors should key off `accountId`.

## Modular target

```text
public/src/
  design/        tokens and reusable components
  shell/         app frame, top bar, primary nav, router, right inspector
  store/         state envelope and migrations
  workbench/     mail workbench internals: inbox, drafts, approvals, sent
  capabilities/  calendar, tasks, automations, activity, integrations
  ibal/          concierge drawer and command-entry integration
  lib/           view-model adapters and formatting
fixtures/        preview data with no secrets or private bodies
```

Migration must be strangler-style: each pass removes behavior from `public/inbox-preview.js`
or prepares a module boundary. No big-bang rewrite.

Irreversible route/lane deletion still requires a focused migration receipt and passing
route smoke. This amendment unlocks NAV-002 route-table and scope-lens work; it does not
authorize unreviewed removal of working UI.

## Near-term sequence

1. Complete Gmail adapter hardening and dependency audit.
2. Run NAV-002: restore Home/Calendar/Tasks as primary nav destinations and create one
   route-table contract.
3. Add shared account scope lens contract for Mail, Calendar, Tasks, and Activity.
4. Prepare owner UI-003E visual proof support on the corrected IA.
5. Extract route/nav helpers from `public/inbox-preview.js` as the first strangler slice.
6. Backfeed reusable framework candidates to `xi-io.net#239` after convergence proof.

## Decision value

`UI_NORTH_STAR_OPTION_B_MAIL_SPINE_WITH_PRIMARY_CALENDAR_TASKS_SCOPE_LENS`

