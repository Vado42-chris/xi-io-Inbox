# Framework UI Adoption

## Purpose

Lock the rule that `xi-io Inbox` must reuse or adapt mature `xi-io.net` framework UI components before inventing local UI systems.

## Point of order

As of this document, Inbox has used framework doctrine, event rules, verifier gates, architecture planning, and source-mining. It has not yet used actual framework UI components because Inbox has no runtime UI yet.

That is now an explicit blocker before runtime UI work.

## Framework UI sources identified

The current concrete framework UI sources are in `xi-io.net`:

```text
public/workbench-event-components.js
public/workbench-event-runtime.js
public/github-management-components.js
```

## Reusable framework UI patterns

### Workbench event components

Reusable patterns include:

- three-zone Workbench shell: left rail / center stream / right context
- project lens rail
- stream view selector
- quick filters
- event pills and lifecycle states
- event cards
- event chains
- selected-event context panel
- evidence panel
- claims checked panel
- closure criteria panel
- preview-safe actions
- privacy-sensitive warnings
- keyboard selection via Enter/Space
- local UI state persistence

### GitHub management components

Reusable patterns include:

- preview warning banner
- portfolio summary cards
- project rail
- project header
- repo status card
- pull request cards
- warnings/gates panel
- next safe action panel
- preferences and non-disableable invariants panel
- no-silent-green status pills

## Inbox UI adaptation rule

Inbox runtime UI should start from the framework shell pattern:

```text
left rail    = accounts, providers, filters, bins
center stream = message events, thread events, task/action proposals
right context = selected thread, evidence, draft, actions, receipts
```

## Runtime UI blockers

Before implementing an Inbox runtime UI, complete:

- component map
- adapter plan
- accessibility check
- privacy/warning banner plan
- draft-only egress action pattern
- event schema mapping to UI view model
- decision on direct reuse vs adapted copy vs framework package extraction

## Do not create local UI first

Do not create a new Inbox-only shell, table system, card system, status pill system, action panel, or context panel until the framework components have been tested for reuse/adaptation.

## Acceptable implementation paths

### Path A: direct reuse

Use framework JS modules directly if the product shell remains static/vanilla-compatible.

### Path B: adapted copy with source note

Adapt component patterns into Inbox only if direct reuse is impractical. Keep source attribution and record divergence.

### Path C: promote framework package

If multiple products need the same components, promote shared UI to a framework package or documented export path.

## Decision value

`INBOX_UI_MUST_ADOPT_FRAMEWORK_COMPONENTS_BEFORE_LOCAL_UI`
