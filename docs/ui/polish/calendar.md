# Calendar Polish Plan

## Goal

Make Calendar feel schedulable, time-aware, and linked to Inbox/Tasks evidence.

## Current Problems

- Calendar reads like a list of proposal cards, not a calendar surface.
- Time hierarchy is weak.
- Conflict/reminder states do not feel spatial or temporal.
- Source links are present but visually passive.

## Required Updates

- Introduce agenda-first layout with time rail.
- Add day/week toggle as disabled preview controls.
- Show pending proposals in a side group with source links.
- Make conflicts visually distinct from normal agenda items.
- Show receipts as small audit markers on proposed events.

## Component Pattern

- `AgendaTimeRail`
- `CalendarProposalRow`
- `ConflictNotice`
- `ReminderRow`
- `SourceLinkChip`
- `EventReceiptMarker`

## Acceptance Checks

- User can identify next upcoming item immediately.
- Proposed events are clearly not provider writes.
- Conflicts are visible without using alarmist decoration.
- Inbox/Task source links are visible.
