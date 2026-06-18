# UI peer review program (workspace-by-workspace)

## Purpose

Systematic owner-grade review of each primary nav workspace after owner screenshot pass (2026-06-17). Captures component-framework drift, information architecture overload, and scaffold/AI noise so fixes batch by **component**, not by page in isolation.

## How to use this folder

| Audience | Start here |
| --- | --- |
| Owner | `UI-PEER-REVIEW-RUNBOOK.md` → one workspace file at a time |
| Cursor agents | `UI-PEER-REVIEW-GLOBAL-FINDINGS.md` + workspace file + `component-drift-register.md` |
| ChatGPT / external agents | Same paths on branch `ui-002/framework-derived-static-preview` · PR #12 |

## Review order (recommended)

1. Mail — `UI-PEER-REVIEW-002-mail.md` · FIX-BATCH-001 landed · owner retest pending
2. Account drawer — `UI-PEER-REVIEW-009-account-drawer.md` · FIX-BATCH-002 landed · owner retest pending
3. Home — `UI-PEER-REVIEW-001-home.md` · next implementation batch (003)
4. Ibal drawer — `UI-PEER-REVIEW-008-ibal-drawer.md`
5. Calendar → Tasks → Automations → Activity → Integrations

**Review/classification continues for all remaining pages** while implementation batches queue. See `UI-PEER-REVIEW-PROGRAM-CONTINUATION-2026-06-18.md` and `UI-PEER-REVIEW-REMAINING-WORKSPACES-CLASSIFICATION-2026-06-18.md`.

Fix batches group by component (see runbook). Do not close a workspace until P0 findings are triaged.

## Workspace index

| ID | Workspace | File | Status |
| --- | --- | --- | --- |
| 001 | Home | `UI-PEER-REVIEW-001-home.md` | Classified P0 · FIX-BATCH-003 queued |
| 002 | Mail | `UI-PEER-REVIEW-002-mail.md` | Fix landed · owner retest pending |
| 003 | Calendar | `UI-PEER-REVIEW-003-calendar.md` | Classified P0 · implementation queued |
| 004 | Tasks | `UI-PEER-REVIEW-004-tasks.md` | Classified P0 · implementation queued |
| 005 | Automations | `UI-PEER-REVIEW-005-automations.md` | Classified P1 · product-phase gated |
| 006 | Activity | `UI-PEER-REVIEW-006-activity.md` | Classified P0 · B6 retest classify |
| 007 | Integrations | `UI-PEER-REVIEW-007-integrations.md` | Classified · IA-blocked |
| 008 | Ibal drawer | `UI-PEER-REVIEW-008-ibal-drawer.md` | Classified P1 · implementation queued |
| 009 | Account drawer | `UI-PEER-REVIEW-009-account-drawer.md` | Fix landed · owner retest pending |

## Related standards (do not re-derive)

- Visual QA rubric: `docs/ui/polish/12-visual-qa-rubric.md`
- Component anatomy: `docs/ui/ui-016b-component-anatomy-and-boundary-checks.md`
- Visual product standard: `docs/ui/polish/00-xi-io-visual-product-standard.md`
- UI-013C chrome: `--radius-chrome: 3px` · `docs/ui/ui-013c-owner-grade-visual-direction.md`
- Owner vs scaffold modes: `owner-vs-scaffold-mode.md`

## Program receipt

Kickoff and scope: `UI-PEER-REVIEW-PROGRAM-RECEIPT.md`

Continuation ledger (ordering, classification matrix, IA decisions): `UI-PEER-REVIEW-PROGRAM-CONTINUATION-2026-06-18.md`

Activity B6 retest classify slot: `UI-PEER-REVIEW-ACTIVITY-B6-RETEST-CLASSIFY.md`

Integrations IA decision (Connect Gmail): `UI-PEER-REVIEW-INTEGRATIONS-IA-DECISION.md`

Remaining workspaces classification (2026-06-18): `UI-PEER-REVIEW-REMAINING-WORKSPACES-CLASSIFICATION-2026-06-18.md`
