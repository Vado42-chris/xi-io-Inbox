# Tasks Polish Plan

## Goal

Make Tasks feel like a work tracker, not a card dump.

## Current Problems

- Board columns are functional but visually generic.
- Due dates and source links are too weak.
- The next safe action panel is too large relative to task rows.
- Completed/proposed/blocked states need clearer grammar.

## Required Updates

- Use status lanes with tighter task rows.
- Add source badges for Inbox, Calendar, Receipts.
- Add due/priority metadata in a stable row position.
- Keep Ibal next action compact and contextual.
- Make blocked tasks visibly blocked by reason, not just color.

## Component Pattern

- `TaskStatusLane`
- `TaskRow`
- `TaskSourceBadge`
- `DueDateMeta`
- `BlockedReasonInline`
- `NextSafeActionInline`

## Acceptance Checks

- User can scan proposed, blocked, review, and done states quickly.
- Each task has source and due/priority metadata.
- No task action performs runtime work.
- Blocked state explains cause.
