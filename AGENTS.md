# AGENTS.md

## Branch truth (read first)

```text
main = planning docs + JSON schemas only (not the product).
ui-002/framework-derived-static-preview = active static preview product line (PR #12).
```

Verify branch before auditing. See `docs/operations/branch-truth.md`.

## Product invariants

- Privacy-first operations center: ingress → draft → controlled egress → receipts.
- AI proposes; does not send/delete/mutate providers by default.
- No secrets, tokens, credentials, or real private bodies in git.

## Required reading (UI/product)

1. `docs/operations/branch-truth.md`
2. `docs/ui/reviews/app-peer-review-plan-alignment-2026-06-13.md`
3. `docs/ui/ui-north-star-and-convergence-plan.md`
4. `docs/operations/multi-agent-orchestration.md`
5. `TODO.md` · `docs/product/03-sprint-slice-plan.md`

North-star supersedes conflicting UI-003 lane-first docs when they disagree.

## Validation

| Command | When |
| --- | --- |
| `npm run setup:gmail` | First run / clean worktree (required before full check) |
| `npm run check:quick` | After each 1–3 file edit batch |
| `npm run check:route` | Browser smoke (in full check) |
| `npm run check` | Before slice close / merge prep |
| `git diff --check` | Before commit |
| `npm run dev` | Owner visual proof → http://localhost:4488 |

Schema metaschema (when `schemas/` change):
`python3 -m check_jsonschema --check-metaschema schemas/*.json`

## Anti-stall (external storage)

- One heavy file per edit pass (`inbox-preview.js`, `inbox-preview.css`).
- On tool timeout: `git status` before retry.
- Do not grow the monolith; strangler migrate to `public/src/*` per north-star.

## Module ownership (parallel agents)

```text
public/src/design/        tokens + components (target)
public/src/shell/         frame, single nav, router
public/src/workbench/     Mail → Drafts → Approvals → Sent
public/src/capabilities/  calendar, tasks, automations, extensions, settings
public/src/ibal/          concierge only — not a nav lane
tools/gmail/, schemas/    adapter + contracts
docs/                     receipts, gates, compliance
```

## Current gate

- UI-012B–F + MAIL-001 + route smoke: **code pass** (owner UI-003E pending).
- Next: Gmail hardening (APP-PR-007–011), then owner UI-003E, then convergence skeleton.
- Merge prep: `docs/ui/reviews/ui-012-merge-prep-receipt.md` after owner PASS.

## Cursor Cloud

Preinstall: `npm ci --prefix tools/gmail` then `npm run check` from **ui-002** branch.
