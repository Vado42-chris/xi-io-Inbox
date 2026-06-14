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
| SLICE-UI-005A | operability architecture | define human-operable shell, Ibal concierge model, local operability contract | docs under `docs/ui/`, governance updates | product UI code, runtime, provider work | UI-003E preliminary fail, UI-004 complete | three UI-005 docs + receipt + gate updates | doc review, npm check | `docs/ui/reviews/ui-005a-operability-architecture-receipt.md` | if Tier 2 implied or UI code changed, block | ready | not started | 1 pass |
| SLICE-UI-005B | Inbox operability | compose, reply draft, triage, local state | Inbox lane UI only | send, provider, runtime | UI-005A pass | WG-005-003 pass, local draft receipt | route smoke, keyboard | `docs/ui/reviews/ui-005b-inbox-operability-receipt.md` | send enabled or fixture mutated without doc, block | blocked | not started | 1 to 2 passes |
| SLICE-UI-005C | Calendar operability | local event proposal create/edit | Calendar lane | provider write | UI-005B patterns | WG-005-004 pass | route smoke | `docs/ui/reviews/ui-005c-calendar-operability-receipt.md` | confirmed event implied, block | blocked | not started | 1 pass |
| SLICE-UI-005D | Tasks operability | create/edit tasks, inbox ingress UI | Tasks + cross-lane | provider/repo write | UI-005B patterns | WG-005-005 pass | route smoke | `docs/ui/reviews/ui-005d-tasks-operability-receipt.md` | external sync implied, block | blocked | not started | 1 pass |
| SLICE-UI-005E | Automations operability | rule builder, dry-run only | Automations lane | execution | UI-005A contract | WG-005-006 pass | dry-run review | `docs/ui/reviews/ui-005e-automations-operability-receipt.md` | enable/run works, block | blocked | not started | 1 pass |
| SLICE-UI-005F | Extensions operability | install/remove/detail preview UI | Extensions lane | OAuth, credentials | UI-005A contract | preview install/remove local only | provider gate review | `docs/ui/reviews/ui-005f-extensions-operability-receipt.md` | live connect path, block | blocked | not started | 1 pass |
| SLICE-UI-005G | Settings operability | editable gate/policy forms | Settings lane | runtime provider change | UI-005A contract | local settings overlay | form smoke | `docs/ui/reviews/ui-005g-settings-operability-receipt.md` | runtime policy apply implied, block | blocked | not started | 1 pass |
| SLICE-UI-005H | Ibal concierge shell | concierge drawer, command integration, remove Ibal lane | shell + concierge | execution, model routing | UI-005A Ibal model | WG-005-001/002 pass | keyboard/focus | `docs/ui/reviews/ui-005h-ibal-concierge-receipt.md` | Ibal lane restored as primary, block | blocked | not started | 1 to 2 passes |
| SLICE-UI-005I | Account/session shell | workspace switch, preview login UI | top bar/account | real auth backend | UI-005A contract | preview session switch only | smoke | `docs/ui/reviews/ui-005i-account-session-receipt.md` | OAuth/credential storage, block | blocked | not started | 1 pass |
| SLICE-ARCH-002 | Android build proof | prove Thunderbird Android upstream build or classify failure | local upstream build proof, evidence comment | runtime import, fork identity implementation | existing ARCH-002 packet | build success or classified failure recorded | build proof receipt | `docs/reports/arch-002-build-proof-receipt.md` | if build cannot run, classify failure | planned | not started | 1 to 3 passes |
| SLICE-ARCH-004 | platform/runtime decision | decide runtime/platform envelope before Pass 4 | decision receipt covering storage, secrets, sync, local cloud, surfaces | implementation | UI proof, Android proof inputs where relevant | ARCH-004 decision receipt complete | architecture review | `docs/reports/arch-004-runtime-decision-receipt.md` | unresolved platform/security boundary blocks runtime | blocked | not started | 1 to 2 passes |
| SLICE-PASS-004 | Pass 4 runtime skeleton | create minimal buildable runtime skeleton after gates clear | skeleton, schema validation, example events/proposals, tests, CI | provider credentials, real sends, automation execution | ARCH-002, ARCH-004, UI visual proof | build/test/CI evidence complete | build/test receipt | `docs/reports/pass-4-runtime-skeleton-receipt.md` | if any build gate fails, do not start | blocked | not started | unknown until gates clear |
| SLICE-UI-006 | progressive disclosure IA | list/detail workspace per operable lane | `public/inbox-preview.*` | discard UI-005 | UI-005 complete | UI-006A–F commits | npm check | commit chain `dbbff67`→`197f25d` | lane dump regression | complete | local; push pending | 6 passes |
| SLICE-UI-007A | draft workbench architecture | state reconciliation + draft spine docs | `docs/ui/ui-007-*` | product UI code | owner clarification | architecture + send-event docs | doc review | `ui-007a-draft-workbench-architecture-receipt.md` | runtime claims in docs | complete | this pass | 1 pass |
| SLICE-UI-007B | drafts / approval queue workbench | Drafts view, approval queue, draft object in storage | Inbox/workbench UI | send execution | UI-007A, GATE-DRAFT-WORKBENCH-001 | WG draft queue scenarios | route smoke | `ui-007b-r1/r2/r3`, `ui-007c` receipts | send enabled in Tier 1 | ready | complete locally | owner proof + push |

## Near-Term Order

**Corrected 2026-06-13 (app peer review / plan alignment):**

