# UI-016B Component Anatomy and Boundary Checks

## Status

```text
Type: Level 5 component anatomy spec and check plan.
Depends on: UI-013, UI-014, UI-015, UI-016A.
Blocks: component extraction and framework backfeed claims.
```

UI-016A proved the preview has component-like patterns but is not actually componentized.
UI-016B defines the anatomy and automated boundaries required before extraction.

## Standard component document shape

Every reusable component candidate needs:

| Field | Required meaning |
| --- | --- |
| Name | `Xi*` name or repo-local name. |
| Owner | `framework`, `repo`, `split`, or `template`. |
| Purpose | One sentence: what job it performs. |
| Non-purpose | What it must not become. |
| Anatomy | Slots, regions, required labels, optional regions. |
| States | Empty, loading, selected, focused, blocked, proposed, complete, error. |
| Inputs | Data contract / props / fixture fields. |
| Outputs | Events, route changes, receipts, local state writes. |
| Safety | Provider/runtime/egress limits and blocked-action behavior. |
| Accessibility | Landmark/role/focus/keyboard/contrast requirements. |
| Visual standard | Token usage and lane identity hooks. |
| Evidence | Screenshot/video/check required to close the component. |

## P0 component anatomy

### `XiRouteTable`

Owner: `framework` with repo configuration.

Purpose: one source of truth for primary nav, hash routes, active workspace, contextual rail,
module owner, and route smoke expectations.

Required fields:

```text
id, label, route, laneId, primaryNav, contextNav, moduleOwner, scopeSupported, receiptSurface
```

Checks:

- every `PRODUCT_LEVEL_NAV` entry must come from route table,
- every primary route must load,
- route label/hash/lane cannot drift,
- `Plan` cannot return as a primary route,
- `Activity`/`Integrations` labels must map cleanly to their internal lanes.

### `XiReceiptList` / `XiReceiptRow`

Owner: `framework`.

Purpose: one audit row/list pattern for local receipts, proposals, blocked actions, and future
confirmed runtime events.

Anatomy:

```text
title, type, state, sourceRef, actor, timestamp, limitation, evidenceRefs, continueTarget
```

Checks:

- only one local receipt renderer remains after extraction,
- every receipt row states preview/local/runtime status,
- every receipt can continue to native object or explicitly says why it cannot.

### `XiDetailGrid`

Owner: `framework`.

Purpose: consistent key/value detail rendering across calendar proposals, activity, providers,
settings, and work items.

Anatomy:

```text
label, value, emphasis, linkedRef?, blockedState?
```

Checks:

- detail grid CSS uses shared class,
- no lane-specific duplicate detail grid styles unless documented,
- values are readable without color-only state.

### `XiProviderGateCard`

Owner: `framework`.

Purpose: explain provider status, permissions, data touched, allowed preview action, blocked
runtime action, and lanes unlocked.

Anatomy:

```text
providerId, providerName, status, surfaceIds, permissionSummary, dataTouched,
allowedPreviewAction, blockedRuntimeAction, nextProof
```

Checks:

- no provider card can imply browser OAuth/live connect unless gate allows it,
- each provider declares which lanes it unlocks,
- provider gate state appears where blocked user actions occur.

### `XiScopeLens`

Owner: `framework`.

Purpose: global/account/workspace/project scope selector shared by Mail, Calendar, Tasks, and
Activity.

Anatomy:

```text
scopeKind, accountId?, workspaceId?, projectId?, label, count, syncState
```

Checks:

- Calendar proposals and work items use `accountId`, not only `accountLabel`,
- all scoped lanes use the same selector model,
- all-account and account views are filtered projections, not duplicate stores.

## P1 component anatomy

| Component | Owner | Required before extraction |
| --- | --- | --- |
| `XiBlockedActionBar` | framework | Shared blocked/send/sync/execute grammar and disabled action semantics. |
| `XiRelatedObjectRail` | framework | UI-014 slots: source, reason, target, blocked state, receipt expectation. |
| `XiSheet` / `XiFormShell` | framework | Shared modal/sheet role, focus trap, actions, dirty state, local-only copy. |
| `XiWorkItemCard` | split | Task/story/bug/evidence typed badges and source refs. |
| `XiCalendarProposalCard` | split | Time, source, conflict, account, provider gate, receipt expectation. |
| `XiAutomationDryRunTrace` | framework candidate | Simulation steps, affected objects, blocked external calls. |

## Boundary checks to implement

These should become scripts before the first extraction claim:

| Check | Rule |
| --- | --- |
| `check:route-table` | route table contains every primary nav item and all labels/hash routes derive from it. |
| `check:receipt-renderers` | duplicated `render*LocalReceipts` functions are removed or wrapped by one helper. |
| `check:detail-grid` | detail grid classes/helper are shared across lanes. |
| `check:blocked-actions` | blocked provider/send/sync/execute controls use shared disabled-action grammar. |
| `check:scope-lens` | Mail/Calendar/Tasks/Activity use one account scope contract. |
| `check:component-ownership` | each extracted module has ownership tag: framework/repo/split/template. |
| `check:visual-proof` | required screenshots/video exist for changed visible components. |

`scripts/ui-016c-boundary-check.mjs` implements the first guardrail pass. It allows the
documented pre-extraction baseline but fails on undocumented new receipt renderers, provider
banners, detail grid classes, context nav renderers, or primary-nav drift. It is wired into
`npm run check:components`, `npm run check:quick`, and `npm run check`.

## Extraction rules

- Do not move Gmail adapter/privacy validation into the framework.
- Do not create a component that only renames existing monolith markup.
- Do not extract a component without a documented owner and check.
- Do not add new UI to `public/inbox-preview.js` during migration unless it removes more code
  than it adds or is explicitly marked as a temporary strangler bridge.
- Do not backfeed a framework candidate without evidence from this repo and a reusable anatomy.

## Acceptance criteria

- [x] Component anatomy fields standardized.
- [x] P0/P1 component candidates defined.
- [x] Boundary checks specified.
- [x] Boundary checks implemented as scripts for the documented pre-extraction baseline.
- [ ] First component extraction under `public/src/*` completed.
- [ ] Framework backfeed packet created for `xi-io.net#239`.

## Decision value

`UI_016B_COMPONENT_ANATOMY_DEFINED_BOUNDARY_CHECKS_PENDING_IMPLEMENTATION`

