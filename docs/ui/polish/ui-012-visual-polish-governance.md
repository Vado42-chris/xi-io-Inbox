# UI-012 Visual Polish Governance

## Purpose

Lock sequencing and scope for **professional visual polish** (styling, icons, density, motion) relative to **UI-011 capability repairs**. Prevents another premature owner visual pass.

## Decision (2026-06-11)

```text
Document visual targets now.
Implement visual polish after UI-011C–I.
Re-run owner UI-003E only after capability + bounded UI-012 polish.
```

| Question | Answer |
| --- | --- |
| Pause UI-011C–I for full visual polish now? | **No** |
| Document Rabbit_mod / design targets now? | **Yes** |
| When to implement CSS/icons/density in Inbox? | **After UI-011I** (UI-012B+) |
| When owner visual proof? | **After UI-011I + UI-012** |

## Rationale

1. Owner failures were **product architecture + capability**, not styling alone (`UI_003E_FAIL_PRODUCT_UX_NOT_USER_FACING`).
2. UI-011A matrix: **58 partial / 28 missing** — polish without capability repeats UI-009/010 over-state.
3. Reference product [`xi-io-Rabbit_mod`](https://github.com/Vado42-chris/xi-io-Rabbit_mod) has stronger visual/system structure; differences must be **captured as a brief**, not copied blindly into Inbox mid-spine.
4. Tier 1 static preview constraints unchanged: no provider connect in browser, no send, no secrets in repo.

## Reference repo

| Repo | Role |
| --- | --- |
| `Vado42-chris/xi-io-Inbox` | Product capability spine (UI-011), static preview |
| `Vado42-chris/xi-io-Rabbit_mod` | Visual/system reference for parity brief (UI-012A) |
| `xi-io.net` | Framework export target (`#239`); candidates only until package path exists |

Rabbit_mod structure (for auditors): `public/style.css`, `public/pages/`, `public/device/`, `router.js` — systematic layout vs Inbox monolithic `inbox-preview.*`.

## UI-012 slice model

| Slice | Type | Scope |
| --- | --- | --- |
| **UI-012A** | docs | Rabbit_mod visual parity brief; icon/token checklist; **no product code** |
| **UI-012B** | code | Global tokens, typography, spacing, focus (shell) |
| **UI-012C** | code | Mail list/reading density + icons |
| **UI-012D** | code | Calendar, Tasks, Automations visual pass |
| **UI-012E** | code | Extensions, Activity, Settings visual pass |
| **UI-012F** | docs | Visual QA receipt; owner re-review readiness |

Exact B–F boundaries may shrink if UI-012A finds overlap with existing UI-004 polish plans — **update, do not duplicate** `00-xi-io-visual-product-standard.md`.

## Parallel work (allowed)

While Inbox agent runs **UI-011C–I**, external reviewers (e.g. ChatGPT) may fill UI-012A sections in:

`docs/ui/polish/ui-012a-rabbit-mod-visual-parity-brief.md`

Rules for parallel audit:

- Docs and screenshots only in Inbox repo
- No Inbox product code changes in UI-012A
- No claim that Inbox matches Rabbit until UI-012B+ receipts exist
- Rabbit runtime/device behaviors are **out of scope** for Inbox static preview

## Forbidden until UI-012B

- Owner UI-003E PASS claim
- PR #12 ready-for-review on visual polish alone
- Replacing UI-011 capability sequence with a styling sprint
- Copying Rabbit OAuth/runtime/device shell into Inbox preview

## Gates

| Gate | Requirement |
| --- | --- |
| GATE-UI-VISUAL-001 | UI-011I complete + UI-012F receipt + owner checklist |
| GATE-FRAMEWORK-EXPORT-001 | Visual tokens/components added to `16-white-label-framework-feedback-plan.md` after UI-012 proof |

## Related docs

- `docs/product/ui-011a-product-capability-gap-matrix.md`
- `docs/ui/polish/00-xi-io-visual-product-standard.md`
- `docs/ui/polish/16-white-label-framework-feedback-plan.md`
- `docs/ui/polish/ui-012a-rabbit-mod-visual-parity-brief.md`

## Decision value

```text
UI_012_VISUAL_POLISH_GOVERNANCE_LOCKED
```