1. SLICE-UI-011A — Product Capability Gap Matrix — **complete**
2. SLICE-UI-011B–I — capability repairs — **complete**
3. SLICE-UI-012A — Ibal/Rabbit visual parity brief (docs) — **complete**
4. SLICE-UI-012B — visual token/component alignment — **complete**
5. SLICE-UI-012C — layout/composition polish — **complete**
6. SLICE-NAV-001 — app shell / navigation correction — **complete** (`nav-001-app-shell-navigation-correction-receipt.md`)
7. SLICE-GMAIL-002A — real Gmail metadata bridge — **complete** (`gmail-002a-real-gmail-metadata-ingress-receipt.md`)
8. SLICE-GMAIL-002A-HARDEN — adapter/security hardening — **complete** (`gmail-002a-hardening-receipt.md`)
9. SLICE-GMAIL-002B — read-only body gate — **complete** (`gmail-002b-read-only-body-gate-receipt.md`)
10. SLICE-ACC-001 — account/mail organization UX — **complete** (`acc-001-account-mail-organization-ux-receipt.md`)
11. SLICE-APP-PR-2026-06-13 — app peer review + plan alignment — **complete** (`app-peer-review-plan-alignment-2026-06-13.md`)
12. SLICE-GMAIL-002B-LIVE-PROOF metadata phase — **complete** (`gmail-002b-live-proof-receipt.md`)
13. SLICE-MAIL-001 mail workspace IA repair — **complete** (owner visual review pending)
14. SLICE-UI-012D–F — interaction, a11y, readiness gate — **complete** (code pass)
15. SLICE-ROUTE-SMOKE — Playwright hash-route smoke — **complete** (`scripts/route-smoke.mjs`)
16. SLICE-GMAIL-HARDEN-001 — adapter privacy hardening — **complete** (`gmail-harden-001-privacy-hardening-receipt.md`)
17. SLICE-NPM-AUDIT-GMAIL-001 — review 4 moderate `tools/gmail` dependency vulnerabilities — **complete** (`npm-audit-gmail-001-dependency-audit-receipt.md`)
18. SLICE-UI-NORTH-STAR-AMEND — Option B: Mail spine plus primary Calendar/Tasks/Home — **complete** (`ui-north-star-ratification-2026-06-13.md`)
19. SLICE-NAV-002 — restore primary Home/Calendar/Tasks and dissolve Plan into Tasks sub-views — **complete** (`nav-002-primary-operations-nav-receipt.md`)
20. SLICE-UI-013A — Level 2 visual experience system plan — **complete** (`ui-013-level-2-visual-experience-system.md`)
21. SLICE-UI-014A — Level 3 contextual cross-pollination map — **complete** (`ui-014-level-3-contextual-cross-pollination-map.md`)
22. SLICE-UI-015 — Level 4 lane purpose / journey / failure index — **complete** (`ui-015-level-4-lane-purpose-journey-index.md`)
23. SLICE-UI-016A — Level 5 componentization / framework-vs-repo-vs-template audit — **complete** (`ui-016-level-5-componentization-consistency-index.md`)
24. SLICE-UI-016B — component anatomy spec — **complete** (`ui-016b-component-anatomy-and-boundary-checks.md`)
25. SLICE-PLAN-STD-001 — cross-project planning/framework document standardization — **complete** (`07-cross-project-planning-standard.md`, `framework-document-standardization-backfeed.md`)
26. SLICE-UI-016C — component boundary check scripts — **complete** (`ui-016c-boundary-check.mjs`)
27. SLICE-UI-013B — visual system implementation (agent CSS pass) — **complete** (`ui-013b-visual-implementation-receipt.md`)
28. SLICE-UI-014B — cross-pollination implementation — **complete** (`ui-014b-cross-pollination-implementation-receipt.md`)
29. SLICE-SCOPE-001 — shared account scope lens for Mail/Calendar/Tasks/Activity — **complete** (`scope-001-shared-account-lens-receipt.md`)
31. SLICE-PR-20-PEER-REVIEW — independent verification + merge prep — **complete** (`pr-20-full-peer-review-2026-06-14.md`)
32. SLICE-PR-20-MERGE — merge PR #20 into ui-002 product branch — **complete** @ `50a6ad8`
33. SLICE-UI-013C — owner-grade visual redesign — **complete agent pass** (`ui-013c-visual-implementation-receipt.md`); owner direction PASS; UI-003E proof pending
34. SLICE-RECON-GMAIL-001 — Gmail source-truth + adapter contract repair — **complete** (`recon-gmail-001-source-truth-contract-repair-receipt.md`) @ `93c3501`
35. SLICE-GMAIL-002A-EXT-001 — metadata pagination + label-scoped sync jobs — **complete + peer reviewed** (`gmail-002a-ext-001-peer-review-receipt.md`)
36. SLICE-GMAIL-002A-EXT-002 — local mail index — **complete agent pass** (`gmail-002a-ext-002-local-mail-index-receipt.md`); peer review partial
37. SLICE-GMAIL-002A-EXT-002-REPAIR — index safety repair — **complete** (`gmail-002a-ext-002-repair-receipt.md`)
38. SLICE-GMAIL-002A-EXT-003 — sync status UI + Activity receipts — **complete** (`gmail-002a-ext-003-sync-status-activity-receipts-receipt.md`)
39. SLICE-GMAIL-002A-EXT-004 — historyId incremental sync — **next**
40. SLICE-UI-003E owner visual proof — **ready for owner** after UI-013C chrome tweak
41. SLICE-UI-CONVERGE-001 — module skeleton + route-table contract — **ready after owner proof**

Prior slices (UI-004 through UI-011I) remain complete locally.

## Slice Rules

- A slice cannot start unless Definition of Ready is satisfied.
- A slice cannot complete unless Definition of Done is satisfied.
- If a slice discovers a blocker, update TODO and the relevant gate document.
- Do not merge PR #12 or mark visual proof complete during planning slices.

## Decision

```text
PLAN_001A_SPRINT_SLICE_PLAN_READY_FOR_UI_004A6_SEQUENCE
```
