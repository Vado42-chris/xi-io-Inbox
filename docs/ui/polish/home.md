# Home Polish Plan

## Goal

Make Home feel like the command overview for a serious personal operations system.

## Current Problems

- Overview reads as stacked dashboard cards.
- Safety/status elements compete with actual priorities.
- Priority stack lacks urgency, ownership, and next-action clarity.
- Cross-lane previews are too visually equal.

## Required Updates

- Convert Home into a three-part layout: Now, Next, Evidence.
- Replace metric cards with a compact status strip.
- Make the priority stack the visual anchor.
- Show cross-lane previews as concise rows grouped by Inbox, Calendar, Tasks, and Receipts.
- Move Ibal next safe action into a focused recommendation panel.
- Reduce borders; use spacing and typographic hierarchy instead.

## Component Pattern

- `OperationsStatusStrip`
- `PriorityStack`
- `CrossLanePreviewGroup`
- `IbalRecommendationPanel`
- `EvidenceSummaryRow`

## Acceptance Checks

- User can identify the most important item in under 5 seconds.
- No more than one primary visual anchor.
- Provider/runtime blocks remain visible but secondary.
- Home does not look like a generic analytics dashboard.
