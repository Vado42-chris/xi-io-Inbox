# UI-005F Extensions Operability Receipt

## Date

2026-06-10

## Branch

`ui-002/framework-derived-static-preview`

## Commit SHA

3720522ca196dbe212ac3ea3796e67822a2ffac4

## Scope

Extensions lane Tier 1 preview-install operability: fixture list, local preview install/remove, provision notes, receipts, inspector, clear/reset. Canonical envelope extended with `extensions` namespace.

## Excluded Scope

UI-005G+, OAuth/credentials, provider connect, runtime claims, Ibal removal.

## Files Changed

- `public/inbox-preview.js`
- `public/inbox-preview.css`
- `docs/ui/reviews/ui-005f-extensions-operability-receipt.md`
- `TODO.md`

## UI-005B/C/D/E Regression

Structural pass — inbox/calendar/tasks/automations hooks and canonical key preserved.

## Preview Install/Remove

Pass — fixture providers from extension-matrix; record/remove local preview installs only.

## Provision Notes

Pass — local planning notes; no credentials or tokens stored.

## Local State

Pass — `extensions` namespace in `xiioInbox.preview.state`.

## localStorage

Yes. Key: `xiioInbox.preview.state`. schemaVersion: `2`.

## Clear/Reset

Pass — confirm dialog clears extensions namespace only.

## Inspector

Pass — `extensions:local:{id}` with install/provision and blocker context.

## Safety

Pass — Connect/OAuth disabled; no provider read/write or runtime connection.

## Route Smoke

Structural HTTP 200 + JS hooks verified (`npm run check`).

## Decision

```text
UI_005F_PASS_EXTENSIONS_OPERABILITY_READY_FOR_NEXT_LANE
```

## Next Pass

UI-005G Settings operability.
