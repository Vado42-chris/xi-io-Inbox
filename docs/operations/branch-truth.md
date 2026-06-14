# Branch Truth for Agents

## Purpose

Prevent cloud, Cursor, and local Zed agents from auditing or editing the wrong branch.

## Current branch map

| Branch | Meaning | Use for |
| --- | --- | --- |
| `main` | Bootstrap planning, operation packets, and shared JSON schemas. | Schema validation, docs hygiene, issue cleanup, cross-branch instructions. |
| `ui-002/framework-derived-static-preview` | Active static preview product line. | UI/product work, static preview, local Gmail adapter, route smoke, CI, receipts, owner proof. |

Rule:

```text
main is not the product snapshot.
ui-002/framework-derived-static-preview is the product snapshot.
```

Any finding made from `main` must be labeled as a `main` finding unless the agent explicitly
checked out `ui-002/framework-derived-static-preview`.

## Cloud-agent PR reconciliation

| PR | Base | Treatment |
| --- | --- | --- |
| PR #15 | `main` | Do not merge as the sole repo truth unless it prominently states that `main` is docs/schemas only and product work lives on `ui-002`. |
| PR #16 | `main` | Treat as a `main` freshness audit. Re-check all product claims against `ui-002` before preserving them. |
| PR #17 | `ui-002/framework-derived-static-preview` | Closed — superseded by PR #19, merged at `bf86b63`. |
| PR #19 | `ui-002/framework-derived-static-preview` | Merged — branch-truth, north-star, orchestration, app peer review. |
| PR #20 | `ui-002/framework-derived-static-preview` | **Open — product work lands here until merged.** Contains GMAIL-HARDEN-001, NAV-002, SCOPE-001, UI-013B/014B, Level 2–5 planning docs. See `docs/ui/reviews/pr-20-full-peer-review-2026-06-14.md`. |

## Current product-branch decision state

The branch carries a feature-rich static preview and Gmail adapter, but peer review on
2026-06-13 found the product still blocked by:

- monolithic `public/inbox-preview.js` and `public/inbox-preview.css`,
- mixed navigation models and non-deep-linkable Mail/Drafts/Approvals subviews,
- stale plan surfaces from UI-003/UI-004/UI-005/UI-012,
- Gmail adapter privacy hardening work that should precede broader provider proof,
- missing owner UI-003E visual proof.

The current convergence direction is recorded in:

```text
docs/ui/ui-north-star-and-convergence-plan.md
docs/operations/multi-agent-orchestration.md
docs/ui/reviews/app-peer-review-plan-alignment-2026-06-13.md
```

## Required validation by branch

### `main`

- `python3 -m check_jsonschema --check-metaschema schemas/*.json`
- `git diff --check`

### `ui-002/framework-derived-static-preview`

- `npm run check`
- `git diff --check`
- `npm run dev` plus browser evidence for visible UI changes.

Note: if the repo lives on a non-POSIX filesystem (exFAT/NTFS external drive), Gmail token
`0600` mode assertions may be skipped in `tools/gmail/test/hardening.mjs`. Run full checks on
ext4/Linux CI or move the clone to a POSIX volume for strict token-mode proof.

## Decision value

`MAIN_IS_DOCS_AND_SCHEMAS_UI_002_IS_PRODUCT_AGENTS_MUST_CHECKOUT_THE_RIGHT_BRANCH`

