# UI-003 Unified App Shell Architecture

## Purpose

Define the replacement UI architecture required before PR #12 can pass owner/framework UX review.

## Status

```text
UI-002 technical render smoke proof: passed
UI-002 owner/framework UX review: failed on 2026-06-09
UI-003 tracker: xi-io-Inbox#14
Direct framework export blocker: xi-io.net#239
Implementation status: UI-003D redesigned shell readiness triage complete
Current reading status: historical/reference only after UI-005, UI-007, NAV-001, and
2026-06-13 app peer review. Current direction is
docs/ui/ui-north-star-and-convergence-plan.md.
```

## Supersession notice

This document records the UI-003 lane-shell era. Its lane-first navigation and Ibal lane
model are superseded by:

- `docs/ui/ui-005-ibal-concierge-model.md` for Ibal as concierge, not a lane.
- `docs/ui/ui-007-draft-workbench-architecture.md` for the draft-centered spine.
- `docs/product/nav-001-app-shell-navigation-correction.md` for the NAV-001 shell.
- `docs/ui/ui-north-star-and-convergence-plan.md` for current convergence planning.

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
5. Add lane-oriented preview fixture data. Status: UI-003B first-pass lane detail fixtures complete.
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

## UI-003B Implementation Note

UI-003B adds first-pass lane detail fixtures and lane-specific rendering without adding runtime behavior.

Implemented surfaces:

- Home: priority stack, provider gate summary, draft/egress status, urgent inbox previews, upcoming calendar previews, open task previews, receipt previews, and Ibal next safe action proposal,
- Inbox: account/provider summary, smart views, thread list, selected thread preview, draft proposal, evidence reference, and blocked send/forward/delete/archive/disclose/publish/provider/repo gates,
- Calendar: agenda preview, pending event proposals, conflict placeholder, reminder/source links, and event receipt placeholder,
- Tasks: task status board, due/source metadata, linked inbox/calendar/receipt references, and next safe action proposal,
- Automations: templates, trigger condition previews, approval gates, dry-run flow, disabled execution state, and receipt requirements,
- Extensions: email/calendar/task/GitHub/source/local-server/framework-export gates, permission summaries, and secret boundary summary,
- Receipts: ledger-style audit lane for proof receipts, proposals, drafts, provider gate changes, runtime evidence placeholder, and blocked events,
- Ibal: priority stack, suggested next safe actions, unresolved items, blockers, cross-lane synthesis, what changed summary, and proposed actions only,
- Settings / Provider Gates: account connection state, provider permissions, AI routing, local/cloud boundary, draft-only egress policy, receipt settings, and disabled dangerous actions.

Validation recorded during UI-003B:

```text
npm run check: pass
hash route smoke: pass
invalid hash normalization: #/home
fixture lane count: 9
each lane has lane-specific sections: yes
each lane has lane-specific inspector copy: yes
minimum sections per lane during route smoke: 2
disabled egress controls per route: 8 minimum
external requests during route smoke: 0
provider connection: absent
runtime action execution: absent
```

Not implemented in UI-003B:

- UI-003C Inbox lane refinement,
- final lane-detail product polish,
- provider connection,
- local cloud/home server behavior,
- provider credentials,
- automation execution,
- Pass 4 runtime skeleton,
- redesigned owner/framework visual proof.

Next slice:

```text
UI-003C: Inbox lane only.
```

## UI-003C Implementation Note

UI-003C refines only the Inbox lane so it behaves more like email/message triage without adding provider integration.

Implemented surfaces:

- selectable static thread list with three preview threads,
- account and smart-view mailbox panel,
- selected-thread context panel,
- sanitized message summary timeline,
- evidence reference and blocked attachment tray,
- per-thread draft/proposal content,
- lane-aware right inspector that follows selected thread,
- disabled egress controls and blocked provider/repository mutation gates.

Validation recorded during UI-003C:

```text
npm run check: pass
Inbox route smoke: pass
Inbox thread count: 3
Inbox lane sections: 5
selected-thread inspector updates: pass
disabled egress controls in Inbox: 16
search/command placeholder disabled: yes
external requests during Inbox smoke: 0
provider connection: absent
runtime action execution: absent
```

