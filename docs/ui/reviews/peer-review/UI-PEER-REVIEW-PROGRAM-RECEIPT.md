# UI-PEER-REVIEW-PROGRAM — Kickoff receipt

## Date

2026-06-17

## Branch

`ui-002/framework-derived-static-preview`

## Trigger

Owner walked all primary header nav items with screenshots; requested systematic peer review of component framework consistency, IA, and scaffold vs product balance. External agents (ChatGPT) to review same docs on GitHub.

## Scope

| In | Out |
| --- | --- |
| Workspace-by-workspace peer review docs | Implementing all fixes in one pass |
| Global + component drift register | UI-003E owner PASS claim |
| Owner vs scaffold mode decision | Framework backfeed to xi-io.net |
| Owner Mail UX code pass (partial) | Mail UI polish slice without review |

## Artifacts

| Path | Role |
| --- | --- |
| `docs/ui/reviews/peer-review/README.md` | Index |
| `docs/ui/reviews/peer-review/UI-PEER-REVIEW-RUNBOOK.md` | Method |
| `docs/ui/reviews/peer-review/UI-PEER-REVIEW-GLOBAL-FINDINGS.md` | Cross-lane P0/P1 |
| `docs/ui/reviews/peer-review/component-drift-register.md` | Atomic drift |
| `docs/ui/reviews/peer-review/owner-vs-scaffold-mode.md` | Mode split |
| `UI-PEER-REVIEW-001` … `009` | Per-surface captures |

## Code delta (same program)

- `OWNER_MAIL_UX` — simplified Mail sidebar, setup guide, hide demo drafts/scaffold nav sections
- CSS — owner mail spacing, setup guide, topbar/nav radius alignment (partial)

## Next agent action

1. Read global findings + `UI-PEER-REVIEW-002-mail.md`
2. Implement fix batch B3/B5/B6 for Mail owner mode
3. Re-screenshot Mail · update receipt status

## Decision value

```text
UI_PEER_REVIEW_PROGRAM_OPEN_WORKSPACE_REVIEW_ACTIVE
```

Program documented; workspace reviews captured; Mail owner UX partial; full lane polish blocked until batch fixes + retest.
