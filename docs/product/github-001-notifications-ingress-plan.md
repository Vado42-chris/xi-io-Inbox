# GITHUB-001 — GitHub Notifications and Issues Ingress

## Status

```text
Type: ingress plan (docs only — do not implement in RUNTIME-NORTHSTAR-001)
Blocked by: ARCH-004 formal PASS, RUNTIME-001 spine recommended first
Depends on: RUNTIME-NORTHSTAR-001, Integrations taxonomy (UI-011G)
Receipt target: docs/ui/reviews/github-001-notifications-ingress-receipt.md (future)
```

## Goal

Provide **live GitHub ingress** into the local runtime so Activity, Mail-adjacent
notification views, Tasks, and Ibal can operate on real GitHub events — not fixture cards.

## Primary API surface

[GitHub REST: Notifications](https://docs.github.com/en/rest/activity/notifications)

Supported query dimensions to design for:

- `since`, `before`, pagination
- `all` vs participating
- per-repository filtering
- read/unread state

**Auth constraints:** not all GitHub App installation tokens behave like user
notification tokens. GITHUB-001 must document chosen auth mode (user OAuth,
fine-grained PAT, or GitHub App user-to-server) against endpoint requirements
before UI shows "Connected GitHub."

## In scope (GITHUB-001)

- Runtime `github_provider` module (Tauri/Rust)
- Commands:
  - `github_connect()` / `github_disconnect()`
  - `github_sync_notifications(since, filters)`
  - `github_list_notifications(state, repo, page)`
  - `github_get_notification(id)` — metadata for inspector/Ibal
- Local store: normalized notification records + sync cursor
- Activity receipts: connect, sync, blocked mutation attempts
- Integrations UI: honest connected/syncing states (RUNTIME-002+)

## Out of scope (GITHUB-001)

- Repository mutation (comment, close, merge, push)
- Mail account conflation (GitHub stays Integrations — ACC-001 taxonomy)
- Ibal autonomous actions on GitHub
- Webhooks server (poll-first; webhooks deferred until backend exists)

## Normalized event shape (draft)

```text
id, accountId, repoFullName, subjectType, title, reason, unread,
updatedAt, url, threadId (optional link to mail-like view),
providerSource: 'github-runtime', syncState
```

## Ibal integration (IBAL-001 handoff)

Ibal reads GitHub notification records and proposes:

- Create local task linked to `sourceRef: github:notification:{id}`
- Summarize review request
- Never post comments or change issue state without EGRESS-001 approval

## Security

- Tokens in runtime vault only
- Scopes: minimum for notifications read (+ issues read if needed for context)
- No private repo content in fixtures or committed logs

## Acceptance criteria

- [ ] Runtime connects GitHub with documented auth mode
- [ ] Poll sync retrieves notifications into local store
- [ ] Activity shows sync receipts
- [ ] Integrations card shows Connected / Syncing / Last synced
- [ ] Mutation actions remain blocked with visible gate copy

## Estimate

1–2 agent passes after RUNTIME-001 sidecar parity.
