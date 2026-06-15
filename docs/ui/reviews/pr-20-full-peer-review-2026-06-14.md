# PR #20 Full Peer Review

## Date

2026-06-14

## Reviewer

Local Cursor agent (independent verification of cloud-agent work on `cursor/gmail-harden-5e1b`)

## Scope

Verify PR #20 (`Harden Gmail adapter privacy gates`) against repo claims, owner product
vision, gates, and `npm run check` on the operator workstation path.

## Branch state (critical)

| Ref | HEAD | Contains PR #20 work? |
| --- | --- | --- |
| `origin/ui-002/framework-derived-static-preview` | `bf86b63` | **No** — still NAV-001 `Plan` nav, no GMAIL-HARDEN/NAV-002/UI-013B |
| `origin/cursor/gmail-harden-5e1b` (PR #20) | `f0809b1` | **Yes** — 13 commits ahead of `bf86b63` |
| PR #12 base | `ui-002` | Stale until PR #20 merges into product branch |

**Finding PR-20-001 (critical):** Cloud agents reported completion, but product branch on
GitHub was not updated. All milestone work lives on PR #20 until merged.

## Verification summary

| Area | Verdict | Evidence |
| --- | --- | --- |
| GMAIL-HARDEN-001 | **pass with caveat** | Nested schema negatives, stdout payload suppression, browser import gate, hardening tests; token mode test fails on exFAT/NTFS mounts unless skipped |
| NAV-002 primary nav | **pass** | `PRODUCT_LEVEL_NAV` = Home/Mail/Calendar/Tasks/…; route smoke guards Plan absence |
| SCOPE-001 account lens | **partial pass** | Shared scope lens + runtime `accountId` normalization; schema still v11 |
| UI-014B cross-pollination | **pass (behavior)** | Related-suite zones with Source/Why/Limit + handoffs; route smoke covered |
| UI-013B visual system | **owner FAIL** | Agent CSS pass complete; owner (30yr UX) rejected as generic AI slop — not owner-grade |
| UI-013–016 planning docs | **pass** | Persisted in repo on PR branch |
| UI-016C boundary scripts | **pass** | `npm run check:components` tracks duplication debt |
| Componentization | **not done** | Correct per UI-016A; monolith ~11k+ lines JS |
| GitHub management surface | **still missing** | Integrations card only |
| CI vs local check parity | **fail found** | GitHub Actions passed while local `npm run check` failed on token chmod until FS probe fix |

## Findings table

| ID | Severity | Finding | Required action |
| --- | --- | --- | --- |
| PR-20-001 | critical | PR #20 not merged to `ui-002` | Merge PR #20 after this review fixes land |
| PR-20-002 | high | UI-013B marked complete in TODO/sprint but owner rejected visual quality | Add UI-013C owner-grade redesign slice; keep GATE-UI-VISUAL-001 blocked |
| PR-20-003 | high | Walkthrough videos cited as `/opt/cursor/artifacts/*.mp4` — not in repo | Attach artifacts to receipts or store under `docs/ui/reviews/evidence/` |
| PR-20-004 | medium | `STORAGE_SCHEMA_VERSION` remains 11 despite SCOPE-001 accountId work | Document runtime normalization; plan v12 migration when extracting store module |
| PR-20-005 | medium | Mail Drafts/Approvals still share `#/inbox` | NAV-002 fixed top nav only; deep-link debt remains for CONVERGE-001 |
| PR-20-006 | medium | Token `0600` assertion fails on non-POSIX filesystems (operator path on Storage 22) | Skip assertion when chmod unsupported; document in Gmail README |
| PR-20-007 | medium | GATE-GMAIL-001 row still mentions npm audit follow-up while audit slice marked complete | Reconcile gate copy to npm-audit receipt |
| PR-20-008 | low | Seven additional cursor branches exist unmerged (calendar-dual-highlight, ci-workflow, etc.) | Triage or close after PR #20 merge |
| PR-20-009 | low | UI-013 doc acceptance checkboxes marked done while owner visual bar not met | Split "agent implementation" vs "owner visual pass" in acceptance |

## What cloud agents got right

- Branch-truth and AGENTS.md (merged earlier at `bf86b63`)
- Gmail adapter hardening direction (APP-PR-007–011)
- NAV-002 restores Calendar/Tasks/Home as primary destinations (Option B)
- SCOPE-001 shared account lens pattern (correct architecture, no duplicate stores)
- Level 1–5 planning packet persistence (`UI-013A` through `UI-016B`, cross-project standards)
- Route smoke expanded for nav, cross-pollination, scope lens — good anti-silent-failure measure
- Honest UI-016A verdict: not componentized yet

## What remains missing vs product vision

See `docs/ui/reviews/nav-002-discovery-reconciliation-2026-06-13.md` and gap matrix. Still open:

- Owner-grade visual design (UI-013C+)
- GitHub management / dev workflow UI
- Sent/archive/trash mail folders
- Real mail search results list
- Module extraction (`public/src/*`)
- ARCH-004 runtime decisions
- Framework backfeed to `xi-io.net#239` for Level 2–5 standards
- Owner UI-003E PASS

## Plan updates required (applied in this review pass)

1. TODO — distinguish UI-013B agent pass vs owner visual FAIL; add UI-013C slice
2. `04-build-readiness-gates.md` — GATE-UI-VISUAL references UI-013 owner bar
3. `branch-truth.md` — PR #20 merge status and validation note for non-POSIX mounts
4. `gmail-harden-001` receipt — filesystem caveat for token mode test
5. `ui-013-level-2-visual-experience-system.md` — owner preliminary FAIL recorded

## Recommended merge order

```text
1. Land PR #20 peer-review fixes (this commit) on cursor/gmail-harden-5e1b
2. Merge PR #20 → ui-002/framework-derived-static-preview
3. Rebase/update PR #12 body against merged ui-002
4. UI-013C owner-grade visual redesign (before UI-003E)
5. Module skeleton (CONVERGE-001) after owner ratifies visual direction
6. Framework backfeed packet to xi-io.net
```

## Remaining pass estimate (honest)

| Work | Passes |
| --- | --- |
| Merge PR #20 + reconcile PR #12 | 1 |
| UI-013C owner-grade visual redesign | 2–3 |
| UI-003E owner proof support + decision | 1 (human) |
| CONVERGE-001 module skeleton | 1–2 |
| First strangler extraction | 1–2 |
| GitHub-001 ingress surface | 1–2 |
| Framework xi-io.net backfeed | 1 |
| ARCH-004 decision packet | 1 (owner) |

**Total after merge:** ~8–12 agent passes + owner UI-003E + ARCH-004 owner decision.

## Decision value

```text
PR_20_PEER_REVIEW_PASS_WITH_MERGE_REQUIRED_OWNER_VISUAL_FAIL_UI_013C_NEXT
```
