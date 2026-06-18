# UI-PEER-REVIEW — Activity B6 retest classify

## Status

**Open — unverified** · retest required at `:4488` on Activity lane

## Context

| Field | Value |
| --- | --- |
| Original finding | `UI-PEER-REVIEW-006-activity.md` — P0 table text overlap (WHAT HAPPENED / SOURCE) |
| Possible fix | FIX-BATCH-001 B6 — shared ledger / activity table overflow hardening (`public/inbox-preview.css`) |
| Global finding | B6 · G-P0-002 in `UI-PEER-REVIEW-GLOBAL-FINDINGS.md` |
| FIX-BATCH-001 receipt | `UI-PEER-REVIEW-FIX-BATCH-001-mail-owner-mode-receipt.md` |

Do **not** assume the P0 is open or closed without visual proof on the Activity workspace.

## Retest procedure

1. `npm run dev` → http://localhost:4488
2. Navigate to **Activity**
3. Inspect activity table rows — overlap, truncation, readable WHAT HAPPENED / SOURCE columns
4. Optional: compare with scaffold mode (`showWorkflowScaffold = true`) if layout differs

## Classification outcomes (record one)

| Outcome token | Meaning | Next action |
| --- | --- | --- |
| `CLOSED_BY_FIX_BATCH_001` | Overlap gone; table readable | Downgrade Activity P0 in `UI-PEER-REVIEW-006-activity.md`; keep P1 density/filter items for a future batch |
| `PARTIAL_REPAIR_NEEDS_ACTIVITY_BATCH` | Improved but Activity-specific layout still fails | Queue FIX-BATCH-00N Activity owner-mode; do not reopen Mail batch |
| `STILL_P0_BLOCKER` | Overlap unchanged | Route fix to Activity/shared component batch; verify B6 CSS applies to Activity table selectors |

## Record location

After retest, append to `UI-PEER-REVIEW-006-activity.md` findings log:

```text
Date · Reviewer · Activity B6: <OUTCOME_TOKEN> · notes
```

Update the **Status** line in this file from `Open — unverified` to the chosen outcome.

## Blocked actions

- Do not claim UI-003E PASS from this retest alone
- Do not implement Activity batch code until outcome is classified (except shared CSS proof if `STILL_P0_BLOCKER`)
