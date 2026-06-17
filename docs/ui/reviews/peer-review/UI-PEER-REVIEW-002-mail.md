# UI-PEER-REVIEW-002 — Mail

## Status

Captured 2026-06-17 · Partial code fix (OWNER_MAIL_UX) · Retest pending

## Pass A — Purpose

| Question | Answer |
| --- | --- |
| One-sentence purpose | Read and triage email |
| One user action | Read/select thread; Connect/Sync when empty |
| Hide until needed | Metadata grid, gate badges, inspector Related suite, CLI sync panels |

**Pass A score:** 2 after owner sidebar pass; center/right still fail (still 1 for full viewport).

## Pass B — Region findings

| Region | Finding | Sev | Code status |
| --- | --- | --- | --- |
| Left rail | Was Drafts/Approvals/Imported snapshots noise | P1 | Fixed — owner folders only |
| Main header | Was badge row + 3 banners | P1 | Partial — one setup guide |
| Main header | Partial import (25/12470) still prominent | P0 | Open |
| Toolbar | Compose + search OK | — | OK |
| Thread list | Row overlap / unreadability in screenshots | P0 | Partial CSS |
| Reading pane | Metadata spec sheet not message view | P1 | Open |
| Reading pane | “NOT LIVE GMAIL” + blocked action row | P1 | Open |
| Inspector | Full template duplicate of Mail context | P1 | Open |

## Pass C — Tags

| Block | Tag |
| --- | --- |
| Thread list (snapshot) | Real headers, scaffold delivery |
| Setup guide | Real guidance |
| Reading metadata grid | Scaffold |
| Inspector Related | Scaffold + AI |
| Blocked send/draft buttons | Blocked (should be tertiary) |

## Rubric scores (0–3)

| Category | Score |
| --- | --- |
| Page purpose clarity | 2 |
| Visual hierarchy | 1 |
| Object model clarity | 2 |
| Interaction clarity | 2 |
| Component consistency | 1 |
| Page-specific identity | 2 |
| Status / safety clarity | 1 |
| Density control | 1 |
| Accessibility readiness | 2 |

## Fix batch (priority)

1. B3 — single setup card (done partial)
2. B6 — thread list layout P0
3. B7 — reading pane message-first layout
4. B2 — collapse inspector default on Mail
5. B1 — header status dedupe

## Findings log

| Date | Reviewer | Note |
| --- | --- | --- |
| 2026-06-17 | Owner + Cursor | OWNER_MAIL_UX landed same program |
