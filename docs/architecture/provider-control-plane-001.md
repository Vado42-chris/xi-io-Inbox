# PROVIDER-CONTROL-PLANE-001 — account linking, provider capabilities, contacts/files/events/workflows

**Status:** Capture only — no implementation on current branch unless explicitly approved.  
**Purpose:** Define the reusable xi-io **provider control plane** so Gmail, Google Contacts, Google Drive, Microsoft mail/contacts/OneDrive, GitHub, Slack, Dropbox, and later social providers share one framework instead of isolated integrations.

## Problem

`LOCAL-WEB-RUNTIME-001H` proved Gmail read-only runtime (connect → metadata/labels → selected body → no writes). The product still requires a planning layer for:

- connected accounts and account linking
- contacts, file library, attachments
- provider labels/folders/tags
- local metadata and ledger receipts
- notifications and events
- automations with capability gates
- workflow beginnings, middles, and endings
- reusable frontend/backend framework components

**Every provider is:**

```text
account → capabilities → containers → items → cursors → events → notifications → actions → receipts
```

## Related slices (queue)

| Slice | Role |
| --- | --- |
| `LOCAL-WEB-RUNTIME-001H` | Gmail read-only runtime proof (**landed** `ab7ff45`) |
| `LOCAL-WEB-RUNTIME-001I` | Read-only receive/freshness + notification smoke |
| `GMAIL-DRAFT-EGRESS-001A` | Draft-only egress gate |
| `GMAIL-SEND-EGRESS-001A` | Send-to-self egress gate |
| `MAIL-ACCOUNT-IA-001` | Unified mailbox navigation |
| `PROVIDER-ARCHITECTURE-001` | Cross-provider sync/egress mapping |
| `CONTACT-FILE-IDENTITY-BRIDGE-001` | Contacts, Drive, identity linking |
| `NOTIFICATION-EVENT-FEED-001` | Event feed, toasts, actionable cards |
| `ACCOUNT-LINKING-AUTOMATION-HUB-001` | Accounts/automations UI hub |

## Agent stop lines

- No new OAuth scopes without explicit egress slice
- No provider writes
- No Contacts/Drive/GitHub/Microsoft/Slack/Dropbox/social **implementation** now
- No automations that mutate provider state
- No push until branch hygiene confirmed

---

## Core types

### ProviderAccount

| Field | Type / notes |
| --- | --- |
| `provider` | `gmail` · `google_contacts` · `google_drive` · `microsoft_mail` · `microsoft_contacts` · `onedrive` · `github` · `slack` · `dropbox` · `linkedin` · `facebook` · `other` |
| `accountId` | Stable xi-io account key |
| `providerAccountId` | Provider-native account id |
| `displayName` | Operator-facing name |
| `displayEmail` | Primary email when applicable |
| `avatar` | URL or local ref (no secrets) |
| `scopesGranted` | OAuth scopes on token |
| `capabilities` | Derived capability flags (see below) |
| `connectionState` | `disconnected` · `connecting` · `connected` · `syncing` · `error` · `cached_offline` |
| `tokenState` | `missing` · `present` · `expired` · `scope_conflict` · `revoked` |
| `lastSyncAt` | ISO timestamp |
| `lastError` | Last sync/connect error (redacted) |
| `ledgerRefs` | Receipt ids for connect/sync/egress events |

**Observed identity plane (owner, 2026-06-27):** Gmail, Google Contacts, Google Drive resolve the same Google profile; GitHub resolves to `Vado42-chris`. Product must model **one account-linking plane**, not siloed integrations.

### ProviderCapability

Named gate derived from scopes + owner policy. See capability table below.

### ProviderScope

Raw OAuth scope string(s) from provider. Mapped to capabilities; never conflate incompatible scopes (e.g. Gmail `gmail.metadata` + `gmail.readonly` on same token for body read).

### ProviderConnectionState / ProviderTokenState / ProviderSyncState

