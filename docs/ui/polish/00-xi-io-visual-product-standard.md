# UI-004A xi-io Visual Product Standard

## Purpose

Define the design-director standard required before `xi-io Inbox` moves from structural shell proof into visual polish implementation.

UI-004A is documentation and design planning only. It does not implement visual polish and does not complete owner/framework visual proof.

## Current Status

Owner screenshot review on 2026-06-10 found the UI structurally improved but below competitive product quality.

```text
UI-003D structural readiness: pass
Owner visual polish review: fail
UI-004A design-director packet: required
UI-004B implementation: blocked until UI-004A is complete
UI-003E visual proof: blocked until UI-011I capability + UI-012 visual polish (see `ui-012-visual-polish-governance.md`)
```

## References

- NN/g usability heuristics: visible status, real-world language, consistency, error prevention, recognition over recall, and aesthetic/minimalist focus.
- Fluent 2 layout: spacing, proximity, grid, alignment, and responsive structure create relationship and rhythm.
- WCAG 2.2: focus order, visible focus, labels, names/roles/values, status messages, predictable navigation, and consistent identification remain non-negotiable.

## Product Definition

`xi-io Inbox` is not better email.

`xi-io Inbox` is a personal operations command center for controlled ingress and controlled egress across:

- Inbox
- Calendar
- Tasks
- Automations
- Extensions
- Receipts
- Ibal
- Provider Gates

## Differentiators

- Ibal is a conductor, not a chatbot or decorative sidebar.
- Receipts are a first-class audit trail, not logs.
- Provider gates are trust architecture, not settings clutter.
- Automations are dry-run and proposal workflows, not unsafe rules.
- Inbox is a triage source for tasks, calendar, receipts, and Ibal, not only mail.
- Safety is integrated into product grammar, not pasted on as warning slabs.

## xi-io Product Principles

- Control before action: no egress or mutation without explicit gates.
- Evidence before confidence: every proposed action needs source context.
- Receipts before trust: confirmed actions must be auditable.
- Calm density: show expert-level information without equal-weight clutter.
- Consistency without sameness: repeat interaction grammar, not page layout.
- Progressive disclosure: surface the next safe action first, details second.
- Framework fidelity: product primitives should feed reusable framework patterns.

## Visual Target

The product should feel like a polished operations cockpit: calm, precise, dense where useful, and visibly safe without constant alarm.

It should not feel like:

- internal admin tooling,
- generated card dashboards,
- a prototype status wall,
- a warning banner wrapped around content,
- a set of identical templates with different labels.

## Competitive Bar

Each surface must survive comparison beside Outlook, Gmail, Samsung Mail, Google Calendar, Microsoft To Do, Todoist, Notion, Linear, and mature admin consoles.

The product does not need to mimic those products. It must match their discipline in hierarchy, spacing, responsiveness, accessibility, and confidence.

## Spacing System

Use a 4px base grid.

- 4px: micro separation inside compact rows.
- 8px: related inline elements and control groups.
- 12px: object internals and inspector section rhythm.
- 16px: section internals and list groups.
- 24px: page module separation.
- 32px: major lane regions.
- 48px: rare large section transitions.

Spacing should create relationships. Borders should not be the primary structure.

## Typography System

- Product mark: small, stable, never competing with page title.
- Page title: clear lane identity, one per route.
- Section title: work area label, not marketing copy.
- Object title: selected thread, event, task, rule, receipt, or policy.
- Metadata: compact and muted.
- Status text: short, factual, never repeated at equal weight everywhere.

No viewport-scaled type. No negative letter spacing.

## Surface And Elevation System

- Canvas: product background.
- Shell: top bar, navigation, inspector, and lane surface.
- Work surface: primary page area.
- Object surface: selected thread, agenda row, task, rule, provider, receipt.
- Overlay surface: future modal/popover only.

Cards are allowed only for repeated objects, focused tasks, inspector sections, and bounded modules. Do not place cards inside cards.

## Semantic Color System

Color is functional, not decorative.

- Neutral: base surface, text, separators.
- Accent: active navigation, selected object, primary focus.
- Success/documented: proof or completed receipt only.
- Warning/review: human review or unresolved decision.
- Danger/blocked: dangerous or prohibited action only.
- Proposal: non-executing suggested action.
- Draft: local draft-only state.
- Undecided: architecture/policy unknown.

