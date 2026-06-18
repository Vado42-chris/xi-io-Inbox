# UI-PEER-REVIEW-001 — Home

## Status

Captured 2026-06-17 · UI-PEER-REVIEW-FIX-BATCH-003 landed · Owner retest pending

## Pass A — Purpose

| Question | Answer |
| --- | --- |
| One-sentence purpose | Cross-lane operational overview |
| One user action | Jump to what needs attention (should be **real** priority) |
| Hide until needed | Advanced build explanation, duplicate inspector handoffs |

**Pass A score:** 1 — purpose exists in copy, not in object model (fixture attention item).

## Pass B — Region findings

| Region | Finding | Sev |
| --- | --- | --- |
| Header | Same env badge noise as all lanes | P1 |
| Main | Stat cards mix snapshot counts (25 unread) with product metrics | P0 |
| Main | “Needs attention” = fixture GoDaddy thread, not owner priority | P0 |
| Main | Quick links row competes with primary story | P1 |
| Main | “How this build works (advanced)” — developer copy on user home | P1 |
| Inspector | Full Related across suite + Ibal while on Home | P1 |
| Inspector | Calendar/Mail proposals duplicate other lanes | P1 |

## Pass C — Tags

| Block | Tag |
| --- | --- |
| Stat cards | Scaffold (snapshot) + Real (counts shape) |
| Needs attention card | Scaffold fixture |
| Inspector Ibal text | AI proposal |
| Advanced accordion | Scaffold |

## Rubric scores (0–3)

| Category | Score |
| --- | --- |
| Page purpose clarity | 1 |
| Visual hierarchy | 1 |
| Object model clarity | 1 |
| Interaction clarity | 2 |
| Component consistency | 1 |
| Page-specific identity | 1 |
| Status / safety clarity | 1 |
| Density control | 1 |
| Accessibility readiness | 2 |

## Fix batch

- B1 — single status line
- B2 — collapse inspector on Home or show lane summaries only
- B5 — hide fixture attention until real mail index connected
- Home-specific: replace stat card source with live index when Tauri connected

## Findings log

| Date | Reviewer | Note |
| --- | --- | --- |
| 2026-06-17 | Owner + Cursor | Initial capture from screenshot |
