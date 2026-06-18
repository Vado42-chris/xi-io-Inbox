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
| `UI-PEER-REVIEW-PROGRAM-CONTINUATION-2026-06-18.md` | Continuation ledger (supersedes stale next-action copy) |
| `UI-PEER-REVIEW-ACTIVITY-B6-RETEST-CLASSIFY.md` | Activity B6 outcome slot |
| `UI-PEER-REVIEW-INTEGRATIONS-IA-DECISION.md` | Connect Gmail IA decision |

## Code delta (same program)

- FIX-BATCH-001 — `OWNER_MAIL_UX` Mail owner-mode (setup guide, message-first pane, inspector collapse, B6 activity table overflow)
- FIX-BATCH-002 — `OWNER_ACCOUNT_UX` Account drawer + Settings → Accounts owner-mode

## Next agent action

> **Supersession:** This section was amended 2026-06-18. If any earlier kickoff copy still references “read Mail and implement B3/B5/B6,” treat it as **stale**. Authoritative ordering lives in `UI-PEER-REVIEW-PROGRAM-CONTINUATION-2026-06-18.md`.

1. Owner retest Mail + Account at `:4488`.
2. Continue classification for Home, Ibal, Calendar, Tasks, Automations, Activity, Integrations.
3. Do not start/claim FIX-BATCH-003 until Mail + Account retest regressions are classified.

## Decision value

```text
UI_PEER_REVIEW_PROGRAM_OPEN_WORKSPACE_REVIEW_ACTIVE
```

Program documented; FIX-BATCH-001/002 landed; full-nav review continues; Home next implementation after retest signal.
