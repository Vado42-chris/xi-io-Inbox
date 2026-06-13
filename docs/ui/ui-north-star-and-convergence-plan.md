# UI North Star and Convergence Plan

## Status

```text
Type: operationally ratified convergence plan.
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
- Older plans still describe lane-first Ibal and pre-NAV-001 shell assumptions.

## Canonical product model

The ratified model is:

```text
Received message = input.
Draft = work artifact.
Send = event boundary.
Receipt = audit artifact.
Calendar, Tasks, Automations, Files, Projects, Extensions = capabilities.
Ibal = concierge and command entry, not a lane.
```

Human operation comes first. AI proposes, explains, drafts, cites evidence, and identifies
blockers. AI does not send, delete, forward, archive, disclose, publish, deploy, connect
providers, or execute automations by default.

## Canonical information architecture

```text
Persistent top bar:
  identity, workspace/account, provider/privacy status, command entry, Ibal button

Primary spine:
  Home, Mail Workbench

Mail Workbench:
  Inbox -> Drafts -> Approvals -> Sent / Receipts

Capabilities:
  Calendar, Tasks, Automations, Extensions, Settings / Provider Gates

Ibal:
  concierge drawer and command entry only
```

## Remove or fold

| Remove as top-level destination | Fold into |
| --- | --- |
| `Plan` lane | Tasks and draft-linked planning views |
| `Epics`, `Stories`, `Bugs` | Tasks as types/views, or provider-backed issue integration later |
| `Evidence` | contextual inspector/details panel |
| duplicate `Activity` surfaces | Receipts/audit ledger |
| `Ibal` lane / `#/ibal` route | Ibal drawer and command entry |
| Home bottom tabs | single capability navigation |

## Modular target

```text
public/src/
  design/        tokens and reusable components
  shell/         app frame, top bar, primary nav, router, right inspector
  store/         state envelope and migrations
  workbench/     inbox, drafts, approvals, sent, receipts
  capabilities/  calendar, tasks, automations, extensions, settings
  ibal/          concierge drawer and command-entry integration
  lib/           view-model adapters and formatting
fixtures/        preview data with no secrets or private bodies
```

Migration must be strangler-style: each pass removes behavior from `public/inbox-preview.js`
or prepares a module boundary. No big-bang rewrite.

Irreversible route/lane deletion still requires a focused migration receipt and passing
route smoke. Ratification unlocks module skeleton and route-table contract work; it does
not authorize unreviewed removal of working UI.

## Near-term sequence

1. Complete Gmail adapter hardening and dependency audit.
2. Prepare owner UI-003E visual proof support.
3. Create module skeleton and route-table contract.
4. Extract route/nav helpers from `public/inbox-preview.js` as the first strangler slice.
5. Re-run owner UI-003E after any visual changes.
6. Backfeed reusable framework candidates to `xi-io.net#239` after convergence proof.

## Decision value

`UI_NORTH_STAR_DRAFT_CENTERED_HUMAN_FIRST_ONE_NAV_MODULAR_STRANGLER_RATIFIED`

