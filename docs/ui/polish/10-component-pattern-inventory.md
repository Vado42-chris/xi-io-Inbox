# Component Pattern Inventory

## Purpose

Define reusable UI patterns for UI-004B and later work. This inventory prevents agents from turning every requirement into the same card/pill/panel shape.

## Use Rule

Reuse component behavior and hierarchy. Do not reuse visual templates when a lane needs a different native metaphor.

## Patterns

### App Shell

- Purpose: persistent product frame.
- Where used: all routes.
- Reuse when: route belongs to xi-io Inbox.
- Do not reuse when: modal, print/export, or future embedded widget needs a different frame.
- Anatomy: top bar, lane nav, main surface, inspector, trust state.
- Hierarchy: shell is quiet; lane content owns attention.
- Interaction: route switching, command/search, responsive nav.
- Accessibility: landmarks, skip path later, stable navigation order.
- Safety/egress: global trust state visible.
- Polish: no warning-slab identity; use rhythm and restraint.

### Top Bar

- Purpose: product identity, workspace, account, global trust, command.
- Where used: all routes.
- Reuse when: global state must remain visible.
- Do not reuse when: lane-specific status belongs in page header.
- Anatomy: product mark, workspace/account, trust cluster, command field.
- Hierarchy: compact and persistent.
- Interaction: command/search placeholder only in UI-004.
- Accessibility: labeled command field, readable status text.
- Safety/egress: provider/runtime/global egress state.
- Polish: premium toolbar, not developer header.

### Lane Navigation

- Purpose: switch between product lanes.
- Where used: all routes.
- Reuse when: route is first-class.
- Do not reuse for: filters, mailbox folders, status tabs.
- Anatomy: icon, label, active state, optional scoped status.
- Hierarchy: active lane clear; badges sparse.
- Interaction: hash route switch.
- Accessibility: consistent navigation order and current-page state.
- Safety/egress: no action execution.
- Polish: functional but refined, not a debug menu.

### Page Header

- Purpose: define lane identity and immediate scope.
- Where used: each lane.
- Reuse when: page needs title, summary, lane status.
- Do not reuse as: marketing hero or generic metric row.
- Anatomy: eyebrow, title, short purpose, scoped controls/status.
- Hierarchy: title plus one key state.
- Interaction: future view toggles may live here.
- Accessibility: one h1/h2-equivalent per route.
- Safety/egress: lane-level gates only.
- Polish: confident and compact.

### Safety / Trust Banner

- Purpose: communicate preview/runtime/provider trust limits.
- Where used: shell or contextual blockers.
- Reuse when: safety state changes behavior.
- Do not reuse when: same state is already clear in global trust cluster.
- Anatomy: trust state, reason, affected capability.
- Hierarchy: compact unless critical.
- Interaction: may link to Provider Gates later.
- Accessibility: status text available without color.
- Safety/egress: no send/write/mutate claims.
- Polish: integrated trust strip, not oversized warning slab.

### Global Status Cluster

- Purpose: summarize provider/runtime/local/proposal state.
- Where used: top bar.
- Reuse when: status affects all lanes.
- Do not reuse for: per-object metadata.
- Anatomy: 2-4 compact tokens.
- Hierarchy: secondary to product identity.
- Interaction: future click opens gates.
- Accessibility: status labels are text, not color alone.
- Safety/egress: blocked states visible.
- Polish: sparse and stable.

### Page Status Cluster

- Purpose: summarize lane-specific state.
- Where used: page header.
- Reuse when: status affects the whole lane.
- Do not reuse on every content object.
- Anatomy: count, key blocker, proof state.
- Hierarchy: below title.
- Interaction: may filter lane later.
- Accessibility: readable values.
- Safety/egress: scoped provider/runtime blocks.
- Polish: compact, aligned, not badge noise.

### Primary Object Area

