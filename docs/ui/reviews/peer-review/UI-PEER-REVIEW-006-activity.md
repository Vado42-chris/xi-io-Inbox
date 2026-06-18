# UI-PEER-REVIEW-006 — Activity

## Status

Captured 2026-06-17 · Classification active · P0 retest classify (B6)

**P0 table overlap:** may be fixed by FIX-BATCH-001 shared ledger overflow (B6). Classify via `UI-PEER-REVIEW-ACTIVITY-B6-RETEST-CLASSIFY.md` — do not close or reopen without `:4488` proof on Activity lane.

## Pass A — Purpose

| Question | Answer |
| --- | --- |
| One-sentence purpose | Audit what happened locally |
| One user action | Find a receipt / activity entry |
| Hide until needed | Four filter dimensions, export packet, receipt class advanced |

**Pass A score:** 1 — power-user ledger, not calm history.

## Pass B — Region findings

| Region | Finding | Sev |
| --- | --- | --- |
| Main | **Table text overlap** WHAT HAPPENED / SOURCE | P0 |
| Main | Tabs + dropdowns + scope pills + sidebar filters | P1 |
| Main | Detail pane = compliance form (WHY BLOCKED, RECEIPT ID…) | P1 |
| Main | Repeated “mailbox selected” receipts | P1 |
| Inspector | Calendar proposal unrelated to activity focus | P1 |

## Pass C — Tags

| Block | Tag |
| --- | --- |
| Activity table | Real structure, P0 layout bug |
| Detail metadata grid | Scaffold |
| Export packet | Scaffold |

## Rubric scores (0–3)

| Category | Score |
| --- | --- |
| Page purpose clarity | 1 |
| Visual hierarchy | 0 |
| Object model clarity | 2 |
| Interaction clarity | 1 |
| Component consistency | 1 |
| Page-specific identity | 2 |
| Status / safety clarity | 2 |
| Density control | 0 |
| Accessibility readiness | 0 |

## Fix batch

- **B6 P0** — fix table cell layout / truncation
- Owner mode — single filter + search; hide export advanced
- B2 inspector

## Findings log

| Date | Reviewer | Note |
| --- | --- | --- |
| 2026-06-17 | Owner + Cursor | Initial capture |
| 2026-06-18 | Owner + Cursor | P0 overlap queued for retest classify — possible close via FIX-BATCH-001 B6 |
