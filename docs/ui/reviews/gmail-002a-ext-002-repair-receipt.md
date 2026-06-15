# GMAIL-002A-EXT-002 Repair Receipt

## Date

2026-06-14

## Branch

`ui-002/framework-derived-static-preview`

## Commit SHA

`70db5d756f54505a896cf3f53aa234d7831bd18d`

## Scope

Repair local mail index safety issues from EXT-002 peer review: test isolation, fail-closed corruption handling, atomic writes, versioned envelope, account identity, privacy-safe query output, expanded tests.

## Excluded scope

sync status UI (EXT-003), historyId sync (EXT-004), body read, draft write, send, mutation, GCAL, product UI, owner UI-003E proof, PR merge prep.

## Files changed

- `tools/gmail/lib/local-mail-index.js`
- `tools/gmail/lib/adapter.js` (pass `accountEmail` into upsert)
- `tools/gmail/cli.js` (`--account-email`, `--include-body-preview`)
- `tools/gmail/test/mail-index.mjs`
- `docs/ui/reviews/gmail-002a-ext-002-peer-review-receipt.md`
- `docs/ui/reviews/gmail-002a-ext-002-repair-receipt.md`
- `docs/product/gmail-002a-ext-sync-roadmap.md`
- `docs/product/gmail-002-real-email-ingress-plan.md`
- `docs/product/03-sprint-slice-plan.md`
- `docs/product/06-compliance-validation-index.md`
- `TODO.md`

## Product UI code changed

**no**

## Test isolation result

**pass** — `mail-index.mjs` uses temp-directory `indexPath`; asserts test path ≠ operator `tools/gmail/data/mail-index.json`; verifies operator index mtime unchanged (or still absent).

## Corrupt index fail-closed result

**pass** — JSON parse errors and invalid/unsupported schema throw `MailIndexError` with recovery hint; missing file still initializes empty envelope.

## Atomic write result

**pass** — `saveMailIndex()` validates envelope, writes `*.tmp`, renames to final path, cleans temp on failure; invalid save preserves previous file.

## Index envelope result

**pass** — Envelope includes `schemaVersion`, `updatedAt`, `source`, `mode`, `accounts`, `threads`, `messages`, `warnings`, `blockedCapabilities`; legacy `{ threads, messages }` migrates only when `schemaVersion` is absent.

## Account identity result

**pass** — Upsert stamps `accountEmail`, `accountId`, `provider`; envelope tracks `accounts[]`; query supports `accountEmail` / `accountId` filters.

## Query output privacy result

**pass** — Default `query-index` returns thread metadata summaries only (no `messages[]`, no `sanitizedPlainText`); `--include-body-preview` opt-in for preview field only.

## Tests / checks result

| Check | Result |
| --- | --- |
| mail-index.mjs | pass |
| metadata-sync.mjs | pass |
| metadata-guards.mjs | pass |
| body-gate.mjs | pass |
| npm run check | pass |
| git diff --check | pass |

## Generated data committed

**no**

## body read / draft / send / mutation

**blocked**

## PR draft state

**draft**

## Owner proof state

UI-003E **not passed**.

## Live metadata persistence

**deferred** — structural/unit pass only until operator OAuth reconnect + sync run.

## Next recommended pass

**GMAIL-002A-EXT-003** — sync status UI + Activity receipts (after repair peer review).

## Decision value

`GMAIL_002A_EXT_002_REPAIR_PASS_READY_FOR_EXT_003`
