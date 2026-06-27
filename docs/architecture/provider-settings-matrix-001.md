# PROVIDER-SETTINGS-MATRIX-001 — atomic settings matrix

**Status:** Capture only — **implementation not started**.  
**Ledger event:** `provider.settings_matrix.spec_captured`  
**Parent:** `docs/architecture/provider-control-plane-001.md` · `docs/product/provisioning-account-settings-001.md`  
**Related:** `docs/ai/provider-settings-contract.md` (Ibal provider settings shape — separate from product matrix)

## Purpose

Define an **atomic settings matrix** for every provider/account/global control — so UI, capability ACL, and ledger events stay aligned.

## Setting record schema (capture)

Each setting MUST define:

| Field | Description |
| --- | --- |
| `settingKey` | Stable id (dot notation) |
| `displayLabel` | User-facing label |
| `scope` | `global` · `provider` · `account` |
| `defaultValue` | Safe default |
| `userEditable` | yes / no |
| `requiresProviderReconnect` | yes / no |
| `requiresNewOAuthScope` | yes / no |
| `mutatesProvider` | yes / no |
| `localOnly` | yes / no |
| `ledgerEvent` | Event name on change |
| `receiptRequired` | yes / no |
| `safeRollback` | Behavior on revert |

## Initial setting groups

### Connection

| settingKey (example) | scope | mutatesProvider | notes |
| --- | --- | --- | --- |
| `connection.enabled` | account | no | local enable flag |
| `connection.autoReconnect` | account | no | local orchestration |

### Scopes / capabilities

| settingKey | scope | requiresNewOAuthScope | notes |
| --- | --- | --- | --- |
| `capabilities.bodyRead` | account | maybe | maps to OAuth |
| `capabilities.metadataOnly` | account | maybe | readonly vs metadata conflict guard |
| `capabilities.draftWrite` | account | yes | egress gate |
| `capabilities.send` | account | yes | egress gate |

### Sync cadence

| settingKey | scope | localOnly |
| --- | --- | --- |
| `sync.intervalSeconds` | account | yes |
| `sync.onStartup` | account | yes |
| `sync.historyWindow` | account | yes |

### Body / rendering

| settingKey | scope | userEditable | defaultValue | notes |
| --- | --- | --- | --- | --- |
| `render.preferHtml` | account · sender · message | yes | `auto_safe` | ties to `MAIL-BODY-RENDERER-001` / **001C** toggle chip |
| `render.remoteImages` | account · sender · domain · message | yes | `block` | explicit allow only after user policy — **001C** |
| `render.trackingPixels` | global · account | **no** | `block` | **locked in 001C** — status only, not checkbox |
| `render.styles` | sender · message | yes | `strip_unsafe` | safe allowlist vs prefer plain — **001C** |
| `render.inlineCidImages` | sender · message | yes | `render_safe` | local CID only — **001C** |
| `render.sandboxStrict` | global | no | on | isolation level |

**001C capture:** Sender/message render policy toggles live in the **reading-pane summary strip** (not account settings panel). See `docs/product/mail-body-renderer-001c-render-policy.md`.

| settingKey | displayLabel (001C chip) | ledgerEvent |
| --- | --- | --- |
| `render.preferHtml` | Sanitized HTML | `mail.render_policy.changed` |
| `render.remoteImages` | Remote images | `mail.render_policy.sender_allowed` / `sender_blocked` |
| `render.trackingPixels` | Tracking resources blocked 🔒 | n/a — locked |
| `render.styles` | Style content stripped | `mail.render_policy.changed` |
| `render.inlineCidImages` | Inline images | `mail.render_policy.changed` |

Scope modal values: `message` · `sender` · `domain` (account/global later).

### Labels / folders

| settingKey | scope | mutatesProvider |
| --- | --- | --- |
| `labels.showCounts` | account | no |
| `labels.syncEnabled` | account | no (read sync only until gate) |

### Contacts

| settingKey | scope | mutatesProvider |
| --- | --- | --- |
| `contacts.importEnabled` | account | no until write gate |
| `contacts.mergePolicy` | global | no — owner review |
| `contacts.displayThreshold` | account | no |

### Attachments / files

| settingKey | scope | notes |
| --- | --- | --- |
| `attachments.autoDownloadMaxBytes` | account | default 0 |
| `files.libraryArchiveMode` | global | evidence mode |
| `files.retentionDays` | global | local policy |

### Notifications

| settingKey | scope | localOnly |
| --- | --- | --- |
| `notifications.toastEnabled` | global | yes |
| `notifications.feedEnabled` | global | yes |
| `notifications.mailReceived` | account | yes |

### Ibal actions

| settingKey | scope | notes |
| --- | --- | --- |
| `ibal.proposalsEnabled` | global | propose only |
| `ibal.autoOpenOnSelect` | global | UX preference |

### Draft / send gates

| settingKey | scope | mutatesProvider |
| --- | --- | --- |
| `egress.draftAllowed` | account | yes when enabled |
| `egress.sendAllowed` | account | yes when enabled |
| `egress.ownerApprovalRequired` | global | yes |

### Retention / archive

| settingKey | scope | localOnly |
| --- | --- | --- |
| `retention.localCacheDays` | global | yes |
| `retention.evidenceMode` | global | yes |

### Privacy / security

| settingKey | scope | notes |
| --- | --- | --- |
| `privacy.redactBodiesInLogs` | global | default on |
| `privacy.showTokenFingerprint` | account | never full token |

## Change flow (capture)

```text
user edits setting → capability check → scope/reconnect prompt if needed → ledger event → receipt if required → UI truth refresh
```

## Stop lines

- No settings storage implementation now
- No OAuth scope expansion
- No provider mutation via settings until explicit egress slices

## Ledger

- Spec captured: `provider.settings_matrix.spec_captured`
- Setting change (future): per-key `settings.<settingKey>.changed` events
