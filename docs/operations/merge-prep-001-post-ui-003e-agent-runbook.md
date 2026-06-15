# MERGE-PREP-001 Post-UI-003E Agent Runbook

## Status

**Blocked** until owner sends `UI_003E_PASS_OWNER_VISUAL_PROOF_COMPLETE`.

This runbook is pre-staged so one agent pass can execute merge-prep without rediscovering gates.

## Trigger (required)

Owner message must include:

```text
UI_003E_PASS_OWNER_VISUAL_PROOF_COMPLETE
Reviewer: Chris
Date: YYYY-MM-DD
```

If owner sends `UI_003E_FAIL`, do **not** run this runbook — run scoped fix slice instead.

## Preflight (agent)

```bash
git fetch origin
git checkout ui-002/framework-derived-static-preview
git status --short
git rev-parse HEAD
npm run check
git diff --check
npm run check:ui003e-packet
```

Confirm classification in `ui-003e-owner-visual-proof-packet.md` still shows owner NO until owner edit records PASS.

## Execution sequence (single agent pass)

| Step | Action |
| --- | --- |
| 1 | Owner (or owner-directed agent) updates `ui-003e-owner-visual-proof-packet.md` classification to PASS with date/reviewer — **only after real review** |
| 2 | Create `docs/ui/reviews/merge-prep-001-post-ui-003e-receipt.md` with HEAD SHA, validation table, remaining blockers |
| 3 | Update `TODO.md`, `03-sprint-slice-plan.md`, `06-compliance-validation-index.md` (GATE-UI-VISUAL-001 partial → pass for owner proof only) |
| 4 | Update PR #12 body: UI-003E PASS recorded; **still draft** if ARCH-004/IBAL/live OAuth open |
| 5 | Optional: `xi-io.net` freshness note append (UI-003E pass recorded; no package export claim) |
| 6 | Push branch; confirm GitHub Static Preview Check **pass** |
| 7 | Mark PR **ready for review** only if owner explicitly requests — default stay **draft** until ARCH-004 + IBAL decisions |

## Validation (must all pass)

| Check | Expected |
| --- | --- |
| `npm run check` | pass |
| `check:ui003e-packet` | pass (after owner PASS recorded in packet per owner edit) |
| `git diff --check` | pass |
| No secrets staged | pass |
| ACC-SYNC / EXT-004 receipts unchanged | no regression |

## Still blocked after UI-003E PASS

| Gate | Reason |
| --- | --- |
| ARCH-004 | Platform/runtime not decided |
| IBAL-001 | Placeholder only |
| Live OAuth proof | Operator-deferred |
| Merge to `main` | Owner explicit request only |
| Framework package export | `xi-io.net#239` open |

## Decision values

After successful run (owner PASS recorded):

```text
MERGE_PREP_001_POST_UI_003E_COMPLETE
PR_12_READY_FOR_REVIEW_OPTIONAL
MERGE_TO_MAIN_STILL_BLOCKED
```

## FAIL path

If owner reports `UI_003E_FAIL`:

1. Record FAIL themes in `ui-003e-owner-visual-proof-packet.md` owner review section
2. Open scoped slice (e.g. UI-003E-FIX-001) with receipt — do not merge-prep
3. Re-run owner runbook after fix

## Decision value (this document only)

`MERGE_PREP_001_RUNBOOK_STAGED_PENDING_OWNER_UI_003E_PASS`
