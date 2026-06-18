# UI-012C Layout Composition Polish Receipt

## Date

2026-06-12

## Branch

`ui-002/framework-derived-static-preview`

## Commit SHA

`51acf23927a924f59916d42019db2fffebc0b81e`

## Scope

UI-012C layout and composition polish — mail-first hierarchy, shell balance, lane grid rhythm, scroll regions, section headers. CSS-only; no capability or state changes.

## Excluded scope

- UI-012D+ interaction/state polish
- UI-012B token/component re-work
- Owner UI-003E
- schemaVersion / localStorage / fixture changes
- Provider runtime, send, OAuth
- Screenshots committed to repo

## UI-012A source brief reference

`docs/ui/polish/ui-012a-ibal-rabbit-visual-parity-brief.md`

## UI-012B source receipt reference

`docs/ui/reviews/ui-012b-visual-token-component-alignment-receipt.md`

## Files changed

- `public/inbox-preview.css` — UI-012C layout tokens and composition block
- `docs/ui/polish/ui-012-visual-polish-governance.md` — best-practice evaluation checklist
- `docs/ui/reviews/ui-012c-layout-composition-polish-receipt.md`
- `TODO.md`

## Product UI code changed

**yes** (CSS only; no JS/HTML/JSON changes)

## Mail-first hierarchy result

App shell gives center column maximum flex; Inbox lane surface gets subtle accent border; mail list/detail ratio favors reading pane (1.35 flex); Drafts/Approval Queue share mail workbench grid.

## App shell composition result

Layout tokens for nav width, rail max 19rem, shell gap, and pane height; top-level lane headers normalized with compact title block.

## Column/lane rhythm result

Unified `--layout-list-col` / `--layout-detail-col` across mail, tasks, calendar, automations, extensions, settings, activity; automations three-column grid rebalanced.

## Scroll/overflow result

Lane surfaces flex column with `min-height: 0`; list/detail/feed panes use `overscroll-behavior: contain`; reading panes drop rigid max-height calc; item lists use `--layout-scroll-max`.

## Section hierarchy result

`.lane-header.is-compact`, `.settings-page-head`, `.activity-page-head` share title block rhythm with bottom border.

## Density result

Toolbar and workspace gaps use spacing tokens; empty states padded; reduced cramped clusters without removing capability labels.

## Cross-screen consistency result

Shared workspace flex column + two-column grid grammar across operational lanes; responsive stack at 1180px preserved.

## Ibal/context rail composition result

Right rail capped at 19rem; inspector sections padded consistently; context rail title reduced; does not expand beyond shell rail column.

## Accessibility result

Reading order preserved (nav → main → rail); scroll regions independent; focus styles from UI-012B unchanged; no keyboard trap introduced. **Automated layout/a11y testing unavailable** — manual review via captures.

## Accessibility references used

- [WCAG 2.2 (W3C Recommendation)](https://www.w3.org/TR/WCAG22/) — Keyboard (2.1), Focus Visible (2.4.7), Focus Order (2.4.3), Headings and Labels (2.4.6), Use of Color (1.4.1), Consistent Navigation (3.2.3), Consistent Identification (3.2.4)
- [NN/g Ten Usability Heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/) — consistency, visibility of system status, recognition over recall, aesthetic/minimalist design

## Before capture status

**yes** — 9 PNGs in `/tmp/xi-io-inbox-ui-012c/before/`

## After capture status

**yes** — 9 PNGs in `/tmp/xi-io-inbox-ui-012c/after/`

## Before/after visual artifact result

**yes** — mail-inbox, drafts, approval-queue, calendar, tasks, automations, extensions, activity, settings

## Visual artifact path

`/tmp/xi-io-inbox-ui-012c/before/` and `/tmp/xi-io-inbox-ui-012c/after/`

## Screenshots committed

**no**

## Visual risks still needing owner review

- Mobile/tablet breakpoint layout at 1180px stacks columns (owner may want intermediate breakpoint)
- Mail reading pane proportion vs owner mail-client expectations
- Formal contrast/layout audit deferred to UI-012E

## Best-practice evaluation result

| Question | Answer |
| --- | --- |
| Preserves UI-011A–I capability repairs? | **yes** — behavior unchanged |
| Easier to understand, not only prettier? | **yes** — mail-first grid and scroll clarity |
| Mail primary mental model? | **yes** — center column + inbox emphasis |
| Ibal supports without takeover? | **yes** — rail width capped |
| Selected/blocked/preview/metadata/gated distinct? | **yes** — UI-012B tokens preserved |
| Disabled actions explained in text? | **yes** — unchanged copy |
| Relying on color alone? | **no** — structure + labels |
| Scroll regions predictable? | **yes** — contain + min-height 0 |
| Artifacts outside repo? | **yes** — `/tmp/xi-io-inbox-ui-012c/` |
| Avoided schema/localStorage/fixture changes? | **yes** |
| Avoided provider/runtime changes? | **yes** |
| Avoided duplicating UI-012B? | **yes** — layout-only vars |
| Evidence in repo/TODO/receipt/PR? | **yes** |

## Regression result for UI-011B–I and UI-012B

No JS/HTML/JSON changes. UI-012B token block intact. `npm run check` pass.

## Storage result

Unchanged. **No fixture or data-model files changed.**

## schemaVersion

**11** (unchanged)

## localStorage keys used

- `xiioInbox.preview.state` (unchanged)

## Safety/egress result

No credentials, provider connect, send, or external execution.

## Provider/runtime/platform result

Tier 1 preview only. Gates unchanged.

## Route smoke result

| Check | Result |
| --- | --- |
| Default app load | 200 |
| UI-012C CSS markers | pass |
| schemaVersion in JS | 11 unchanged |
| External network requests | **0** |
| Preview server stopped | yes |

## Same-origin fixture fetch result

Not re-run separately; prior passes unchanged. Fixture file not modified.

## Owner proof gate result

UI-003E blocked until UI-012F.

## Remaining blockers

- UI-012D interaction/state polish
- UI-012E formal contrast audit
- Owner visual proof after UI-012F

## Next recommended pass

**UI-012D** — interaction and state polish

## Decision value

```text
UI_012C_PASS_READY_FOR_INTERACTION_STATE_POLISH
```
