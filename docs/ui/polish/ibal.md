# Ibal Polish Plan

## Goal

Make Ibal feel like the conductor/orchestrator, not another dashboard lane.

## Current Problems

- Ibal panels repeat the same card grammar as other lanes.
- Priority, blockers, suggestions, and synthesis need clearer hierarchy.
- Proposal-only status should be integrated into interaction model.
- Cross-lane synthesis needs stronger information design.

## Required Updates

- Use a conductor layout: Focus, Suggested Next, Blockers, What Changed.
- Make current priority stack the primary column.
- Show proposed actions as non-executing recommendation rows.
- Add visible links to source lanes.
- Make blockers visually calm but impossible to miss.

## Component Pattern

- `IbalFocusStack`
- `SuggestedNextActionRow`
- `BlockerList`
- `CrossLaneSynthesis`
- `WhatChangedDigest`
- `ProposalOnlyAction`

## Acceptance Checks

- User understands Ibal proposes, not executes.
- Top blocker and next safe action are obvious.
- Cross-lane links are visible.
- Ibal feels distinct from Home.
