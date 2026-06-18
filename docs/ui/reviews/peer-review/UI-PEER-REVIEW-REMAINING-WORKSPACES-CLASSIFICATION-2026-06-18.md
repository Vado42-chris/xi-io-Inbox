# UI-PEER-REVIEW — Remaining workspaces classification

## Date

2026-06-18

## Branch

`ui-002/framework-derived-static-preview`

## Purpose

Continue the all-pages peer-review program in **classification mode** after FIX-BATCH-001 Mail and FIX-BATCH-002 Account landed.

This record exists because implementation gating was briefly misread as review gating. That interpretation is incorrect.

```text
Review/classification continues across all remaining workspaces.
Implementation batches may still be held pending owner retest, IA decision, or P0 proof.
```

## Inputs read

- `UI-PEER-REVIEW-PROGRAM-CONTINUATION-2026-06-18.md`
- `UI-PEER-REVIEW-GLOBAL-FINDINGS.md`
- `UI-PEER-REVIEW-001-home.md`
- `UI-PEER-REVIEW-003-calendar.md`
- `UI-PEER-REVIEW-004-tasks.md`
- `UI-PEER-REVIEW-005-automations.md`
- `UI-PEER-REVIEW-006-activity.md`
- `UI-PEER-REVIEW-007-integrations.md`
- `UI-PEER-REVIEW-008-ibal-drawer.md`
- `UI-PEER-REVIEW-009-account-drawer.md`

Mail and Account are included only as dependency context because their implementation batches have already landed and await owner retest.

## Classification summary

| Workspace | Current classification | Severity | Implementation readiness | Required next proof / decision |
| --- | --- | --- | --- | --- |
| Home | Owner-mode cleanup ready to scope | P0 | Ready for FIX-BATCH-003 after Mail/Account retest regression check | Confirm no Mail/Account regression blocks shared owner-mode pattern |
| Ibal drawer | AI surface dedupe and owner-copy cleanup | P1 | Ready for a later drawer/AI batch, not required before Home | Decide one Ask Ibal surface and remove duplicate proposal view |
| Calendar | Owner-mode simplification required | P0 | Queued, not first because Home has broader first-run impact | Remove fixture account/proposal primary exposure; month-first owner path |
| Tasks | Owner-mode simplification required | P0 | Queued, likely after Calendar or grouped with work-object simplification | Replace PM/backlog scaffold with simple task list / board toggle |
| Automations | Product-phase / empty-state decision required | P1 | Should likely be deferred or collapsed, not fully built now | Choose hide lane vs one dry-run coming-soon card |
| Activity | B6 retest classify required | P0 until proven otherwise | Not ready for new implementation until retest classifies overlap | `CLOSED_BY_FIX_BATCH_001`, `PARTIAL_REPAIR_NEEDS_ACTIVITY_BATCH`, or `STILL_P0_BLOCKER` |
| Integrations | IA decision required before implementation | P0/P1 | Blocked pending Connect Gmail ownership decision | Owner decision: Accounts primary, Integrations primary, or split |

## Cross-cutting findings applied

| Global finding | Applied classification |
| --- | --- |
| G-P0-004 repeated status noise | Already addressed in Mail/Account patterns; remaining pages should adopt one status line and Advanced details. |
| G-P0-005 fixture narratives as product | Home, Calendar, Tasks, Automations remain affected; owner mode must hide fixture narratives unless explicitly scaffold mode. |
| G-P1-005 inspector template repetition | All remaining lanes should collapse inspector by default or make it lane-specific. |
| G-P1-101 four-column permanent layout | Calendar, Tasks, Automations, Activity need owner-simple center-first layouts. |
| G-P1-102 duplicate Ask Ibal | Ibal/header/inspector duplication should be reduced to one primary owner path. |
| G-P1-104 Integrations catalog-first | Integrations must become connect-first or be demoted behind Accounts. |
| G-P1-106 Activity filter stack | Activity owner mode should start with search + one filter, not all dimensions. |
| G-P1-203 blocked buttons as primary row | Calendar, Account, and Integrations should demote blocked/provider-write affordances from primary copy. |
| G-P1-204 CLI commands in UI | Fixed for Account owner mode; continue enforcing across Settings/Integrations. |

## Workspace classifications

### Home — classify as FIX-BATCH-003 candidate

Status: **ready to scope, held only by Mail/Account retest regression check**.

Why: Home is the first-run owner surface and currently shows mixed snapshot/product metrics plus fixture attention. That creates the same trust problem as Mail before FIX-BATCH-001, but at the app entry point.

Owner-mode direction:

- Replace fixture attention with a neutral connection/status summary unless real connected local index data exists.
- Collapse or remove Home inspector by default.
- Use one status line, not repeated preview/account/snapshot banners.
- Keep advanced build explanation behind Advanced.
- Keep quick links only if they route to owner actions, not scaffold stories.

Proposed decision token after implementation, not now:

