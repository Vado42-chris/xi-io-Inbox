# UI-002 Static Preview Plan

## Purpose

Create the first static `xi-io Inbox` UI preview using framework-derived component patterns from `xi-io.net`.

## Current review result

```text
Technical render smoke proof: passed locally
Owner/framework UX review: failed on 2026-06-09
Merge readiness: blocked
```

The current preview can render, but it is insufficient as an xi-io product UI.

## Scope correction

This plan supports **static preview smoke proof only**.

It does not prove the end-product platform, runtime, packaging, storage boundary, provider integration, local cloud behavior, Android behavior, desktop shell behavior, or final deployment architecture.

It also does not prove xi-io product quality or framework product compliance.

Platform/runtime decisions are tracked separately in:

```text
xi-io-Inbox#13
```

Decision matrix:

```text
docs/architecture/platform-runtime-decision-matrix.md
```

## Rule

Do not invent a new local UI system first.

Do not treat the presence of `public/index.html`, `npm run dev`, or browser preview as a final web-app decision.

Do not claim Electron, Tauri, native Android, local web, or local cloud as selected final runtime until `ARCH-004` is resolved.

Do not treat adapted-copy compliance as sufficient when the resulting UI fails to express the xi-io product architecture.

## Framework blocker

Direct runtime import from `xi-io.net/public/*.js` is not practical yet. The framework consumer contract was merged in `xi-io.net#238`, but stable direct export/package work remains tracked in `xi-io.net#239`.

`xi-io.net#239` is now a real blocker for direct framework UI reuse, not optional cleanup.

## Current preview decision

The current adapted-copy/static-preview path produced a technical page render, but failed owner/framework UX review.

Do not merge PR #12 as-is.

Keep PR #12 draft.

## Framework sources to inspect before redesign

- `Vado42-chris/xi-io.net/public/workbench-event-components.js`
- `Vado42-chris/xi-io.net/public/workbench-event-runtime.js`
- `Vado42-chris/xi-io.net/public/github-management-components.js`
- `Vado42-chris/xi-io.net/docs/framework/workbench-ui-consumer-contract-v1.md`
- `Vado42-chris/xi-io.net/docs/framework/platform-runtime-envelope-contract-v1.md`

## Replacement preview target

A replacement preview must use a framework-compliant unified app shell with explicit product lanes:

- Inbox,
- Calendar,
- Tasks,
- Extensions,
- Ibal,
- Receipts/Audit,
- Provider Gates,
- Automations,
- Draft-only Egress.

## Required acceptance criteria

A replacement preview must provide:

- unified app shell,
- clear top-level navigation,
- clear lane separation,
- clear workpaths,
- clear information architecture,
- Inbox surface that feels like an email client,
- Calendar surface that feels schedulable,
- Tasks surface that supports tracking work,
- Extensions surface for add-ons/providers/tools,
- Ibal orchestration surface for guided action,
- Receipts/audit surface for confirmed actions,
- Provider gates before real data/actions,
- Draft-only egress controls,
- framework visual language,
- direct framework reuse or documented framework export blocker.

## What this preview may test after redesign

- unified shell structure,
- lane navigation,
- product IA fit,
- preview data rendering,
- keyboard smoke behavior,
- blocked action visibility,
- draft-only egress language,
- framework-derived UI fit.

## What this preview must not claim

- product platform readiness,
- web app final architecture,
- Electron app architecture,
- Tauri app architecture,
- Android runtime readiness,
- local cloud readiness,
- email provider integration,
- final storage/security model.

## Decision value

`UI_002_TECHNICAL_RENDER_PASSED_OWNER_FRAMEWORK_UX_REVIEW_FAILED_REDESIGN_REQUIRED`
