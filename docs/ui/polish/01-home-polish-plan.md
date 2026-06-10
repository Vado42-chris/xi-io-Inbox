# Home Polish Plan

## Page Purpose

Show the current operations situation across ingress, time, work, gates, receipts, and Ibal proposals.

## Primary User Job

Understand what needs attention now and choose the next safe path.

## Emotional / Visual Target

Calm command overview. It should feel composed, not like a metrics dashboard.

## Information Hierarchy

1. Current priority and next safe action.
2. Provider/runtime trust state.
3. Urgent ingress, calendar pressure, tasks, and receipts.
4. Supporting blocked or preview-only context.

## Primary Object Model

Priority item with source, urgency, blocked/safe state, and linked lane.

## Secondary Object Model

Provider gate summaries, upcoming events, open tasks, recent receipts, and Ibal proposal summaries.

## Navigation Behavior

Home is the default route. Each preview item should navigate conceptually to its lane without implying runtime execution.

## Right Inspector Behavior

Inspector summarizes the selected priority, why it matters, evidence source, safe next action, blockers, and expected receipt.

## Empty / Loading / Blocked States

Empty state should say no urgent review items, while still showing provider/runtime gates. Blocked states should be contextual, not a page-wide warning.

## Status And Badge Usage

Use one global trust cluster and compact object-level status only where it changes priority. Avoid repeating `preview only` on every element.

## Primary Actions

- Review priority item.
- Open related lane.
- Inspect Ibal next safe action.

## Secondary Actions

- View recent receipts.
- Inspect provider gates.
- Review upcoming time pressure.

## Disabled / Dangerous Action Behavior

No send, provider mutation, repository mutation, automation execution, or runtime write actions appear on Home.

## Keyboard / Focus Behavior

Tab order: global command, lane nav, priority stack, cross-lane previews, inspector. Enter/Space selects a priority preview without losing focus.

## Responsive Behavior

Desktop uses priority plus cross-lane overview. Mobile shows priority first, then Ibal, then gates, then previews.

## Visual Polish Requirements

- Replace equal-weight cards with one primary priority module.
- Reduce borders and rely on spacing, type, and alignment.
- Make trust state compact and persistent.
- Use small lane icons for scan speed.

## Component Reuse Requirements

Reuse priority object, trust cluster, preview list, receipt teaser, and inspector grammar.

## Page-Specific Visual Distinction

Home gets the clearest synthesis treatment and the strongest next-safe-action emphasis.

## What Currently Fails

The current page reads as repeated cards and metrics. It does not create a confident command-center hierarchy.

## Required Improvements

- Convert the top content into Now, Next, and Evidence zones.
- Make Ibal's next recommendation visible without becoming a chatbot.
- Move low-priority status into muted metadata.

## Acceptance Checklist

- Primary priority is obvious within five seconds.
- User can identify the next safe action without reading every card.
- Safety is visible but not visually dominant.
- Home does not look like a generic analytics dashboard.
