# Interaction Standard

## Purpose

Define interaction behavior for UI-004B and later polish without adding runtime writes, provider connections, automation execution, or platform claims.

## Route Switching

- Hash routes remain the current static preview route model.
- Supported routes (UI-004): `#/home`, `#/inbox`, `#/calendar`, `#/tasks`, `#/automations`, `#/extensions`, `#/receipts`, `#/ibal`, `#/settings`.
- Supported routes (UI-005B+): `#/ibal` removed; Ibal accessed via concierge entry only (see `docs/ui/ui-005-ibal-concierge-model.md`).
- Route changes update active lane, page header, main content, and inspector.
- Unknown routes return to Home or a safe not-found state.

## Active Lane State

- Active lane has a visible selected state and accessible current-page indication.
- Active state must not rely on color alone.
- Status badges in navigation are allowed only for lane-level blockers or meaningful state.

## Item Selection

- Selectable objects update both the main selected-object area and inspector where applicable.
- Selection must preserve keyboard focus.
- Selection must not trigger provider, repository, automation, send, publish, or deploy actions.

## Inspector Update Behavior

Inspector updates answer:

- what is selected,
- why it matters,
- what evidence supports it,
- what is safely possible,
- what is blocked,
- what receipt would exist later.

Inspector content must be lane-aware and selected-object-aware. Generic repeated copy is a failure.

## Keyboard Tab Order

Default desktop order:

1. Skip/landmark support later.
2. Top bar command/search.
3. Lane navigation.
4. Primary lane content.
5. Secondary lane content.
6. Right inspector.

Mobile order follows visual reading order: top bar, route navigation, primary content, selected detail/inspector.

## Enter / Space Behavior

- Enter activates selected route links and selectable objects.
- Space activates button-like selectable objects.
- Enter/Space on disabled controls must do nothing.
- Selection updates must preserve focus.

## Escape Behavior

Escape should be reserved for transient UI:

- close future popovers,
- dismiss temporary command palette,
- return focus to invoking control,
- clear transient selection only where clear behavior is explicit.

Escape must not hide persistent safety state.

## Disabled Action Behavior

- Disabled dangerous actions have no handler.
- Disabled controls appear only where they teach safety or policy.
- Repeated disabled stacks should be replaced with compact blocked-action modules.

## Draft-Only Action Behavior

- Draft actions may create preview-only local proposals in future slices.
- In UI-004, draft actions remain static or disabled unless explicitly scoped.
- Draft state must never imply external send/write.

## Provider Gate Behavior

- Provider gates are inspectable planning objects.
- No OAuth, credentials, provider reads, provider writes, or permission requests occur.
- Gate details should explain blocker, scope, and future receipt expectation.

## Automation Dry-Run Behavior

- Dry-run means static simulation only.
- Automation templates cannot execute or enable.
- Dry-run output must show trigger, condition, gate, proposal, and receipt requirement.

## Receipt Inspection Behavior

- Receipt rows are selectable audit objects.
- Inspecting a receipt cannot authorize execution.
- Receipt details show source, type, state, evidence, and limitations.

## Ibal Proposal Behavior

- Ibal proposes and synthesizes only.
- Ibal cannot run providers, mutate repositories, execute automations, or send messages.
- Ibal recommendations must expose source lanes and blockers.

## Opening Ibal Concierge (UI-005B+)

- Top bar concierge control and command entry open Ibal concierge drawer/panel.
- Concierge available from any route; does not require `#/ibal` navigation.
- Opening concierge preserves underlying lane selection context.
- Escape closes concierge and restores focus to invoking control.
- Concierge focus is trapped while open; tab order remains deterministic.

## Submitting a Local Prompt / Proposal (UI-005B+)

- User prompt submitted via command entry or concierge input.
- Response is fixture/proposal-shaped in Tier 1; no live model-provider claim.
- Each response includes evidence, blockers, and receipt expectation where applicable.
- User may convert proposal to local draft via explicit action (never auto-applied).

## Creating Local Draft / Proposal State (UI-005B+)

- Forms save to client overlay per `docs/ui/ui-005-local-operability-contract.md`.
- Save actions use explicit labels: "Save local draft", "Save proposal" — not "Send" or "Create event".
- Saved state updates inspector and may append local receipt preview.
- Unsaved edits must be visible before navigation away when feasible.

## Cancelling Local Unsaved State (UI-005B+)

- Cancel discards in-form edits not yet saved to overlay.
- Navigation away from dirty form should confirm when implementation adds forms.
- Cancel never triggers provider, repo, or network side effects.

## Restoring Preview State (UI-005B+)

- On load, client overlay merges with fixture seed data.
- Restore defaults reloads fixture baseline and clears or replaces overlay per user control.
- Status message confirms restore outcome.

## Clearing Local Preview Data (UI-005B+)

- Explicit "Clear local preview data" control required (Settings or global).
- Confirm dialog before clear; focus managed; textual status after.
- Clear removes overlay drafts/proposals/local edits; does not mutate repo or fixtures.

## Blocked Runtime Escalation (UI-005B+)

- Tier 2 actions (send, connect, execute, provider write) remain disabled or absent.
- If shown for education, disabled controls have no handler and show XiOperabilityGate reason.
- Attempted escalation surfaces gate ID, blocker, and receipt implication — no silent fail.

## Evidence-First Proposal Review (UI-005B+)

- Ibal and lane proposals must show evidence before primary action buttons.
- User reviews why, sources, and blockers before saving local draft.
- Proposal without evidence is a wargame fail for non-trivial recommendations.

## No-Runtime-Write Behavior

The following remain absent or disabled:

- send,
- forward,
- delete,
- archive,
- disclose,
- publish,
- deploy,
- provider mutation,
- repository mutation,
- provider connection,
- credential storage,
- automation execution,
- local cloud behavior.

## Focus Management

- Focus must remain visible.
- Selection updates must not move focus unexpectedly.
- Route changes should place focus predictably in the new lane when route activation is keyboard-initiated.
- Future modals/popovers must trap and restore focus.

## Status Message Behavior

- User-visible status changes must be textual, not color-only.
- Status messages must be scoped: global, lane, object, or transient.
- Over-repeated status labels reduce signal and should be consolidated.

## Predictable Navigation

- Repeated navigation occurs in the same relative order.
- Labels stay stable across routes.
- Lane navigation is not reused for filters.

## Responsive Navigation

- Desktop: persistent left nav.
- Tablet: persistent or compact nav depending on width.
- Mobile: compact nav with route labels available; no icon-only mystery navigation.

## Acceptance

- All interactive preview controls have clear no-runtime behavior.
- Route and selection behavior can be smoke-tested without provider access.
- Keyboard operation remains deterministic.

## Decision

```text
UI_005A_INTERACTION_STANDARD_EXTENDED_FOR_LOCAL_OPERABILITY
```
