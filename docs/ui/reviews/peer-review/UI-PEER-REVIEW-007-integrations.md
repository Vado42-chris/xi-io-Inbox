# UI-PEER-REVIEW-007 — Integrations

## Status

Captured 2026-06-17 · Retest pending

## Pass A — Purpose

| Question | Answer |
| --- | --- |
| One-sentence purpose | Connect external providers |
| One user action | Connect Gmail (primary user need) |
| Hide until needed | Taxonomy essay, dual filter rows, full provider catalog |

**Pass A score:** 1 — catalog page not connect-first.

## Pass B — Region findings

| Region | Finding | Sev |
| --- | --- | --- |
| Main | Integration taxonomy banner | P1 |
| Main | Two filter chip rows + search | P1 |
| Main | Large grid; empty “Select extension” detail | P1 |
| Main | Gmail card = metadata only / blocked — mismatched user goal | P0 |
| Inspector | Mail thread snippet unrelated | P1 |

## Pass C — Tags

| Block | Tag |
| --- | --- |
| Provider cards | Scaffold status labels |
| Gmail card | Real provider, blocked connect in browser |
| Taxonomy | Scaffold docs |

## Rubric scores (0–3)

| Category | Score |
| --- | --- |
| Page purpose clarity | 1 |
| Visual hierarchy | 1 |
| Object model clarity | 1 |
| Interaction clarity | 1 |
| Component consistency | 1 |
| Page-specific identity | 1 |
| Status / safety clarity | 2 |
| Density control | 0 |
| Accessibility readiness | 2 |

## Fix batch

- Owner mode — “Connect Gmail” hero + short list; catalog in Advanced
- Route mail account connect here vs Settings duplication (IA decision)
- B2 inspector

## Findings log

| Date | Reviewer | Note |
| --- | --- | --- |
| 2026-06-17 | Owner + Cursor | Initial capture |
