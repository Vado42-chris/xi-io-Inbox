# UI-PEER-REVIEW — Program continuation (2026-06-18)

## Phase

**Review/classification active across the full nav.** Implementation batches land workspace-by-workspace; review does not stop when a batch is gated on owner retest.

## Review is not implementation

```text
Classification may continue across all peer-review workspaces even while implementation batches are held.
Do not interpret "hold FIX-BATCH-003" as "stop reviewing remaining pages."
```

| Mode | Meaning |
| --- | --- |
| **Review / classification** | Read workspace files, triage P0/P1, record fix direction, IA decisions — continues now |
| **Implementation batch** | Code change under `OWNER_*_UX` / owner-mode pattern — next batch **Home** unless Mail/Account retest finds regressions |
| **Owner retest** | Required before claiming the *next* implementation batch is owner-ready — does **not** pause review of other pages |

## Remote truth (PR #12)

| Field | Value |
| --- | --- |
| Remote HEAD | `384f18b` |
| FIX-BATCH-002 implementation | `bfc9caf` |
| Receipt SHA fix | `384f18b` |
| CI @384f18b | green (Static Preview + Tauri Runtime) |
| Decision (Account) | `UI_PEER_REVIEW_FIX_BATCH_002_PASS_READY_FOR_OWNER_ACCOUNT_REVIEW` |

## Recommended ordering

1. **Owner retest** — Mail + Account at `:4488` (landed fixes need confirmation).
2. **Continue peer-review classification** — all remaining pages; no UI-003E claims.
3. **Next implementation batch** — **FIX-BATCH-003 Home** unless Mail/Account retest fails.
4. **Activity P0 recheck** — table overlap may already be fixed by FIX-BATCH-001 B6 (shared ledger overflow); classify at retest, do not assume open or closed without proof.
5. **IA decision** — Integrations vs Settings → Accounts for primary **Connect Gmail** path (overlap after FIX-BATCH-002).

## Workspace classification matrix

| Workspace | Review doc | Impl batch | Owner retest | Top P0 / P1 | Fix direction (owner mode) |
| --- | --- | --- | --- | --- | --- |
| Mail | `UI-PEER-REVIEW-002-mail.md` | FIX-BATCH-001 landed | **Pending** `:4488` | Findings marked fixed in doc | Confirm message-first pane, setup guide, inspector collapse |
| Account drawer | `UI-PEER-REVIEW-009-account-drawer.md` | FIX-BATCH-002 landed | **Pending** `:4488` | Original P0/P1 fixed in impl | Confirm connect/sync/add, Advanced demotion, receipt dedupe |
| Home | `UI-PEER-REVIEW-001-home.md` | **Next impl** (003) | After 003 | P0 fixture attention + stat card mix | Single status line; collapsed Home inspector; hide fixture attention until connected data |
| Calendar | `UI-PEER-REVIEW-003-calendar.md` | Queued | — | P0 fixture account in proposal UI | Month view first; proposals in Advanced; collapsed inspector; token alignment |
| Tasks | `UI-PEER-REVIEW-004-tasks.md` | Queued | — | P0 fixture epics/stories | Simple task list + optional board; hide epics/evidence; suppress fixture seeds |
| Automations | `UI-PEER-REVIEW-005-automations.md` | Queued | — | P1 empty center + catalogs | Hide lane until product phase **or** one calm coming-soon / dry-run card |
| Activity | `UI-PEER-REVIEW-006-activity.md` | **Retest classify** | — | P0 table overlap (**may be fixed**) | Verify B6 at `:4488`; single search/filter; export in Advanced; collapse inspector |
| Integrations | `UI-PEER-REVIEW-007-integrations.md` | Queued + **IA** | — | P0 catalog-first vs connect goal | Connect Gmail hero; short provider list; catalog in Advanced; resolve Accounts overlap |
| Ibal drawer | `UI-PEER-REVIEW-008-ibal-drawer.md` | Queued | — | P1 duplicate proposals / AI-heavy | Dedupe proposal display; owner mail context copy; one Ask Ibal surface |

## Activity P0 — retest classification (not a stop)

Captured review (`UI-PEER-REVIEW-006`) lists **table text overlap** as P0. FIX-BATCH-001 included shared **activity table overflow** hardening (`public/inbox-preview.css` · global finding B6 / G-P0-002).

**Receipt slot:** `UI-PEER-REVIEW-ACTIVITY-B6-RETEST-CLASSIFY.md`

| Outcome token | Meaning |
| --- | --- |
| `CLOSED_BY_FIX_BATCH_001` | Overlap fixed by B6; downgrade Activity P0 |
| `PARTIAL_REPAIR_NEEDS_ACTIVITY_BATCH` | Improved but Activity lane still needs owner batch |
| `STILL_P0_BLOCKER` | Overlap unchanged; route to Activity/shared component batch |

Default state: **open — unverified** until `:4488` proof on Activity lane. Record outcome in `UI-PEER-REVIEW-006-activity.md` findings log only after visual proof.

## IA decision — Connect Gmail surface

**Formal decision item:** `UI-PEER-REVIEW-INTEGRATIONS-IA-DECISION.md`

After FIX-BATCH-002, **Settings → Accounts** and **Integrations** both relate to provider connect. Before FIX-BATCH-Integrations (or a dedicated IA slice):

| Option | Tradeoff |
| --- | --- |
| **Accounts primary** | Connect/sync live in Account drawer + Settings; Integrations = catalog Advanced |
| **Integrations primary** | Hero connect on Integrations; Account drawer = session status only |
| **Split** | Connect action in both with identical copy and one backend path — risk duplicate CTAs |

Decision owner: product/owner session. Agents may document options; do not wire duplicate connect flows without explicit choice.

## Implementation queue (after retest signal)

| Batch | Scope | Blocked by |
| --- | --- | --- |
| FIX-BATCH-003 | Home owner-mode | Mail/Account retest regressions only |
| FIX-BATCH-004+ | Calendar, Tasks, Automations, Activity, Integrations, Ibal | Prior batch + classification updates |

Review docs for Calendar → Tasks → Automations → Activity → Integrations → Ibal may be updated in **classification mode** while FIX-BATCH-003 is queued.

## Stop lines (unchanged)

- UI-003E PASS — **not passed** (owner runbook only)
- PR #12 — **draft**, not ready for review
- MERGE-PREP-001 — blocked
- Framework export promotion — blocked
- Provider mutation / send / draft write — blocked

## Decision value

```text
UI_PEER_REVIEW_PROGRAM_OPEN_WORKSPACE_REVIEW_ACTIVE
```

Review continues; FIX-BATCH-001/002 await owner retest; FIX-BATCH-003 Home is next implementation unless retest blocks.
