# Framework Engine Hook Plan

## Purpose

Define which validation and governance hooks are needed for `xi-io Inbox` UI polish and which belong later in `xi-io.net`.

This plan follows the framework engine boundary model:

```text
Ingress -> Analysis -> Reality Engine -> Egress -> Lexicon
```

and the validation families documented in `xi-io.net`.

## Hook Rule

Add hooks that evaluate or enforce UI safety and quality now. Do not attach runtime/provider/platform hooks before ARCH-004 and provider gates are resolved.

## Required Now

### ux_wargame_hook

- Purpose: run simulated page scenarios against docs, screenshots, and static preview behavior.
- Input: scenario matrix, route screenshots, route URL, current commit, page plan.
- Output: pass/fail findings, maturity impact, TODO candidates.
- Runs: before UI-004B acceptance and before owner visual proof.
- Blocking: blocking for UI-004B exit when critical shell/Inbox scenarios fail.
- Related docs: `13-page-leveling-and-wargame-standard.md`, `14-ui-wargame-scenario-matrix.md`.
- Components: XiWargameScenarioCard, XiVisualQAScorecard.
- Scope: Inbox now; feed standard to `xi-io.net#239`.

### visual_qa_hook

- Purpose: score pages with the 0-3 visual QA rubric.
- Input: screenshots, route, reviewer, rubric categories.
- Output: page score receipt and blocker TODOs.
- Runs: after each visual polish slice.
- Blocking: blocking for visual proof and PR draft exit.
- Related docs: `12-visual-qa-rubric.md`.
- Components: XiVisualQAScorecard.
- Scope: should become framework-level.

### a11y_gate_hook

- Purpose: check focus order, visible focus, labels, names/roles/values, status messages, and predictable navigation.
- Input: route DOM, keyboard script, accessibility notes.
- Output: pass/fail gate receipt and TODOs.
- Runs: before accepting interactive polish.
- Blocking: blocking for visual proof when safety or navigation is affected.
- Related docs: `11-interaction-standard.md`, `docs/ui/ui-002-accessibility-egress-check.md`.
- Components: XiLaneNav, XiContextInspector, XiSafeActionBar.
- Scope: framework-level pattern with product-specific route matrix.

### egress_safety_hook

- Purpose: verify no send, forward, delete, archive, disclose, publish, deploy, provider mutation, repo mutation, or automation execution path is active.
- Input: DOM controls, event handlers where inspectable, fixture policy.
- Output: blocked-action receipt.
- Runs: every UI implementation pass.
- Blocking: always blocking.
- Related docs: `docs/security/draft-only-egress.md`, `11-interaction-standard.md`.
- Components: XiSafeActionBar, XiGatePanel.
- Scope: framework-level.

### provider_gate_hook

- Purpose: verify provider actions remain blocked and explain why.
- Input: provider gate fixture, Extensions/Settings routes, inspector copy.
- Output: provider gate receipt.
- Runs: before any provider-adjacent UI acceptance.
- Blocking: blocking while ARCH-003/ARCH-004 remain unresolved.
- Related docs: `09-settings-provider-gates-polish-plan.md`, `06-extensions-polish-plan.md`.
- Components: XiGatePanel, XiTrustCluster.
- Scope: framework-level with product adapters later.

### receipt_hook

- Purpose: verify proposals, drafts, gates, blocked events, and future actions have receipt expectations.
- Input: fixture records, receipts lane, inspector content.
- Output: receipt coverage report.
- Runs: before accepting actions/proposals UI.
- Blocking: blocking for egress-related UI.
- Related docs: `07-receipts-polish-plan.md`, `docs/product/invariants.md`.
- Components: XiReceiptLedger, XiReceiptRow.
- Scope: framework-level.

### ibal_proposal_hook

- Purpose: verify Ibal proposes, explains, cites source lanes/blockers, and does not execute.
- Input: Ibal lane, inspector content, source links.
- Output: Ibal proposal safety report.
- Runs: before Ibal UI acceptance.
- Blocking: blocking if Ibal appears executable or unsupported.
- Related docs: `08-ibal-polish-plan.md`, `11-interaction-standard.md`.
- Components: XiIbalRecommendation, XiCrossLaneLink.
- Scope: framework-level with product-specific source maps.

### rosetta_label_hook

- Purpose: prevent synonym drift in core product terms.
- Input: route labels, nav labels, status tokens, action labels.
- Output: label drift report.
- Runs: before polish acceptance and framework promotion.
- Blocking: advisory at first; blocking before Level 5.
- Related docs: visual standard, interaction standard, page plans.
- Components: XiStatusToken, XiLaneNav.
- Scope: framework-level.

Canonical labels:

- Inbox
- Calendar
- Tasks
- Automations
- Extensions
- Receipts
- Ibal
- Provider Gates
- Draft-only
- Proposal-only
- Runtime blocked
- Provider blocked
- Receipt
- Evidence
- Source
- Gate
- Next safe action

### framework_freshness_hook

- Purpose: report reusable patterns, blockers, and promotion candidates back to `xi-io.net#239`.
- Input: component inventory, Level 5 candidates, implementation receipts.
- Output: framework feedback comment or receipt.
- Runs: after UI-004B and after each framework-grade component emerges.
- Blocking: advisory for local page polish; blocking for framework-grade classification.
- Related docs: `16-white-label-framework-feedback-plan.md`.
- Components: all promoted Xi* candidates.
- Scope: `xi-io.net#239`.

## Not Required Yet

### live provider adapter hooks

Reason: provider connection, credentials, and provider reads/writes are blocked by ARCH-003/ARCH-004 and safety policy.

### local cloud hooks

Reason: local cloud/home server role is not decided by ARCH-004.

### automation execution hooks

Reason: automations are dry-run/proposal only; execution is blocked.

### send / forward / delete hooks

Reason: these actions remain absent or disabled. Only egress safety validation is needed now.

### Electron / Tauri / native hooks

Reason: platform/runtime surface is undecided.

### full model-provider routing hooks

Reason: model provider routing is not required for static UI proof; Ibal remains proposal-only.

## Framework Placement

Inbox-local first:

- scenario definitions,
- page maturity records,
- product-specific Rosetta labels.

Framework candidates:

- visual QA hook,
- a11y gate hook,
- egress safety hook,
- provider gate hook,
- receipt hook,
- Ibal proposal hook,
- framework freshness hook.

## Acceptance

This plan is valid when each hook has:

- purpose,
- input,
- output,
- run timing,
- blocking/advisory status,
- related docs,
- component relationship,
- Inbox-local vs framework disposition.

## Decision

```text
UI_004A5_FRAMEWORK_ENGINE_HOOK_PLAN_READY_FOR_WARGAME_REVIEW
```
