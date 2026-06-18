# UI-005 Human-Operable Shell Architecture

## Purpose

Define the product-operability architecture required before any UI-005B+ implementation.

UI-005A is documentation only. It corrects the product model from one-way reporting toward human-operable first, AI-augmented second, while preserving provider/runtime gates and receipt visibility.

## Problem Statement (UI-003E Preliminary Fail)

The preliminary owner review on 2026-06-10 found:

```text
UI_003E_PRELIMINARY_FAIL_UI_005_HUMAN_OPERABLE_SHELL_REQUIRED
```

Core failure: the preview is **one-way reporting**, not a **human-operable tool**.

| Lane / area | Owner expectation | Current preview (UI-004) |
| --- | --- | --- |
| Inbox | Compose, reply draft, triage | Static thread list |
| Calendar | Scheduling interaction | Agenda fixtures only |
| Tasks | Create/edit, inbox→task ingress | Kanban fixtures only |
| Automations | User-created rules | Template list only |
| Extensions | Install/remove/provision detail | Status report only |
| Settings | Configurable gates/policies | Read-only policy table |
| Account | Login/session shell | Preview workspace label only |
| Ibal | Concierge/conductor entry | Full lane page (wrong model) |

UI-004 improved visual hierarchy and lane identity but did not add the interaction model required by xi-io product doctrine.

## Current UI-004 State: Polished But Insufficient

UI-004B–G accomplished:

- Shell/trust/inspector system polish
- Lane-specific visual and object rhythm
- Safety boundaries preserved (no provider, no runtime writes)
- Governance receipts and TODO discipline

UI-004 success does **not** satisfy owner visual proof or human-operability requirements.

## Human-Operable First Principle

Users must be able to **enter, change, and review** information in the product shell before AI augmentation is treated as primary value.

Human operability means:

- editable forms and local drafts where appropriate,
- selectable objects with persistent local state,
- explicit create/edit/cancel flows,
- visible unsaved and saved-local state,
- blocked runtime escalation with evidence,
- receipt preview for local proposals.

Human operability does **not** mean provider connection, send, sync, automation execution, or platform/runtime claims.

## AI-Augmented Second Principle

Ibal and AI-assisted surfaces augment human work; they do not replace human entry or decision authority.

AI augmentation in Tier 1 preview:

- proposes next safe actions,
- synthesizes cross-lane context,
- surfaces evidence and blockers,
- suggests local draft/proposal content,
- never executes, sends, connects providers, or mutates repositories.

## Two-Tier Operability Model

### Tier 1: Local Human-Operable Preview

Allowed in static preview on the lab branch while ARCH-004 and provider gates remain blocked.

Scope:

- local forms and draft composers,
- local proposal creation (draft-only),
- localStorage or equivalent preview persistence,
- dry-run automation simulation UI,
- local receipt previews,
- account/session shell UI without real auth,
- Ibal concierge proposal surface without model routing claims.

Boundary: all writes stay in browser-local preview state or in-memory session. No external write.

### Tier 2: Runtime-Operable (Blocked)

Blocked until:

- GATE-RUNTIME-001 (ARCH-002, ARCH-004, UI visual proof),
- GATE-PROVIDER-001,
- GATE-AUTO-EXEC-001,
- and related compliance gates pass.

Scope when unblocked (future):

- provider reads/writes with credentials and receipts,
- real send/forward/delete/archive/disclose,
- automation execution after approval,
- repository mutation with explicit permission,
- platform-specific runtime behavior per ARCH-004.

Tier 2 must never be implied by Tier 1 UI copy, controls, or receipts.

## Tier 1 May Include Later (UI-005B–I)

- local compose/reply draft forms (Inbox),
- local calendar event proposals (Calendar),
- local task create/edit and inbox→task ingress UI (Tasks),
- local automation rule builder with dry-run only (Automations),
- local extension install/remove/provision UI gated as preview (Extensions),
- editable settings/gate forms with local persistence (Settings),
- Ibal concierge drawer/panel with fixture conversation and proposal-only actions (Ibal),
- account/workspace switch shell without real OAuth (Account),
- local receipt generation for proposals/drafts/blocked actions,
- preview state restore and clear controls.

