# ARCH-004 — Runtime Host Decision

## Status

```text
Gate: ARCH-004 (platform runtime and deployment envelope)
Capture slice: RUNTIME-NORTHSTAR-001 (2026-06-15)
Formalize slice: ARCH-004-FORMALIZE (2026-06-10)
Formal decision state: PASS — owner sign-off recorded
Decision token: ARCH_004_PASS_TAURI_LOCAL_RUNTIME_PRIMARY
Prior matrix: docs/architecture/platform-runtime-decision-matrix.md (still valid for options survey)
Receipt: docs/ui/reviews/arch-004-tauri-runtime-host-formal-decision-receipt.md
```

## Decision summary

**Primary next-phase runtime target: Tauri local desktop application.**

The connected xi-io Inbox product runs as a **local-first desktop runtime** with:

- Web UI (existing preview-derived frontend) hosted inside Tauri
- Rust-side provider services exposed via [Tauri commands](https://v2.tauri.app/develop/calling-rust/)
- Managed application state for sync jobs, local stores, and provider sessions
- OAuth loopback handled by the desktop runtime (graduating CLI proof)
- Tokens and secrets outside the static browser surface and outside git

Static preview (`npm run dev` / `python -m http.server`) remains a **fixture and
gate-proof harness**, not the shipping runtime.

## Rationale for Tauri

| Requirement | Tauri fit |
| --- | --- |
| Local-first, user-owned data | Desktop app; no cloud dependency for core loop |
| Live Gmail/GitHub sync services | Rust async commands; background tasks |
| OAuth loopback (Google desktop) | Native loopback listener; aligns with existing CLI |
| Replace manual JSON import | Commands return store snapshots; UI subscribes to state |
| Keep existing web UI investment | Reuse preview CSS/JS; strangler migration |
| Security boundary | Tokens in runtime secure store, not browser localStorage |

## Rejected or deferred alternatives

| Option | Verdict | Notes |
| --- | --- | --- |
| Static preview as final product | **Rejected** | Scaffold only; no in-browser live providers |
| Manual JSON file bridge as final UX | **Rejected** | Operator export/import is dev bridge, not product |
| Browser-only OAuth in static preview | **Rejected (this phase)** | Tokens must not enter static browser storage |
| Cloud-first backend as primary | **Deferred** | Conflicts with local-first default; revisit for optional sync hub |
| Gmail Pub/Sub push as first sync | **Deferred** | Server-oriented; overkill before desktop runtime proven |
| Electron desktop | **Not chosen** | Viable but heavier; Tauri preferred unless evidence beats it in RUNTIME-001 spike |
| Local Node server only | **Not chosen** | Possible dev bridge; lacks integrated desktop OAuth/state story vs Tauri |
| Android as first desktop-class runtime | **Deferred** | ARCH-002 mail spine proof still pending; not primary for this phase |

## Runtime architecture (target)

```text
┌─────────────────────────────────────────────────────────┐
│ Tauri shell (desktop)                                    │
│  ┌─────────────────────┐  ┌──────────────────────────┐ │
│  │ Web UI (preview-derived) │ invoke commands       │ │
│  └──────────┬──────────┘  └────────────┬─────────────┘ │
│             │                           │               │
│  ┌──────────▼───────────────────────────▼─────────────┐ │
│  │ Rust runtime core                                     │ │
│  │  • gmail_provider (sync, index, history, status)     │ │
│  │  • github_provider (notifications ingress) [GITHUB-001]│ │
│  │  • local_stores (threads, events, receipts)          │ │
│  │  • oauth / token vault (OS-backed)                     │ │
│  └──────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
         │ poll                          │ poll
         ▼                               ▼
    Gmail API                      GitHub REST API
```

Static preview harness (parallel, not replaced yet):

```text
Browser → fetch public/data/*.local.json → inbox-preview.js
```

## Gmail sync approach

- **Poll-based** incremental sync using stored `historyId` with bounded full-sync
  fallback (promote `tools/gmail` EXT-004 logic into runtime service).
- **Not** Pub/Sub push until a dedicated backend/server need exists.

References:

- [Gmail sync guide (poll)](https://developers.google.com/workspace/gmail/api/guides/sync)
- [Gmail push notifications (defer)](https://developers.google.com/workspace/gmail/api/guides/push)

## OAuth approach

- Google: desktop loopback redirect ([OAuth 2.0 for iOS & Desktop Apps](https://developers.google.com/identity/protocols/oauth2/native-app))
- GitHub: auth mode chosen deliberately in GITHUB-001. The authenticated-user
  [notifications endpoint](https://docs.github.com/en/rest/activity/notifications)
  does **not** work with GitHub App user access tokens, GitHub App installation
  tokens, or fine-grained PATs. Do not assume the default GitHub App path covers
  personal notifications without verifying endpoint constraints.

## Storage and secrets boundaries

| Asset | Location |
| --- | --- |
| OAuth refresh tokens | Runtime secure store (gitignored); never repo or browser localStorage |
| Mail/thread index | Runtime local store (SQLite or JSON under app data dir) |
| Sync receipts | Runtime store + Activity projection |
| Static preview fixtures | `public/data/*.sample.json` only for CI/harness |

## What stays blocked until egress slices

- Gmail: draft write, send, label/archive/trash mutation (GMAIL-002C/D, EGRESS-001)
- GitHub: repo mutation, PR merge, issue close without gate
- Ibal: autonomous provider execution

## Relationship to existing gates

| Gate | Effect |
| --- | --- |
| GATE-RUNTIME-001 | ARCH-004 formal PASS recorded; RUNTIME-001 implementation unblocked |
| GATE-PROVIDER-001 | Live read ingress allowed in runtime; write still blocked |
| GATE-UI-VISUAL-001 | UI-003E owner proof still required before merge-ready product claim |
| Static preview checks | Remain; do not remove |

## Open decisions (post–ARCH-004 formal PASS)

- [x] Confirm Tauri as primary runtime host (owner sign-off 2026-06-10)
- [ ] Choose Rust mail store format (SQLite vs JSON envelope) in RUNTIME-001
- [ ] Android companion role after ARCH-002
- [ ] Local cloud/home server role (deferred)
- [ ] Distribution/signing pipeline (deferred)
- [ ] GitHub auth mode for notifications API (GITHUB-001 — not GitHub App installation token by default)

## Implementation sequence (post-decision)

1. **RUNTIME-001** — Gmail runtime provider service (no send/mutation; no browser tokens)
2. **RUNTIME-002** — UI binds to runtime store; deprecate manual JSON import for product path
3. **GITHUB-001** — GitHub notifications ingress provider
4. **IBAL-001** — Proposals over provider events
5. **EGRESS-001** — Approval-gated write/send/mutation

## Decision values

```text
ARCH_004_PROVISIONAL_TAURI_LOCAL_RUNTIME_PRIMARY   (RUNTIME-NORTHSTAR-001 capture)
ARCH_004_PASS_TAURI_LOCAL_RUNTIME_PRIMARY          (ARCH-004-FORMALIZE — owner sign-off)
```
