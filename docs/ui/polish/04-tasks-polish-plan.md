# Tasks Polish Plan

## Page Purpose

Track work generated from inbox, calendar, Ibal, receipts, and provider gates.

## Primary User Job

See what work is proposed, blocked, under review, or done, then choose the next safe action.

## Emotional / Visual Target

Focused work progression, not project-management clutter.

## Information Hierarchy

1. Work state groups.
2. High-priority or due-soon tasks.
3. Source references.
4. Next safe action and receipt linkage.

## Primary Object Model

Task with title, state, source, due/priority metadata, blocker, and linked receipt/proposal.

## Secondary Object Model

Status columns, source references, linked inbox/calendar items, and Ibal next action.

## Navigation Behavior

Status groups structure the lane. Selection updates inspector with task context and source evidence.

## Right Inspector Behavior

Inspector explains selected task, source references, due/priority context, blocker, safe next action, and receipt expectation.

## Empty / Loading / Blocked States

Empty state says no proposed work. Blocked tasks must identify the blocking reason.

## Status And Badge Usage

Use status columns and muted metadata first. Badges only clarify exceptional states.

## Primary Actions

- Review task proposal.
- Inspect source.
- Generate next safe action.

## Secondary Actions

- Link to inbox thread.
- Link to calendar proposal.
- Inspect receipt.

## Disabled / Dangerous Action Behavior

No provider task write, external send, repo mutation, or automation execution occurs.

## Keyboard / Focus Behavior

Task cards/rows are selectable. Tab order follows columns top-to-bottom or list order on mobile.

## Responsive Behavior

Desktop can use compact board columns. Mobile should use grouped lists instead of squeezed columns.

## Visual Polish Requirements

- Make progression visible through layout, not only labels.
- Show due/source metadata consistently.
- Avoid equal-weight board cards where a list is clearer.

## Component Reuse Requirements

Reuse task item, source link, status group, next-safe-action panel, and inspector grammar.

## Page-Specific Visual Distinction

Tasks must feel like work progression.

## What Currently Fails

The current board is structurally present but too visually similar to other lanes.

## Required Improvements

- Clarify proposed, blocked, review, and done states.
- Strengthen source and due metadata.
- Make blocker reasons readable.

## Acceptance Checklist

- User can distinguish task states quickly.
- Every task has source and due/priority metadata.
- Blocked state explains cause.
- No task action performs runtime work.
