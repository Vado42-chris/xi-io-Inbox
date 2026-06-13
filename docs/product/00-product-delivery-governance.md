# Product Delivery Governance

## Purpose

Define the minimum delivery governance layer for `xi-io Inbox` before broader build work resumes.

`PLAN-001A` is a documentation and planning pass. It does not approve product UI polish, runtime work, provider connections, automation execution, local cloud behavior, or Pass 4.

## Current Status

| ID | Area | Status | Evidence |
| --- | --- | --- | --- |
| GATE-UI-WARGAME-001 | UI-004A.6 simulated wargame | complete | `docs/ui/reviews/ui-004a6-wargame-review.md` |
| GATE-UI-IMPLEMENT-001 | UI-004B shell polish | ready for bounded repair scope | `docs/product/04-build-readiness-gates.md` |
| GATE-VISUAL-PROOF-001 | Owner/framework visual proof | partial (UI-012F ready; owner UI-003E pending) | `docs/ui/ui-002-local-proof-status.md`, `ui-012f-final-visual-readiness-gate-receipt.md` |
| GATE-DRAFT-WORKBENCH-001 | Draft workbench Tier 1 | partial (UI-007A–C local; owner proof pending) | `docs/ui/reviews/ui-007c-send-event-dry-run-receipt.md` |
| GATE-RUNTIME-001 | Pass 4 runtime skeleton | blocked | `docs/architecture/platform-runtime-decision-matrix.md` |
| GATE-ANDROID-001 | Android mail spine build proof | pending | `docs/operations/cursor-arch-002-build-proof-prompt.md` |
| GATE-FRAMEWORK-001 | Direct framework UI import | blocked by `xi-io.net#239` | `docs/ui/polish/16-white-label-framework-feedback-plan.md` |

## Source-Of-Truth Document Map

| ID | Document | Role |
| --- | --- | --- |
| EVIDENCE-GOV-001 | `docs/product/00-product-delivery-governance.md` | delivery rules, phase model, readiness definitions |
| EVIDENCE-REQ-001 | `docs/product/01-product-requirements-register.md` | requirement IDs and traceability |
| EVIDENCE-BACKLOG-001 | `docs/product/02-epic-story-backlog.md` | epics and initial user stories |
| EVIDENCE-SLICE-001 | `docs/product/03-sprint-slice-plan.md` | bounded delivery slices |
| EVIDENCE-GATE-001 | `docs/product/04-build-readiness-gates.md` | build permission gates and risk register |
| EVIDENCE-HYDRATE-001 | `docs/product/05-framework-hydration-checklist.md` | framework expectation status |
| EVIDENCE-COMP-001 | `docs/product/06-compliance-validation-index.md` | compliance and validation index |
| EVIDENCE-UI-STD-001 | `docs/ui/polish/00-xi-io-visual-product-standard.md` | visual product standard |
| EVIDENCE-UI-WG-001 | `docs/ui/polish/14-ui-wargame-scenario-matrix.md` | UI wargame scenarios |
| EVIDENCE-ARCH-001 | `docs/architecture/platform-runtime-decision-matrix.md` | runtime/platform decision constraints |
| EVIDENCE-SAFETY-001 | `docs/security/draft-only-egress.md` | draft-only egress policy |

## Agent Reading Order

1. `AGENTS.md`
2. `TODO.md`
3. `docs/product/00-product-delivery-governance.md`
3. `docs/product/01-product-requirements-register.md`
4. `docs/product/02-epic-story-backlog.md`
5. `docs/product/03-sprint-slice-plan.md`
6. `docs/product/04-build-readiness-gates.md`
7. `docs/product/05-framework-hydration-checklist.md`
8. `docs/product/06-compliance-validation-index.md`
9. Relevant UI, architecture, security, schema, and framework docs for the active slice.

## Waterfall Phase Map

Sprint/slice work executes inside this larger phase map.

| ID | Phase | Goal | Current State |
| --- | --- | --- | --- |
| PHASE-00 | Bootstrap governance | make repo safe, inspectable, and framework-aligned | complete |
| PHASE-01 | Source mining and framework freshness | mine proven xi-io sources and report reusable findings | complete for initial audit |
| PHASE-02 | Android mail spine proof plan | establish candidate mail spine and build proof path | partially complete, proof pending |
| PHASE-03 | Product delivery governance | normalize requirements, stories, gates, compliance, hydration | PLAN-001A complete |
| PHASE-04 | UI design governance | define visual standards, wargame, and framework hooks | UI-004A.5 complete |
| PHASE-05 | UI polish implementation | implement shell, then page-specific polish | UI-004B–G, UI-005, UI-006 complete locally |
| PHASE-05B | Draft workbench spine | re-center on draft lifecycle + approval queue | UI-007A docs complete; UI-007B pending |
| PHASE-06 | Owner/framework visual proof | record visual proof and merge-readiness decision | partial — owner re-review pending |
| PHASE-07 | Runtime/platform decision | decide platform, storage, secret, sync, backup, local-cloud boundaries | blocked by ARCH-004 |
| PHASE-08 | Runtime skeleton | introduce buildable runtime code | blocked |
| PHASE-09 | Provider/runtime integrations | connect providers and execution paths | blocked |

