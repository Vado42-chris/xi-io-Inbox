# UI-005A Operability Architecture Receipt

## Date

2026-06-10

## Branch

`ui-002/framework-derived-static-preview`

## Commit SHA

ab5ef9676f847fd90222e0aea1e2ec12bc849aa9

## Scope

Docs-only operability architecture pass:

- human-operable shell architecture (Tier 1/Tier 2 model)
- Ibal concierge model correction (supersedes Ibal lane page)
- local operability contract
- component inventory, interaction standard, wargame matrix extensions
- epic backlog, sprint slices, build gate, compliance index updates
- TODO update

## Excluded Scope

- Product UI code (`public/index.html`, `public/inbox-preview.css`, `public/inbox-preview.js`)
- Fixture changes (`public/data/inbox-events.preview.json`)
- UI-005B–I implementation
- Provider/runtime/platform work
- Visual proof completion
- PR draft exit
- Pass 4
- `secrets/` staging

## Files Created

- `docs/ui/ui-005-human-operable-shell-architecture.md`
- `docs/ui/ui-005-ibal-concierge-model.md`
- `docs/ui/ui-005-local-operability-contract.md`
- `docs/ui/reviews/ui-005a-operability-architecture-receipt.md`

## Files Updated

- `docs/ui/polish/10-component-pattern-inventory.md`
- `docs/ui/polish/11-interaction-standard.md`
- `docs/ui/polish/14-ui-wargame-scenario-matrix.md`
- `docs/product/02-epic-story-backlog.md`
- `docs/product/03-sprint-slice-plan.md`
- `docs/product/04-build-readiness-gates.md`
- `docs/product/06-compliance-validation-index.md`
- `TODO.md`

## Product UI Code Changed

No.

## Before-State Summary (UI-003E / UI-004)

- UI-004B–G complete: polished but read-only reporting surface.
- UI-003E preliminary fail: not human-operable; Ibal wrong model (lane page).
- No Tier 1/Tier 2 operability boundary documented.
- No GATE-LOCAL-OPERABILITY-001.
- Ibal in lane nav and `#/ibal` route per UI-003/UI-004.

## Implementation Summary

1. Defined human-operable first / AI-augmented second architecture.
2. Established Tier 1 local operability vs Tier 2 runtime-operable (blocked).
3. Superseded Ibal lane model with concierge/conductor entry model.
4. Added local operability contract (persistence, drafts, dry-run, clear, blocked escalation).
5. Extended component inventory with nine operability patterns.
6. Extended interaction standard for concierge, local drafts, clear/restore, blocked escalation.
7. Added eight UI-005 wargame scenarios (WG-005-001 through WG-005-008).
8. Added EPIC-OPERABILITY-001 and Ibal/operability stories.
9. Added UI-005A–I sprint slices and GATE-LOCAL-OPERABILITY-001.
10. Added five compliance items for local operability.

## Route Smoke Result

Not run — docs-only pass; no product UI code changed.

## Keyboard / Focus Result

Not run — docs-only pass.

## Inspector Result

Not run — docs-only pass.

## Safety / Egress Result

Tier 1/Tier 2 boundary documented. Tier 2 actions remain forbidden in Tier 1 implementation scope.

## Provider / Runtime / Platform Result

Unchanged — all blocked. No provider, credential, runtime, or platform claims added.

## Visual QA Delta Estimate

No visual change (docs only). Operability implementation (UI-005B–I) estimated 8–10 passes before UI-003E re-review.

## UI-005B Allowed

Yes — after this receipt pass decision and commit.

Reason: all three UI-005 architecture docs exist; governance docs updated; GATE-LOCAL-OPERABILITY-001 defined; acceptance criteria met; no product UI code in this pass.

## Remaining Blockers

- Visual proof / UI-003E final — blocked until UI-005B–I + re-review
- Pass 4 — blocked
- ARCH-004 — blocked
- ARCH-002 — pending/blocked
- Providers/runtime/platform — blocked
- `xi-io.net#239` direct framework export — blocked
- Ibal lane still in current preview UI until UI-005H implementation

## Validation Commands

```text
npm run check — required, run at commit
git diff --check — required, run at commit
git status --short — required; secrets/ must remain untracked unstaged
```

## Next Recommended Pass

UI-005B — Inbox operability (compose, reply draft, triage, local state).

## Decision Value

```text
UI_005A_PASS_UI_005B_ALLOWED
```
