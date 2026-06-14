# UI-CONVERGE-001 Route Table + Module Skeleton Receipt

## Date

2026-06-10

## Branch

`ui-002/framework-derived-static-preview`

## Commit SHA

`PENDING`

## Scope

First strangler extraction: canonical `public/src/shell/route-table.js`, module skeleton README, preview wired to import route table, `check:route-table` guard.

## Excluded scope

Full monolith extraction, framework backfeed, owner UI-003E, merge prep, receipt renderer dedup.

## Files changed

- `public/src/shell/route-table.js` (new)
- `public/src/shell/route-table.types.js` (new)
- `public/src/README.md` (new)
- `public/inbox-preview.js` (import route table; remove inline nav/route duplicates)
- `scripts/route-table-check.mjs` (new)
- `scripts/ui-016c-boundary-check.mjs` (derive nav from route table)
- `package.json`
- `docs/product/03-sprint-slice-plan.md`
- `docs/product/06-compliance-validation-index.md`
- `TODO.md`

## Product UI code changed

**yes** — routing/nav behavior unchanged; source of truth moved to route-table module.

## Route table result

**pass** — PRIMARY_NAV, mail workbench sub-views, workspace↔lane mapping, scope-lens lanes, and hash routes centralized.

## Module skeleton result

**pass** — `public/src/` skeleton documented; first extracted module is `shell/route-table.js`.

## Tests / checks result

| Check | Result |
| --- | --- |
| route-table-check.mjs | pass |
| ui-016c-boundary-check.mjs | pass |
| route-smoke.mjs | pass |
| npm run check | pass |

## schemaVersion

Preview state schema unchanged: **11**. Route table schema: **1**.

## Working UI preserved

**pass** — no lane deletion; mail drafts/approvals remain `#/inbox` sub-views.

## PR draft state

**draft**

## Owner proof state

UI-003E **not passed**.

## Next recommended pass

**FRAMEWORK-BACKFEED-001** — xi-io.net `#239` two-way freshness packet.

## Decision value

`UI_CONVERGE_001_PASS_READY_FOR_FRAMEWORK_BACKFEED`

## Tracked debt (unchanged)

5 receipt renderers, 2 provider banners, 3 detail grid classes — documented in ui-016c.