- Purpose: focus the lane's main work object.
- Where used: selected thread, agenda, task board, rule builder, ledger, Ibal.
- Reuse when: one object model dominates.
- Do not reuse as: generic card grid.
- Anatomy: object title, source, key state, primary content, safe action.
- Hierarchy: strongest content area.
- Interaction: selection updates inspector.
- Accessibility: clear labels and focus target.
- Safety/egress: blocked actions contextual.
- Polish: lane-specific composition.

### Secondary Detail Area

- Purpose: supporting details without stealing focus.
- Where used: evidence, receipts, linked items, permissions, blockers.
- Reuse when: details support selected object.
- Do not reuse for: primary work.
- Anatomy: label, compact content, link/source.
- Hierarchy: secondary.
- Interaction: selectable if it changes inspector.
- Accessibility: heading and relationship to primary object.
- Safety/egress: no hidden action.
- Polish: quiet and readable.

### Summary Metrics

- Purpose: summarize counts or state.
- Where used: Home, lane headers, not every page by default.
- Reuse when: metric changes decision-making.
- Do not reuse as: filler.
- Anatomy: label, value, short explanation.
- Hierarchy: compact.
- Interaction: optional filter later.
- Accessibility: label/value text.
- Safety/egress: avoid implying runtime proof.
- Polish: restrained; no KPI dashboard tone.

### Content Lists

- Purpose: scan many objects.
- Where used: thread list, agenda, tasks, providers, receipts.
- Reuse when: objects share row structure.
- Do not reuse when: a timeline, board, or rule chain is clearer.
- Anatomy: title, metadata, state, optional source.
- Hierarchy: row rhythm over card borders.
- Interaction: row selection.
- Accessibility: list semantics or equivalent labels.
- Safety/egress: dangerous actions absent from rows.
- Polish: high-density but calm.

### Thread Cards / Rows

- Purpose: message triage object.
- Where used: Inbox.
- Reuse when: object is a thread/message preview.
- Do not reuse for: tasks or receipts.
- Anatomy: sender/source, subject, time, summary, urgency, linked outputs.
- Hierarchy: subject and source first.
- Interaction: select thread, preserve focus.
- Accessibility: button/list item with clear name.
- Safety/egress: no body or real provider data.
- Polish: mail-client rhythm.

### Selected Thread Panel

- Purpose: expanded thread context.
- Where used: Inbox.
- Reuse when: thread is selected.
- Do not reuse for: generic inspector.
- Anatomy: title, source, sanitized summary, timeline, evidence, draft.
- Hierarchy: main Inbox object.
- Interaction: source/evidence/draft selection later.
- Accessibility: heading and described sections.
- Safety/egress: draft-only, no send.
- Polish: premium reading pane.

### Agenda Rows

- Purpose: time-based event scan.
- Where used: Calendar.
- Reuse when: object has time.
- Do not reuse for: tasks without time.
- Anatomy: time, title, source, proposal/conflict/reminder state.
- Hierarchy: time rail plus title.
- Interaction: select agenda item.
- Accessibility: readable chronological order.
- Safety/egress: no provider write.
- Polish: time-grid feel.

### Task Boards

- Purpose: work progression.
- Where used: Tasks.
- Reuse when: state groups matter.
- Do not reuse on small screens if grouped list is clearer.
- Anatomy: status group, task rows/cards, due/source metadata.
- Hierarchy: state group then task.
- Interaction: select task.
- Accessibility: logical group headings.
- Safety/egress: no provider task write.
- Polish: progression without clutter.

### Automation Rule Cards

- Purpose: show trigger, condition, gate, proposal, receipt.
- Where used: Automations.
- Reuse when: rule proposal is dry-run only.
- Do not reuse for: executable automations.
- Anatomy: trigger chain, condition, proposed action, approval, receipt.
- Hierarchy: rule chain over status badge.
- Interaction: inspect dry-run.
- Accessibility: sequence is textual.
- Safety/egress: execution blocked.
- Polish: simulation lab.

### Extension / Provider Cards

- Purpose: inspect provider/tool connection and permission state.
- Where used: Extensions and Settings.
- Reuse when: integration state is the object.
- Do not reuse for: generic lane cards.
- Anatomy: provider name, category, connection state, permission scopes, blocker.
- Hierarchy: provider and permission first.
- Interaction: select provider.
- Accessibility: clear provider names and states.
- Safety/egress: no OAuth or credential action.
- Polish: security/control center.

