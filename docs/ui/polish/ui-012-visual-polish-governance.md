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
| **UI-012A** | docs | Ibal/Rabbit visual parity brief + audit — **complete** (`ui-012a-ibal-rabbit-visual-parity-brief.md`) |
| **UI-012B** | code | Visual token + component alignment (shell buttons, chips, pills, nav) |
| **UI-012C** | code | Layout + composition polish (lane rhythms, mail-first) — **complete** |
| **NAV-001** | code + docs | App shell / navigation correction (level-1 header nav, contextual left rail) — **complete**; peer-review inserted before UI-012D |
| **UI-012D** | code | Interaction + state polish (hover/selected/empty/Ibal proposals) — **paused** until GMAIL-002A or explicit owner choice |
| **UI-012E** | code | Accessibility + contrast + focus polish |
| **UI-012F** | docs | Final visual readiness gate receipt; owner re-review readiness |

Exact boundaries follow the canonical brief — **update, do not duplicate** `00-xi-io-visual-product-standard.md`.

## Best-practice evaluation (UI-012C–F receipts)

Each polish receipt must answer:

- Does this preserve UI-011A–I capability repairs?
- Does this make the product easier to understand, or only prettier?
- Does Mail remain the primary mental model?
- Does Ibal support the workspace without taking over it?
- Are selected, blocked, preview-only, metadata-only, and provider-gated states visually distinct?
- Are disabled actions explained in visible text?
- Are we relying on color alone?
- Are scroll regions predictable?
- Are screenshots/artifacts stored outside the repo?
- Did we avoid schema/localStorage/fixture changes?
- Did we avoid provider/runtime behavior changes?
- Did we avoid duplicating prior polish pass work?
- Is all evidence persisted in repo docs, TODO, receipt, and PR body?

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
- `docs/ui/polish/ui-012a-ibal-rabbit-visual-parity-brief.md`
- `docs/ui/polish/ui-012a-rabbit-mod-visual-parity-brief.md` (redirect)

## Decision value

```text
UI_012_VISUAL_POLISH_GOVERNANCE_LOCKED
```
