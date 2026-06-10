# Ibal Polish Plan

## Page Purpose

Show cross-lane synthesis, priorities, blockers, suggested next safe actions, and proposed actions.

## Primary User Job

Use Ibal to understand what changed and what should happen next without triggering runtime action.

## Emotional / Visual Target

Conductor and orchestrator. It should feel intelligent, restrained, and accountable.

## Information Hierarchy

1. Current priority stack.
2. Suggested next safe actions.
3. Blockers and unresolved items.
4. What changed and cross-lane synthesis.
5. Proposed actions only.

## Primary Object Model

Ibal recommendation with reasoning, source lanes, blocker state, confidence/evidence cue, proposed action, and receipt expectation.

## Secondary Object Model

Priority stack, unresolved items, blockers, change summary, and cross-lane references.

## Navigation Behavior

Recommendation selection updates inspector. Links point to source lanes or receipt evidence.

## Right Inspector Behavior

Inspector explains selected recommendation: why it matters, source evidence, safe next action, blocker, and receipt that would exist later.

## Empty / Loading / Blocked States

Empty state says no current proposal. Blocked state says Ibal cannot execute or connect providers.

## Status And Badge Usage

Proposal-only state belongs in the recommendation model, not repeated on every visual fragment.

## Primary Actions

- Review next safe action.
- Inspect reasoning.
- Open source lane.

## Secondary Actions

- Inspect blockers.
- Review what changed.
- Inspect receipt expectation.

## Disabled / Dangerous Action Behavior

Ibal cannot send, connect providers, mutate repos, execute automations, publish, deploy, or write runtime data.

## Keyboard / Focus Behavior

Recommendations are selectable. Focus must remain stable as synthesis/inspector content updates.

## Responsive Behavior

Desktop may show priority/recommendation split. Mobile puts top recommendation first, then evidence and blockers.

## Visual Polish Requirements

- Make Ibal visually distinct from Home.
- Use reasoning/evidence structure instead of generic cards.
- Show proposal chains and blockers clearly.

## Component Reuse Requirements

Reuse recommendation card, source link, evidence block, blocker panel, receipt expectation, and inspector grammar.

## Page-Specific Visual Distinction

Ibal must feel like orchestration, not chat and not a duplicate dashboard.

## What Currently Fails

The current lane says conductor but visually resembles other card-based lanes.

## Required Improvements

- Create a conductor board structure.
- Show cross-lane reasoning.
- Make top blocker and next safe action unmistakable.

## Acceptance Checklist

- Top blocker and next safe action are obvious.
- Cross-lane links are visible.
- Ibal is proposal-only.
- Ibal feels distinct from Home.
