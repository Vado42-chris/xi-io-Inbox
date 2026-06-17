# AGENTS.md

## Branch truth (read first)

```text
main = planning docs + JSON schemas only (not the product).
ui-002/framework-derived-static-preview = active product line (PR #12, draft).
```

Verify branch before auditing. See `docs/operations/branch-truth.md`.

## Product invariants

- Privacy-first operations center: ingress → draft → controlled egress → receipts.
- AI proposes; does not send/delete/mutate providers by default.
- No secrets, tokens, credentials, or real private bodies in git.

## Required reading (UI/product)

1. `docs/operations/branch-truth.md`
2. `docs/operations/owner-gate-chart.md` (plain-language gates for owner)
3. `docs/ui/reviews/app-peer-review-plan-alignment-2026-06-13.md`
4. `docs/ui/ui-north-star-and-convergence-plan.md`
5. `docs/operations/multi-agent-orchestration.md`
6. `TODO.md` · `docs/product/03-sprint-slice-plan.md`

North-star supersedes conflicting UI-003 lane-first docs when they disagree.

### Required reading (runtime spine)

When touching Tauri, Gmail runtime, or UI runtime binding:

1. `docs/architecture/runtime-store-boundary-v1.md`
2. Latest RUNTIME receipt for the slice in progress (see `docs/ui/reviews/runtime-*.md`)
3. `docs/ui/reviews/runtime-002a-peer-review-receipt.md` (capability ACL pattern)

### Required reading (UX/polish — reference only)

Do not re-derive polish rules here. Read before any visual or interaction pass:

1. `docs/ui/polish/ui-012-visual-polish-governance.md`
2. `docs/ui/ui-013-level-2-visual-experience-system.md`
3. **`docs/ui/reviews/peer-review/README.md`** — active workspace peer review program (owner screenshots 2026-06-17)

Polish is **blocked** until workspace peer review batches land and owner UI-003E PASS. See **Agent stop line** below.

## Host modes (do not conflate)

| Mode | Command | What it proves |
| --- | --- | --- |
| Static scaffold preview | `npm run dev` → http://localhost:4488 | JSON/fixture UI, CI route smoke, owner UI-003E scaffold review |
| Tauri connected runtime | `npm run tauri:dev` | Live Gmail connect/sync orchestration, runtime mail index, capability ACL |

Static preview is not connected live mail. Tauri runtime is not a substitute for owner UI-003E on `:4488`. Record which mode was used in receipts.

## Validation

| Command | When |
| --- | --- |
| `npm run setup:gmail` | First run / clean worktree (required before full check) |
| `npm run check:quick` | After each 1–3 file edit batch |
| `npm run check:runtime001` | Tauri spine / sidecar allowlist changes |
| `npm run check:runtime002a` | Read-only mail index bridge changes |
| `npm run check:runtime002b` | Connect/sync orchestration changes |
| `npm run check:runtime002c` | Refresh loop + operator proof packaging |
| `npm run check:ollama-peer-review` | Ollama governance harness files |
| `npm run peer-review:ollama -- --slice <id> --dry-run` | Baked peer-review bundle (no API call) |
| `npm run gate:runtime002c -- --write-evidence` | Automated RUNTIME-002C structural gate + evidence |
| `npm run peer-review:ollama -- --slice <id> --write` | Ollama draft peer review receipt |
| `npm run check:route` | Browser smoke (in full check) |
| `npm run check` | Before slice close / CI (static + structural runtime checks, no cargo) |
| `npm run check:full` | Local/agent slice close (includes `gate:runtime002c` + cargo test) |
| `cargo test --manifest-path src-tauri/Cargo.toml` | Tauri Rust changes |
| `git diff --check` | Before commit |
| `npm run dev` | Owner scaffold visual proof → http://localhost:4488 |
| `npm run tauri:dev` | Runtime connect/sync/index proof (operator OAuth still human) |

Schema metaschema (when `schemas/` change):
`python3 -m check_jsonschema --check-metaschema schemas/*.json`

Review committed SHA on a clean tree. Stash unrelated WIP before peer review or slice-close validation.

### Governance peer review (token economics)

Prefer the baked Ollama harness before re-typing peer review prompts in Cursor when a slice profile exists. See `docs/ai/ollama-peer-review-runbook.md` and `.cursor/rules/ollama-peer-review.mdc`. Draft output is not final until checks pass and the canonical `*-peer-review-receipt.md` is written. Product provider Settings shape: `docs/ai/provider-settings-contract.md`.

### Automated structural gates

