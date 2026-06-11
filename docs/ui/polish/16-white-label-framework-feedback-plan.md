# White-Label Framework Feedback Plan

## Purpose

Identify which `xi-io Inbox` UI patterns should become reusable `xi-io.net` framework candidates and what white-label support the framework needs.

Direct framework import remains blocked by `xi-io.net#239`; this plan records candidates and promotion rules only.

## Promotion Rule

A local pattern becomes a framework candidate when it:

- appears in two or more Inbox lanes or two or more xi-io products,
- has stable anatomy,
- has documented accessibility rules,
- has documented safety/egress rules,
- passes Level 4 locally,
- has a clear white-label slot model,
- does not encode product-private assumptions.

Level 5 requires framework feedback disposition.

## Reusable Component Candidates

### XiAppShell

- Reusable value: all xi-io products need a product shell with route, trust, and inspector regions.
- Inbox proof page: all routes.
- Validate before promoting: responsive shell, landmarks, trust cluster placement, no warning-slab identity.
- xi-io.net#239 timing: after UI-004B.

### XiLaneNav

- Reusable value: lane-based products need consistent navigation without duplicating filter controls.
- Inbox proof page: all routes.
- Validate before promoting: active state, keyboard order, label lock, sparse status tokens.
- xi-io.net#239 timing: after UI-004B.

### XiTrustCluster

- Reusable value: provider/runtime/safety-aware apps need compact global trust state.
- Inbox proof page: Home, Settings, Extensions.
- Validate before promoting: no badge spam, text not color-only, route-level scoping.
- xi-io.net#239 timing: after UI-004B.

### XiContextInspector

- Reusable value: many xi-io products need selected item, evidence, safe action, blockers, and receipts.
- Inbox proof page: Inbox, Ibal, Receipts.
- Validate before promoting: selected-object model, focus stability, responsive behavior.
- xi-io.net#239 timing: after UI-004B plus Inbox polish.

### XiGatePanel

- Reusable value: provider, runtime, permission, and egress gates recur across products.
- Inbox proof page: Settings, Extensions, Automations.
- Validate before promoting: reason, scope, unlock requirement, receipt implication.
- xi-io.net#239 timing: after Settings/Extensions polish.

### XiReceiptLedger

- Reusable value: audit-first products need ledger views.
- Inbox proof page: Receipts.
- Validate before promoting: type/source/state columns, selection behavior, no-execution rule.
- xi-io.net#239 timing: after Receipts polish.

### XiReceiptRow

- Reusable value: compact audit records can appear in Receipts, inspector, Home, and Workbench.
- Inbox proof page: Receipts, Home.
- Validate before promoting: source/evidence links, status token rules, accessible row names.
- xi-io.net#239 timing: after Receipts polish.

### XiIbalRecommendation

- Reusable value: Ibal proposal surfaces are core framework behavior.
- Inbox proof page: Ibal, Home, inspector.
- Validate before promoting: recommendation, why, evidence, blockers, source lanes, proposal-only state.
- xi-io.net#239 timing: after Ibal polish.

### XiSafeActionBar

- Reusable value: draft/proposal-only and blocked egress actions recur across products.
- Inbox proof page: Inbox, Settings, inspector.
- Validate before promoting: disabled/absent action rules, no handler, compact policy treatment.
- xi-io.net#239 timing: after UI-004B plus Inbox polish.

### XiSourceEvidenceBlock

- Reusable value: source/provenance display is a framework-wide trust primitive.
- Inbox proof page: Inbox, Ibal, Receipts, Calendar.
- Validate before promoting: evidence class, source id, caveat, privacy-safe summary.
- xi-io.net#239 timing: after Inbox/Ibal polish.

### XiCrossLaneLink

- Reusable value: source relationships connect thread, task, event, receipt, Ibal, and gates.
- Inbox proof page: Inbox -> Calendar, Inbox -> Tasks, Receipts -> source.
- Validate before promoting: route links, source labels, no runtime mutation.
- xi-io.net#239 timing: after first cross-lane wargame pass.

### XiDryRunRuleCard

- Reusable value: safe automation simulation appears in Inbox and future framework automation products.
- Inbox proof page: Automations.
- Validate before promoting: trigger, condition, proposal, gate, receipt chain.
- xi-io.net#239 timing: after Automations polish.

### XiObjectTimeline

- Reusable value: thread/event/history relationships need timeline rhythm across products.
- Inbox proof page: Inbox thread timeline, Receipts history.
- Validate before promoting: chronological order, source labels, evidence caveats.
- xi-io.net#239 timing: promote later.

### XiStatusToken

- Reusable value: semantic status consistency prevents label and color drift.
- Inbox proof page: all routes.
- Validate before promoting: global/lane/object layering, Rosetta labels, color-not-only.
- xi-io.net#239 timing: after UI-004B.

### XiVisualQAScorecard

- Reusable value: framework products need repeatable owner/framework visual review.
- Inbox proof page: review docs.
- Validate before promoting: score format, thresholds, TODO generation.
- xi-io.net#239 timing: now as planning candidate; implementation later.