Not implemented in UI-003C:

- real provider connection,
- real message bodies,
- provider credentials,
- runtime send, forward, delete, archive, disclose, publish, deploy, provider mutation, or repository mutation,
- automation execution,
- local cloud/home server behavior,
- Pass 4 runtime skeleton,
- redesigned owner/framework visual proof.

Next slice:

```text
UI-003D: redesigned shell review and visual-proof readiness triage.
```

## UI-003D Readiness Triage

UI-003D reviews the redesigned shell for readiness to enter owner/framework visual proof. It does not mark visual proof complete.

Readiness findings:

- redesigned shell is ready for owner/framework visual review,
- old rail / stream / context-only preview should not be revived,
- PR #12 must remain draft until owner/framework visual proof passes,
- direct framework export/package reuse remains blocked by `xi-io.net#239`,
- platform/runtime work remains blocked by `ARCH-004`,
- focus preservation was fixed for Inbox thread selection after keyboard smoke found focus loss on re-render.

Validation recorded during UI-003D:

```text
npm run check: pass
desktop/mobile route readiness smoke: pass
routes checked: 18
desktop viewport: 1440x950
mobile viewport: 390x844
navigation count per route: 9
active navigation item per route: 1
minimum sections per route: 2
right inspector visible per route: yes
minimum disabled egress controls per route: 8
Inbox disabled controls: 16
horizontal overflow: none detected
external requests during readiness smoke: 0
Inbox keyboard selection with Enter/Space: pass
Inbox focus preservation after selection: pass
```

Framework freshness note for `xi-io.net#239`:

- candidate reusable primitives observed: app top bar, lane navigation, safety banner, route-aware lane surface, right inspector, disabled egress action list, status pills, and focus-preserving selectable list behavior,
- direct import remains blocked; continue adapted-copy path until stable framework exports exist.

Next slice:

```text
UI-003E: owner/framework visual proof recording and merge-readiness decision.
```

## Post-UI-003D Owner Visual Review

Owner screenshot review on 2026-06-10 found that the shell is structurally useful but not visually competitive.

Result:

```text
UI-003D readiness smoke: pass
Owner visual polish review: fail
UI-003E visual proof recording: blocked
UI-004 polish planning: required
```

UI-004A corrects the initial partial polish planning docs into a numbered design-director packet. UI-004A is documentation/planning only; it does not implement visual polish.

Required UI-004A planning docs:

- `docs/ui/polish/00-xi-io-visual-product-standard.md`
- `docs/ui/polish/01-home-polish-plan.md`
- `docs/ui/polish/02-inbox-polish-plan.md`
- `docs/ui/polish/03-calendar-polish-plan.md`
- `docs/ui/polish/04-tasks-polish-plan.md`
- `docs/ui/polish/05-automations-polish-plan.md`
- `docs/ui/polish/06-extensions-polish-plan.md`
- `docs/ui/polish/07-receipts-polish-plan.md`
- `docs/ui/polish/08-ibal-polish-plan.md`
- `docs/ui/polish/09-settings-provider-gates-polish-plan.md`
- `docs/ui/polish/10-component-pattern-inventory.md`
- `docs/ui/polish/11-interaction-standard.md`
- `docs/ui/polish/12-visual-qa-rubric.md`

UI-004A.5 adds the missing process layer required before implementation:

- `docs/ui/polish/13-page-leveling-and-wargame-standard.md`
- `docs/ui/polish/14-ui-wargame-scenario-matrix.md`
- `docs/ui/polish/15-framework-engine-hook-plan.md`
- `docs/ui/polish/16-white-label-framework-feedback-plan.md`

UI-004A.5 confirms that the UI-004A packet was necessary but not sufficient. It defines page maturity levels, simulated wargame scenarios, framework hook candidates, and white-label feedback candidates for `xi-io.net#239`.

Next slice:

```text
UI-004A.6: simulated wargame review against the current shell before UI-004B implementation.
```

## Decision value

`UI_003_UNIFIED_APP_SHELL_ARCHITECTURE_REQUIRED_BEFORE_UI_002_CAN_PASS`
