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

1. Mail — `UI-PEER-REVIEW-002-mail.md`
2. Account drawer — `UI-PEER-REVIEW-009-account-drawer.md`
3. Home — `UI-PEER-REVIEW-001-home.md`
4. Ibal drawer — `UI-PEER-REVIEW-008-ibal-drawer.md`
5. Calendar → Tasks → Automations → Activity → Integrations

Fix batches group by component (see runbook). Do not close a workspace until P0 findings are triaged.

## Workspace index

| ID | Workspace | File | Status |
| --- | --- | --- | --- |
| 001 | Home | `UI-PEER-REVIEW-001-home.md` | Captured — owner screenshots |
| 002 | Mail | `UI-PEER-REVIEW-002-mail.md` | Captured — owner screenshots · partial owner UX pass in code |
| 003 | Calendar | `UI-PEER-REVIEW-003-calendar.md` | Captured — owner screenshots |
| 004 | Tasks | `UI-PEER-REVIEW-004-tasks.md` | Captured — owner screenshots |
| 005 | Automations | `UI-PEER-REVIEW-005-automations.md` | Captured — owner screenshots |
| 006 | Activity | `UI-PEER-REVIEW-006-activity.md` | Captured — owner screenshots |
| 007 | Integrations | `UI-PEER-REVIEW-007-integrations.md` | Captured — owner screenshots |
| 008 | Ibal drawer | `UI-PEER-REVIEW-008-ibal-drawer.md` | Captured — owner screenshots |
| 009 | Account drawer | `UI-PEER-REVIEW-009-account-drawer.md` | Captured — owner screenshots |

## Related standards (do not re-derive)

- Visual QA rubric: `docs/ui/polish/12-visual-qa-rubric.md`
- Component anatomy: `docs/ui/ui-016b-component-anatomy-and-boundary-checks.md`
- Visual product standard: `docs/ui/polish/00-xi-io-visual-product-standard.md`
- UI-013C chrome: `--radius-chrome: 3px` · `docs/ui/ui-013c-owner-grade-visual-direction.md`
- Owner vs scaffold modes: `owner-vs-scaffold-mode.md`

## Program receipt

Kickoff and scope: `UI-PEER-REVIEW-PROGRAM-RECEIPT.md`
