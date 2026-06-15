# UI-012D Interaction / State Polish Receipt

## Date

2026-06-10

## Branch

`ui-002/framework-derived-static-preview`

## Commit SHA

*(uncommitted at receipt write)*

## Scope

UI-012D — hover/selected/focus/empty/disabled interaction polish across shell nav, mail workspace (post MAIL-001), Ibal proposal cards, compact context rail, settings rail-driven layout. CSS + minor JS ARIA hooks only.

## Excluded scope

UI-012E+ · OAuth/runtime · schemaVersion change · owner UI-003E PASS · merge prep

## Files changed

- `public/inbox-preview.css` — UI-012D interaction block (nav, mail rows, accordion, Ibal states, blocked buttons)
- `public/inbox-preview.js` — mail nav `aria-current`, interactive empty hints, existing shell sub-nav persistence
- `scripts/ui-012d-model-check.mjs` — model guard
- `package.json` — `check:ui012d` in `npm run check`

## Validation

| Check | Result |
| --- | --- |
| `npm run check` | pass |
| Route smoke | Mail: select thread, mailbox, smart view; Settings rail-driven; Ibal proposal card states |
| Keyboard spot-check | Tab through product nav → context nav → mail thread row; focus ring visible |

## Decision value

`UI_012D_PASS_INTERACTION_STATES_READY_FOR_A11Y`

## Next recommended pass

**UI-012E** accessibility / contrast / focus polish.

## Remaining estimate to merge-ready

**~4 passes**: UI-012E · UI-012F · xi-io.net framework backfeed · UI-003E owner PASS + merge prep.
