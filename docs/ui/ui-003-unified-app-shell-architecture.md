# UI-003 Unified App Shell Architecture

## Purpose

Define the replacement UI architecture required before PR #12 can pass owner/framework UX review.

## Status

```text
UI-002 technical render smoke proof: passed
UI-002 owner/framework UX review: failed on 2026-06-09
UI-003 tracker: xi-io-Inbox#14
Direct framework export blocker: xi-io.net#239
Implementation status: UI-003A shell skeleton implemented
```

## Decision

The current PR #12 preview must not be polished in place as a single rail / stream / context page.

The replacement preview must express `xi-io Inbox` as a unified xi-io operations application with explicit lanes for Inbox, Calendar, Tasks, Automations, Extensions, Receipts, Ibal, and Provider Gates.

## Framework source inspection

Inspected framework sources:

```text
Vado42-chris/xi-io.net/public/workbench-event-components.js
Vado42-chris/xi-io.net/public/workbench-event-runtime.js
Vado42-chris/xi-io.net/public/github-management-components.js
Vado42-chris/xi-io.net/docs/framework/workbench-ui-consumer-contract-v1.md
Vado42-chris/xi-io.net/docs/framework/platform-runtime-envelope-contract-v1.md
```

Relevant framework patterns already present:

- project or account lens,
- stream views,
- quick filters,
- event cards,
- event chains,
- lifecycle and status pills,
- evidence,
- claims checked,
- closure criteria,
- preview-safe actions,
- downstream agent notes,
- warning banners,
- no-silent-green gates,
- next safe action,
- preferences and invariants.

These patterns are useful inside product lanes. They are not sufficient as the whole product shell.

## Framework constraints

- The Workbench UI consumer contract allows adapted copy only when no stable direct import/export path exists.
- Adapted copies require source notes, validation, and freshness reporting.
- Browser/visual proof is separate from static validation.
- The platform/runtime envelope contract says a preview surface is not a platform decision.
- Multi-surface shared core remains the provisional planning model.
- `xi-io.net#239` blocks direct framework UI reuse until stable Workbench export/package work is decided.

## Global app frame

The replacement static preview should use:

```text
Top bar:
  product identity
  active workspace/account
  provider status
  privacy mode
  Ibal status
  search / command

Left navigation:
  Home
  Inbox
  Calendar
  Tasks
  Automations
  Extensions
  Receipts
  Ibal
  Settings / Provider Gates

Main surface:
  selected lane

Right inspector:
  selected item context
  evidence
  draft/egress state
  Ibal proposal
  receipts
```

The existing rail / stream / context pattern becomes a lane-level pattern, not the whole application.

## Route model

The preview may remain static browser code, but it should behave like an application with distinct routes:

```text
#/home
#/inbox
#/calendar
#/tasks
#/automations
#/extensions
#/receipts
#/ibal
#/settings
```

## Lane requirements

### Home

Purpose: cross-lane operational overview.

Required surfaces:

- current priority stack,
- provider gate summary,
- draft/egress status,
- urgent inbox items,
- upcoming calendar items,
- open tasks,
- recent receipts,
- Ibal next safe action.

### Inbox

Purpose: email/message triage.

Required surfaces:

- accounts and providers,
- folders or smart views,
- message/thread list,
- selected thread,
- draft panel,
- attachments/evidence,
- labels/tags,
- blocked send/forward/delete gates.

### Calendar

Purpose: scheduling and time awareness.

Required surfaces:

- agenda or day/week/month preview,
- pending calendar proposals,
- conflicts,
- reminders,
- event receipts,
- source links from inbox/tasks.

### Tasks

Purpose: track work created or influenced by ingress.

Required surfaces:

- task list,
- status lanes,
- due dates,
- source references,
- linked inbox threads,
- linked calendar events,
- next safe action.

### Automations

Purpose: create safe rules and workflows without bypassing egress gates.

Required surfaces:

- automation templates,
- trigger conditions,
- approval gates,
- dry-run preview,
- receipts,
- disabled/active status.

