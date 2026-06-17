# Branch Truth for Agents

## Purpose

Prevent cloud, Cursor, and local agents from auditing or editing the wrong branch or stale gate state.

## Current branch map

| Branch | Meaning | Use for |
| --- | --- | --- |
| `main` | Bootstrap planning, operation packets, and shared JSON schemas. | Schema validation, docs hygiene, issue cleanup, cross-branch instructions. |
| `ui-002/framework-derived-static-preview` | Active product line (static preview + Tauri runtime spine). | UI/product work, Gmail adapter, Tauri runtime, route smoke, CI, receipts, owner proof. |

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
| PR #12 | `ui-002/framework-derived-static-preview` | **Active product PR (draft).** Runtime spine + static preview. Do not mark ready-for-review without owner direction. |
| PR #15 | `main` | Do not merge as the sole repo truth unless it states that `main` is docs/schemas only. |
| PR #16 | `main` | Treat as a `main` freshness audit. Re-check product claims against `ui-002`. |
| PR #17 | `ui-002/framework-derived-static-preview` | Closed — superseded by PR #19, merged at `bf86b63`. |
| PR #19 | `ui-002/framework-derived-static-preview` | Merged — branch-truth, north-star, orchestration, app peer review. |
| PR #20 | `ui-002/framework-derived-static-preview` | Open — see `docs/ui/reviews/pr-20-full-peer-review-2026-06-14.md`. |

## Current remote truth

```text
Branch: ui-002/framework-derived-static-preview
HEAD:   run `git rev-parse HEAD` after fetch
PR:     #12 (open, draft, unmerged)
CI:     Static Preview Check (npm run check) + Tauri Runtime Check (cargo test + gate)
Owner:  docs/operations/owner-gate-chart.md
```

### Active gate (agent work order)

| Step | Status |
| --- | --- |
| RUNTIME-002A → RUNTIME-002C + peer reviews | complete |
| GOV-REFRESH-001 | complete |
| TAURI-CI-001 | complete |
| **UI-003E owner visual proof** (`:4488`) | **NOT passed — owner eyes required** |
| MERGE-PREP-001 | blocked until UI-003E PASS |

Authoritative slice ledger: `TODO.md` · `docs/product/03-sprint-slice-plan.md` · `AGENTS.md`.

### Completed on branch (recent)

- ARCH-004 formal PASS — Tauri local desktop runtime primary
- RUNTIME-001 / 001B — Gmail provider spine + live connect/sync commands
- RUNTIME-002A — read-only mail index bridge + capability ACL
- RUNTIME-002A-PEER-REVIEW — PASS
- RUNTIME-002B — connect/sync UI orchestration
- ACC-SYNC-UI-001, FRAMEWORK-BACKFEED-001, UI-003E-PREP (runbook + packet guard)

### Still true (peer review 2026-06-13)

- Monolithic `public/inbox-preview.js` and `public/inbox-preview.css` remain the main UI surface.
- Design tokens/components under `public/src/design/` are target architecture, not yet source of truth.
- Owner UI-003E scaffold visual proof is separate from Tauri runtime live-mail operator proof (002C).

Convergence direction:

```text
docs/ui/ui-north-star-and-convergence-plan.md
docs/operations/multi-agent-orchestration.md
docs/ui/reviews/app-peer-review-plan-alignment-2026-06-13.md
docs/architecture/runtime-store-boundary-v1.md
```

## Preflight before continuing work

Run on a clean tree before slice work, peer review, or merge prep:

```bash
git fetch origin
git status --short
git rev-parse HEAD
git rev-parse origin/ui-002/framework-derived-static-preview
```

Expect `HEAD` == `origin/ui-002/framework-derived-static-preview` == current SHA in this file and `AGENTS.md`.

If unrelated WIP is present (demo-removal, UX experiments), **stash it** before runtime peer review or slice-close validation. Do not pop unrelated stashes during RUNTIME slices.

```bash
npm run setup:gmail          # if tools/gmail/node_modules missing
npm run check                # full static + adapter + route smoke
cargo test --manifest-path src-tauri/Cargo.toml   # if touching Tauri/runtime
cargo build --manifest-path src-tauri/Cargo.toml  # before runtime slice close
git diff --check
```

Host modes:

| Proof type | Command |
| --- | --- |
| Scaffold / UI-003E | `npm run dev` → http://localhost:4488 |
| Runtime connect/sync/index | `npm run tauri:dev` |

Record which mode a receipt used. Do not treat scaffold proof as live-mail proof.

## Required validation by branch

### `main`

- `python3 -m check_jsonschema --check-metaschema schemas/*.json`
- `git diff --check`

### `ui-002/framework-derived-static-preview`

- `npm run check`
- `git diff --check`
- `npm run dev` for visible scaffold UI changes
- `npm run tauri:dev` for runtime orchestration changes (operator OAuth still human)

Note: if the repo lives on a non-POSIX filesystem (exFAT/NTFS external drive), Gmail token
`0600` mode assertions may be skipped in `tools/gmail/test/hardening.mjs`. Run full checks on
ext4/Linux CI or move the clone to a POSIX volume for strict token-mode proof.

## Decision value

`MAIN_IS_DOCS_AND_SCHEMAS_UI_002_IS_PRODUCT_AGENTS_MUST_CHECKOUT_THE_RIGHT_BRANCH`
