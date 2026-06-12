# UI-012B Visual Token Component Alignment Receipt

## Date

2026-06-12

## Branch

`ui-002/framework-derived-static-preview`

## Commit SHA

*(filled after commit)*

## Scope

UI-012B visual token and component alignment per `docs/ui/polish/ui-012a-ibal-rabbit-visual-parity-brief.md`. CSS-only pass; no capability or state changes.

## Excluded scope

- UI-012C+ layout/composition overhaul
- Owner UI-003E visual proof
- schemaVersion / localStorage changes
- Provider runtime, send, OAuth
- Screenshots committed to repo

## UI-012A source brief reference

`docs/ui/polish/ui-012a-ibal-rabbit-visual-parity-brief.md`

## Files changed

- `public/inbox-preview.css` — token layer + UI-012B component alignment block
- `docs/ui/reviews/ui-012b-visual-token-component-alignment-receipt.md`
- `TODO.md`

## Product UI code changed

**yes** (CSS only; no JS/HTML/JSON changes)

## Token alignment result

Centralized `--space-*`, surface, border, text, semantic status, marker, interaction, radius, and shadow tokens in `:root`. Legacy aliases (`--cyan`, etc.) preserved for regression safety.

## Selected state result

Unified selected/active grammar for lane nav, mail folders, thread/draft rows, settings, extensions, activity filters, automations, tasks, calendar cells, and activity ledger focus rows — left inset indicator + border + background (not color alone).

## Pill/chip/badge result

Normalized `.pill`, `.pill-neutral`, status chips, and `.extensions-marker-*` (including new external marker styling) with shared pill geometry and semantic colors.

## Card/panel result

Shared radius, border, and reading-pane hierarchy tokens applied to cards, panels, ledger table, and detail grids.

## Button/action result

Normalized `.inbox-action-btn` variants (primary, danger, blocked/disabled dashed), link button focus, and hover transitions using tokens.

## Focus/keyboard visual result

Global `:focus-visible` uses tokenized ring; `.is-inspector-focusable:focus-visible` distinct from selection inset bar; outlines not suppressed without replacement.

## Density/comfort result

Introduced `--density-row`, `--density-row-compact`, `--density-chip` for consistent control/row heights without removing capability information.

## Visual distinction result

Marker tokens for internal/external/local/developer; preview/blocked/metadata semantic colors; advanced sections remain muted.

## Ibal/context rail result

Calm drawer/surface treatment; concierge open state uses accent-soft; proposal-only suffix on concierge heading; recommendation state uses preview semantic color.

## Accessibility result

Focus visible preserved/improved; selected vs focus distinguished; blocked/disabled dashed borders + opacity; no color-only pill/status (text labels retained). Automated contrast measurement not available — manual visual review via before/after captures noted below.

## Before/after visual artifact result

**yes** — 9 views captured before and after (mail-inbox, drafts, approval-queue, calendar, tasks, automations, extensions, activity, settings).

## Visual artifact path

`/tmp/xi-io-inbox-ui-012b/before/` and `/tmp/xi-io-inbox-ui-012b/after/` (Playwright headless, 1440×900)

## Screenshots committed

**no**

## Regression result for UI-011B–I

No JS/HTML/JSON changes. Capability lanes preserved. `npm run check` pass.

## Storage result

Unchanged. No migration code touched.

## schemaVersion

**11** (unchanged)

## localStorage keys used

- `xiioInbox.preview.state` (unchanged canonical envelope only)

## Safety/egress result

No credentials, provider connect, send, or external execution introduced.

## Provider/runtime/platform result

Tier 1 preview only. Provider gates unchanged.

## Route smoke result

| Check | Result |
| --- | --- |
| Default app load | 200 |
| CSS token markers | pass |
| schemaVersion in JS | 11 unchanged |
| Fixture JSON fetch | 200 same-origin |
| External network requests | **0** |
| Preview server stopped | yes |

## Same-origin fixture fetch result

`public/data/inbox-events.preview.json` at `127.0.0.1:4488` — pass.

## Owner proof gate result

UI-003E remains blocked until UI-012F. No owner PASS claimed.

## Remaining blockers

- Layout/composition polish (UI-012C)
- Interaction/state polish depth (UI-012D)
- Formal contrast audit tooling (UI-012E)
- Owner visual proof after UI-012F

## Next recommended pass

**UI-012C** — layout and composition polish

## Decision value

```text
UI_012B_PASS_READY_FOR_LAYOUT_COMPOSITION_POLISH
```
