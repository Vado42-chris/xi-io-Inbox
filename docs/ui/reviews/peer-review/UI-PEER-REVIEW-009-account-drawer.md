# UI-PEER-REVIEW-009 — Account drawer

## Status

Captured 2026-06-17 · UI-PEER-REVIEW-FIX-BATCH-002 landed · Owner retest pending

## Pass A — Purpose

| Question | Answer |
| --- | --- |
| One-sentence purpose | See account connection status |
| One user action | Connect Gmail or open Settings → Accounts |
| Hide until needed | Seven import buttons, CLI commands, gate grid, receipt spam |

**Pass A score:** 0 — reads as developer control panel.

## Pass B — Region findings

| Header | Email repeated 3× with metadata strings | P0 | Fixed — single email + status chip |
| Body | Seven import/wipe buttons before clear path | P1 | Fixed — moved to Advanced |
| Body | CLI sync-status command in UI | P0 | Fixed — demoted to Settings Advanced |
| Body | Metadata/body/send/mutation grid | P1 | Fixed — hidden from owner drawer |
| Body | “Connect in browser blocked” prominent | P1 | Fixed — removed from owner drawer |
| Footer | Three identical mailbox-selected receipts | P1 | Fixed — deduped in Advanced |

## Pass C — Tags

| Block | Tag |
| --- | --- |
| Add Gmail | Real |
| Import metadata snapshot | Scaffold operator |
| Gate grid | Scaffold |
| Recent activity receipts | Scaffold |

## Rubric scores (0–3)

| Category | Score |
| --- | --- |
| Page purpose clarity | 0 |
| Visual hierarchy | 0 |
| Object model clarity | 1 |
| Interaction clarity | 1 |
| Component consistency | 1 |
| Page-specific identity | 1 |
| Status / safety clarity | 1 |
| Density control | 0 |
| Accessibility readiness | 1 |

## Fix batch

- Owner drawer — avatar, email, Connected/Not connected, Connect, Settings link
- Move import/wipe/CLI to Settings → Accounts advanced
- B1 status dedupe

## Findings log

| Date | Reviewer | Note |
| --- | --- | --- |
| 2026-06-17 | Owner + Cursor | Initial capture |
