# GMAIL-001B: Local OAuth Adapter Plan (Metadata Only)

## Adapter boundary

| Property | Value |
| --- | --- |
| Deployment | Local-only adapter (not static preview UI) |
| OAuth flow | Installed-app / loopback (`127.0.0.1`) per Google native-app guidance |
| Account identity | Returned from `gmail.profile.get` — never hard-coded |
| Default data | Metadata only; bodies blocked |
| Send | Blocked at adapter and gate |
| Draft write | Blocked until GMAIL-001C+ gate |

## Scope planning (least privilege)

Prefer narrow scopes for GMAIL-001B implementation (GMAIL-001C):

| Scope candidate | Use | Notes |
| --- | --- | --- |
| `openid` + `email` | account identity | profile only |
| `https://www.googleapis.com/auth/gmail.metadata` | labels, counts, metadata | restricted; disclose accurately |
| `gmail.readonly` | defer | broader than needed for first spike |
| `gmail.compose` | **blocked** | includes send |
| `gmail.modify` | **blocked** | mutation |
| `mail.google.com` | **blocked** | full access |

Exact scope set must be re-validated at GMAIL-001C implementation against Google scope policy and app verification requirements.

## Token storage boundary

| Store | Allowed |
| --- | --- |
| OS keychain (preferred) | Yes |
| Ignored encrypted local file (fallback) | Yes, gitignored |
| `localStorage` / `sessionStorage` | **Never** |
| Repo / fixtures / docs / screenshots / logs | **Never** |

Wipe requirement: `provider.wipeLocalData` must delete tokens, cached metadata, and receipt pointers.

## Adapter methods

### Connection lifecycle

| Method | GMAIL-001B | GMAIL-001C |
| --- | --- | --- |
| `provider.status` | plan | implement |
| `provider.connect.start` | plan | implement |
| `provider.connect.callback` | plan | implement |
| `provider.disconnect` | plan | implement |
| `provider.wipeLocalData` | plan | implement |

### Gmail read (metadata)

| Method | Default |
| --- | --- |
| `gmail.profile.get` | allowed |
| `gmail.labels.list` | allowed |
| `gmail.labels.counts` | allowed |
| `gmail.drafts.listMetadata` | allowed (no bodies) |
| `gmail.messages.searchMetadata` | allowed (explicit queries; no bulk body) |
| `gmail.messages.getBody` | **BLOCKED** |
| `gmail.drafts.create` | **BLOCKED** |
| `gmail.drafts.update` | **BLOCKED** |
| `gmail.drafts.send` | **BLOCKED** |

## Output shape (all methods)

```json
{
  "success": true,
  "blocked": false,
  "scopeState": ["gmail.metadata"],
  "providerGate": "metadata_read_only",
  "dataClassification": "metadata_redacted",
  "receiptId": "receipt-…",
  "redactionState": "applied",
  "payload": {}
}
```

Blocked methods return `success: false`, `blocked: true`, `providerGate` reason, and receipt id.

## Implementation location (GMAIL-001C)

```text
tools/gmail/          # local adapter CLI or Node module (no secrets in repo)
```

Static preview (`public/inbox-preview.js`) must **not** hold OAuth tokens or call Gmail directly until product UI gate passes.

## Receipts

Every connect, metadata fetch, blocked escalation, disconnect, and wipe emits a local receipt (not committed if it contains private data).
