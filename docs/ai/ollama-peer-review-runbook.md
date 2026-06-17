# Ollama governance peer review runbook

## Purpose

Run **automatic, prompt-free peer reviews** for xi-io Inbox slices using Ollama (local or cloud) before spending Cursor tokens on the same checklist.

This is **Ring 1 governance AI** — not product Ibal. It writes **draft receipts** only.

```text
Implementation slice complete
  → npm run peer-review:ollama -- --slice <profile> --write
  → operator/agent validates checks
  → finalize canonical docs/ui/reviews/*-peer-review-receipt.md
  → gate next slice / GitHub
```

## Zero prompt memory

Slice profiles live in `scripts/lib/ollama-peer-review/profiles.mjs`. Each profile bakes in:

- file list + focus columns
- excluded scope
- review section headings
- decision tokens (PASS / PARTIAL)
- suggested validation commands

You never re-type the peer review prompt.

## Commands

| Command | When |
| --- | --- |
| `npm run check:ollama-peer-review` | After editing harness files |
| `npm run peer-review:ollama -- --list-slices` | See available profiles |
| `npm run peer-review:ollama -- --slice runtime-002b --dry-run` | Inspect bundle size / paths (no API call) |
| `npm run peer-review:ollama -- --slice runtime-002b --write` | Generate draft receipt |

Default behavior without flags is `--dry-run`.

## Credentials (gitignored)

Resolution order:

1. `OLLAMA_API_KEY` environment variable
2. `--secrets-file <path>`
3. Auto-discover (first match):
   - `secrets/API Key/olamma-api-xi-io.txt`
   - `secrets/google/olamma-api-xi-io.txt`
   - `secrets/ollama-api-xi-io.txt`

Never commit secrets. Draft receipts must not echo API keys.

## Host selection

| Mode | How |
| --- | --- |
| Local Ollama | `--host local` or omit key (default `http://127.0.0.1:11434`) |
| Ollama Cloud | API key present → default `https://ollama.com`, or `--host cloud` |

Override with `OLLAMA_HOST` or `--host https://...`.

## Models

Profile defaults:

- Cloud: `qwen3-coder:480b-cloud`
- Local: `qwen3-coder:30b`

Override: `OLLAMA_MODEL` or `--model <name>`.

Use coding-oriented models for structural peer review.

## Output

Draft path (default):

```text
docs/ui/reviews/<slice>-ollama-peer-review-draft.md
```

Drafts include an HTML comment header marking them **not final**.

### Finalization checklist

1. Run validation commands listed in the draft (e.g. `npm run check:runtime002b`, `cargo test`).
2. Fix any real blocking findings in code — do not edit the draft to fake PASS.
3. Copy/adapt approved content to the canonical receipt name, e.g. `runtime-002b-peer-review-receipt.md`.
4. Commit only the **final** receipt when the slice gate requires it.

## Adding a new slice profile

1. Edit `scripts/lib/ollama-peer-review/profiles.mjs`.
2. Add file list, excluded scope, review sections, decision tokens.
3. Run `npm run check:ollama-peer-review`.
4. Dry-run the new profile before `--write`.

Prefer **narrow file lists** over whole-monolith dumps. Context budget caps apply (see `context.mjs`).

## Relationship to product AI

| Ring | Tooling | Settings UI |
| --- | --- | --- |
| Governance peer review (this runbook) | `npm run peer-review:ollama` | No — dev/operator only |
| Product Ibal (IBAL-001) | Tauri + model router | Yes — see `provider-settings-contract.md` |

## Automatic agent workflow

Cursor rule `.cursor/rules/ollama-peer-review.mdc` instructs agents:

- After implementation slice close, run dry-run then `--write` for the matching profile.
- Do not treat draft as PASS without running checks.
- Prefer Ollama draft before a full Cursor peer-review pass when slice profile exists.

## Non-goals

- Not a substitute for `npm run check` or cargo tests
- Not live OAuth proof
- Not UI-003E PASS
- Not autonomous merge to GitHub
