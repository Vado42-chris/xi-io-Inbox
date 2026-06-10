# UI Wargame Scenario Matrix

## Purpose

Define simulated-user scenarios used to evaluate `xi-io Inbox` before visual polish implementation and before owner/framework visual proof.

These scenarios are not real user testing. They are structured expert preflight checks.

## Persona Lenses

Run each relevant scenario through one or more lenses:

- expert operator,
- overwhelmed user,
- privacy-sensitive user,
- keyboard-only user,
- screen-reader path,
- mobile/small viewport user,
- task-focused user,
- AI-skeptical user,
- recovery-from-error user.

## Scenario Record Shape

```text
scenario_id:
lane:
user_goal:
starting_route:
expected_path:
expected_visible_objects:
expected_inspector_response:
expected_blocked_actions:
expected_receipt_or_proposal_state:
fail_conditions:
framework_components:
maturity_level_impact:
```

## Global Scenarios

### WG-001: User finds what is safe next

- Lane: Home / Ibal
- User goal: identify the next safe action without reading every module.
- Starting route: `#/home`
- Expected path: Home priority -> Ibal proposal -> relevant lane.
- Expected visible objects: priority item, trust cluster, next safe action, source lane link.
- Expected inspector response: why it matters, evidence, blocker, expected receipt.
- Expected blocked actions: all send/write/mutate actions absent or disabled.
- Expected receipt/proposal state: proposal only.
- Fail conditions: next action hidden, Ibal looks executable, safety dominates page, no evidence.
- Framework components: XiAppShell, XiTrustCluster, XiIbalRecommendation, XiContextInspector.
- Maturity impact: required for Home Level 2 and Ibal Level 2.

### WG-002: User reviews current trust/safety state

- Lane: Home / Settings
- User goal: understand provider/runtime/platform safety state.
- Starting route: `#/home`
- Expected path: trust cluster -> Settings / Provider Gates.
- Expected visible objects: provider blocked, runtime blocked, draft/proposal state.
- Expected inspector response: no provider connection, no credentials, no runtime writes.
- Expected blocked actions: send, forward, delete, disclose, provider mutation, repo mutation.
- Expected receipt/proposal state: future gate changes require receipts.
- Fail conditions: status spam, hidden provider block, unclear runtime boundary.
- Framework components: XiTrustCluster, XiGatePanel, XiStatusToken.
- Maturity impact: required for shell Level 2.

## Inbox Scenarios

### WG-101: Urgent message becomes draft proposal

- Lane: Inbox
- User goal: review urgent thread and create a draft proposal without sending.
- Starting route: `#/inbox`
- Expected path: smart view -> urgent thread -> selected thread -> draft proposal.
- Expected visible objects: thread row, selected thread panel, evidence block, draft-only state.
- Expected inspector response: selected thread, why urgent, evidence refs, draft path, blocked send.
- Expected blocked actions: send, forward, delete, archive, disclose.
- Expected receipt/proposal state: draft proposal receipt expected later.
- Fail conditions: thread looks like generic card, draft looks sent, provider data implied.
- Framework components: XiThreadRow, XiSelectedThreadPanel, XiSafeActionBar, XiSourceEvidenceBlock.
- Maturity impact: required for Inbox Level 3.

### WG-102: Urgent message becomes calendar proposal

- Lane: Inbox / Calendar
- User goal: convert time-sensitive thread context into calendar proposal.
- Starting route: `#/inbox`
- Expected path: selected thread -> time reference -> calendar proposal.
- Expected visible objects: thread source, time window, proposal state, calendar source link.
- Expected inspector response: source thread, time evidence, provider write blocked, future receipt.
- Expected blocked actions: provider calendar write, invite send.
- Expected receipt/proposal state: calendar proposal only.
- Fail conditions: event appears created, no link back to Inbox, provider write ambiguity.
- Framework components: XiCrossLaneLink, XiSourceEvidenceBlock, XiGatePanel.
- Maturity impact: required for Inbox and Calendar Level 3.

### WG-103: Urgent message becomes task proposal

- Lane: Inbox / Tasks
- User goal: convert message into task proposal with source evidence.
- Starting route: `#/inbox`
- Expected path: selected thread -> extract task proposal -> Tasks source reference.
- Expected visible objects: thread, task proposal, source link, blocker/priority.
- Expected inspector response: why task exists, source thread, safe next action.
- Expected blocked actions: provider task write, repo mutation.
- Expected receipt/proposal state: task proposal receipt expected later.
- Fail conditions: task appears confirmed, source missing, unsafe action shown.
- Framework components: XiCrossLaneLink, XiSourceEvidenceBlock, XiSafeActionBar.
- Maturity impact: required for Inbox and Tasks Level 3.

## Calendar Scenarios

### WG-201: Calendar proposal links back to inbox and task

- Lane: Calendar
- User goal: verify why an event proposal exists.
- Starting route: `#/calendar`
- Expected path: agenda proposal -> source links -> inspector.
- Expected visible objects: time rail, event proposal, inbox source, task source.
- Expected inspector response: event source, provider write block, future event receipt.
- Expected blocked actions: provider calendar write and invite send.
- Expected receipt/proposal state: event proposal only.
- Fail conditions: proposal appears confirmed, time hierarchy weak, no source links.
- Framework components: XiAgendaRow, XiCrossLaneLink, XiReceiptRow.
- Maturity impact: required for Calendar Level 3.

## Tasks Scenarios

### WG-301: Task originates from inbox