### XiWargameScenarioCard

- Reusable value: simulated scenario reports should be comparable across products.
- Inbox proof page: `14-ui-wargame-scenario-matrix.md`.
- Validate before promoting: scenario shape, result shape, maturity impact.
- xi-io.net#239 timing: now as planning candidate; implementation later.

## White-Label Framework Needs

The framework should support:

- product name slot,
- product mark slot,
- lane registry,
- route registry,
- navigation labels,
- trust-state tokens,
- provider-gate configuration,
- Ibal lane enable/disable,
- receipt/audit support,
- theme tokens,
- density mode,
- accessibility defaults,
- no-runtime-write policy defaults,
- framework freshness receipt.

## Product-Specific Customization For Inbox

Inbox needs custom defaults for:

- controlled ingress and egress language,
- draft/proposal-only actions,
- provider gates for email/calendar/tasks/source integrations,
- Ibal conductor language,
- receipt-first audit language,
- privacy-safe message summaries,
- cross-lane object graph.

## Cross-Lane Object Graph

Required relationships:

- inbox thread -> draft proposal,
- inbox thread -> calendar proposal,
- inbox thread -> task proposal,
- task -> receipt,
- automation -> dry-run receipt requirement,
- provider gate -> blocked capability,
- Ibal proposal -> source lanes and blockers,
- receipt -> source object.

This graph should become a reusable framework primitive after Inbox proves it with UI-004 polish.

## Feedback Timing

Report now:

- UI-004A.5 planning candidates,
- hook names,
- white-label slot needs,
- framework-grade promotion rule.

Report after UI-004B:

- shell,
- lane nav,
- trust cluster,
- inspector,
- status token behavior.

Report after page polish:

- receipt ledger,
- Ibal recommendation,
- dry-run automation,
- provider gate,
- source evidence,
- cross-lane links.

Report after UI-007 draft workbench (2026-06-10, local Tier 1):

- XiMailWorkbench — 4-column mail shell with independent scroll panes,
- XiDraftObject — schema v3 `drafts` namespace with status model,
- XiApprovalQueue — submit/approve/dequeue with send blocked,
- XiContextCommandRail — thread/draft/batch/sent modes; evidence collapsed,
- XiSendEventDryRun — `sentEvents` namespace + simulate-send receipts,
- XiPostSendPlan — pre-send checks and post-send consequence preview.

Backfeed recorded: `xi-io.net` `docs/framework/inbox-ui-consumer-freshness-note.md`, issue `xi-io.net#239`.

Report after UI-009 product UX shell (2026-06-10, Tier 1):

- XiUserSettingsSplit — user settings first; provider/privacy gates collapsed under Advanced,
- XiAccountConnectWizard — queue real email; CLI/OAuth boundary; no tokens in browser preview,
- XiCalendarMonthGrid — month navigation + day selection; events on dates,
- XiKanbanBoard — status columns; local tasks; cross-lane source links,
- XiActivityLedger — user-facing Activity nav; filter tabs; build evidence demoted,
- XiMailReadingPolish — `demoteMailDisplayText` pattern; advanced metadata collapsed; user status chips.

Inbox-side receipt: `docs/ui/reviews/ui-009-product-ux-gap-audit.md`. Optional `xi-io.net#239` comment when operator pushes.

Report after UI-010J–K polish (2026-06-10):

- XiCalendarWeekStrip — week row above month grid,
- XiIbalConciergeCopy — product assistant language,
- XiMailListDensity — list pane spacing and snippet clamp.

Operator: post condensed UI-009/010 summary to `xi-io.net#239` on push (no new framework files required).

## UI-012 visual polish candidates (after UI-011I + UI-012B proof)

Reference: [`xi-io-Rabbit_mod`](https://github.com/Vado42-chris/xi-io-Rabbit_mod). Governance: `ui-012-visual-polish-governance.md`. Brief: `ui-012a-rabbit-mod-visual-parity-brief.md`.

| Candidate | Reusable value | Inbox proof | #239 timing |
| --- | --- | --- | --- |
| XiVisualTokens | shared color/type/spacing across xi-io products | UI-012B shell | after UI-012F |
| XiIconGrammar | when icon vs text; sizes; a11y labels | UI-012B–C | after UI-012F |
| XiMailListRow | mail-like density + unread + attachment affordance | UI-012C Mail | after UI-012F |
| XiNavDensity | folder/label nav rhythm | UI-012C Mail nav | after UI-012F |

Do not promote until UI-012A brief scored and UI-012B+ local proof exists.

## Acceptance

This plan is valid when:

- candidates list reusable value,
- each candidate names Inbox proof pages,
- promotion threshold is explicit,
- `xi-io.net#239` feedback timing is clear,
- white-label needs are separated from product-specific Inbox language.

## Decision

```text
UI_004A5_WHITE_LABEL_FRAMEWORK_FEEDBACK_PLAN_READY
```
