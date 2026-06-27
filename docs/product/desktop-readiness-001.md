# DESKTOP-READINESS-001 (capture only)

**Status:** Spec note — do not implement until `LOCAL-WEB-RUNTIME-001H` passes.  
**Branch context:** `ui-002/framework-derived-static-preview` · local-web-runtime-first.

## Product direction

xi-io Inbox = Outlook-like local command center:

- Gmail/mail providers
- GitHub accounts
- calendar/task orchestration
- CloudHQ-style productivity features
- Ibal de-noising/drafting
- ledger-backed evidence
- event-driven site/project state

## Decision

**Local-web-runtime first, desktop wrapper second.**

Desktop-readiness is architecture and packaging planning only. It does not replace or shortcut the current Gmail spine proof on `http://127.0.0.1:8788`.

## Near-term (before desktop work)

Prove on local web runtime:

1. Gmail live metadata sync
2. Labels/account metadata
3. Selected read-only body hydration
4. Provider writes remain blocked
5. Stable local runtime API contracts

## Desktop-readiness work (after 001H PASS)

### 1. Runtime boundary

```text
Browser/Tauri shell → local runtime API → provider adapters → local index/ledger
```

The existing `:8788` HTTP API remains the spine; a desktop shell wraps it rather than re-deriving provider logic.

### 2. Local profile storage

Under operator profile (e.g. `~/.xiio/inbox/`):

- accounts
- provider tokens
- preferences
- sync state
- ledger
- draft queue
- evidence refs

### 3. Secret storage strategy

- Prefer Linux secret service/keyring where available
- Fallback: encrypted local profile only if keyring unavailable
- Never commit tokens, credentials, or private bodies to git

### 4. Packaging path (later)

| Platform | Path |
| --- | --- |
| Linux (first) | Tauri shell candidate |
| Linux distribution | Flatpak later (sandbox, portals, publishing) |
| Windows / macOS | After Linux validation |
| ChromeOS | Linux/Flatpak or PWA-style route after validation |

Reference: [Tauri](https://tauri.app/) · [Flatpak docs](https://docs.flatpak.org/en/latest/)

### 5. OAuth truth (non-negotiable)

- Desktop can persist refresh tokens and reduce repeated login friction
- Desktop **cannot** eliminate user consent
- Scope changes, revoked grants, expired refresh tokens, or contaminated grants may require reauthorization
- Correct scopes must be requested at consent time ([Google OAuth 2.0 web server flow](https://developers.google.com/identity/protocols/oauth2/web-server))

Example: `gmail.readonly` + `gmail.metadata` on the same token blocks `format=FULL` body read — reconnect with readonly-only scopes is required; a desktop shell does not bypass that.

### 6. Local web runtime without desktop wrapper

`:8788` must remain fully usable for owner proof, CI parity, and development without installing Tauri or Flatpak.

## Start gates (all required)

Do **not** start Tauri/Flatpak implementation until:

1. `LOCAL-WEB-RUNTIME-001H` owner proof PASS
2. Runtime commit is atomic
3. Provider read-only model is stable

## Agent stop line

- Do not interrupt `LOCAL-WEB-RUNTIME-001H` for desktop work
- Do not pivot implementation to Tauri/Flatpak before spine PASS
- Capture and document only until owner unlocks downstream slices
