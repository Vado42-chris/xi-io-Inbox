# SLICE-SHELL-LAYOUT-001 — Implementation receipt

## Date

2026-06-19

## Branch

`ui-002/framework-derived-static-preview`

## Spec

- `docs/ui/ui-shell-layout-001-column-scroll-and-rail-behavior.md`
- `docs/ui/ui-visual-language-001-editorial-surfaces-and-border-minimization.md`

## Implementation commits

| Commit | Scope |
| --- | --- |
| `e4c3708` | Add `public/shell-layout-001.css`, load from `public/index.html`, receipt |

## Scope delivered

| Area | Change |
| --- | --- |
| Viewport shell | `100dvh` with `100vh` fallback; `body`/`app-shell` height locked; no primary body scroll on desktop |
| Column scroll | Flex/grid chain with `min-height: 0`; lane workspaces and grids fill remaining height |
| Scroll panes | Lists, reading panes, Activity feed/detail, Integrations catalog/detail, calendar regions, rails scroll independently |
| Right rail | Flex column + `overflow-y: auto`; sticky Activity detail removed for independent scroll |
| Chrome reduction | Lane surface, nav, inspector use background fields + dividers; reduced box shadows and heavy borders |
| Owner overlays | Owner-mode status/dry-run/advanced cards use open fields (no nested bordered cards) |
| Advanced scaffold | Unchanged — `showWorkflowScaffold` and Advanced `<details>` paths preserved |

## Files touched

- `public/shell-layout-001.css` (new)
- `public/index.html` (stylesheet load after owner-mode overlays)

## Out of scope (follow-up)

- Activity B6 classify / Activity owner-mode batch
- Integrations IA decision
- COPY-LITERAL-001 / QUIET-PROOF-001
- Per-lane markup changes in `inbox-preview.js`
- Full removal of all legacy bordered panels inside Advanced scaffolds

## Owner verification checklist

Hard-refresh `http://localhost:4488` and confirm:

1. Mail — folder/list and reading pane scroll independently; no page-level horizontal overflow
2. Calendar — month/agenda regions scroll inside lane
3. Tasks — owner list and Advanced scaffold scroll independently
4. Automations — owner cards + Advanced grid scroll independently
5. Activity — feed and detail columns scroll independently
6. Integrations — catalog and detail panes scroll independently
7. Right contextual rail scrolls when content exceeds viewport
8. Advanced / scaffold recovery still works (`showWorkflowScaffold`)

## Validation

| Check | Result |
| --- | --- |
| `npm run check:quick` | pass (this agent pass) |
| Owner `:4488` scroll proof | pending |

## Stop lines unchanged

- UI-003E PASS not claimed
- PR #12 remains draft
- MERGE-PREP-001 blocked
- Provider mutation / export / #21–#25 blocked

## Decision value

```text
SHELL_LAYOUT_001_IMPLEMENTATION_PASS_PENDING_OWNER_SCROLL_PROOF
```
