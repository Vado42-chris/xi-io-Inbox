# UI-SHELL-LAYOUT-001 — Column scroll, viewport shell, and rail behavior

## Status

```text
Type: shell layout specification (functional + visual shell)
Date: 2026-06-19
Slice: SLICE-SHELL-LAYOUT-001 (alias: SLICE-UI-SHELL-001)
Scope: independent column scrolling, viewport shell, rail stability, responsive density
Excluded: provider/runtime, architecture #21–#25, lane feature logic
Depends on: docs/ui/ui-visual-language-001-editorial-surfaces-and-border-minimization.md
Blocks: credible UI-003E retest when scroll/rail bugs remain
```

## Non-authority clause

This document specifies **shell layout requirements**. It does not authorize feature implementation, gate bypass, or UI-003E PASS by itself.

## Problem statement

Broken or cramped scrolling is a **functional** defect, not merely style. Owner review (2026-06-19) reported:

```text
columns that do not scroll independently
page shell feeling like web admin header, not focused cockpit
right rail competing with main task column
Activity table/filter area cramped (see also Activity B6 classify)
```

Shell layout must be fixed **before** treating visual polish as complete. This slice is separate from SLICE-VISUAL-LANGUAGE-001 because scroll containers are engineering constraints; border minimization is visual grammar.

## Requirements

### Viewport shell

```text
Use 100dvh (with fallback) for app shell height
App shell: display flex or grid with min-height: 0 on scroll children
No document-body scroll for primary workbench columns when lane content overflows
```

### Independent column scrolling

Each primary column that can overflow must scroll **independently**:

```text
Mail: folder rail | thread list | reading pane | context rail (as designed)
Calendar: month grid region | day/agenda region | contextual rail
Tasks / Automations / Activity: main list/workspace | reading/detail | inspector/rail
```

Validation: load long fixture content in every column; confirm only the overflowing column scrolls.

### Rail behavior

| Rule | Detail |
| --- | --- |
| Context rail | Contextual — see VISUAL-LANGUAGE-001; must not force second dashboard density |
| Inspector | Collapsible; default collapsed in owner mode where peer-review specifies |
| Rail width | Stable; no horizontal jump when selection changes |
| Rail scroll | Independent when content exceeds viewport |

### Responsive behavior

```text
Narrow viewports: collapse rails behind disclosure or stack columns
Preserve min-height: 0 on stacked scroll regions
No double scroll traps (scroll inside scroll without intent)
```

### Chrome reduction (pairs with VISUAL-LANGUAGE-001)

```text
Top bar: product cockpit, not bloated admin header
Reduce stacked horizontal bars above lane content
Lane toolbar: one primary row; overflow to disclosure
```

## Primary files (implementation — not started)

| Area | Likely touch |
| --- | --- |
| Global shell | `public/inbox-preview.css` — `.app-shell`, lane workspace grids |
| Owner overlays | `public/*-owner-mode.css` — must not reintroduce nested scroll traps |
| Monolith | `public/inbox-preview.js` — only if region structure blocks CSS fix |

Prefer **CSS-first** shell fix. Avoid monolith rewrites unless route region structure prevents independent scroll.

## Acceptance criteria

- [ ] Each workbench column scrolls independently with long content
- [ ] App shell fills viewport without body-level lane scroll (except intentional full-page lanes)
- [ ] `min-height: 0` applied on flex/grid scroll children
- [ ] Context rail does not horizontally compress main column below usable width
- [ ] Activity table region scrolls without overlapping adjacent columns (B6 retest)
- [ ] `npm run check` and route smoke pass

## Work order

```text
1. SLICE-VISUAL-LANGUAGE-001 docs locked
2. SLICE-SHELL-LAYOUT-001 implementation (this slice)
3. One small global CSS pass applying field/divider rules (VISUAL-LANGUAGE-001 phase 3)
4. Activity B6 visual classify under both constraints
5. Integrations IA decision
6. Structured UI-003E owner retest
```

## Validation

| Command | When |
| --- | --- |
| Manual `:4488` scroll proof | After implementation |
| `npm run check:route` | After `public/**` CSS/structure change |
| `npm run check` | Before slice close |

## Decision

```text
SHELL_LAYOUT_001_COLUMN_SCROLL_RAIL_SPEC_LOCKED_2026_06_19
```

Functional shell spec locked. Implementation not started.
