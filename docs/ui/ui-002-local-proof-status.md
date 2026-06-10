# UI-002 Local Proof Status

## Purpose

Track the local browser smoke proof and owner/framework UX review status for PR #12.

## Status

```text
Technical render smoke proof: PASSED by local owner/Codex/Zed preview
Owner/framework UX review: FAILED on 2026-06-09
Owner visual polish review: FAILED on 2026-06-10
Local visual proof complete: NO
PR #12 merge readiness: BLOCKED
```

UI-003D readiness triage passed on 2026-06-10. This means the redesigned shell is ready for owner/framework visual proof recording, not that visual proof is complete.

Owner screenshot review on 2026-06-10 found that the redesigned shell is still not competitive with Microsoft, Google, Samsung, and other high-polish product surfaces. UI-004 page polish planning is required before visual proof can pass.

## Scope correction

This receipt is not a product-quality pass.

A technical render pass only means the current static page can open and render. It does not mean the preview is acceptable as a unified xi-io application.

Platform/runtime decisions are tracked in `xi-io-Inbox#13` and documented in:

```text
docs/architecture/platform-runtime-decision-matrix.md
```

## Framework state

- `xi-io.net#238` merged the Workbench UI consumer contract.
- `xi-io.net#235` is closed as completed.
- `xi-io.net#239` tracks future stable direct export/package work.
- `xi-io.net#239` is now treated as a real blocker for direct framework UI reuse.

The PR #12 preview uses the adapted-copy/static-preview path. Direct framework package import is not complete.

## Owner/framework UX review result

The current preview is insufficient as an xi-io product UI.

Review findings:

- It does not feel like a unified xi-io application.
- It does not express the full Inbox, Calendar, Tasks, Extensions, Ibal, Receipts, provider gate, and automation model.
- It compresses too many concerns into one unclear page.
- It lacks clear lanes, clear workpaths, clear navigation, clear information architecture, and clear user purpose.
- Adapted-copy compliance is not enough if the result does not express the framework product architecture.

## Required correction

Do not merge PR #12 as-is.

Do not mark UI-002 visual proof complete.

Keep PR #12 draft.

The next UI work must follow the UI-004 polish standards and page plans before owner/framework visual proof can pass.

## Required future UI acceptance criteria

A replacement preview must explicitly include:

- unified app shell,
- Inbox lane,
- Calendar lane,
- Tasks lane,
- Extensions lane,
- Ibal orchestration surface,
- receipts/audit surface,
- provider gates,
- draft-only egress controls,
- clear navigation and information architecture,
- framework visual language,
- direct framework reuse or documented framework export blocker.

## PR gate

PR #12 remains draft.

After redesign, a new local proof may be recorded only if the redesigned preview satisfies both technical smoke proof and owner/framework UX review.

Product/runtime testing remains blocked by `ARCH-004`.

## UI-003D readiness receipt

```text
npm run check: pass
desktop/mobile route readiness smoke: pass
routes checked: 18
viewports checked: 1440x950 and 390x844
horizontal overflow: none detected
external requests: 0
Inbox keyboard selection: pass
Inbox focus preservation: pass
owner/framework visual proof complete: NO
```

## Decision value

`UI_002_TECHNICAL_SMOKE_PASSED_OWNER_FRAMEWORK_UX_REVIEW_FAILED`
