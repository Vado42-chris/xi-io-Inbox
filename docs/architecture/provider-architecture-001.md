# PROVIDER-ARCHITECTURE-001 — cross-provider account/sync/egress model

**Status:** Capture only — do not implement until `LOCAL-WEB-RUNTIME-001H` passes and runtime commit is atomic.  
**Purpose:** Map current Gmail work into a provider-neutral model so Microsoft mail, GitHub, Dropbox, Slack, and later social providers can be added without retrofitting the app.

## Ordering

1. Finish `LOCAL-WEB-RUNTIME-001H`
2. Fix stale preview/live copy in UI
3. Owner proof PASS
4. Atomic runtime commit
5. This spec guides Microsoft mail after Gmail stabilizes
6. GitHub after Microsoft/Gmail provider model stabilizes
7. Dropbox / Slack later
8. Socials v2 only

## Agent stop lines

- No Microsoft implementation now
- No GitHub implementation now
- No Dropbox/Slack/social implementation now
- No egress / provider writes during 001H
- No new OAuth scopes during 001H
- No send/draft smoke test until separate egress gate exists

---

## Provider-neutral concepts

### 1. Account

| Field | Description |
| --- | --- |
| `provider` | e.g. `gmail`, `microsoft-mail`, `github`, `slack`, `dropbox` |
| `providerAccountId` | Stable provider-side account id |
| `displayEmail` / `displayName` | Operator-facing identity |
| `scopes` / `capabilities` | Granted OAuth scopes mapped to capability flags |
| `connectionState` | disconnected · connected · syncing · error · cached_offline |
| `tokenState` | present · expired · scope_conflict · revoked |
| `lastSyncState` | timestamp, mode, error, cursor snapshot |

### 2. Container

Provider-specific grouping of items:

| Provider | Container examples |
| --- | --- |
| Gmail | system label, user label |
| Microsoft | folder, category |
| GitHub | org, repo, notification stream |
| Slack | workspace, channel, thread |
| Dropbox | folder, file area |

UI and sync logic should treat containers as first-class metadata, not hard-code “folders” or “labels.”

### 3. Item

Addressable unit within a container:

| Provider | Item examples |
| --- | --- |
| Gmail | message, thread |
| Microsoft | message, conversation |
| GitHub | issue, PR, comment, notification |
| Slack | message, thread |
| Dropbox | file, activity event |
| Social (v2) | post, message, comment |

### 4. Sync cursor

Opaque provider cursor stored as `providerCursor`:

| Provider | Cursor |
| --- | --- |
| Gmail | `historyId` |
| Microsoft Graph | `@odata.deltaLink` per folder ([delta query](https://learn.microsoft.com/en-us/graph/delta-query-messages)) |
| GitHub | notification `last_read_at` / ETag / since cursor |
| Slack | channel/thread timestamp cursor |

Incremental sync updates local index without full re-fetch.

### 5. Hydration

Two-phase model (proven in Gmail 001H):

1. **Metadata sync first** — headers, labels/folders, counts, snippets
2. **Body/content hydration on demand** — selected item only; attachments/files gated separately
3. **Derived metadata** stored locally (sender, date, labels, reply candidate, attachment presence)
4. **Raw provider IDs preserved** (`threadId`, `messageId`, etc.)

### 6. Egress gates

Each capability requires explicit scope + owner approval policy:

| Gate | Examples |
| --- | --- |
| `read-only` | metadata, body on demand |
| `draft/create-only` | create draft, no send |
| `modify/update` | mark read, apply label, move folder |
| `send/post/comment` | send mail, post Slack, comment on issue |
| `destructive/delete` | trash, delete, close+merge |

Never bundle egress into read-only proof slices.

### 7. Ledger events

Standard event names for evidence:

- `provider.connected`
- `provider.sync.started` / `provider.sync.completed` / `provider.sync.failed`
- `item.metadata.synced`
- `item.body.hydrated`
- `item.risk.flagged`
- `draft.created`
- `send.requested` / `send.approved` / `send.completed` / `send.failed`

---

## Gmail mapping (current spine)

| Concept | Gmail |
| --- | --- |
| Read metadata/body/settings | `gmail.readonly` |
| Metadata-only | `gmail.metadata` — **must not** coexist on same token as readonly for body hydration |
| Containers | labels (system + user) |
| Sync cursor | `historyId` |
| Egress (future) | `gmail.compose`, `gmail.send`, `gmail.modify` — separate gates, not 001H |

Reference: [Gmail API scopes](https://developers.google.com/workspace/gmail/api/auth/scopes)

## Microsoft mapping (future)

| Scope | Capability |
| --- | --- |
| `Mail.Read` | Read user mail including body |
| `Mail.ReadBasic` | Basic properties only — **not** body |
| `Mail.ReadWrite` | Create/read/update/delete mail — **does not send** |
| `Mail.Send` | Send mail |
| `MailboxFolder.Read` | Folder metadata |
| Delta query | Incremental sync via `@odata.nextLink` / `@odata.deltaLink` |

Folders/categories map to **Container**; not identical to Gmail labels.

Reference: [Microsoft Graph permissions](https://learn.microsoft.com/en-us/graph/permissions-reference)

## GitHub mapping (future)

- Prefer GitHub App / fine-grained permissions where possible
- Notifications, issues, PRs, repos, checks/actions = **streams** + **items**
- Egress (comment, close, merge, rerun job) = separate gated capabilities
- `notifications` scope includes read **and** mark-read — treat as write-capable surface

Reference: [GitHub OAuth scopes](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/scopes-for-oauth-apps)

## Future providers (capture only)

| Provider | Near-term | Later |
| --- | --- | --- |
| Dropbox | files, activity read | write/delete |
| Slack | workspace/channels/messages read | post/reply |
| LinkedIn / Facebook / social | v2 only; API-policy constrained | long-term adapter targets |

---

## Runtime boundary (target)

```text
Browser/Tauri shell → local runtime API (:8788) → provider adapters → local index/ledger
```

Desktop wrapper is second; local web runtime remains usable without Tauri/Flatpak. See `docs/product/desktop-readiness-001.md`.