Blocked states must be clear but not visually dominate every page.

## Status And Badge Rules

Layer status by scope:

- Global status: top bar or trust strip.
- Lane status: page header.
- Object status: compact metadata.
- Critical block: contextual callout.
- Low-priority state: muted text.

Do not attach a pill to every object by default. A badge earns space only when it changes what the user should do next.

## Iconography Rules

Use recognizable icons for navigation, action families, gates, evidence, receipts, time, tasks, rules, providers, and Ibal proposals.

Icons must clarify scanning. They must not become decoration or replace necessary labels in primary navigation.

## Motion Rules

Motion is functional and restrained.

- Route changes may use minimal opacity/position transitions.
- Selection updates should preserve focus and avoid layout jump.
- Safety state changes should be immediate and clear.
- No ornamental animation in proof surfaces.

Respect reduced-motion preferences.

## Focus And Keyboard Rules

- Every interactive control has visible focus.
- Route navigation has predictable tab order.
- Enter and Space activate selected list objects where appropriate.
- Escape clears transient panels or returns focus when transient UI exists.
- Disabled controls remain visible only when they teach a safety rule.
- Focus must not disappear after inspector updates.

## Responsive Rules

Responsive behavior may re-architect, not only shrink.

- Desktop: left navigation, primary lane, right inspector can coexist.
- Tablet: inspector may become a lower or collapsible contextual region.
- Mobile: navigation becomes compact; inspector becomes route/detail state.
- Primary work remains first in source and reading order.

## Density Rules

Support high-information workflows through hierarchy, not uniform compression.

- Dense lists are acceptable for Inbox, Receipts, Tasks, and provider permissions.
- Calendar needs time rhythm and whitespace.
- Ibal needs synthesis blocks, not a ledger clone.
- Home needs a priority cockpit, not an analytics dashboard.

## Inspector Rules

The inspector must answer:

- What is selected?
- Why does it matter?
- What evidence supports it?
- What can I safely do next?
- What is blocked?
- What receipt will exist if action is later confirmed?

The inspector must feel like contextual intelligence, not a repeated sidebar template.

## Safety And Egress Display Rules

Safety must be persistent but integrated.

- Global trust state belongs in the shell.
- Contextual blockers belong near the blocked action.
- Dangerous actions remain absent or disabled.
- Provider, runtime, repository, and automation execution gates remain explicit.
- Do not use a large warning slab as the main product identity.

## Page Identity Rules

Each lane needs a native metaphor:

| Lane | Metaphor |
| --- | --- |
| Home | operations cockpit |
| Inbox | mail client and thread triage |
| Calendar | agenda and time grid |
| Tasks | work board/list progression |
| Automations | rule builder and simulation |
| Extensions | permission/control center |
| Receipts | ledger and audit trail |
| Ibal | conductor/orchestrator |
| Settings / Provider Gates | security and policy console |

## Component Reuse Rules

Reuse interaction grammar:

- navigation,
- selection,
- inspector update,
- status layering,
- blocked action treatment,
- evidence references,
- receipts.

Do not reuse one generic card layout for every lane.

## Required Repetition

Repeat these patterns everywhere:

- active lane state,
- keyboard behavior,
- disabled dangerous actions,
- provider gate language,
- receipt/audit references,
- no-runtime-write constraints.

## Required Distinction

Make these page-specific:

- primary object model,
- content rhythm,
- page header composition,
- inspector emphasis,
- density,
- dominant interaction.

## Framework Feedback Candidates For xi-io.net#239

Potential reusable framework primitives:

- app shell and top bar trust cluster,
- lane navigation with status layering,
- contextual inspector panel,
- status token system,
- evidence block,
- receipt row and receipt detail,
- provider gate panel,
- dry-run automation rule card,
- Ibal recommendation card,
- visual QA rubric for framework products.

## Acceptance

UI implementation may not continue until:

- all numbered UI-004A docs exist,
- TODO classifies UI-004A as docs/design planning only,
- product UI code remains untouched in UI-004A,
- UI-004B scope is limited to shell/topbar/navigation/safety/inspector system.

## Decision

```text
UI_004A_DESIGN_DIRECTOR_PACKET_REQUIRED_BEFORE_VISUAL_POLISH_IMPLEMENTATION
```
