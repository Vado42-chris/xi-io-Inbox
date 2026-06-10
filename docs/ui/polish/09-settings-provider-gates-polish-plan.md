# Settings / Provider Gates Polish Plan

## Page Purpose

Control account state, provider permissions, AI routing, local/cloud data boundary, draft-only egress policy, receipts, and disabled dangerous actions.

## Primary User Job

Understand policy defaults and provider gates before any runtime/provider action exists.

## Emotional / Visual Target

Security and policy console: precise, calm, and explicit.

## Information Hierarchy

1. Account/provider connection state.
2. Permission and credential policy.
3. AI provider routing and data boundary.
4. Egress policy and receipt/audit settings.
5. Disabled dangerous actions.

## Primary Object Model

Policy gate with label, value, reason, scope, blocker, and future receipt behavior.

## Secondary Object Model

Account state, provider permissions, AI routing, local/cloud data boundary, egress defaults, and audit settings.

## Navigation Behavior

Policy group selection updates inspector. No setting writes occur in UI-004.

## Right Inspector Behavior

Inspector explains selected policy, evidence/default source, what is blocked, what action would require approval, and receipt impact.

## Empty / Loading / Blocked States

No connected accounts is a safe default. Unknown platform/runtime state is undecided, not failure.

## Status And Badge Usage

Use policy value and reason first. Use blocked badges only for high-risk disabled actions.

## Primary Actions

- Inspect provider gate.
- Review egress policy.
- Review receipt/audit policy.

## Secondary Actions

- Inspect local/cloud boundary.
- Inspect AI routing placeholder.
- Inspect dangerous action disablement.

## Disabled / Dangerous Action Behavior

No OAuth, credential storage, provider permission change, send, disclose, publish, deploy, repo mutation, or runtime write occurs.

## Keyboard / Focus Behavior

Policy rows are selectable. Disabled controls are either absent or focusable only when their disabled state teaches the policy.

## Responsive Behavior

Desktop uses grouped policy console. Mobile uses grouped list with selected detail below.

## Visual Polish Requirements

- Use policy rows and grouped panels rather than generic cards.
- Make default values clear.
- Keep dangerous action list compact and secondary.

## Component Reuse Requirements

Reuse policy row, gate panel, trust cluster, disabled-action treatment, and inspector grammar.

## Page-Specific Visual Distinction

Settings must feel like security and policy governance.

## What Currently Fails

The current page communicates block states but lacks a polished policy-console hierarchy.

## Required Improvements

- Group policy by user mental model.
- Make values easier to scan.
- Separate provider gates from platform/runtime decisions.

## Acceptance Checklist

- Policy state is legible without reading every card.
- Dangerous actions are disabled or absent.
- No final runtime/cloud/platform decision is implied.
- Provider gates remain explicit.
