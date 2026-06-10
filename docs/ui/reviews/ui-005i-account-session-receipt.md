# UI-005I Account Session Receipt

## Date

2026-06-10

## Branch

`ui-002/framework-derived-static-preview`

## Commit SHA

510617c3ccf18115ce8c6c5ea541d06380d92baf

## Scope

Account/session shell: interactive top-bar workspace trigger, preview session panel, workspace select, account fixture switch, session notes, receipts, clear/reset. Canonical envelope extended with `account` namespace. Lane operability data preserved on account switch.

## Excluded Scope

UI-003E+, real OAuth/auth backend, credentials storage, runtime session.

## Files Changed

- `public/inbox-preview.js`
- `public/inbox-preview.css`
- `docs/ui/reviews/ui-005i-account-session-receipt.md`
- `TODO.md`

## UI-005B–H Regression

Structural pass — lane operability, Ibal concierge, canonical key preserved.

## Workspace Switch

Pass — local workspace label select; fixture-backed options.

## Account Switch

Pass — switch between preview account fixtures; active state visible.

## Preview Login UI

Pass — session display name + notes; Sign in/OAuth blocked.

## Local State

Pass — `account` namespace in `xiioInbox.preview.state`.

## localStorage

Yes. Key: `xiioInbox.preview.state`. schemaVersion: `2`.

## Clear/Reset

Pass — clears account namespace only; lane data preserved.

## Safety

Pass — no passwords, tokens, or OAuth secrets stored.

## Route Smoke

Structural (`npm run check`).

## Decision

```text
UI_005I_PASS_ACCOUNT_SESSION_READY_FOR_UI_003E
```

## Next Pass

UI-003E owner/framework visual proof re-run.
