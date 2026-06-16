# ARCH-004-FORMALIZE — Tauri Runtime Host Formal Decision Receipt

## Date

2026-06-10

## Branch

`ui-002/framework-derived-static-preview`

## Commit SHA

Recorded at commit time (see final report).

## Owner decision token

```text
ARCH_004_PASS_TAURI_LOCAL_RUNTIME_PRIMARY
```

## Scope

Documentation and governance closeout only:

- Formalize ARCH-004 runtime host decision
- Record owner sign-off on Tauri local desktop runtime as primary next-phase host
- Unblock RUNTIME-001 as next implementation slice (plan only — no implementation in this pass)

## Excluded scope

- RUNTIME-001 implementation
- Live Gmail or GitHub implementation
- Mail UI polish
- ACC-SYNC-UI-001 stash work
- Unrelated uncommitted product code (`public/inbox-preview.*`, `tools/gmail/*`, etc.)
- Merge prep / PR ready-for-review
- UI-003E owner PASS claim
- Removal of static preview or CLI adapter work

## Selected runtime host

**Tauri local desktop runtime** — primary next-phase product host.

- Web UI (preview-derived) hosted inside Tauri
- Rust-side provider services via Tauri commands
- Managed application state for sync jobs, local stores, provider sessions
- Desktop OAuth loopback (Google native app flow)
- Tokens in runtime secure store, not browser localStorage

## Rejected or deferred alternatives

| Option | Verdict |
| --- | --- |
| Static preview as final product | **Rejected** |
| Manual JSON file bridge as final UX | **Rejected** |
| Browser-only OAuth in static preview | **Rejected (this phase)** |
| Cloud-first backend as primary | **Deferred** |
| Gmail Pub/Sub push as first sync | **Deferred** |
| Electron desktop | **Not chosen** (Tauri preferred unless RUNTIME-001 evidence beats it) |
| Local Node server only | **Not chosen** |
| Android as first desktop-class runtime | **Deferred** |

## Static preview status

**Retained as scaffold.** Static preview + `tools/gmail` CLI + JSON bridge remain for
UI shape, fixture, gate, receipt, and CI proof. Not the product destination.

## OAuth / token policy

- Browser OAuth in static preview: **blocked**
- Tokens in browser localStorage, fixtures, or repo: **forbidden**
- Desktop loopback OAuth in Tauri runtime: **primary path** ([Google native app OAuth](https://developers.google.com/identity/protocols/oauth2/native-app))

## Gmail runtime implications

- **RUNTIME-001** is next: promote CLI adapter metadata sync, local index, historyId
  sync, and sync status into a Tauri-side Gmail provider service
- Poll-based incremental sync; Pub/Sub push deferred
- No send, draft write, or label/archive/trash mutation in RUNTIME-001
- No body read unless separately gated and selected

## GitHub runtime implications

- **GITHUB-001** remains blocked until RUNTIME-001 Gmail spine lands
- Notifications ingress via poll-based REST API
- Auth must be chosen deliberately: authenticated-user notifications endpoint does
  **not** work with GitHub App user access tokens, GitHub App installation tokens,
  or fine-grained PATs ([GitHub REST notifications](https://docs.github.com/en/rest/activity/notifications))

## Egress gate policy

Unchanged. Draft write, send, mail mutation, GitHub mutation, and Ibal autonomous
execution remain gated with receipts. Connected ingress does not imply open egress.

## Files changed

| File | Action |
| --- | --- |
| `docs/architecture/arch-004-runtime-host-decision.md` | updated — provisional → formal PASS |
| `docs/product/runtime-north-star-001-connected-operations-cockpit.md` | updated — ARCH-004 accepted |
| `docs/product/runtime-001-gmail-provider-service-plan.md` | updated — next implementation slice |
| `docs/product/github-001-notifications-ingress-plan.md` | updated — auth constraints + blocker |
| `docs/product/03-sprint-slice-plan.md` | updated — ARCH-004 complete; RUNTIME-001 ready |
| `docs/product/06-compliance-validation-index.md` | updated — ARCH-004 blockers cleared |
| `docs/architecture/platform-runtime-decision-matrix.md` | updated — formal decision pointer |
| `TODO.md` | updated — ARCH-004 formalized; RUNTIME-001 unblocked |
| `docs/ui/reviews/arch-004-tauri-runtime-host-formal-decision-receipt.md` | this receipt |

## Product UI code changed

**No**

## Validation result

See final report (`npm run check`, `git diff --check`, `git status --short`).

Route-smoke `net::ERR_INSUFFICIENT_RESOURCES` recorded as environment/resource flake
when all non-browser model/static checks pass and no implementation files changed.

## PR #12 draft state

**Remains draft.** Not marked ready for review.

## UI-003E state

**Not passed** — human gate unchanged.

## Next recommended pass

**RUNTIME-001** — Gmail runtime provider service:

- Tauri project skeleton + Gmail provider command/status surface
- Local runtime store (promote CLI adapter semantics)
- No browser OAuth, no browser tokens, no send/draft/mutation, no GitHub yet
- Do not include unrelated uncommitted UX/Gmail edits until runtime spine exists

## Decision value

```text
ARCH_004_PASS_TAURI_LOCAL_RUNTIME_PRIMARY
```
