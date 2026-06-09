# UI-002 Static Preview Plan

## Purpose

Create the first static `xi-io Inbox` UI preview using framework-derived component patterns from `xi-io.net`.

## Rule

Do not invent a new local UI system first.

## Decision

Direct runtime import from `xi-io.net/public/*.js` is not practical yet because `xi-io.net` does not currently expose those files as a package or public consumer contract. Use an adapted-copy/static-preview path with source notes, then promote a reusable consumer contract through `xi-io.net#235`.

## Framework sources

- `Vado42-chris/xi-io.net/public/workbench-event-components.js`
- `Vado42-chris/xi-io.net/public/workbench-event-runtime.js`
- `Vado42-chris/xi-io.net/public/github-management-components.js`

## Preview target

- left rail: accounts, providers, filters
- center stream: message/thread/action proposal events
- right context: selected thread, evidence, draft-only actions, receipts

## Decision value

`UI_002_STATIC_PREVIEW_BRANCH_STARTED_FRAMEWORK_DERIVED`
