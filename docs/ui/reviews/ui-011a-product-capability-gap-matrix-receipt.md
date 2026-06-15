# UI-011A Product Capability Gap Matrix Receipt

## Date

2026-06-10

## Branch

`ui-002/framework-derived-static-preview`

## Commit SHA

`bca8e99` (pre-UI-011A commit; matrix committed in this pass)

## Scope

Docs-only Product Capability Gap Matrix reconciling user product bar vs `public/inbox-preview.*` evidence across Mail, Drafts, Calendar, Tasks, Automations, Extensions, Evidence, Activity, Settings, Ibal.

## Excluded scope

- Product UI code changes
- Owner UI-003E visual proof
- PR #12 merge / ready-for-review
- Gmail body read, draft write, send
- Provider/runtime/platform claims
- ChatGPT connector integration

## Files created

- `docs/product/ui-011a-product-capability-gap-matrix.md`
- `docs/ui/reviews/ui-011a-product-capability-gap-matrix-receipt.md`

## Files updated

- `TODO.md`
- `docs/product/03-sprint-slice-plan.md` (near-term order correction)
- `docs/product/04-build-readiness-gates.md` (GATE-VISUAL-PROOF note)

## Validation

| Check | Result |
| --- | --- |
| `npm run check` | pass |
| `git diff --check` | pass |
| Product UI code changed | **no** |
| `secrets/` tracked | **no** |
| `secrets/` gitignored | **yes** (`.gitignore`) |
| PR #12 draft | **yes** |

## Summary counts

| Status | Count |
| --- | --- |
| implemented | 12 |
| partial | 58 |
| missing | 28 |
| blocked | 2 |
| not planned | 2 |

| Quality (developer-facing scaffold/fixture) | 72 of 102 capabilities not production-like |

## Top 10 product gaps

1. Mail baseline parity (folders, sent, search UX)
2. Tasks work-management layer (epic/story/bug/AC/backlog)
3. Evidence/artifact user workflow
4. Reusable automation action library
5. Visual automation builder (not text form)
6. Extension type taxonomy
7. Calendar day agenda
8. Draft batch approval + templates/history
9. Live Gmail in product (CLI only today)
10. UI-003E scheduled before capability repairs

## Recommended next slice

**UI-011B** — Mail baseline parity repair

## Blockers

- Owner visual proof **blocked** until UI-011B–I
- PR #12 merge **blocked**
- Gmail write/send/body read **blocked**
- Provider runtime **blocked** (ARCH-004)

## Decision value

```text
UI_011A_PASS_REPAIR_SEQUENCE_READY
```
