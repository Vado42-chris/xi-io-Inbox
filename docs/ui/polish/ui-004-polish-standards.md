# UI-004 Polish Standards

## Purpose

Define the visual and interaction standard required before `xi-io Inbox` can pass owner/framework visual proof.

## Status

```text
Current UI state: structurally useful, visually insufficient
Owner review source: screenshot review on 2026-06-10
Implementation status: planning only
PR #12 state: keep draft
Runtime/provider status: blocked
```

## Sources Used

- NN/g 10 usability heuristics: status visibility, real-world language, control/freedom, consistency, error prevention, recognition over recall, efficiency, aesthetic/minimalist design.
- Microsoft Fluent 2 principles: natural on every platform, built for focus, inclusive by default, recognizable product identity.
- WCAG 2.2: perceivable, operable, understandable, robust; keyboard operation, visible focus, reflow, contrast, labels, predictable navigation.
- Material Design 3 component references: navigation, cards, typography, color, and interaction states as cross-product design-system examples.

## Diagnosis

The current shell proves information architecture but fails craft:

- too many bordered boxes compete equally,
- status pills dominate instead of supporting scan,
- typography lacks hierarchy and rhythm,
- top bar and safety banner consume too much prime space,
- lane pages repeat generic structures too often,
- right inspector feels bolted on rather than integrated,
- dark palette is flat and low-character,
- page affordances do not yet feel like a product from an expert UI designer.

## Product Standard

`xi-io Inbox` should feel like a calm operations cockpit, not a dashboard template.

The product should compete by:

- showing fewer but better-prioritized objects,
- making state obvious without shouting,
- separating primary work from audit/safety surfaces,
- making dangerous actions impossible but still understandable,
- using consistent component grammar across lanes,
- giving each lane a distinct work shape.

## Shared Component Grammar

### App Frame

- Top bar becomes compact: product, workspace, provider/privacy/Ibal state, command field.
- Safety state becomes a persistent compact banner or status strip, not a tall warning block on every route.
- Left navigation stays stable, with clearer active state and grouped destinations.
- Right inspector becomes a contextual panel with tabs or sections: Context, Evidence, Egress, Ibal, Receipts.

### Page Header

- One strong lane title.
- One short purpose sentence.
- One compact state cluster.
- Optional lane toolbar with filters/actions.
- No oversized decorative pills.

### Lists

- List rows should replace most cards.
- Rows need stable columns, leading identity, primary title, metadata, status, and next action.
- Selected rows need a single strong selection treatment.
- Empty, blocked, and preview states use purpose-built treatments.

### Cards

Use cards only for repeated item groups, inspector sections, and focused task/proposal blocks.

Do not use cards for every sentence or page section.

### Status

Status grammar:

- `preview only`: quiet amber text/chip.
- `blocked`: red chip only where the block matters.
- `draft only`: green/teal chip for safe proposed work.
- `proposal only`: amber chip.
- `documented`: green chip.

Rules:

- status chips should be smaller and less visually heavy,
- never put two large circular status badges in page headers,
- blocked/danger states should be legible but not decorative.

### Typography

Target:

- stronger hierarchy,
- fewer all-caps labels,
- lower visual noise,
- more line-height discipline,
- no viewport-scaled text.

Suggested scale:

- app title: 18-20px,
- lane title: 24-32px,
- section title: 15-18px,
- row title: 14-16px,
- metadata: 12-13px.

### Color

Target palette:

- near-black base,
- layered neutral surfaces,
- one primary xi-io blue,
- restrained amber/red/green for status,
- no one-note slate dashboard feel.

Requirements:

- improve contrast,
- reduce border count,
- use shadow/elevation sparingly,
- reserve accent color for active navigation and focus.

### Spacing

Use a compact 4/8px spacing system:

- page gutters: 16-24px,
- section gaps: 16px,
- row padding: 10-14px,
- inspector section gap: 12px.

### Interaction

Required patterns:

- keyboard focus remains visible and preserved after selection,
- route changes never hide current state,
- selected list item updates inspector predictably,
- disabled actions expose reason and future requirement,
- no action that appears executable may mutate provider, repo, or external state.

### Accessibility

Minimum before visual proof:

- keyboard route and selection checks,
- focus visible and not obscured,
- no horizontal overflow at mobile and desktop widths,
- labels and headings match visible content,
- contrast review for text, status chips, borders, and focus,
- target sizes are usable for pointer/touch.

## Page Plan Files

- `home.md`
- `inbox.md`
- `calendar.md`
- `tasks.md`
- `automations.md`
- `extensions.md`
- `receipts.md`
- `ibal.md`
- `settings-provider-gates.md`

## Decision

```text
UI_004_VISUAL_POLISH_REQUIRED_BEFORE_OWNER_VISUAL_PROOF
```
