# ACC-SYNC-UI-001 Peer Review — Account Factory + Sync Empty-State

## Date

2026-06-15

## Branch / remote truth

```text
Repo: Vado42-chris/xi-io-Inbox
Branch: ui-002/framework-derived-static-preview
PR: #12 (draft, unmerged)
Review commit: (pending)
```

## Reviewer role

Cursor implementation peer review (owner checkpoint). **Not** live OAuth proof.

## Validation run (this pass)

| Check | Result |
| --- | --- |
| `npm run check` | **pass** (incl. acc-sync-ui-001, acc-001, route-smoke) |
| Stash integration | Landed from `ACC-SYNC-UI-001` stash with fixes (no fake email, fixture preserved) |
| UI-003E claims | **unchanged** — not marked pass |

## Findings verification

| ID | Finding | Status |
| --- | --- | --- |
| ACC1-001 | Sync status import must materialize mail account row | **fixed** — `applySyncStatusToAccounts()` |
| ACC1-002 | No fake fallback email when status lacks email | **fixed** — returns false, no row |
| ACC1-003 | Duplicate sync overlay in factory + enrich | **fixed** — single factory path |
| ACC1-004 | Silent placeholder injection when empty | **fixed** — removed; fixture stays in JSON for threads |
| ACC1-005 | clear sync status must update preview state | **fixed** — immutable map on `previewAccounts` |
| ACC1-006 | Demo vs operator accounts in nav | **fixed** — `operatorMailAccounts()` / `demoFixtureMailAccounts()` |

## Residual notes (non-blocking)

| ID | Severity | Finding |
| --- | --- | --- |
| ACC1-R01 | Info | `personal-gmail-preview` fixture id retained for thread evidence (`acc-001` check) — migrate in future slice if desired. |
| ACC1-R02 | Info | Live sync-status import in browser not exercised in CI — operator-deferred. |

## Decision

```text
ACC_SYNC_UI_001_PEER_REVIEW_PASS_STRUCTURAL
```

## Combined gate

```text
PR_12_REMAINS_DRAFT
UI_003E_OWNER_PROOF_NEXT_HUMAN_GATE
```

## Decision value

`ACC_SYNC_UI_001_PEER_REVIEW_PASS`