### Extensions

Purpose: providers, integrations, and add-ons.

Required surfaces:

- email provider status,
- calendar provider status,
- task provider status,
- GitHub/source integration status,
- local cloud/home server status,
- permissions,
- secret boundary.

### Receipts

Purpose: audit trail.

Required surfaces:

- confirmed actions,
- proposals,
- drafts,
- provider gate changes,
- local proof receipts,
- runtime evidence,
- blocked events.

### Ibal

Purpose: conductor/orchestrator.

Required surfaces:

- current priority stack,
- suggested next safe actions,
- unresolved items,
- blockers,
- cross-lane synthesis,
- what changed summaries,
- proposed actions only.

Ibal must be first-class as a lane and contextual in the right inspector. It must not be hidden as a decorative sidebar.

### Settings / Provider Gates

Purpose: account, provider, privacy, and permission control.

Required surfaces:

- account connection state,
- provider permission state,
- AI provider routing state,
- local/cloud data boundary,
- draft-only egress policy,
- receipts/audit settings,
- disabled dangerous actions.

## View model targets

The redesigned preview data should separate these fixture groups:

```text
workspace
accounts[]
providers[]
lanes[]
inboxThreads[]
calendarItems[]
tasks[]
automationProposals[]
extensions[]
receipts[]
ibalQueue[]
providerGates[]
egressPolicy
inspectorSelection
```

## Safety requirements

- Preview data only.
- No provider connection.
- No provider credentials.
- No send/forward/delete runtime action.
- No external disclosure.
- No local cloud/home server claim.
- No final platform/runtime claim.
- Draft-only egress remains visible and enforced in UI state.

## Acceptance test

The redesigned proof must answer yes to:

- Does it feel like a xi-io application?
- Is Inbox clearly email/message triage?
- Is Calendar clearly schedulable?
- Are Tasks trackable?
- Can the user understand Automations?
- Are Extensions and provider gates obvious?
- Is Ibal visible as conductor/orchestrator?
- Are Receipts/Audit first-class?
- Are dangerous egress actions blocked?
- Is platform/runtime still undecided?

## Implementation sequence

1. Keep PR #12 draft.
2. Update PR #12 body so it cannot look green.
3. Replace the current preview shell with a unified app shell. Status: UI-003A complete.
4. Reuse existing validation scripts and no-provider safety checks.
5. Add lane-oriented preview fixture data. Status: UI-003A skeleton fixtures complete.
6. Run static validation.
7. Run browser/visual proof.
8. Record owner/framework UX review result.
9. Report any reusable UI findings back to `xi-io.net#239`.

## UI-003A Implementation Note

UI-003A replaces the failed single-page preview shell with a static unified app shell skeleton only.

Implemented surfaces:

- top bar with product identity, workspace/account, provider status, privacy mode, Ibal status, and disabled search/command placeholder,
- left lane navigation for Home, Inbox, Calendar, Tasks, Automations, Extensions, Receipts, Ibal, and Settings / Provider Gates,
- hash routes from `#/home` through `#/settings`,
- route-aware main lane placeholder,
- persistent right inspector for context, evidence, draft/egress state, Ibal proposal, receipts, and blocked egress actions,
- safety banner for preview-only data, no provider connection, no dangerous egress, undecided platform/runtime, and `xi-io.net#239`.

Validation recorded during UI-003A:

```text
npm run check: pass
hash route smoke: pass
default route: #/home
lanes visible: 9
right inspector visible: yes
disabled egress controls: 8
external requests during route smoke: 0
```

Not implemented in UI-003A:

- final lane detail UI,
- provider connection,
- local cloud/home server behavior,
- provider credentials,
- automation execution,
- Pass 4 runtime skeleton,
- redesigned owner/framework visual proof.

Next slice:

```text
UI-003B: lane detail fixtures and first-pass lane content density.
```

## Decision value

`UI_003_UNIFIED_APP_SHELL_ARCHITECTURE_REQUIRED_BEFORE_UI_002_CAN_PASS`
