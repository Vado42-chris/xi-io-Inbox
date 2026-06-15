# Calendar Polish Plan

## Page Purpose

Show time pressure, schedule proposals, conflicts, reminders, and source-linked calendar context.

## Primary User Job

Understand upcoming time commitments and review calendar proposals without writing to a provider.

## Emotional / Visual Target

Time-aware, calm, and schedulable. It should feel closer to an agenda/time grid than a card dashboard.

## Information Hierarchy

1. Today/agenda timeline.
2. Pending event proposals.
3. Conflicts and reminders.
4. Source links and receipt placeholders.

## Primary Object Model

Agenda item with time, title, source, proposal/write state, and conflict/reminder state.

## Secondary Object Model

Calendar proposals, source links from Inbox/Tasks, reminder placeholders, and event receipt placeholders.

## Navigation Behavior

Calendar route should support future day/week/month modes. Current preview may show one default agenda mode.

## Right Inspector Behavior

Inspector explains selected time item, source evidence, provider write block, Ibal proposal, and future event receipt.

## Empty / Loading / Blocked States

Empty agenda still shows provider status and proposal queue. Provider blocked state is shown near calendar write affordances.

## Status And Badge Usage

Use proposal/conflict/reminder states sparingly. Time should carry the main visual structure.

## Primary Actions

- Review proposed event.
- Inspect conflict.
- Link back to source thread/task.

## Secondary Actions

- Filter proposal queue.
- Inspect reminder placeholder.
- Inspect receipt placeholder.

## Disabled / Dangerous Action Behavior

No provider calendar write, invite send, event delete, or external disclosure occurs.

## Keyboard / Focus Behavior

Agenda rows are selectable. Enter/Space selects item and updates inspector.

## Responsive Behavior

Desktop may show timeline plus proposal queue. Mobile prioritizes chronological agenda, then proposals.

## Visual Polish Requirements

- Add visible time rail.
- Use stronger chronological grouping.
- Treat conflicts as structured constraints, not red decoration.
- Separate proposals from confirmed/provider events.

## Component Reuse Requirements

Reuse agenda row, proposal panel, source link, receipt preview, and inspector grammar.

## Page-Specific Visual Distinction

Calendar must feel like time.

## What Currently Fails

The current page lists agenda content but does not yet create enough time rhythm or schedulable structure.

## Required Improvements

- Introduce time grid/rail composition.
- Make proposals visibly draft-only.
- Make source links easy to scan.

## Acceptance Checklist

- User can scan the day by time.
- Proposed events are clearly not provider writes.
- Conflicts are visible without alarmist treatment.
- Source links are visible.
