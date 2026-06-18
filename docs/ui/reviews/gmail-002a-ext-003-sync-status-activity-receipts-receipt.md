# GMAIL-002A-EXT-003 Sync Status + Activity Receipts Receipt

## Date

2026-06-14

## Branch

`ui-002/framework-derived-static-preview`

## Commit SHA

`e468c7886312cea83df9a4aba9ac03146a2b5bcb`

## Scope

Local Gmail sync status model (CLI + importable JSON), sync receipt summarization, Activity surfacing of metadata sync events, Mail/Integrations/Settings status UI, privacy-safe stdout defaults.

## Excluded scope

historyId incremental sync (EXT-004), body read, draft write, send, mutation, GCAL, SQLite/LMDB storage, owner UI-003E proof, merge prep.

## Files changed

- `tools/gmail/lib/sync-status.js` (new)
- `tools/gmail/lib/receipts.js` (read sync receipt events)
- `tools/gmail/lib/adapter.js` (`providerSyncStatus`)
- `tools/gmail/cli.js` (`sync-status`)
- `tools/gmail/test/sync-status.mjs` (new)
- `public/inbox-preview.js` (sync status panel, Activity mapping, import UI)
- `public/inbox-preview.css` (sync status panel styles)
- `public/data/gmail-sync-status.sample.json` (new safe fixture)
- `scripts/gmail-002a-ext-003-model-check.mjs` (new)
- `package.json`, `tools/gmail/package.json`
- `docs/product/gmail-002a-ext-sync-roadmap.md`
- `docs/product/06-compliance-validation-index.md`
- `docs/product/03-sprint-slice-plan.md`
- `TODO.md`

## Product UI code changed

**yes** — Mail workspace status strip, Settings → Accounts sync panel, Integrations Gmail detail, Activity entries from imported sync receipts.

## Sync status model result

**pass** — `buildSyncStatus()` summarizes OAuth connected/disconnected, secrets configured, metadata snapshot/index presence, last sync summary, gate states, live proof deferred, sync receipt events, next operator action. No token values.

## Activity receipt result

**pass** — Imported `syncReceipts` map to Activity (`planned`, `started`, `pageFetched`, `completed`, `failed`, gate withheld/blocked events).

## Mail/Integrations UI result

**pass** — Visible Gmail CLI sync status panel in Mail header (compact), Settings accounts block, Integrations Gmail card. Honest copy: browser OAuth disabled, operator CLI path documented.

## CLI support result

**pass** — `node cli.js sync-status` and `node cli.js sync-status --out PATH` operational.

## Privacy/stdout result

**pass** — Default sync-status output excludes tokens, secrets, message bodies, and `sanitizedPlainText`.

## Tests / checks result

| Check | Result |
| --- | --- |
| sync-status.mjs | pass |
| gmail-002a-ext-003-model-check.mjs | pass |
| npm run check | pass |
| git diff --check | pass |

## schemaVersion

Preview state schema unchanged: **11** (`xiioInbox.preview.state`). Sync status JSON schema: **1**.

## localStorage keys

**unchanged** — sync status held in memory + imported JSON files only (`gmail-sync-status.local.json` / sample).

## body read / draft / send / mutation

**blocked**

## Generated data committed

**no** — sample fixture only; operator artifacts remain gitignored under `tools/gmail/data/`.

## Secrets status

**pass** — no tokens/secrets staged or printed.

## Live OAuth proof status

**deferred** — operator reconnect + live sync run still required for live persistence proof.

## PR draft state

**draft**

## Owner proof state

UI-003E **not passed**.

## Next recommended pass

**GMAIL-002A-EXT-004** — historyId incremental sync + full-sync fallback.

## Decision value

`GMAIL_002A_EXT_003_PASS_READY_FOR_HISTORYID`

## Non-blocking caution

JSON mail index remains a bridge scaffold — not final storage architecture for long-term indexed mail.
