# GCAL-001 Calendar Read-Only Import Receipt

## Date

2026-06-10

## Branch

`ui-002/framework-derived-static-preview`

## Commit SHA

`1ee37a7e3b92deba3f075ecd5795c922c2552dc4`

## Scope

Google Calendar read-only metadata adapter (`tools/gcal`), CLI export, validated snapshot schema, preview calendar grid import.

## Excluded scope

CONVERGE-001, event write, calendar mutation, live OAuth proof, owner UI-003E, merge prep.

## Files changed

- `tools/gcal/**` (new adapter package)
- `public/inbox-preview.js` (calendar snapshot import + grid merge)
- `public/inbox-preview.css` (imported event chip)
- `public/data/gcal-events.sample.json` (new)
- `scripts/gcal-001-model-check.mjs` (new)
- `package.json`, `.gitignore`
- `docs/product/03-sprint-slice-plan.md`
- `docs/product/06-compliance-validation-index.md`
- `docs/product/gmail-002a-ext-sync-roadmap.md`
- `TODO.md`

## Product UI code changed

**yes** — Calendar provider banner, month grid imported events, Settings import/clear actions.

## Calendar import result

**pass** — `export-calendar-snapshot` writes validated read-only metadata; preview imports local/sample JSON and maps events into month grid with write gates unchanged.

## CLI support result

**pass** — `status`, `connect`, `list-calendars`, `list-events`, `export-calendar-snapshot`, `blocked`.

## Privacy/stdout result

**pass** — Snapshots exclude attendees, tokens, and conference links; default stdout is summary-only.

## Tests / checks result

| Check | Result |
| --- | --- |
| gcal snapshot-schema.mjs | pass |
| gcal hardening.mjs | pass |
| gcal-001-model-check.mjs | pass |
| npm run check | pass |

## schemaVersion

Preview state schema unchanged: **11**. Calendar snapshot schema: **1**.

## event write / calendar mutation

**blocked**

## Generated data committed

**no** — sample fixture only; operator artifacts gitignored under `tools/gcal/data/`.

## Live OAuth proof status

**deferred** — operator reconnect + live export required.

## PR draft state

**draft**

## Owner proof state

UI-003E **not passed**.

## Next recommended pass

**CONVERGE-001** — module skeleton + route-table contract.

## Decision value

`GCAL_001_PASS_READY_FOR_CONVERGE`
