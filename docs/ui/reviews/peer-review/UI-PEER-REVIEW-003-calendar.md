# UI-PEER-REVIEW-003 — Calendar

## Status

Captured 2026-06-17 · Classification active

## Pass A — Purpose

| Question | Answer |
| --- | --- |
| One-sentence purpose | See schedule and act on time |
| One user action | Pick a day / event |
| Hide until needed | Proposal editor fields, conflict preview, provider gate inspector |

**Pass A score:** 1 — too many jobs on one screen.

## Pass B — Region findings

| Region | Finding | Sev |
| --- | --- | --- |
| Main | Yellow “writes locked” slab | P1 |
| Main | Month grid + week strip + daily detail + proposal editor | P1 |
| Main | Fixture account `personal-gmail-preview` in proposal | P0 |
| Main | Orange lane accent OK; chrome inconsistent with Mail | P1 |
| Inspector | Same Related/Provider template | P1 |
| Left | Scope lens redundant | P1 |

## Pass C — Tags

| Block | Tag |
| --- | --- |
| Month grid events | Scaffold/fixture |
| Transport event draft | Scaffold proposal |
| Sync blocked buttons | Blocked |

## Rubric scores (0–3)

| Category | Score |
| --- | --- |
| Page purpose clarity | 1 |
| Visual hierarchy | 1 |
| Object model clarity | 2 |
| Interaction clarity | 1 |
| Component consistency | 1 |
| Page-specific identity | 2 |
| Status / safety clarity | 1 |
| Density control | 0 |
| Accessibility readiness | 1 |

## Fix batch

- B5 owner mode — month view only; proposals in Advanced
- B2 inspector collapse
- B4 button/radius alignment with Mail

## Findings log

| Date | Reviewer | Note |
| --- | --- | --- |
| 2026-06-17 | Owner + Cursor | Initial capture |