- Lane: Tasks
- User goal: understand task source and what is safe to do next.
- Starting route: `#/tasks`
- Expected path: task group -> task item -> source link -> inspector.
- Expected visible objects: task state, due/priority, inbox source, blocker.
- Expected inspector response: source evidence, due context, next safe action, receipt expectation.
- Expected blocked actions: provider task write, message send, repo mutation.
- Expected receipt/proposal state: task proposal or documented proof only.
- Fail conditions: task lacks source, blocked reason hidden, generic board layout dominates.
- Framework components: XiTaskBoard, XiSourceEvidenceBlock, XiContextInspector.
- Maturity impact: required for Tasks Level 3.

## Automations Scenarios

### WG-401: Automation proposes dry-run only

- Lane: Automations
- User goal: inspect what an automation would do without enabling it.
- Starting route: `#/automations`
- Expected path: rule template -> dry-run chain -> approval gate.
- Expected visible objects: trigger, condition, proposal, approval gate, receipt requirement.
- Expected inspector response: selected rule, evidence, dry-run result, execution blocked.
- Expected blocked actions: enable, run, provider mutation, repo mutation.
- Expected receipt/proposal state: dry-run/proposal only.
- Fail conditions: rule appears executable, missing receipt requirement, no approval gate.
- Framework components: XiDryRunRuleCard, XiGatePanel, XiReceiptRow.
- Maturity impact: required for Automations Level 3.

## Extensions Scenarios

### WG-501: Extension/provider remains blocked

- Lane: Extensions
- User goal: inspect provider state and understand why no connection exists.
- Starting route: `#/extensions`
- Expected path: provider group -> provider card -> permissions/boundary.
- Expected visible objects: provider blocked, credentials absent, permission scopes.
- Expected inspector response: selected provider, credential absence, required future receipt.
- Expected blocked actions: OAuth, credential storage, provider read/write.
- Expected receipt/proposal state: future provider gate receipt required.
- Fail conditions: connect path appears live, secret boundary unclear, framework blocker confused with provider gate.
- Framework components: XiProviderCard, XiGatePanel, XiTrustCluster.
- Maturity impact: required for Extensions Level 3.

## Receipts Scenarios

### WG-601: Receipt explains what happened

- Lane: Receipts
- User goal: verify whether an action happened, was proposed, or was blocked.
- Starting route: `#/receipts`
- Expected path: ledger row -> receipt detail -> source link.
- Expected visible objects: receipt type, source, state, evidence, no-runtime caveat.
- Expected inspector response: selected receipt, evidence, limitation, related blocker.
- Expected blocked actions: receipt cannot execute or approve action.
- Expected receipt/proposal state: proof/proposal/draft/gate/blocked class visible.
- Fail conditions: ledger looks like generic cards, runtime receipt implied, source missing.
- Framework components: XiReceiptLedger, XiReceiptRow, XiSourceEvidenceBlock.
- Maturity impact: required for Receipts Level 3.

## Ibal Scenarios

### WG-701: Ibal proposes next action but cannot execute

- Lane: Ibal
- User goal: understand recommendation, evidence, blockers, and next safe path.
- Starting route: `#/ibal`
- Expected path: recommendation -> source lanes -> blocker -> receipt expectation.
- Expected visible objects: recommendation, reasoning, source lanes, blockers.
- Expected inspector response: why recommendation matters, evidence, no-execution state.
- Expected blocked actions: send, provider connection, automation execution, repo mutation.
- Expected receipt/proposal state: Ibal proposal only.
- Fail conditions: Ibal looks like chatbot, recommendation lacks evidence, execution ambiguity.
- Framework components: XiIbalRecommendation, XiContextInspector, XiCrossLaneLink.
- Maturity impact: required for Ibal Level 3.

## Settings / Provider Gates Scenarios

### WG-801: Settings shows why action remains blocked

- Lane: Settings / Provider Gates
- User goal: inspect a blocked action and understand what would be required later.
- Starting route: `#/settings`
- Expected path: policy group -> gate -> disabled action explanation.
- Expected visible objects: policy value, gate reason, blocker, receipt requirement.
- Expected inspector response: selected policy, evidence/default, blocked action, receipt impact.
- Expected blocked actions: all dangerous egress and provider/runtime mutations.
- Expected receipt/proposal state: future policy/provider change requires receipt.
- Fail conditions: policy values unreadable, dangerous actions overtake page, platform claim implied.
- Framework components: XiGatePanel, XiStatusToken, XiSafeActionBar.
- Maturity impact: required for Settings Level 3.

## Accessibility Scenarios

### WG-901: Keyboard-only user navigates lanes and inspector

- Lane: all
- User goal: move through lane nav, primary objects, and inspector without a mouse.
- Starting route: `#/home`
- Expected path: command field -> nav -> lane content -> inspector.
- Expected visible objects: focus state, active lane, selected object, inspector update.
- Expected inspector response: updates without focus loss.
- Expected blocked actions: disabled actions do nothing.
- Expected receipt/proposal state: unchanged.
- Fail conditions: invisible focus, focus lost, tab order incoherent, Enter/Space unsafe.
- Framework components: XiLaneNav, XiContextInspector, XiStatusToken.
- Maturity impact: required for Level 2 on every lane.

## Acceptance

The matrix is valid when:

- every lane has at least one scenario,
- cross-lane scenarios cover Inbox -> Calendar, Inbox -> Tasks, Ibal -> source lanes, and Receipts -> source lanes,
- safety and egress failure conditions are explicit,
- maturity impact is recorded.

## Decision

```text
UI_004A5_WARGAME_SCENARIO_MATRIX_REQUIRED_BEFORE_UI_004B
```
