# Automations Polish Plan

## Goal

Make Automations feel like a safe workflow builder in dry-run mode.

## Current Problems

- Templates look like static cards, not automation flows.
- Trigger, gate, and receipt information needs a clearer sequence.
- Dry-run steps need a stronger simulation pattern.
- Disabled state must feel intentional, not unfinished.

## Required Updates

- Show each automation as Trigger -> Proposal -> Approval Gate -> Receipt.
- Add disabled status clearly at template and lane level.
- Use a dry-run timeline for simulation.
- Add approval gate module explaining why execution is blocked.
- Keep enable/run controls absent or disabled with reason.

## Component Pattern

- `AutomationTemplateRow`
- `TriggerConditionBlock`
- `ApprovalGateBlock`
- `DryRunTimeline`
- `ReceiptRequirement`
- `DisabledExecutionState`

## Acceptance Checks

- User understands automations are proposal/dry-run only.
- No template appears executable.
- Each automation shows trigger, gate, and receipt requirement.
- Blocked execution is visually deliberate.
