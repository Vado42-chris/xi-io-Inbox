# GOV-REFRESH-001 — Governance Truth Refresh Receipt

## Date

2026-06-17

## Branch

`ui-002/framework-derived-static-preview`

## Commit SHA

(record at commit)

## Scope

Reconcile stale governance surfaces after RUNTIME-002C peer review and CI fix:

- Preview fixture ARCH-004 copy
- TODO ARCH-004 duplicate open items
- Framework hydration ARCH-004 / runtime envelope rows
- Owner-visible gate chart (plain language)
- TAURI-CI-001 GitHub workflow
- PR #12 body refresh
- branch-truth / AGENTS alignment

## Excluded scope

- UI-003E PASS claim
- PR ready-for-review
- Mail UI polish
- GitHub-001 / IBAL-001 implementation

## Fixture refresh result

**Pass**

- `public/data/inbox-events.preview.json` home metric: ARCH-004 no longer "remains open"
- Priority stack item references UI-003E owner gate instead of vague PR draft note

## TODO ledger result

**Pass**

- RUNTIME spine items marked complete through 002C peer review
- ARCH-004 formal PASS section: superseded duplicate open checkboxes annotated
- Near-term summary points to owner UI-003E

## Hydration checklist result

**Pass**

- `HYDRATE-ARCH004-001` → satisfied with formal PASS receipt
- `HYDRATE-RUNTIME-ENVELOPE-001` → partial with RUNTIME spine evidence (not Pass 4)

## Owner gate chart result

**Pass**

- `docs/operations/owner-gate-chart.md` — plain-language what to open vs what agents prove

## CI result

**Pending push verification**

- Static Preview Check: `npm run check` (no cargo) — green @ `63b0a69`; re-verify on this commit after push
- TAURI-CI-001: `.github/workflows/tauri-runtime-check.yml` added — cargo test + gate with `TAURI_CI=1`

## PR #12 body result

**Pending** — refresh via `gh pr edit` after push

## Validation result

| Check | Result |
| --- | --- |
| `npm run check` | Pass |
| `npm run check:json` | Pass (fixture valid) |

## Decision value

```text
GOV_REFRESH_001_PASS_TRUTH_SURFACES_ALIGNED
```

Governance fixtures, TODO, hydration rows, owner gate chart, and CI split (static vs Tauri) aligned. UI-003E remains the primary owner visual gate.
