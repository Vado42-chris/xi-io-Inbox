# UI-005 Ibal Concierge Model

## Purpose

Correct the Ibal product model before UI-005B+ implementation.

Ibal is the xi-io **conductor/concierge**, not a primary lane page and not a decorative chatbot widget.

## Problem With Current Ibal Lane Model

UI-003 and UI-004 implemented Ibal as:

- a first-class hash route (`#/ibal`),
- a full lane page with recommendation cards,
- contextual inspector proposals duplicated from lane content.

Owner preliminary review (2026-06-10) found this wrong:

> Ibal is a button/control that spawns an AI chat concierge to help manage inbox and cross-lane work.

Conflict with prior architecture doc (`docs/ui/ui-003-unified-app-shell-architecture.md`):

> Ibal must be first-class as a lane and contextual in the right inspector.

**UI-005 supersedes the lane model.** Ibal remains first-class as **persistent product access**, not as a navigable lane page.

## New Ibal Model

### Concierge Entry

- Persistent control in top bar (and optionally command palette trigger).
- Opens Ibal concierge surface (drawer or panel in UI-005H).
- Available from any route; does not require lane navigation.

### Command/Search Integration

- Top bar command field becomes entry point for:
  - natural-language ask,
  - scoped command (e.g. "draft reply", "what is blocked"),
  - navigation assist (route suggestion only, no execution).
- Command submission opens or focuses Ibal concierge with parsed intent.

### Contextual Proposal Surface

- Ibal reads **current selection context** (lane, selected thread, task, event, gate).
- Proposals are scoped to selection, not generic dashboard cards.
- Each proposal includes: recommendation, why, evidence, blockers, source lanes, receipt expectation.

### Inspector Augmentation

- When Ibal is not open, inspector may show compact Ibal proposal snippet for selected object.
- Full concierge conversation lives in dedicated surface, not inspector filler.

### Cross-Lane Synthesis

- Ibal may reference multiple lanes (Inbox → Tasks → Calendar) in one proposal.
- Cross-lane links remain evidence-backed; no implied execution across lanes.

### Proposal-Only Action Model

Ibal may:

- propose,
- explain,
- cite evidence,
- identify blockers,
- suggest local draft/proposal text,
- recommend next safe human action.

Ibal may not:

- send, forward, delete, archive, disclose, publish, deploy,
- connect providers or store credentials,
- execute or enable automations,
- mutate repositories,
- claim model-provider routing or runtime AI execution.

## Navigation Impact

### Remove Ibal as Primary Lane (UI-005B+)

- Remove `Ibal` from left lane navigation.
- Remove or redirect `#/ibal` route to safe fallback (Home or last lane).
- Preserve Ibal recommendations in Home priority stack and inspector where contextual.

### Preserve Persistent Conductor Access

Ibal appears in:

| Surface | Role |
| --- | --- |
| Top bar | Concierge button + command entry integration |
| Concierge drawer/panel | Primary conversation and proposal review |
| Inspector | Compact contextual proposal for selected object |
| Safe-action surfaces | "Ask Ibal" affordance near blocked or draft actions |
| Home | Next safe action synthesis (not a separate lane visit) |

### Route Model After Correction

Supported lanes (UI-005B+):

```text
#/home
#/inbox
#/calendar
#/tasks
#/automations
#/extensions
#/receipts
#/settings
```

Ibal: **no primary lane route**; concierge access only.

## Interaction Model

```text
1. User asks (typed prompt or command entry)
2. Ibal proposes (recommendation + evidence + blockers)
3. UI shows evidence/source/blockers in concierge and inspector
4. User may accept proposal as local draft (UI-005B+ lanes)
5. Local draft/proposal persisted per Tier 1 contract
6. Receipt preview generated for proposal/draft/blocked path
7. No execution — runtime escalation shows gate reason
```

### User Asks

- Free-text or structured prompt in concierge surface.
- Fixture responses in Tier 1; no live model-provider claims.

### Ibal Proposes

- Structured proposal cards, not unstructured chat stream only.
- Each proposal is inspectable: why, evidence, blockers, safe next.

### Evidence / Source / Blockers

- Mandatory for every non-trivial proposal.
- Links to source lanes and fixture refs; no private message bodies.

### Local Draft / Proposal Creation

- User may convert proposal to local draft (e.g. reply draft, task proposal, calendar proposal).
- Draft remains local and explicitly unsent/uncommitted.

### No Execution

- All runtime actions remain disabled with gate explanation.
- Ibal never auto-applies proposals.

## Receipt Model

| Receipt type | When |
| --- | --- |
| Ibal proposal receipt | User receives or saves an Ibal proposal |
| Blocked action receipt | User attempts blocked runtime escalation |
| Local draft/proposal receipt | User creates or saves local draft from Ibal or lane |

Receipts are preview artifacts in Tier 1. They do not authorize execution.

## Framework Reusable Candidates

Promote to `xi-io.net` after Level 4/5 proof (`xi-io.net#239`):

| Candidate | Purpose |
| --- | --- |
| XiIbalConcierge | Persistent concierge entry + drawer/panel shell |
| XiCommandEntry | Top bar command/search with Ibal integration |
| XiContextProposal | Selection-scoped proposal with evidence/blockers |
| XiSafeNextAction | Compact safe-next affordance in inspector/Home |
| XiProposalReceipt | Local proposal/draft receipt preview |

These extend existing patterns (XiIbalRecommendation, XiContextInspector) rather than replacing framework doctrine.

## Required Updates (Completed in UI-005A)

- `docs/ui/polish/10-component-pattern-inventory.md` — new operability and Ibal concierge patterns.
- `docs/ui/polish/11-interaction-standard.md` — concierge open/close, proposal review, local draft flows.
- `docs/ui/polish/14-ui-wargame-scenario-matrix.md` — UI-005 Ibal and operability scenarios.

## Anti-Patterns (Forbidden)

- Ibal as chatbot widget with no evidence or blockers.
- Ibal as primary lane competing with Inbox/Tasks.
- Chat stream that implies send/execute.
- Hidden auto-actions from Ibal suggestions.
- Model-provider or runtime AI claims in Tier 1 preview.

## Decision

```text
UI_005A_IBAL_CONCIERGE_MODEL_SUPERSEDES_IBAL_LANE_MODEL
IBAL_PRIMARY_LANE_REMOVAL_REQUIRED_IN_UI_005B_PLUS
IBAL_CONCIERGE_IMPLEMENTATION_DEFERRED_TO_UI_005H
PROPOSAL_ONLY_EXECUTION_BLOCKED
```
