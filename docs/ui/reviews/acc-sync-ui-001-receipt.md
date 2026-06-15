# ACC-SYNC-UI-001 Account Factory + Sync Empty-State Receipt

## Date

2026-06-15

## Branch

`ui-002/framework-derived-static-preview`

## Commit SHA

(pending — recorded after push)

## Scope

Mail account factory from imported Gmail sync status; operator vs demo fixture separation; sync state labels/classes; empty-state copy when no connected accounts.

## Excluded scope

Live OAuth in browser, send/draft/mutation, IBAL-001, UI-003E owner proof, merge prep, framework package export, fixture account id migration away from `personal-gmail-preview`.

## Files changed

- `public/inbox-preview.js`
- `public/inbox-preview.css`
- `scripts/acc-sync-ui-001-model-check.mjs` (new)
- `package.json`
- `docs/ui/reviews/acc-sync-ui-001-receipt.md`
- `docs/ui/reviews/acc-sync-ui-001-peer-review.md`
- `docs/product/03-sprint-slice-plan.md`
- `docs/product/06-compliance-validation-index.md`
- `TODO.md`

## Product UI code changed

**yes** — account list derives connected rows from sync status import; demo fixture separated in nav.

## Account factory result

**pass** — `applySyncStatusToAccounts()` creates/updates Gmail account from sync status email; fails closed when email missing (no placeholder address).

## Empty-state result

**pass** — mail context nav shows explicit empty copy when `operatorMailAccounts()` is empty; demo fixture listed under separate section.

## Sync status UX result

**pass** — syncing/paused/failed/connected labels and CSS classes; Settings account rows use status chip markup.

## Tech debt addressed

**pass** — removed silent `personal-gmail-preview` injection in `allMailAccounts()`; fixed `clearGmailSyncStatus()` and `clearGmailMetadataSnapshot()` to mutate `state.account.previewAccounts` immutably.

## Tests / checks result

| Check | Result |
| --- | --- |
| acc-sync-ui-001-model-check.mjs | pass |
| acc-001-model-check.mjs | pass |
| npm run check | pass |
| git diff --check | pass |

## Generated data committed

**no**

## body read / draft / send / mutation

**blocked**

## PR draft state

**draft**

## UI-003E state

**not passed** — owner-only gate unchanged.

## Next recommended pass

**UI-003E** owner visual proof (human) or **ACC-SYNC-UI-001** live sync-status import smoke (operator).

## Decision value

`ACC_SYNC_UI_001_PASS_READY_FOR_UI_003E`
