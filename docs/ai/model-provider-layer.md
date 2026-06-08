# AI Model Provider Layer

## Purpose

`xi-io Inbox` must support replaceable AI providers instead of hardcoding one vendor.

Ibal is the orchestrator. Model providers are compute backends.

```text
Ibal -> Model Router -> Provider Adapter -> Model/API/Local Endpoint
```

## Provider principle

Users should be able to bring their own AI provider, API key, endpoint, or local model server where practical.

Supported provider classes:

- local endpoint
- user API key
- hosted xi-io convenience provider, later if monetization supports it
- generic OpenAI-compatible endpoint
- custom enterprise/self-hosted endpoint, later

## Initial provider targets

| Provider | Priority | Notes |
| --- | --- | --- |
| Ollama local server | high | Local-first target, but phone-hosted Ollama is not assumed. |
| OpenAI API | high | User API key or future hosted convenience path. |
| Anthropic Claude API | high | User API key path. |
| Generic OpenAI-compatible endpoint | high | Supports many local/self-hosted gateways. |
| Google Gemini | medium | Useful later for Google ecosystem users. |
| Mistral | medium | Useful later. |
| xAI/Grok | medium | Optional later. |
| OpenRouter | medium | Aggregator option, but not core default. |

## Mobile Ollama constraint

Running Ollama directly on a phone is not assumed for MVP.

Supported local-first paths should be:

1. phone app connects to a trusted LAN Ollama server,
2. phone app connects to a user-configured local/self-hosted endpoint,
3. future third-party on-device model runtime if practical,
4. cloud provider fallback with explicit consent.

## Data permission levels

Each provider must declare what data it may receive.

| Level | Meaning |
| --- | --- |
| metadata-only | Sender, subject, dates, labels, no body. |
| snippet-only | Limited body preview. |
| full-message | Full message body, no attachments. |
| message-plus-attachments | Full content plus attachments. |
| redacted-content | Masked names/emails/numbers/addresses where possible. |
| local-only | Never send this task to cloud AI. |
| ask-every-time | Require confirmation before each model call. |

## Default routing policy

- Local/self-hosted providers may be used for low-risk classification if the user configured them.
- Cloud providers must ask before first use.
- Sensitive bins should ask every time before cloud analysis.
- No AI provider may send, delete, forward, or externally disclose messages by default.

## Receipt requirements

Every model call that influences a user-visible proposal should record:

- provider
- model or endpoint alias
- data permission level
- source event IDs
- task type
- result status
- whether content left the device
- user confirmation status, if required

## Non-goals

- Do not automate consumer chat websites.
- Do not scrape browser sessions.
- Do not require one vendor subscription.
- Do not assume phone-local LLM inference for MVP.
