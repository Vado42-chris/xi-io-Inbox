# Sprint And Slice Plan

## Purpose

Define bounded delivery slices for the current planning, UI, architecture, framework, and runtime sequence.

These slices are execution units inside the larger waterfall phase map in `docs/product/00-product-delivery-governance.md`.

## Slice Status Values

| Status | Meaning |
| --- | --- |
| complete | done with evidence |
| ready | Definition of Ready satisfied |
| blocked | cannot start until named blockers clear |
| planned | expected later, not ready yet |

## Delivery Slices

| ID | Slice | Goal | Scope | Excluded Scope | Dependencies | Acceptance Criteria | Validation Evidence | Evidence Artifact | Rollback / Block Condition | Ready State | Done State | Estimate Impact |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SLICE-PLAN-001A | PLAN-001A governance skeleton | create minimum product delivery governance, requirements, backlog, slices, gates, hydration, compliance index | docs only under `docs/product/` plus TODO | UI code, runtime, provider work, full final requirements packet | UI-004A.5 docs, product roadmap/invariants | seven docs exist, IDs present, TODO updated, PR draft unchanged | doc review, git diff | EVIDENCE-PLAN-001A | if docs drift into implementation claims, stop and correct | ready | complete in this pass | keeps 4 to 7 pass estimate |
| SLICE-PLAN-001B | detailed product delivery packet | expand user journeys, page/system map, component contracts, data/event model, QA matrix, agent handoff only if needed | docs only | implementation and runtime | PLAN-001A findings | missing details from PLAN-001A are closed or explicitly deferred | doc review | EVIDENCE-PLAN-001B | if UI-004A.6 is not blocked by missing detail, defer PLAN-001B | planned | not started | conditional |
| SLICE-UI-004A6 | simulated wargame review | run current UI through normalized stories, scenarios, visual QA, maturity levels | review receipt and TODO updates | UI code changes | PLAN-001A complete | scenario pass/fail and TODOs recorded | wargame review | `docs/ui/reviews/ui-004a6-wargame-review.md` | failed scenario creates TODO, not silent pass | ready | complete | completed in this pass |
| SLICE-UI-004B | shell/topbar/navigation/safety/inspector polish | apply visual standard to app shell and system chrome only | `public/` UI shell CSS/JS/HTML as needed | page-specific lane polish | UI-004A.6 complete | shell visual QA threshold met, egress blocked, routes stable | npm check, screenshot/route receipt | `docs/ui/reviews/ui-004b-shell-polish-receipt.md` | if safety or route behavior regresses, block | ready | not started | 1 to 2 passes |
| SLICE-UI-004C | Inbox lane polish | make Inbox lane feel like premium mail/thread triage | Inbox page only | providers, send, archive, runtime mail import | UI-004B | Inbox visual/object model thresholds met | visual QA + wargame | `docs/ui/reviews/ui-004c-inbox-polish-receipt.md` | if draft-only/send boundary blurs, block | blocked | not started | 1 to 2 passes |
| SLICE-UI-004D | Ibal and Receipts polish | polish conductor/orchestrator and ledger/audit differentiators | Ibal and Receipts lanes | execution, model routing, runtime receipts | UI-004B, UI-004C patterns | proposal-only and audit-first behavior clear | visual QA + receipt hook | `docs/ui/reviews/ui-004d-ibal-receipts-receipt.md` | if Ibal appears executable or receipts imply runtime proof, block | blocked | not started | 1 to 2 passes |
| SLICE-UI-004E | Provider Gates and Settings polish | make provider/privacy/policy gates legible and trustworthy | Settings / Provider Gates, related Extensions gate states | OAuth, credentials, provider reads/writes | UI-004B | provider blocks, permission states, policy defaults clear | provider gate review | `docs/ui/reviews/ui-004e-provider-gates-receipt.md` | if connection path appears live, block | blocked | not started | 1 pass |
| SLICE-UI-004F | Calendar and Tasks polish | polish time/work lanes around proposals, sources, and status | Calendar and Tasks lanes | provider writes, external task mutation | UI-004B, Inbox source pattern | source links and proposal states clear | wargame + visual QA | `docs/ui/reviews/ui-004f-calendar-tasks-receipt.md` | if proposal appears confirmed, block | blocked | not started | 1 to 2 passes |
| SLICE-UI-004G | Automations and Extensions polish | polish dry-run rules and provider/tool control center | Automations and Extensions lanes | automation execution, OAuth, credentials | UI-004B, provider gate pattern | dry-run and blocked provider states clear | dry-run/provider gate review | `docs/ui/reviews/ui-004g-automation-extensions-receipt.md` | if automation appears runnable, block | blocked | not started | 1 pass |
| SLICE-ARCH-002 | Android build proof | prove Thunderbird Android upstream build or classify failure | local upstream build proof, evidence comment | runtime import, fork identity implementation | existing ARCH-002 packet | build success or classified failure recorded | build proof receipt | `docs/reports/arch-002-build-proof-receipt.md` | if build cannot run, classify failure | planned | not started | 1 to 3 passes |
| SLICE-ARCH-004 | platform/runtime decision | decide runtime/platform envelope before Pass 4 | decision receipt covering storage, secrets, sync, local cloud, surfaces | implementation | UI proof, Android proof inputs where relevant | ARCH-004 decision receipt complete | architecture review | `docs/reports/arch-004-runtime-decision-receipt.md` | unresolved platform/security boundary blocks runtime | blocked | not started | 1 to 2 passes |
| SLICE-PASS-004 | Pass 4 runtime skeleton | create minimal buildable runtime skeleton after gates clear | skeleton, schema validation, example events/proposals, tests, CI | provider credentials, real sends, automation execution | ARCH-002, ARCH-004, UI visual proof | build/test/CI evidence complete | build/test receipt | `docs/reports/pass-4-runtime-skeleton-receipt.md` | if any build gate fails, do not start | blocked | not started | unknown until gates clear |

## Near-Term Order

1. SLICE-PLAN-001A
2. SLICE-UI-004A6
3. SLICE-UI-004B
4. SLICE-UI-004C
5. SLICE-UI-004D
6. SLICE-UI-004E
7. SLICE-UI-004F
8. SLICE-UI-004G
9. SLICE-ARCH-002 and SLICE-ARCH-004 as separate architecture tracks
10. SLICE-PASS-004 only after gates clear

## Slice Rules

- A slice cannot start unless Definition of Ready is satisfied.
- A slice cannot complete unless Definition of Done is satisfied.
- If a slice discovers a blocker, update TODO and the relevant gate document.
- Do not merge PR #12 or mark visual proof complete during planning slices.

## Decision

```text
PLAN_001A_SPRINT_SLICE_PLAN_READY_FOR_UI_004A6_SEQUENCE
```
