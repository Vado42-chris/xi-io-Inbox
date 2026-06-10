# Framework Hydration Checklist

## Purpose

Track whether `xi-io Inbox` satisfies, partially satisfies, is missing, is blocked by, or is not yet subject to core xi-io framework expectations.

## Status Values

| Status | Meaning |
| --- | --- |
| satisfied | sufficient for current phase |
| partial | represented but not complete |
| missing | no adequate repo evidence yet |
| blocked | cannot complete until named blocker clears |
| not-applicable-yet | later runtime/product phase |

## Hydration Items

| ID | Framework Expectation | Status | Evidence Doc | Missing Work | Blocked By | Next Action |
| --- | --- | --- | --- | --- | --- | --- |
| HYDRATE-INVARIANTS-001 | product invariants exist and define core loop | satisfied | `docs/product/invariants.md` | none for planning | none | keep referenced in stories/gates |
| HYDRATE-EGRESS-001 | draft-only egress policy exists | satisfied | `docs/security/draft-only-egress.md` | runtime gatekeeper later | runtime/provider gates | map to future tests |
| HYDRATE-SOURCE-001 | source audit and import boundaries exist | partial | `docs/architecture/source-audit.md`, `docs/architecture/source-candidate-matrix.md` | detailed license/NOTICE review before distribution | ARCH-002/ARCH-003 | keep runtime import blocked |
| HYDRATE-PROVIDER-SCHEMA-001 | provider manifest/schema exists | partial | `schemas/provider-manifest.schema.json` | provider identity, storage, permission flow | ARCH-003/ARCH-004 | defer integration |
| HYDRATE-AI-PROVIDER-001 | AI provider manifest/schema exists | partial | `schemas/ai-provider-manifest.schema.json` | runtime model routing and receipts | ARCH-004 | keep Ibal proposal-only |
| HYDRATE-RECEIPTS-001 | receipts/audit doctrine exists | partial | `docs/product/invariants.md`, `docs/ui/polish/07-receipts-polish-plan.md` | runtime receipt schema/tests later | Pass 4/runtime | run receipt hook in UI proof |
| HYDRATE-UI-CONSUMER-001 | framework UI consumer contract honored | partial | `docs/ui/framework-ui-adoption.md`, `docs/ui/ui-003-unified-app-shell-architecture.md` | direct framework export path | `xi-io.net#239` | continue adapted-copy with source notes |
| HYDRATE-RUNTIME-ENVELOPE-001 | platform/runtime envelope contract honored | partial | `docs/architecture/platform-runtime-decision-matrix.md` | final runtime, storage, secrets, sync decisions | ARCH-004 | keep Pass 4 blocked |
| HYDRATE-VISUAL-QA-001 | visual QA rubric exists | satisfied | `docs/ui/polish/12-visual-qa-rubric.md` | route receipts after polish | UI-004 implementation | run UI-004A.6 then UI-004B |
| HYDRATE-WARGAME-001 | wargame scenario standard exists and UI-004A.6 receipt exists | satisfied | `docs/ui/polish/13-page-leveling-and-wargame-standard.md`, `docs/ui/polish/14-ui-wargame-scenario-matrix.md`, `docs/ui/reviews/ui-004a6-wargame-review.md` | route receipts after implementation polish | none for UI-004B | start UI-004B |
| HYDRATE-ENGINE-HOOK-001 | engine hook plan exists | satisfied | `docs/ui/polish/15-framework-engine-hook-plan.md` | implementation of hooks later | framework/tooling | use as review contract |
| HYDRATE-WHITE-LABEL-001 | white-label framework feedback plan exists | satisfied | `docs/ui/polish/16-white-label-framework-feedback-plan.md` | promote candidates after proof | `xi-io.net#239`, UI proof | comment/update framework after UI-004B/page proof |
| HYDRATE-FRESHNESS-001 | two-way framework freshness tracked | partial | `docs/architecture/xiio-framework-alignment.md` | post-proof candidate updates | UI proof, `xi-io.net#239` | keep framework freshness TODO active |
| HYDRATE-ARCH004-001 | ARCH-004 platform/runtime status tracked | partial | `docs/architecture/platform-runtime-decision-matrix.md` | decisions and receipt | ARCH-004 | decide after prerequisites |
| HYDRATE-ARCH002-001 | ARCH-002 Android mail spine status tracked | partial | `docs/architecture/android-mail-spine-audit-pass-3.md`, `docs/operations/cursor-arch-002-build-proof-prompt.md` | local build proof or classified failure | operator/local build | run ARCH-002 proof separately |
| HYDRATE-BACKLOG-001 | product backlog readiness exists | partial | `docs/product/02-epic-story-backlog.md` | PLAN-001B details if needed | none for UI-004A.6 | use for UI-004A.6 |
| HYDRATE-GATES-001 | build readiness gates exist | partial | `docs/product/04-build-readiness-gates.md` | update after each slice | active work | UI-004B is ready; maintain remaining blocked gates |
| HYDRATE-COMPLIANCE-001 | compliance validation index exists | partial | `docs/product/06-compliance-validation-index.md` | future tool receipts and exact mappings | runtime/UI implementation | keep mapping pending where dependent |
| HYDRATE-ROUTE-QUALITY-001 | route quality receipts exist for final UI | missing | none yet | desktop/mobile route receipts after UI polish | UI-004B+ | create route receipts during visual proof |
| HYDRATE-AGENT-HANDOFF-001 | agent handoff packet exists | missing | none yet | build/pass handoff packet | PLAN-001B or later | defer unless UI-004A.6 reveals need |
| HYDRATE-QA-MATRIX-001 | full QA matrix exists | missing | none yet | full QA matrix for implementation/runtime | PLAN-001B or later | defer until gates require |

## Hydration Rules

- `satisfied` means sufficient for the current planning phase, not final production completeness.
- `partial` items must name missing work.
- `blocked` items must name the blocker.
- Framework hydration must be rechecked after UI-004B, after page-specific polish, and before Pass 4.

## Decision

```text
PLAN_001A_FRAMEWORK_HYDRATION_STATUS_INDEX_READY
```