## Sprint / Slice Execution Model

Slices are bounded delivery units. Each slice must state scope, excluded scope, dependencies, validation method, evidence artifact, and rollback/block condition before work starts.

`TODO.md` remains operational tracking. It is not the full backlog and must not replace this governance packet.

## Decision Gates

| ID | Gate | Rule |
| --- | --- | --- |
| GATE-READY-001 | Definition of Ready | a slice cannot start until ready criteria are known |
| GATE-DONE-001 | Definition of Done | a slice cannot close until evidence and TODO state are updated |
| GATE-NO-SILENT-001 | no silent success | a failed or skipped check must be recorded as blocked, not ignored |
| GATE-DRAFT-PR-001 | PR #12 draft state | PR #12 remains draft until owner/framework visual proof passes |
| GATE-PASS4-001 | Pass 4 block | Pass 4 remains blocked until Android proof, UI proof, and ARCH-004 gates clear |

## Build-Blocking Conditions

| ID | Condition | Blocking Scope |
| --- | --- | --- |
| RISK-ARCH-004 | platform/runtime envelope undecided | Pass 4, local cloud, provider integration |
| RISK-ARCH-002 | Thunderbird Android upstream build proof pending | Android runtime import |
| RISK-UI-PROOF | owner/framework visual proof incomplete | PR #12 draft exit, UI merge readiness |
| RISK-FRAMEWORK-239 | direct framework export blocked by `xi-io.net#239` | direct framework package import |
| RISK-PROVIDER-GATES | provider identity, credentials, permissions unresolved | provider reads/writes |
| RISK-EGRESS | dangerous egress must remain blocked | send, forward, delete, disclose, mutate, execute |

## Pass Relationships

| ID | Workstream | Relationship |
| --- | --- | --- |
| REL-UI-001 | UI passes | UI-004A.6 must use normalized stories and gates from PLAN-001A |
| REL-PRODUCT-001 | product passes | product requirements and backlog govern future implementation slices |
| REL-ARCH-001 | architecture passes | ARCH-002 and ARCH-004 can block runtime and provider work |
| REL-FRAMEWORK-001 | framework freshness | reusable patterns feed back to `xi-io.net#239` after proof |

## Definition Of Ready

A slice is ready only when all items are known:

| ID | Criterion |
| --- | --- |
| GATE-READY-GOAL | goal known |
| GATE-READY-SCOPE | scope known |
| GATE-READY-EXCLUDED | excluded scope known |
| GATE-READY-DEPS | dependencies known |
| GATE-READY-BLOCKERS | blockers known |
| GATE-READY-ACCEPT | acceptance criteria known |
| GATE-READY-VALIDATE | validation method known |
| GATE-READY-EVIDENCE | evidence artifact known |
| GATE-READY-ROLLBACK | rollback/block condition known |

## Definition Of Done

A slice is done only when:

| ID | Criterion |
| --- | --- |
| GATE-DONE-ACCEPT | acceptance criteria are satisfied or explicitly blocked |
| GATE-DONE-EVIDENCE | validation evidence is recorded |
| GATE-DONE-COMPLIANCE | compliance checks are satisfied or explicitly blocked |
| GATE-DONE-TODO | `TODO.md` is updated |
| GATE-DONE-SCOPE | no forbidden scope was added |
| GATE-DONE-SILENT | no failure was silent |
| GATE-DONE-STATUS | PR/status/comment updates are made where relevant |

## Risk Register Summary

| ID | Risk | Severity | Likelihood | Mitigation | Status | Blocking Gate |
| --- | --- | --- | --- | --- | --- | --- |
| RISK-001 | UI implementation starts before stories/gates are normalized | high | medium | complete PLAN-001A before UI-004A.6/UI-004B | active | GATE-UI-WARGAME-001 |
| RISK-002 | visual polish repeats generic dashboard/card patterns | high | high | use UI-004A visual standard and wargame scoring | active | GATE-VISUAL-PROOF-001 |
| RISK-003 | runtime/platform claims leak into static preview | high | medium | keep ARCH-004 gate visible and blocked | active | GATE-RUNTIME-001 |
| RISK-004 | provider or credential behavior is implied before gates exist | high | medium | provider gates remain blocked and documented | active | GATE-PROVIDER-001 |
| RISK-005 | reusable framework work remains product-local | medium | medium | report candidates to `xi-io.net#239` after proof | active | GATE-FRAMEWORK-001 |

## Standing Rules

- PR #12 remains draft until visual proof passes.
- Visual proof remains incomplete until owner/framework review passes.
- Pass 4 remains blocked until Android proof, UI proof, and ARCH-004 decisions clear.
- Provider connections, credentials, runtime writes, automation execution, local cloud behavior, and platform claims are forbidden in PLAN-001A.
- Product UI code must not change in PLAN-001A.

## Decision

```text
PLAN_001A_PRODUCT_DELIVERY_GOVERNANCE_SKELETON_REQUIRED_BEFORE_UI_004A6
```