## Tier 1 Must Not Include

- provider connection or OAuth flows,
- credentials or secret storage,
- send, forward, delete, archive, disclose, publish, deploy,
- automation execution or enablement that implies runtime run,
- repository mutation,
- local cloud / home server behavior,
- Electron, Tauri, Android, hosted cloud, sync, or distribution claims,
- direct framework package import claims (`xi-io.net#239` remains blocked),
- visual proof completion or PR draft exit.

## Required Shell Changes (UI-005B+)

1. **Remove Ibal as primary lane navigation** — replace with persistent concierge/conductor entry (see `docs/ui/ui-005-ibal-concierge-model.md`).
2. **Add operability affordances to top bar** — command entry opens Ibal concierge; workspace/account shell becomes interactive preview.
3. **Introduce local draft/proposal state layer** — shared preview persistence contract (see `docs/ui/ui-005-local-operability-contract.md`).
4. **Upgrade inspector for operability** — show selected object, local draft state, evidence, safe next, blocked runtime escalation, receipt preview.
5. **Add human action panels per lane** — compose, create, edit, dry-run, install/remove (preview-gated), not read-only reports.
6. **Preserve UI-004 visual polish** — operability layers on top; do not revert shell rhythm.
7. **Add preview data management** — restore/clear local preview state with explicit user control.

## Required Lane Operability Changes (UI-005B–I)

| Slice | Lane focus | Tier 1 operability target |
| --- | --- | --- |
| UI-005B | Inbox | compose, reply draft, triage actions, local thread state |
| UI-005C | Calendar | create/edit event proposals, local agenda state |
| UI-005D | Tasks | create/edit tasks, inbox→task ingress UI |
| UI-005E | Automations | rule builder UI, dry-run simulation only |
| UI-005F | Extensions | install/remove/detail/provision UI (preview-gated) |
| UI-005G | Settings | editable gate/policy forms, local persistence |
| UI-005H | Ibal concierge | drawer/panel chat shell, proposal-only, evidence-first |
| UI-005I | Account/session | login/workspace switch shell, no real auth |

Receipts lane remains audit-first; it gains local receipt preview generation from Tier 1 actions but does not authorize execution.

## Acceptance Criteria Before UI-005B May Start

All must be true:

1. `docs/ui/ui-005-human-operable-shell-architecture.md` exists (this document).
2. `docs/ui/ui-005-ibal-concierge-model.md` exists and defines navigation correction.
3. `docs/ui/ui-005-local-operability-contract.md` exists and defines Tier 1/Tier 2 boundary.
4. `docs/ui/reviews/ui-005a-operability-architecture-receipt.md` exists with pass decision.
5. Component inventory, interaction standard, wargame matrix, epic backlog, build gates, and compliance index updated.
6. `GATE-LOCAL-OPERABILITY-001` documented and separates Tier 1 from Tier 2.
7. No product UI code changed in UI-005A pass.
8. TODO marks UI-005A complete and UI-005B as next only on pass.

## UI-005 Slice Sequence

```text
UI-005A  operability architecture (docs only) — this pass
UI-005B  Inbox operability
UI-005C  Calendar operability
UI-005D  Tasks operability
UI-005E  Automations operability
UI-005F  Extensions operability
UI-005G  Settings operability
UI-005H  Ibal concierge shell
UI-005I  Account/session shell
UI-003E  owner visual proof re-run
```

## Decision

```text
UI_005A_HUMAN_OPERABLE_SHELL_ARCHITECTURE_DEFINED
TIER_1_LOCAL_OPERABILITY_AUTHORIZED_FOR_UI_005B_PLUS
TIER_2_RUNTIME_OPERABILITY_REMAINS_BLOCKED
IBAL_LANE_MODEL_SUPERSEDED_BY_CONCIERGE_MODEL
```
