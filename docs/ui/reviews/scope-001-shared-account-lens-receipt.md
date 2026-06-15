# SCOPE-001 Shared Account Lens Receipt

## Date

2026-06-14

## Branch

`cursor/gmail-harden-5e1b`

## Scope

Implement the shared account scope lens for Mail, Calendar, Tasks, and Activity and normalize
Calendar/Tasks objects onto stable `accountId` fields.

## Implemented

- Added one shared `Scope` lens to Mail, Calendar, Tasks, and Activity contextual rails.
- Reused Mail's existing account IDs for the lens options.
- Normalized Calendar proposals with `accountId`.
- Normalized local Tasks/work items with `accountId`.
- Derives `accountId` from:
  - explicit object `accountId`,
  - linked `threadId`,
  - `sourceRef` values such as `inbox-thread:<id>`,
  - matching account display labels as fallback.
- Added post-payload normalization so stored local objects pick up account IDs after fixture mail
  threads are available.
- Activity entries now carry `accountId` and filter by account ID instead of display copy.
- Calendar/Tasks creation forms preserve the active scoped account in hidden `accountId` fields.
- Route smoke verifies the scope lens can switch and reset account scope in Mail, Calendar, Tasks,
  and Activity.

## Not implemented

- No provider sync.
- No OAuth or live account switching.
- No persisted backend schema or database migration.
- No component extraction of `XiScopeLens` yet.

## Self peer review

| Question | Answer |
| --- | --- |
| Best path? | Yes. The lens reuses existing Mail account IDs and normalizes dependent objects rather than inventing a separate account model. |
| Correct fix vs different approach? | Correct for preview scope. Backend/runtime migrations wait for ARCH-004/runtime skeleton. |
| Truncation? | No. Mail, Calendar, Tasks, and Activity all share the lens; Calendar/Tasks gain `accountId`; Activity filters by account ID. |
| Hallucination? | No. This is local preview scope only and does not claim live account sync. |
| Duplicated work? | Avoided separate Calendar/Tasks account selectors by using one shared renderer and handler. |
| Silent failure? | Route smoke now checks account-scope switch/reset across all four lanes. |

## Validation

```text
npm run check:route
npm run check:quick
npm run check
Manual walkthrough: /opt/cursor/artifacts/scope_001_account_lens_walkthrough.mp4
```

## Decision value

`SCOPE_001_SHARED_ACCOUNT_LENS_ACCOUNT_ID_PREVIEW_IMPLEMENTED`