Run `npm run gate:runtime002c -- --write-evidence` after RUNTIME-002C work — no human checklist. See `docs/operations/automated-gates-runbook.md` and `.cursor/rules/automated-gates.mdc`. Live Google OAuth is the only RUNTIME-002C human step (consent click + gitignored marker file). UI-003E remains owner-only.

## Anti-stall (external storage)

- One heavy file per edit pass (`inbox-preview.js`, `inbox-preview.css`).
- On tool timeout: `git status` before retry.
- Do not grow the monolith; strangler migrate to `public/src/*` per north-star.
- UI changes without a strangler target path should default to the smallest diff; prefer new modules over expanding renderers in the monolith.

## Module ownership (parallel agents)

```text
public/src/design/        tokens + components (target — not yet source of truth)
public/src/shell/         frame, single nav, router
public/src/runtime/       Tauri bridge + runtime-mode helpers
public/src/workbench/     Mail → Drafts → Approvals → Sent (target)
public/src/capabilities/  calendar, tasks, automations, extensions, settings (target)
public/src/ibal/          concierge only — not a nav lane (target)
src-tauri/                Tauri commands, capabilities ACL, runtime store reads
tools/gmail/, schemas/    adapter + contracts
docs/                     receipts, gates, compliance
```

## Agent stop line

From `docs/product/03-sprint-slice-plan.md` — do not override without owner decision:

```text
Do not start broad RUNTIME-002 as one pass.
Do not do Mail UI polish until RUNTIME-002C operator proof.
Do not pop unrelated stashed UX/Gmail edits.
Do not mark PR #12 ready for review or claim UI-003E PASS.
Do not implement GitHub, Ibal, body read, draft write, send, or provider mutation.
```

Capability rule: read-only webview ACL (`allow-gmail-runtime-read`) must stay separate from live connect/sync ACL (`allow-gmail-runtime-sync`). Do not expand read capability with live commands.

## Current gate (see `docs/operations/branch-truth.md` for HEAD SHA)

```text
Remote HEAD: ui-002/framework-derived-static-preview (run git rev-parse HEAD)
PR #12: open, draft, unmerged
CI: Static Preview Check (see GitHub Actions on branch)
```

| Slice | Status |
| --- | --- |
| RUNTIME-002A + RUNTIME-002A-PEER-REVIEW | complete |
| RUNTIME-002B connect/sync UI orchestration | complete (`a0c010f`) |
| **RUNTIME-002B-PEER-REVIEW** | **complete** |
| **RUNTIME-002C** + automated gate + peer review | **complete** |
| Optional live OAuth marker | owner when ready (`secrets/runtime-002c-oauth-consent.complete`) |
| **GOV-REFRESH-001** | complete |
| **TAURI-CI-001** | complete (`.github/workflows/tauri-runtime-check.yml`) |
| **UI-PEER-REVIEW program** | **active** — `docs/ui/reviews/peer-review/` · start Mail (002) |
| **UI-003E owner visual proof** (scaffold `:4488`) | **NOT passed — owner only** |
| MERGE-PREP-001 | blocked until UI-003E PASS |

Decision tokens in flight (see receipts — do not invent new ones):

- `RUNTIME_002B_PEER_REVIEW_PASS_READY_FOR_RUNTIME_002C`
- `RUNTIME_002C_PEER_REVIEW_PASS_READY_FOR_DOWNSTREAM`
- `GOV_REFRESH_001_PASS_TRUTH_SURFACES_ALIGNED`
- `UI_PEER_REVIEW_PROGRAM_OPEN_WORKSPACE_REVIEW_ACTIVE`
- UI-003E: not passed

Owner session (scaffold): `docs/ui/reviews/ui-003e-owner-session-runbook.md`
Post-PASS agent runbook: `docs/operations/merge-prep-001-post-ui-003e-agent-runbook.md`

## UI-003E chain of custody (critical)

**Agents must not** edit `docs/ui/reviews/ui-003e-owner-visual-proof-packet.md` classification to PASS or check owner checklist items.

Only the owner may record PASS after a real localhost:4488 review, using the exact string `UI_003E_PASS_OWNER_VISUAL_PROOF_COMPLETE`.

`npm run check:ui003e-packet` enforces this in CI. If local edits revert the packet, run `git checkout -- docs/ui/reviews/ui-003e-owner-visual-proof-packet.md` from branch HEAD.

Runtime live-mail operator proof (connect/sync end-to-end in Tauri) is a **separate** human gate (RUNTIME-002C). Agents must not claim it during RUNTIME-002B or UI-003E scaffold review.

Historical slice status (UI-012, ACC-SYNC, framework backfeed, etc.) lives in `TODO.md` — do not treat this file as the full project ledger.

## Cursor Cloud

Preinstall: `npm ci --prefix tools/gmail` then `npm run check` from **ui-002** branch.
