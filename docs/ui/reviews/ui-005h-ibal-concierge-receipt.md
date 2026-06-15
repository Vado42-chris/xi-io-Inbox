# UI-005H Ibal Concierge Receipt

## Date

2026-06-10

## Branch

`ui-002/framework-derived-static-preview`

## Commit SHA

cb4d87cdc1510db5b58bac9932dfdb8bfb624276

## Scope

Ibal concierge shell: remove Ibal from primary lane navigation, redirect `#/ibal` to Home with concierge open, top-bar concierge button + command entry, drawer with fixture proposals, inspector Ask Ibal affordance, local receipts. Canonical envelope extended with `ibal` namespace.

## Excluded Scope

UI-005I+, live model routing, execution, provider connect, Account shell.

## Files Changed

- `public/inbox-preview.js`
- `public/inbox-preview.css`
- `docs/ui/reviews/ui-005h-ibal-concierge-receipt.md`
- `TODO.md`

## UI-005B–G Regression

Structural pass — lane operability hooks and canonical key preserved.

## Ibal Lane Removal

Pass — `navLanes()` excludes Ibal; `#/ibal` redirects to `#/home` and opens concierge.

## Concierge Drawer

Pass — open/close, backdrop, Escape, fixture proposal cards with evidence/blockers.

## Command Entry

Pass — top-bar command form submits to Ibal; opens concierge.

## Local State

Pass — `ibal` namespace in `xiioInbox.preview.state`.

## localStorage

Yes. Key: `xiioInbox.preview.state`. schemaVersion: `2`.

## Inspector

Pass — Ask Ibal button; contextual proposal snippet when available.

## Safety

Pass — Auto-execute blocked; fixture responses only; no model/runtime claims.

## Route Smoke

Structural (`npm run check`).

## Decision

```text
UI_005H_PASS_IBAL_CONCIERGE_READY_FOR_NEXT_LANE
```

## Next Pass

UI-005I Account/session shell.
