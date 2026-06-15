# UI-004A.6 Simulated Wargame Review

## Purpose

Run the current PR #12 static preview through the normalized PLAN-001A requirements, stories, gates, compliance IDs, and UI-004A.5 wargame scenarios before any UI-004B implementation work.

This is a simulated expert review. It is not owner visual proof, real user testing, WCAG conformance proof, runtime security proof, provider proof, or platform proof.

## Review Metadata

| Field | Value |
| --- | --- |
| Date | 2026-06-10 |
| Reviewer | Codex local agent |
| Branch | `ui-002/framework-derived-static-preview` |
| Baseline commit | `ba691f8` |
| PR | `#12` draft |
| Scope | review/docs only |
| Product UI code changed | no |
| Runtime/provider/platform behavior changed | no |

## Inputs

| ID | Source |
| --- | --- |
| EVIDENCE-GOV-001 | `docs/product/00-product-delivery-governance.md` |
| EVIDENCE-REQ-001 | `docs/product/01-product-requirements-register.md` |
| EVIDENCE-BACKLOG-001 | `docs/product/02-epic-story-backlog.md` |
| EVIDENCE-SLICE-001 | `docs/product/03-sprint-slice-plan.md` |
| EVIDENCE-GATE-001 | `docs/product/04-build-readiness-gates.md` |
| EVIDENCE-HYDRATE-001 | `docs/product/05-framework-hydration-checklist.md` |
| EVIDENCE-COMP-001 | `docs/product/06-compliance-validation-index.md` |
| EVIDENCE-UI-WG-001 | `docs/ui/polish/14-ui-wargame-scenario-matrix.md` |
| EVIDENCE-UI-QA-001 | `docs/ui/polish/12-visual-qa-rubric.md` |
| EVIDENCE-UI-SMOKE-001 | `docs/ui/ui-002-accessibility-egress-check.md` |

## Executive Decision

`UI-004A.6` is complete.

`UI-004B` may start next, but only for the shell/topbar/lane navigation/global safety treatment/right inspector system.

The current preview does not pass owner/framework visual proof and PR #12 must remain draft.

## Gate Results

| Gate | Result | Notes |
| --- | --- | --- |
| GATE-UI-IMPLEMENT-001 | pass for UI-004B repair scope | wargame failures are recorded below and route to UI-004B/page polish TODOs |
| GATE-UI-VISUAL-001 | blocked | visual QA remains below competitive quality |
| GATE-PR12-DRAFT-001 | blocked | owner/framework visual proof is incomplete |
| GATE-RUNTIME-001 | blocked | ARCH-002, ARCH-004, and visual proof remain incomplete |
| GATE-PROVIDER-001 | blocked | provider identity, credentials, permissions, and runtime boundaries remain unresolved |
| GATE-AUTO-EXEC-001 | blocked | automations remain dry-run/proposal only |
| GATE-FRAMEWORK-EXPORT-001 | blocked | direct export remains blocked by `xi-io.net#239` |

## Scenario Results

| Scenario | Related IDs | Result | Finding | Required Follow-Up |
| --- | --- | --- | --- | --- |
| WG-001 safe next action | REQ-IBAL-001, REQ-INSPECT-001, STORY-IBAL-001 | partial | Home and Ibal expose next-action content, but the shell still makes safety/status compete with the primary object. | UI-004B must reduce global status dominance and make next safe action easier to scan. |
| WG-002 trust/safety state | REQ-EGRESS-001, REQ-EXT-001, COMP-EGRESS-001 | pass with polish debt | Provider/runtime/draft states are visible and no write path is implied. Status tokens are still too repetitive. | UI-004B must consolidate global trust state and reduce badge spam. |
| WG-101 urgent message to draft | REQ-INBOX-001, REQ-EGRESS-001, STORY-INBOX-002 | partial | Inbox has selectable static threads, selected-thread detail, evidence, draft copy, and blocked egress. It still reads as heavy card/pill UI rather than premium mail triage. | UI-004C must polish Inbox object model after UI-004B. |
| WG-102 urgent message to calendar proposal | REQ-INBOX-001, REQ-CALENDAR-001, STORY-INBOX-003 | partial | Calendar proposal source is represented, and provider writes remain blocked. Cross-lane path is mostly text/fixture based. | UI-004F must strengthen source links and proposal flow. |
| WG-103 urgent message to task proposal | REQ-INBOX-001, REQ-TASKS-001, STORY-INBOX-003 | partial | Task source references exist, but cross-lane task creation remains non-interactive fixture content. | UI-004F must clarify task source and safe next action flow. |
| WG-201 calendar proposal source | REQ-CALENDAR-001, STORY-CALENDAR-001 | partial | Agenda/proposal content exists and does not claim provider writes. Time hierarchy and source navigation are not yet competitive. | UI-004F must improve calendar rhythm and source inspection. |
| WG-301 task source and next action | REQ-TASKS-001, STORY-TASKS-001 | partial | Task board and source references exist. Non-Inbox item selection does not yet drive a distinct inspector object state. | UI-004B must define inspector selection grammar; UI-004F must polish task lane. |
| WG-401 automation dry-run | REQ-AUTO-001, STORY-AUTO-001, COMP-AUTO-001 | pass with polish debt | Automation execution remains blocked and dry-run receipt requirements are visible. Visual composition still feels like cards. | UI-004G must make automations feel like rule simulation. |
| WG-501 provider blocked | REQ-EXT-001, STORY-EXT-001, COMP-CREDENTIALS-001 | pass with polish debt | Provider, credential, permission, and secret boundaries remain blocked/absent. | UI-004E/UI-004G must make gates feel like trust architecture rather than settings clutter. |
| WG-601 receipt explains state | REQ-RECEIPTS-001, STORY-RECEIPTS-001 | partial | Receipt classes and ledger rows exist. Rows are not yet a polished audit interaction model. | UI-004D must make receipt inspection first-class. |
| WG-701 Ibal proposal no execute | REQ-IBAL-001, STORY-IBAL-001, COMP-IBAL-001 | partial | Ibal is proposal-only and cites blockers, but the lane still feels like a board of cards instead of conductor/orchestrator. | UI-004D must make Ibal a command/orchestration surface. |
| WG-801 settings blocked action | REQ-EGRESS-001, REQ-EXT-001, COMP-PROVIDER-WRITE-001 | pass with polish debt | Policies, provider gates, AI routing, local/cloud boundary, and dangerous action blocks are visible. | UI-004E must improve hierarchy and gate explanations. |
| WG-901 keyboard navigation | REQ-A11Y-001, COMP-KEYBOARD-001 | partial | Prior smoke proved route and Inbox thread keyboard behavior. Cross-lane object selection and inspector updates are not yet fully defined. | UI-004B must add a consistent inspector/focus contract before page polish. |