### Receipt Rows

- Purpose: audit ledger object.
- Where used: Receipts and inspector.
- Reuse when: action/proposal/proof needs audit entry.
- Do not reuse as: decorative status.
- Anatomy: type, title, source, timestamp/ref, state.
- Hierarchy: ledger columns.
- Interaction: select receipt.
- Accessibility: table/list semantics.
- Safety/egress: receipt never authorizes action.
- Polish: credible audit trail.

### Ibal Recommendation Cards

- Purpose: show conductor proposal with reasoning.
- Where used: Ibal and inspector.
- Reuse when: Ibal proposes next safe action.
- Do not reuse for: chat messages.
- Anatomy: recommendation, why, evidence, blockers, source lanes, receipt expectation.
- Hierarchy: recommendation and reason first.
- Interaction: inspect recommendation.
- Accessibility: clear proposed/not executed state.
- Safety/egress: proposal only.
- Polish: orchestration, not chatbot.

### Right Inspector Panels

- Purpose: contextual intelligence.
- Where used: all routes.
- Reuse when: selected object needs context/evidence/egress/Ibal/receipts.
- Do not reuse as: duplicate page content.
- Anatomy: selected context, why it matters, evidence, safe next, blocked, receipt.
- Hierarchy: answer questions, not repeat sections.
- Interaction: updates on selection.
- Accessibility: labeled complementary region.
- Safety/egress: dangerous actions absent/disabled.
- Polish: integrated, not bolted on.

### Safety Gates

- Purpose: explain why a capability is blocked.
- Where used: provider, egress, automation, runtime, repo mutation.
- Reuse when: action would be dangerous or unavailable.
- Do not reuse for: normal neutral preview metadata.
- Anatomy: gate name, reason, scope, unlock requirement, receipt implication.
- Hierarchy: near affected capability.
- Interaction: inspect gate later.
- Accessibility: reason text available.
- Safety/egress: explicit no-write state.
- Polish: calm guardrail.

### Blocked Action Buttons

- Purpose: show intentionally unavailable dangerous actions when educational.
- Where used: inspector/policy only.
- Reuse when: absence would hide safety behavior.
- Do not reuse as: repeated decoration.
- Anatomy: action label plus blocked state.
- Hierarchy: secondary, grouped.
- Interaction: disabled; no handler.
- Accessibility: disabled state clear.
- Safety/egress: no action.
- Polish: compact policy module.

### Status Pills

- Purpose: compact state marker.
- Where used: global, lane, object only when state matters.
- Reuse when: status changes decision or scan path.
- Do not reuse on every object by default.
- Anatomy: short label, semantic color/token.
- Hierarchy: subordinate to object content.
- Interaction: non-interactive unless explicitly filter later.
- Accessibility: text label required.
- Safety/egress: blocked/proposal/draft tokens precise.
- Polish: sparse and disciplined.

### Evidence Blocks

- Purpose: show source references and proof context.
- Where used: inspector, Inbox, Receipts, Ibal.
- Reuse when: evidence supports a proposal or action.
- Do not reuse for: body text filler.
- Anatomy: source type, source id/ref, summary, confidence/limit.
- Hierarchy: supports primary object.
- Interaction: inspect source later.
- Accessibility: source labels explicit.
- Safety/egress: no private body exposure.
- Polish: trustworthy but compact.

### Command / Search Field

- Purpose: future command/search entry.
- Where used: top bar.
- Reuse when: global search/command is available.
- Do not reuse for: lane filters.
- Anatomy: label, placeholder, input.
- Hierarchy: secondary global utility.
- Interaction: placeholder only until implemented.
- Accessibility: explicit label.
- Safety/egress: no runtime command execution in preview.
- Polish: quiet, not dominant.

## Decision

```text
UI_004A_COMPONENT_PATTERN_INVENTORY_READY_FOR_SHELL_IMPLEMENTATION
```
