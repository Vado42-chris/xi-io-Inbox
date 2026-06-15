# Automations Polish Plan

## Page Purpose

Design and review safe automation proposals using dry-run simulation and approval gates.

## Primary User Job

Understand what an automation would do, why it is blocked, and what approval/receipt would be required.

## Emotional / Visual Target

Rule builder and simulation lab. It should feel controlled and explicit, not executable by accident.

## Information Hierarchy

1. Automation proposal templates.
2. Trigger, condition, and gate chain.
3. Dry-run simulation.
4. Approval, blocker, and receipt requirement.

## Primary Object Model

Automation rule with trigger, condition, proposed action, approval gate, disabled state, and receipt requirement.

## Secondary Object Model

Dry-run steps, source examples, provider gates, and blocked execution states.

## Navigation Behavior

Rule selection updates dry-run and inspector. No enablement path appears in UI-004.

## Right Inspector Behavior

Inspector explains selected rule, source evidence, dry-run output, approval blocker, and future receipt.

## Empty / Loading / Blocked States

Empty state shows no automation proposals. Blocked state explains execution is disabled by policy and runtime gates.

## Status And Badge Usage

Use dry-run/proposal/blocked states at rule or gate level only. Do not badge every step.

## Primary Actions

- Review proposal.
- Run static dry-run preview.
- Inspect approval gate.

## Secondary Actions

- Inspect source.
- Inspect receipt requirement.
- Review disabled state.

## Disabled / Dangerous Action Behavior

No automation execution, provider mutation, repository mutation, send, publish, or deploy occurs.

## Keyboard / Focus Behavior

Rules and dry-run steps are selectable where relevant. Disabled execution controls are skipped or clearly disabled.

## Responsive Behavior

Desktop can show rule list plus simulation. Mobile shows selected rule followed by dry-run steps.

## Visual Polish Requirements

- Use a visible trigger -> condition -> proposal -> approval -> receipt chain.
- Make dry-run state visually distinct from executable state.
- Avoid making templates look clickable as live automations.

## Component Reuse Requirements

Reuse automation rule card, gate chain, dry-run step, receipt requirement, and inspector grammar.

## Page-Specific Visual Distinction

Automations must feel like safe rule-building.

## What Currently Fails

The current lane communicates dry-run but still resembles generic cards and status pills.

## Required Improvements

- Introduce rule-chain composition.
- Make execution-disabled state deliberate.
- Separate proposal content from future enablement.

## Acceptance Checklist

- No template appears executable.
- Each automation shows trigger, gate, and receipt requirement.
- Dry-run flow is visible.
- Blocked execution is unmistakable.
