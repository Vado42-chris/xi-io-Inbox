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

## Current gate (2026-06-15 @ `f164f5f`)

```text
Remote HEAD: ui-002/framework-derived-static-preview @ f164f5f
PR #12: draft, unmerged
CI: Static Preview Check pass
```

| Slice | Status |
| --- | --- |
| GMAIL-002A-EXT-004-REPAIR + CATCHUP-002 | complete |
| FRAMEWORK-BACKFEED-001 → xi-io.net#239 | complete |
| ACC-SYNC-UI-001 | complete |
| UI-003E-PREP + MERGE-PREP runbook staged | complete |
| **UI-003E owner visual proof** | **human gate — NOT passed** |
| MERGE-PREP-001 execution | blocked until owner PASS |

Owner session: `docs/ui/reviews/ui-003e-owner-session-runbook.md`
Post-PASS agent runbook: `docs/operations/merge-prep-001-post-ui-003e-agent-runbook.md`

## UI-003E chain of custody (critical)

**Agents must not** edit `docs/ui/reviews/ui-003e-owner-visual-proof-packet.md` classification to PASS or check owner checklist items.

Only the owner may record PASS after a real localhost:4488 review, using the exact string `UI_003E_PASS_OWNER_VISUAL_PROOF_COMPLETE`.

`npm run check:ui003e-packet` enforces this in CI. If local edits revert the packet, run `git checkout -- docs/ui/reviews/ui-003e-owner-visual-proof-packet.md` from branch HEAD.

## Cursor Cloud

Preinstall: `npm ci --prefix tools/gmail` then `npm run check` from **ui-002** branch.
