# Build Readiness Gates

## Purpose

Define explicit gates that control when UI implementation, visual proof, runtime work, provider integration, automation execution, Android proof, framework export, local cloud work, and product MVP build may proceed.

## Gate States

| State | Meaning |
| --- | --- |
| pass | all required evidence exists |
| blocked | required evidence or decision is missing |
| partial | some evidence exists but gate cannot pass |
| not-applicable-yet | later scope |

## Gates

| ID | Gate Name | Required Completed Docs | Required Evidence | Evidence Artifact | Blocking Issues | Forbidden Actions While Blocked | State | Risk References | Next Review Trigger |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| GATE-LOCAL-OPERABILITY-001 | Tier 1 local operability allowed | UI-005A architecture docs, local operability contract | Tier 1/Tier 2 boundary explicit; no runtime claims in Tier 1 | `docs/ui/reviews/ui-005a-operability-architecture-receipt.md` | UI-005A incomplete | Tier 2 provider/runtime actions in Tier 1 UI | blocked until UI-005A pass | RISK-004, RISK-009 | UI-005A pass |
| GATE-UI-IMPLEMENT-001 | UI implementation allowed | PLAN-001A, UI-004A.6 receipt | wargame failures/TODOs recorded | `docs/ui/reviews/ui-004a6-wargame-review.md` | none for UI-004B repair scope | page-specific polish before UI-004B | pass for UI-004B–G; UI-005B+ requires GATE-LOCAL-OPERABILITY-001 | RISK-002 | start UI-005B after GATE-LOCAL-OPERABILITY-001 |
| GATE-UI-VISUAL-001 | UI visual proof allowed | UI-004B and page-specific polish receipts | visual QA thresholds met, owner review ready | `docs/ui/ui-002-local-proof-status.md` | visual polish incomplete | mark visual proof complete, PR ready-for-review | blocked | RISK-002 | after UI-004 polish receipts |
| GATE-PR12-DRAFT-001 | PR #12 draft exit allowed | UI visual proof, CI, TODO clean for scope | owner/framework visual proof pass | PR #12 body/comment receipt | visual proof incomplete | merge PR #12, mark ready | blocked | RISK-002 | after owner visual proof |
| GATE-RUNTIME-001 | runtime skeleton allowed | ARCH-002 evidence, ARCH-004 decision, UI proof | build/platform decisions and UI acceptance | `docs/reports/pass-4-runtime-skeleton-receipt.md` | ARCH-002, ARCH-004, visual proof | runtime skeleton/import | blocked | RISK-003 | after ARCH/UI gates pass |
| GATE-PROVIDER-001 | provider integration allowed | ARCH-003/ARCH-004, provider schema review, egress policy | credentials/permission/storage boundary | future provider gate receipt | provider identity/secrets unresolved | OAuth, credentials, provider read/write | blocked | RISK-004 | after provider architecture decision |
| GATE-AUTO-EXEC-001 | automation execution allowed | egress gatekeeper, receipts, provider gates, runtime security | dry-run to approval to execution contract | future automation execution receipt | runtime/provider/security unresolved | run/enable automation | blocked | RISK-004 | after runtime provider safety proof |
| GATE-ANDROID-001 | Android build proof allowed | ARCH-002 packet | local upstream build command/evidence | `docs/reports/arch-002-build-proof-receipt.md` | local execution pending | runtime import/fork work | partial | RISK-006 | when operator runs ARCH-002 prompt |
| GATE-FRAMEWORK-EXPORT-001 | framework export/reuse allowed | UI-004B proof, Level 4/5 candidate docs, `xi-io.net#239` disposition | reusable candidate feedback | `xi-io.net#239` comment/receipt | direct export unresolved | direct package import claim | blocked | RISK-005 | after UI-004B and page proof |
| GATE-LOCAL-CLOUD-001 | local cloud/home server work allowed | ARCH-004 decision, threat model, storage/secrets plan | local cloud role and auth boundary | future ARCH-004 receipt | ARCH-004 unresolved | local server behavior, sync, LAN claims | blocked | RISK-003, RISK-007 | after ARCH-004 decision |
| GATE-MVP-001 | product MVP build allowed | PR #12 visual proof, ARCH decisions, provider/egress/compliance gates | MVP scope, validation matrix, risk review | future MVP readiness receipt | all major gates incomplete | MVP/runtime claims | blocked | RISK-001..RISK-008 | after runtime skeleton proof |

## Risk Register

| ID | Risk Statement | Severity | Likelihood | Mitigation | Current Status | Blocking Gate |
| --- | --- | --- | --- | --- | --- | --- |
| RISK-001 | Implementation starts from scattered intent rather than normalized requirements/stories. | high | medium | PLAN-001A creates requirements, backlog, slices, gates, hydration, compliance IDs. | active | GATE-UI-IMPLEMENT-001 |
| RISK-002 | UI remains structurally complete but visually below competitive product quality. | high | high | UI-004A visual standard, UI-004A.6 wargame, visual QA scoring, owner review. | active | GATE-UI-VISUAL-001 |
| RISK-003 | Static browser preview is mistaken for runtime/platform decision. | high | medium | ARCH-004 gate and platform matrix remain blocking. | active | GATE-RUNTIME-001 |
| RISK-004 | Provider, credential, send, delete, disclose, repo mutation, or automation execution becomes implied. | critical | medium | draft-only egress policy, disabled/absent actions, provider gates, egress safety hook. | active | GATE-PROVIDER-001 |
| RISK-005 | Framework reusable patterns are trapped locally or duplicated inconsistently. | medium | medium | white-label feedback plan and `xi-io.net#239` comments after proof. | active | GATE-FRAMEWORK-EXPORT-001 |
| RISK-006 | Android mail spine import happens before upstream build proof/license/provider identity proof. | high | medium | ARCH-002 and ARCH-003 remain blockers. | active | GATE-ANDROID-001 |
| RISK-007 | Local cloud/home server scope is invented before security boundary exists. | high | medium | ARCH-004 must decide role/auth/storage/sync/backup. | active | GATE-LOCAL-CLOUD-001 |
| RISK-008 | Compliance evidence remains fragmented and failures are missed. | high | medium | compliance validation index centralizes status and evidence artifacts. | active | GATE-MVP-001 |
| RISK-009 | Local operability UI leaks into runtime/provider/platform claims. | critical | medium | GATE-LOCAL-OPERABILITY-001, Tier 1 contract, blocked escalation patterns, receipt labeling. | active | GATE-LOCAL-OPERABILITY-001 |

## Evidence Artifact Naming

Future validation receipts should use:

```text
docs/reports/<gate-or-slice>-receipt.md
docs/ui/reviews/<ui-slice>-receipt.md
docs/product/reviews/<planning-slice>-receipt.md
```

No receipt may claim runtime, provider, platform, or visual proof unless the matching gate has passed.

## Decision

```text
PLAN_001A_BUILD_READINESS_GATES_EXPLICIT_AND_BLOCKING
```
