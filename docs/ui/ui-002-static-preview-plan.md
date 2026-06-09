# UI-002 Static Preview Plan

## Purpose

Create the first static `xi-io Inbox` UI preview using framework-derived component patterns from `xi-io.net`.

## Scope correction

This plan supports **static preview smoke proof only**.

It does not prove the end-product platform, runtime, packaging, storage boundary, provider integration, local cloud behavior, Android behavior, desktop shell behavior, or final deployment architecture.

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

## Decision

Direct runtime import from `xi-io.net/public/*.js` is not practical yet. The framework consumer contract was merged in `xi-io.net#238`, but stable direct export/package work remains tracked in `xi-io.net#239`.

Use an adapted-copy/static-preview path with source notes for PR #12.

## Framework sources

- `Vado42-chris/xi-io.net/public/workbench-event-components.js`
- `Vado42-chris/xi-io.net/public/workbench-event-runtime.js`
- `Vado42-chris/xi-io.net/public/github-management-components.js`

## Preview target

- left rail: accounts, providers, filters
- center stream: message/thread/action proposal events
- right context: selected thread, evidence, draft-only actions, receipts

## What this preview may test

- rail / stream / context layout
- preview data rendering
- click selection behavior
- keyboard smoke behavior
- blocked action visibility
- draft-only egress language
- framework-derived UI fit

## What this preview must not claim

- product platform readiness
- web app final architecture
- Electron app architecture
- Tauri app architecture
- Android runtime readiness
- local cloud readiness
- email provider integration
- final storage/security model

## Decision value

`UI_002_STATIC_PREVIEW_SCOPE_CORRECTED_PLATFORM_RUNTIME_UNDECIDED`
