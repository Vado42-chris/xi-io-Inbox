# OLLAMA-PEER-REVIEW-001 — Governance AI Harness Receipt

## Date

2026-06-10

## Branch

`ui-002/framework-derived-static-preview`

## Scope

Add automatic, prompt-free governance peer review harness using Ollama (local or cloud) plus a provider Settings contract for future IBAL-001 / UI-004E / UI-005G work.

Deliverables:

- `scripts/ollama-peer-review.mjs` CLI with baked slice profiles
- Supporting lib under `scripts/lib/ollama-peer-review/`
- Structural check `scripts/ollama-peer-review-model-check.mjs`
- Runbook `docs/ai/ollama-peer-review-runbook.md`
- Provider contract `docs/ai/provider-settings-contract.md`
- Receipt template + Cursor rule for automatic agent workflow

## Excluded scope

- Product Ibal model routing (IBAL-001)
- Settings UI implementation (UI-004E / UI-005G)
- Tauri secure vault wiring for provider keys
- Live OAuth proof
- UI-003E PASS claim
- Committing secrets or calling cloud API during CI

## Files changed

| Area | Files |
| --- | --- |
| Harness | `scripts/ollama-peer-review.mjs`, `scripts/lib/ollama-peer-review/*`, `scripts/ollama-peer-review-model-check.mjs` |
| Docs | `docs/ai/ollama-peer-review-runbook.md`, `docs/ai/provider-settings-contract.md`, `docs/ui/reviews/_templates/ollama-peer-review-receipt.template.md`, this receipt |
| Agent workflow | `.cursor/rules/ollama-peer-review.mdc`, `AGENTS.md`, `package.json` |

## Slice profiles result

**Pass**

- `runtime-002b` — next runtime gate (capability split, orchestration, refresh, error handling)
- `runtime-002a` — reference profile for read bridge reviews
- `generic` — operator `--files` escape hatch

Prompts, excluded scope, review headings, and decision tokens are baked into profiles (zero prompt memory).

## Provider contract result

**Pass**

- Adapter matrix covers local Ollama, Ollama Cloud, OpenAI-compatible cloud/custom, Gemini/Anthropic as later adapters
- ChatGPT vs Codex documented as model routes on one adapter class
- Credentials boundary: webview never holds keys; Tauri vault for product path
- Aligns with `docs/ai/model-provider-layer.md`

## Secrets handling result

**Pass**

- Auto-discovers gitignored paths only (`secrets/API Key/olamma-api-xi-io.txt`, etc.)
- Prefers `OLLAMA_API_KEY` env when set
- Draft receipts annotate key source category, never key material
- No secrets added to git

## Automation result

**Pass**

- `npm run peer-review:ollama -- --slice <id> --dry-run` default-safe
- `--write` produces `docs/ui/reviews/<slice>-ollama-peer-review-draft.md`
- Cursor rule instructs agents to run harness after slice implementation

## Validation result

| Check | Result |
| --- | --- |
| `npm run check:ollama-peer-review` | Pass |
| `npm run peer-review:ollama -- --slice runtime-002b --dry-run` | Pass |
| Cloud `--write` | Operator-required (not run in CI) |

## Blocking findings

None.

## Non-blocking findings

1. Cloud `--write` requires operator API key and network; keep out of `npm run check` full pipeline until a mock mode exists.
2. Add new slice profiles as gates appear; do not point profiles at whole monolith files.

## Next recommended pass

**RUNTIME-002B-PEER-REVIEW** — run:

```bash
npm run peer-review:ollama -- --slice runtime-002b --write
```

Then validate checks and finalize `docs/ui/reviews/runtime-002b-peer-review-receipt.md`.

## Decision value

```text
OLLAMA_PEER_REVIEW_001_PASS_READY_FOR_RUNTIME_002B_OLLAMA_PEER_REVIEW
```

Governance AI harness and provider Settings contract established. Use Ollama draft peer review before spending Cursor tokens on the RUNTIME-002B gate.
