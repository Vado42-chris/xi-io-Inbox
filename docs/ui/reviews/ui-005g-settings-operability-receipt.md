# UI-005G Settings Operability Receipt

## Date

2026-06-10

## Branch

`ui-002/framework-derived-static-preview`

## Commit SHA

pending

## Scope

Settings lane Tier 1 gate/policy planning operability: editable gate notes, local policy preview values, receipts, inspector, clear/reset. Canonical envelope extended with `settings` namespace.

## Excluded Scope

UI-005H+, runtime policy apply, provider connect, credentials, Ibal removal.

## Files Changed

- `public/inbox-preview.js`
- `public/inbox-preview.css`
- `docs/ui/reviews/ui-005g-settings-operability-receipt.md`
- `TODO.md`

## UI-005B–F Regression

Structural pass — prior lane hooks and canonical key preserved.

## Gate Planning Forms

Pass — per-fixture gate notes and preview control labels; connect blocked.

## Policy Preview Forms

Pass — local preview value select + notes; apply blocked.

## Local State

Pass — `settings` namespace in `xiioInbox.preview.state`.

## localStorage

Yes. Key: `xiioInbox.preview.state`. schemaVersion: `2`.

## Clear/Reset

Pass — confirm dialog clears settings namespace only.

## Inspector

Pass — `settings:local:gate:{key}` and `settings:local:policy:{key}`.

## Safety

Pass — Connect/Apply disabled; no credentials or runtime writes.

## Route Smoke

Structural (`npm run check`).

## Decision

```text
UI_005G_PASS_SETTINGS_OPERABILITY_READY_FOR_NEXT_LANE
```

## Next Pass

UI-005H Ibal concierge shell.