```text
UI_PEER_REVIEW_FIX_BATCH_003_PASS_READY_FOR_OWNER_HOME_REVIEW
```

### Ibal drawer — classify as AI surface dedupe batch

Status: **classification complete, implementation queued**.

Why: Ibal has a real product role, but the current drawer is output-heavy. It duplicates proposal cards and surfaces scaffold mail context. This creates a false sense of agency because the user sees AI objects before clear input and control.

Owner-mode direction:

- Keep one prompt/input path.
- Keep one visible response/proposal area.
- Remove duplicate selected proposal card unless the user explicitly selects a proposal.
- Rewrite mail context in owner language.
- Remove redundant Ask Ibal buttons where the drawer is already open.

### Calendar — classify as owner month-first cleanup

Status: **classification complete, implementation queued**.

Why: Calendar has a clear page purpose, but owner view is overloaded by month grid, week strip, daily detail, proposal editor, provider gate, and fixture account references.

Owner-mode direction:

- Month view first.
- Day/event detail on selection.
- Proposals and conflict preview in Advanced.
- Remove fixture account text from primary UI.
- Collapse provider-write warning into one setup/status card.

### Tasks — classify as personal-task owner mode

Status: **classification complete, implementation queued**.

Why: Tasks reads like product-management scaffolding, not personal task completion. Epics, stories, bugs, acceptance criteria, and evidence artifacts are valid for agents but too heavy for owner mode.

Owner-mode direction:

- Simple task list as default.
- Optional board toggle.
- Hide epics, acceptance criteria, evidence, and bug tracker unless scaffold mode or Advanced is enabled.
- Suppress fixture seeds in owner mode.

### Automations — classify as phase-gated surface

Status: **classification complete, product-phase decision needed before major implementation**.

Why: Automations currently presents an empty center surrounded by templates, library content, provider gate copy, and dry-run scaffolding. A full implementation now would likely add noise before the product has enough live events.

Owner-mode direction options:

1. Hide Automations from owner primary nav until product phase.
2. Keep lane visible as one calm dry-run / coming-soon card.
3. Keep templates in Advanced only.

Recommended classification: **defer implementation unless owner explicitly wants the lane visible now**.

### Activity — classify as retest-required P0

Status: **open until visual retest**.

Why: Activity had a P0 table overlap finding. FIX-BATCH-001 included shared activity table overflow hardening, so the original P0 may already be fixed. Without `:4488` proof, it must remain open but not assumed broken.

Required outcome token:

```text
CLOSED_BY_FIX_BATCH_001
PARTIAL_REPAIR_NEEDS_ACTIVITY_BATCH
STILL_P0_BLOCKER
```

Owner-mode direction if not closed:

- Fix table truncation/wrapping first.
- Reduce filter stack to search + one primary filter.
- Move export packet and receipt class details to Advanced.
- Collapse unrelated inspector content.

### Integrations — classify as IA-blocked

Status: **blocked pending Connect Gmail ownership decision**.

Why: Integrations is supposed to connect providers, but after FIX-BATCH-002, Account drawer and Settings → Accounts also own connect/sync trust. Implementing Integrations before choosing ownership risks duplicate CTAs and conflicting mental models.

Decision options:

| Option | Meaning |
| --- | --- |
| Accounts primary | Account drawer + Settings own Connect Gmail; Integrations becomes provider catalog / Advanced. |
| Integrations primary | Integrations owns Connect Gmail hero; Account drawer shows session status only. |
| Split | Both link to the same connect path with identical copy; highest duplication risk. |

Recommended classification: **PENDING_OWNER**, no implementation until this IA decision is recorded.

## Proposed implementation queue after classification

This is a sequencing recommendation, not a gate change.

| Batch | Scope | Reason | Blocked by |
| --- | --- | --- | --- |
| FIX-BATCH-003 | Home owner-mode cleanup | First-run trust surface, high owner impact | Mail/Account retest regressions only |
| FIX-BATCH-004 | Ibal drawer dedupe or Calendar owner-mode | Depends whether owner wants AI drawer or schedule next | Owner preference / severity |
| FIX-BATCH-005 | Tasks personal-task owner mode | Removes PM scaffold from owner workflow | Prior batch |
| FIX-BATCH-006 | Automations phase gate | Either hide or one dry-run card | Product phase decision |
| FIX-BATCH-007 | Activity owner history | Only if B6 retest is not closed | Activity B6 outcome |
| FIX-BATCH-008 | Integrations connect-first | Only after IA decision | Integrations IA decision |

## Stop lines unchanged

- Do not claim UI-003E PASS.
- Do not mark PR #12 ready.
- Do not start MERGE-PREP-001.
- Do not promote framework exports.
- Do not implement provider send, draft write, delete, label/archive mutation, or live provider execution.

## Decision value

```text
UI_PEER_REVIEW_REMAINING_WORKSPACES_CLASSIFIED_2026_06_18
```
