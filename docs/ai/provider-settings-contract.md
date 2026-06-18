# Provider Settings Contract

## Status

```text
Type: design contract (docs-only)
Consumers: UI-004E, UI-005G, IBAL-001, model-provider-layer
Decision token: PROVIDER_SETTINGS_CONTRACT_V1
```

## Purpose

Define one **AI-agnostic provider configuration shape** for xi-io Inbox and Ibal so users can:

- run **local Ollama** with custom GGUF/model tags,
- attach **cloud API keys** (OpenAI/ChatGPT/Codex routes, Google Gemini, Ollama Cloud),
- or point at a **custom OpenAI-compatible endpoint**,

without embedding vendor SDKs in the webview or hardcoding a single AI vendor.

Product AI stays **out of the untrusted UI** and **inside the Tauri trusted runtime**.

```text
Settings UI (profiles only)
  → Tauri secure store (credentials)
  → Ibal orchestrator
  → Model router
  → Provider adapter
  → Local or cloud endpoint
```

Governance peer review (`npm run peer-review:ollama`) is a **separate dev ring** and does not use this Settings contract.

## Design principles

1. **AI-agnostic** — adapters, not vendor pages.
2. **Bring your own key** — default path; optional xi-io hosted convenience later.
3. **Local-first routing** — cloud requires explicit consent.
4. **Proposal-only Ibal** — providers classify/draft; they do not send/delete/mutate by default.
5. **Receipts for influential calls** — provider, model alias, permission level, egress flag.
6. **No secrets in git or webview storage** — credentials in Tauri secure store / operator `secrets/` for dev tools only.

## Settings surface (future UI-004E / UI-005G)

Settings exposes **provider profiles**, not raw SDK wiring.

### Profile record (logical schema)

| Field | Type | Notes |
| --- | --- | --- |
| `id` | string | Stable UUID/slug |
| `label` | string | User-visible name |
| `adapterClass` | enum | See adapter matrix |
| `enabled` | boolean | Soft disable without deleting keys |
| `endpoint` | url | Required for local/custom; optional override for cloud |
| `modelAlias` | string | User-selected model tag (incl. custom GGUF names) |
| `apiKeyRef` | secure ref | Pointer into Tauri vault — never returned to webview |
| `defaultPermissionLevel` | enum | Default `metadata-only` |
| `routingPolicy` | enum | `local-first`, `cloud-allowed`, `local-only` |
| `askBeforeCloud` | boolean | Default true |
| `lastTestStatus` | enum | `unknown`, `ok`, `failed` |
| `lastTestAt` | timestamp | From bounded ping only |

### Adapter matrix

| Settings label (UX) | `adapterClass` | Endpoint default | Model examples | Notes |
| --- | --- | --- | --- | --- |
| Local Ollama | `openai-compatible-local` | `http://127.0.0.1:11434/v1` | `qwen3:14b`, custom GGUF tags | LAN/server URLs allowed |
| Ollama Cloud | `openai-compatible-cloud` | `https://ollama.com/v1` | `qwen3-coder:480b-cloud` | API key required |
| OpenAI / ChatGPT | `openai-compatible-cloud` | `https://api.openai.com/v1` | `gpt-4o`, etc. | Same adapter as Codex route |
| OpenAI Codex route | `openai-compatible-cloud` | `https://api.openai.com/v1` | codex-capable model IDs | **Model route**, not separate SDK |
| Custom OpenAI-compatible | `openai-compatible-custom` | user URL | user model alias | Gateways, LiteLLM, etc. |
| Google Gemini | `google-gemini` | Google API base | `gemini-*` | Separate adapter (later) |
| Anthropic Claude | `anthropic-messages` | Anthropic API base | `claude-*` | Separate adapter (later) |

**Do not** build separate first-class integrations per marketing name when one adapter class covers them.

### Data permission levels

Same enum as `docs/ai/model-provider-layer.md`:

`metadata-only` (default), `snippet-only`, `full-message`, `message-plus-attachments`, `redacted-content`, `local-only`, `ask-every-time`.

Settings UI must show the active level before any cloud call.

### Test connection

Bounded ping only:

- no mail bodies,
- no attachments,
- no provider mutation,
- result stored as `lastTestStatus`.

## Runtime boundaries

| Layer | May hold API keys | May call providers |
| --- | --- | --- |
| Webview (`public/*`) | **No** | **No** |
| Tauri commands / sidecar | Yes (vault) | Yes (bounded tasks) |
| Dev scripts (`scripts/ollama-peer-review.mjs`) | Yes (`secrets/`, env) | Yes (governance only) |

Ibal module (`public/src/ibal/`) orchestrates **requests**; execution crosses into Tauri.

## Model router inputs

Each task packet sent to the router includes:

- `taskType` (classify, summarize, draft proposal, peer-review-like dev tasks are out-of-band)
- `permissionLevel`
- `sourceEventIds`
- `preferredProfileId` optional
- `allowCloud` boolean derived from policy + user consent

Router chooses:

1. explicit profile if valid + permitted,
2. else local-first enabled profile,
3. else fail closed with honest UI copy.

## Receipt fields (product path)

Every influential model call records:

- profile id + adapter class
- model alias
- permission level
- source event IDs
- task type
- result status
- `contentLeftDevice` boolean
- user confirmation status when required

## Context-window strategy

As models gain larger windows, **increase task packet size**, not monolith dumps:

- fixed file/event lists,
- excluded scope,
- explicit review sections,
- one receipt per pass.

Same pattern as governance peer review profiles.

## Non-goals (MVP Settings)

- No provider keys in preview JSON fixtures
- No autonomous send/delete/archive
- No scraping consumer chat websites
- No phone-hosted Ollama assumption
- No requirement to use xi-io-hosted AI

## Implementation sequencing

| Slice | Uses this contract |
| --- | --- |
| OLLAMA-PEER-REVIEW-001 | No (dev script only) |
| UI-004E Provider Gates polish | Read-only mock of profile states |
| UI-005G Settings operability | Local editable forms (still no live product routing) |
| IBAL-001 | Real router + Tauri adapters |

## Cross-repo note (Ibal)

`xi-io:ibal` shares visual/security patterns but owns its own Settings implementation. This contract is the **inbox-side source of truth** for adapter classes and permission enums; ibal should mirror adapter class names to avoid drift.

## Related docs

- `docs/ai/model-provider-layer.md`
- `docs/ai/ollama-peer-review-runbook.md`
- `docs/ui/reviews/ibal-cross-repo-peer-review-request.md`