## Visual QA Summary

Scores are simulated review scores against the current static preview. They do not replace owner review.

| Route/System | Purpose | Hierarchy | Object Model | Interaction | Consistency | Page Identity | Safety | Density | A11y Readiness | Competitive Polish | Average | Level |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Shell/system | 2 | 1 | 2 | 2 | 1 | 1 | 2 | 1 | 2 | 1 | 1.5 | Level 2 |
| Home | 2 | 1 | 2 | 1 | 1 | 1 | 2 | 1 | 2 | 1 | 1.4 | Level 2 |
| Inbox | 2 | 2 | 2 | 2 | 1 | 2 | 2 | 2 | 2 | 1 | 1.8 | Level 2 |
| Calendar | 2 | 1 | 2 | 1 | 1 | 2 | 2 | 1 | 2 | 1 | 1.5 | Level 2 |
| Tasks | 2 | 1 | 2 | 1 | 1 | 2 | 2 | 1 | 2 | 1 | 1.5 | Level 2 |
| Automations | 2 | 1 | 2 | 1 | 1 | 2 | 2 | 1 | 2 | 1 | 1.5 | Level 2 |
| Extensions | 2 | 1 | 2 | 1 | 1 | 2 | 2 | 1 | 2 | 1 | 1.5 | Level 2 |
| Receipts | 2 | 2 | 2 | 1 | 1 | 2 | 2 | 2 | 2 | 1 | 1.7 | Level 2 |
| Ibal | 2 | 1 | 2 | 1 | 1 | 2 | 2 | 1 | 2 | 1 | 1.5 | Level 2 |
| Settings / Provider Gates | 2 | 1 | 2 | 1 | 1 | 2 | 2 | 1 | 2 | 1 | 1.5 | Level 2 |

No route is ready for visual proof. No route reaches Level 3 because page-specific metaphor exists in content but not yet in composed interaction, selection, and visual hierarchy.

## Findings

### Blocking For Visual Proof

- UI-004A6-BLOCKER-001: shell hierarchy is still too uniform; top status, safety banner, lane header, pills, panels, and inspector compete.
- UI-004A6-BLOCKER-002: safety is correct but visually overexposed; it must become an integrated trust grammar.
- UI-004A6-BLOCKER-003: right inspector is useful but not yet a consistent selected-object intelligence system across all lanes.
- UI-004A6-BLOCKER-004: lanes have distinct content but still share too much card/pill rhythm.
- UI-004A6-BLOCKER-005: page-specific polish cannot proceed safely until shell/nav/trust/inspector system is corrected.

### Passing Safety Conditions

- No provider connection is present.
- No credentials are present.
- No send, forward, delete, disclose, publish, deploy, provider mutation, repo mutation, or automation execution path is approved.
- Ibal remains proposal-only.
- Automations remain dry-run/proposal-only.
- Runtime/platform decisions remain blocked by ARCH-004.
- Direct framework import remains blocked by `xi-io.net#239`.

## Required TODO Updates

- Mark UI-004A.6 complete.
- Mark UI-004B ready as the next implementation slice for shell/topbar/lane navigation/safety/inspector only.
- Keep page-specific polish blocked until UI-004B completes.
- Keep visual proof incomplete.
- Keep PR #12 draft.
- Keep Pass 4 blocked.

## PLAN-001B Decision

Do not start PLAN-001B now.

PLAN-001A is sufficient for UI-004A.6 and UI-004B. Detailed user journeys, page/system maps, component contracts, data/event models, QA matrices, and agent handoff packets may be expanded later only if a future slice exposes a specific blocker.

## UI-004B Scope Permission

Allowed next:

- shell visual hierarchy,
- top bar,
- lane navigation,
- global trust/safety treatment,
- right inspector selection/focus system,
- status/badge reduction,
- no-runtime-write preservation.

Still forbidden:

- provider connections,
- credentials,
- runtime writes,
- send/forward/delete/archive/disclose,
- automation execution,
- local cloud behavior,
- platform/runtime claims,
- direct framework import claim,
- visual proof completion,
- PR draft exit.

## Decision

```text
UI_004A6_WARGAME_COMPLETE_UI_004B_REPAIR_SCOPE_ALLOWED_VISUAL_PROOF_BLOCKED
```
