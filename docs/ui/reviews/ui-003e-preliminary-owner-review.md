# UI-003E Preliminary Owner Visual Proof Review

## Status

```text
Preliminary owner review: FAIL
Visual proof complete: NO
PR #12 merge readiness: BLOCKED
UI-004 page polish: visually improved but insufficient
Next phase required: UI-005 human-operable interactive shell
```

## Reviewer

Owner preliminary peer review (2026-06-10), shared with local agents and ChatGPT peer review.

## Executive Finding

The current preview is **one-way reporting**, not **human-operable first, AI-augmented second**.

UI-004B–G improved hierarchy and lane identity, but did not add the interaction model required by xi-io product doctrine.

## Failed Acceptance Themes

| Theme | Owner finding | Current preview state |
| --- | --- | --- |
| Human operability | Users cannot enter or change information | Fixture/read-only everywhere |
| Inbox | Does not function like a real inbox | Static thread list, no compose/reply/triage actions |
| Calendar | Does not function like a real calendar | Agenda fixtures only, no scheduling interaction |
| Tasks | Not real task management; no intelligent inbox→task ingress | Kanban fixtures only |
| Automations | Cannot be created by user | Template list only |
| Extensions | Not installable/removable; no provisioning detail | Status report only |
| Account | No account-level login/session model | Preview workspace label only |
| Ibal | Wrong product model | Implemented as full lane page; should be concierge chat entry point |
| Settings / gates | Cannot configure anything | Policy report only |

## Critical Architecture Conflict: Ibal

**Owner/framework expectation:** Ibal is a button/control that spawns an AI chat concierge to help manage inbox and cross-lane work.

**Current repo plan (UI-003/UI-004):** Ibal is a first-class lane plus inspector proposals.

These models conflict. UI-005 must reconcile against `xi-io.net` framework sources before implementation.

## What UI-004 Did Accomplish

- Shell/trust/inspector system improved (UI-004B)
- Lane-specific visual/object rhythm improved (UI-004C–G)
- Safety boundaries preserved (no provider, no runtime writes)
- Governance receipts and TODO discipline maintained

UI-004 success does **not** satisfy owner visual proof.

## Required Next Phase: UI-005

Human-operable interactive shell (static/local-first, still no provider/runtime until gates clear).

### UI-005 slices (proposed)

1. **UI-005A** Operability architecture + Ibal model correction (docs/governance)
2. **UI-005B** Inbox operability (compose, reply draft, triage actions, local state)
3. **UI-005C** Calendar operability (create/edit proposal events, local state)
4. **UI-005D** Tasks operability (create/edit tasks, inbox→task ingress UI)
5. **UI-005E** Automations operability (rule builder UI, dry-run only)
6. **UI-005F** Extensions operability (install/remove/detail/provision UI, gated)
7. **UI-005G** Settings operability (editable gate/policy forms, local state)
8. **UI-005H** Ibal concierge chat shell (drawer/panel, fixture conversation, proposal-only)
9. **UI-005I** Account/session shell (login/workspace switch UI, no real auth yet)
10. **UI-003E** Re-run owner visual proof

## Still Forbidden Until Runtime Gates Clear

- Real provider OAuth/credentials
- Real send/forward/delete/sync
- Automation execution
- Real account authentication backend
- Platform/runtime claims

## Decision

```text
UI_003E_PRELIMINARY_FAIL_UI_005_HUMAN_OPERABLE_SHELL_REQUIRED
```
