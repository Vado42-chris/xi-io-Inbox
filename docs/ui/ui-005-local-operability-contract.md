# UI-005 Local Operability Contract

## Purpose

Define the Tier 1 local operability boundary for UI-005B+ implementation.

This contract prevents local preview affordances from leaking into runtime, provider, or platform claims.

## Tier 1: Local Operability Definition

Tier 1 is **browser-local human-operable preview**:

- user can enter and change preview state,
- state persists in localStorage or equivalent client store,
- actions produce local drafts, proposals, and receipt previews,
- no external system write occurs,
- blocked runtime paths remain explicit and gated.

Tier 1 satisfies owner requirement for human-operable first while ARCH-004 and provider gates remain blocked.

## Tier 2: Runtime Operability Definition

Tier 2 is **runtime-operable product behavior**:

- provider reads/writes with approved credentials,
- real egress after gatekeeper approval,
- automation execution after dry-run and approval,
- repository mutation with permission and receipt,
- platform-specific deployment per ARCH-004.

Tier 2 is blocked until `GATE-RUNTIME-001`, `GATE-PROVIDER-001`, `GATE-AUTO-EXEC-001`, and related gates pass.

## Allowed Local Preview Operations (Tier 1)

| Operation | Lane / area | Persistence | Receipt |
| --- | --- | --- | --- |
| Create/edit compose draft | Inbox | local | draft proposal receipt |
| Create/edit reply draft | Inbox | local | draft proposal receipt |
| Triage flags (read/star/archive intent local only) | Inbox | local | local state receipt optional |
| Create/edit calendar event proposal | Calendar | local | event proposal receipt |
| Create/edit task | Tasks | local | task proposal receipt |
| Inbox→task ingress UI | Tasks / Inbox | local | cross-lane proposal receipt |
| Build automation rule (dry-run) | Automations | local | dry-run receipt |
| Install/remove extension (preview) | Extensions | local | gate/blocked receipt |
| Edit settings/gate values (preview) | Settings | local | policy preview receipt |
| Ibal ask → proposal → local draft | Ibal + lanes | local | Ibal proposal receipt |
| Account/workspace switch (preview) | Top bar | session/local | session preview receipt |
| Clear/restore preview state | Settings or global | n/a | clear/restore receipt |

## Forbidden Runtime Operations (Tier 2 — Blocked in Tier 1)

- provider connection, OAuth, credential storage,
- send, forward, delete, archive, disclose, publish, deploy,
- provider read/write/sync,
- automation execution or enablement implying run,
- repository mutation,
- local cloud / home server / LAN sync,
- platform runtime claims (Electron, Tauri, Android, hosted cloud),
- real authentication backend,
- direct framework package import.

## Data Persistence Boundary

### Fixture data (read-only seed)

- `public/data/inbox-events.preview.json` remains seed/fixture source.
- UI-005B+ must not require fixture mutation for operability; local state overlays fixtures.

### Local overlay state (Tier 1 writable)

- Drafts, proposals, edits, installs (preview), settings overrides stored in client.
- Must be clearly labeled as preview/local.
- Must be clearable by user without repo changes.

### Repository state

- No commit, push, or file write from preview UI.
- No automation that mutates repo from browser.

## localStorage Policy (When Used in UI-005B+)

- Key namespace: `xiio-inbox-preview-state-v2` (existing) or versioned successor documented in receipt.
- Store: drafts, proposals, local edits, dry-run rules, preview settings, extension preview installs.
- Do not store: credentials, tokens, private message bodies, secrets.
- On load: merge overlay with fixtures; show unsaved/conflict state if needed.
- User controls: restore defaults, clear all local preview data (required UI).

## No-Provider Policy

- No OAuth flows, connection buttons that work, or provider API calls.
- Provider cards remain inspect-only with blocked state.
- "Connect" affordances may exist only as disabled/educational with gate explanation.

## No-Credential Policy

- No password fields that persist values.
- No API key entry that saves to storage.
- Account shell is preview-only identity switch.

## Dry-Run Automation Policy

- Rule builder may compose trigger/condition/proposal locally.
- Dry-run shows simulated chain only.
- Enable/run buttons absent or disabled with execution gate explanation.
- Dry-run output never triggers network or repo side effects.

## Draft/Proposal-Only Policy

- All egress-shaped actions produce **draft** or **proposal** state.
- UI copy must not imply sent, scheduled, installed (runtime), or executed.
- Confirmation dialogs distinguish "save local draft" from "send/commit" (blocked).

## Receipt Preview Policy

- Local actions may append to preview receipt ledger (client-side).
- Receipt types: `proposal`, `draft`, `dry-run`, `gate`, `blocked`, `ibal-proposal`, `local-clear`.
- Receipts do not authorize Tier 2 actions.
- Receipts lane shows merged fixture + local receipts with clear provenance.

## Accessibility Requirements

- All operability forms: labels, names, visible focus, keyboard submit/cancel.
- Local state changes: textual status messages (not color-only).
- Clear preview data: confirm dialog, focus restore, status message.
- Ibal concierge: keyboard open/close, focus trap in drawer, escape to close.
- Disabled runtime escalation: reason available to screen readers.

## Compliance Requirements

Mapped in `docs/product/06-compliance-validation-index.md`:

- COMP-LOCAL-PERSIST-001 — local preview persistence boundary
- COMP-LOCAL-DRAFT-001 — unsaved/draft state labeling
- COMP-LOCAL-CLEAR-001 — clear local preview data
- COMP-IBAL-PROPOSAL-001 — AI proposal-only behavior
- COMP-RUNTIME-ESCALATION-001 — blocked runtime escalation visibility

## Test Evidence Required Before Implementation (UI-005B+)

Each operability slice must record:

- route smoke for affected routes,
- keyboard/focus check for new forms and concierge,
- localStorage round-trip (save, reload, clear),
- blocked runtime escalation attempt (disabled + reason),
- receipt preview generation,
- no external network requests during smoke (unless documented),
- `npm run check` and `git diff --check`.

## Validation Gates

| Gate | Requirement |
| --- | --- |
| GATE-LOCAL-OPERABILITY-001 | Pass — UI-005A–I complete |
| GATE-UI-IMPLEMENT-001 | Pass for UI-005 scope |
| GATE-UI-VISUAL-001 | Partial — owner visual re-review pending (`ui-003e-owner-visual-proof-packet.md`) |
| GATE-RUNTIME-001 | Still blocked |
| GATE-PROVIDER-001 | Still blocked |

## Rollback / Block Conditions

Block UI-005B+ slice if:

- local action implies provider write or send,
- credentials appear in storage or network,
- automation UI enables execution,
- Ibal lane restored as primary nav without concierge model,
- fixture file mutated without documented exception,
- visual proof or PR draft exit claimed prematurely,
- Tier 1 copy claims Tier 2 capability.

Rollback: revert slice commit; update receipt with fail decision; keep UI-005A architecture docs as source of truth.

## Decision

```text
UI_005A_LOCAL_OPERABILITY_CONTRACT_DEFINED
TIER_1_BOUNDARY_EXPLICIT
TIER_2_RUNTIME_REMAINS_BLOCKED
GATE_LOCAL_OPERABILITY_001_REQUIRED_BEFORE_UI_005B
```
