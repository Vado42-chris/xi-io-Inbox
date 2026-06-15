# UI-016C Component Boundary Checks Receipt

## Date

2026-06-14

## Branch

`cursor/gmail-harden-5e1b`

## Scope

Implement the first automated component-boundary guardrail before visual redesign,
cross-pollination implementation, scope lens work, or component extraction.

## Implemented

- Added `scripts/ui-016c-boundary-check.mjs`.
- Added `npm run check:components`.
- Wired component boundary checks into `npm run check:quick` and `npm run check`.
- The script verifies:
  - primary nav contract and no top-level `Plan`, `Drafts`, or `Approvals`,
  - active workspace mappings for Home/Mail/Calendar/Tasks/Activity/Integrations,
  - documented receipt-renderer duplication baseline,
  - documented provider-banner duplication baseline,
  - documented detail-grid duplication baseline,
  - documented context-nav renderer baseline,
  - blocked-action grammar anchors,
  - scope-lens/accountId work remains tracked,
  - UI-016/UI-016B ownership and boundary-check docs mention the relevant contracts.

## Tracked debt baseline

```text
5 receipt renderers
2 provider banners
3 detail grid classes
```

This pass does not collapse those duplicates. It prevents new undocumented duplication before
the extraction slices.

## Not implemented

- No visible UI redesign.
- No component extraction.
- No scope lens implementation.
- No cross-pollination implementation.

## Self peer review

| Question | Answer |
| --- | --- |
| Best path? | Yes. Guardrails before visual/code work reduce the chance of repeating one-off UI patterns. |
| Correct fix vs different approach? | Correct for milestone one: baseline-aware checks now, extraction later. |
| Truncation? | No. The check covers route/nav, duplicated renderers, detail grids, blocked action anchors, scope tracking, and ownership docs. |
| Hallucination? | No. Known duplicate debt is still reported, not called fixed. |
| Duplicated work? | Prevents new undocumented duplicate receipt/detail/provider/context patterns. |
| Silent failure? | Boundary drift now fails `npm run check:components`, `check:quick`, and full `check`. |

## Validation

```text
npm run check:components
npm run check:quick
npm run check
git diff --check
```

## Decision value

`UI_016C_BOUNDARY_CHECKS_INSTALLED_KNOWN_DUPLICATION_TRACKED`