Connection = OAuth/session health. Token = credential file/keyring state. Sync = last ingress cursor, mode, counts, errors.

### ProviderCursor

Opaque incremental sync token per container or account: Gmail `historyId`, Graph `@odata.deltaLink`, GitHub since/ETag, Slack ts, etc.

### ProviderContainer

Label, folder, repo, channel, Drive folder — see `PROVIDER-ARCHITECTURE-001`.

### ProviderItem

Message, thread, contact, file, issue, notification — addressable unit with raw provider ids preserved.

### ProviderAction

User or automation intent: view, hydrate, draft, send, label, upload, comment, dismiss notification, etc. Each action checks capability gate before execution.

### ProviderEvent

Ingress observation: sync completed, item arrived, risk flagged, token expired. Feeds notification layer.

### ProviderReceipt

Ledger record: who/what/when/outcome/evidence ref. Required for connect, sync, body hydrate, draft create, send, automation run.

### ProviderRiskSignal

De-noise / reply-needed / phishing candidate / scope anomaly — local derived metadata only until owner policy approves provider reaction.

### ProviderAttachmentRef

Link from message item to file bytes or provider file id. May point to provider-only, local cache, or file library entry — see `CONTACT-FILE-IDENTITY-BRIDGE-001`.

### ProviderContactRef

Link from email address or display name to contact record(s) with confidence score.

### ProviderFileRef

Link from attachment or library item to Drive/OneDrive/Dropbox file metadata.

---

## Capability gates

Each capability declares:

| Property | Meaning |
| --- | --- |
| `providerScopeRequired` | Minimum OAuth scope(s) |
| `ownerApprovalRequired` | Human consent per action or slice |
| `mutatesProvider` | true if remote state changes |
| `reversible` | Can undo without data loss |
| `automatable` | Allowed in automation rules when approved |
| `receiptRequired` | Ledger event mandatory |
| `stopLine` | Condition that blocks automation (e.g. external recipient) |

| Capability | Mutates | Typical scope (Gmail example) | Stop line |
| --- | --- | --- | --- |
| `read_metadata` | no | `gmail.metadata` or readonly subset | metadata-only token cannot hydrate body |
| `read_body` | no | `gmail.readonly` (readonly-only token) | dual metadata+readonly scope |
| `read_contacts` | no | Google People / Graph contacts read | — |
| `read_files` | no | Drive readonly / Graph files read | — |
| `read_attachments` | no | same as read_body + file read | size threshold policy |
| `create_draft` | yes | `gmail.compose` | no send in same action |
| `send` | yes | `gmail.send` or `mail.send` | self-only until slice approved |
| `modify` | yes | `gmail.modify` / `Mail.ReadWrite` | separate from send |
| `delete` | yes | modify + delete policies | owner per action |
| `post_comment` | yes | GitHub issues write | no merge/close in v1 |
| `upload_file` | yes | Drive file write | quota + evidence mode |
| `archive` | yes | modify | receipt required |
| `label` | yes | modify | receipt required |
| `automate` | varies | derived from underlying action | blocked if any action lacks gate |

**001H landed capabilities only:** `read_metadata`, `read_body` (on demand), label **read** via metadata — not `label` write.

---

## Framework templates (future)

Capture targets for implementation slices — **not built now**:

- Frontend: account cards, provider badges, notification cards, action chips, capability badges, consent/scope review, accordion nav, resizable rail
- Backend: schema templates, MCP tool templates, API route templates, ledger event templates
- Governance: model checks per slice, peer review profiles

See `docs/product/account-linking-automation-hub-001.md` and `docs/product/notification-event-feed-001.md`.

---

## Ordering

1. Branch hygiene: 001H commits landed; deferred WIP stays uncommitted
2. Capture this doc + companion specs (**this slice**)
3. Next implementation: `LOCAL-WEB-RUNTIME-001I` (read-only freshness + notification smoke)
4. Draft/send via separate egress gates only
5. Mail IA, Microsoft mapping, GitHub workspace, Drive/Contacts after spine stable
