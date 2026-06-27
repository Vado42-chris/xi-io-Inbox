# PROVISIONING-ACCOUNT-SETTINGS-001 — account provisioning and settings surfaces

**Status:** Capture only — **implementation not started**.  
**Ledger event:** `provisioning.account_settings.spec_captured`  
**Parent:** `docs/architecture/provider-control-plane-001.md` · `docs/product/account-linking-automation-hub-001.md`

## Purpose

Define the **provisioning layer**: how xi-io shows what is connected, what is readable, what is writable, what is blocked, what is local-only, and what the user can change — across providers and accounts.

```text
Every visible action must map to a capability.
Every capability must map to a scope/policy.
Every scope/policy must map to a user-facing setting.
Every setting/action change must produce a ledger event or receipt.
```

This is **not polish**. It is product truth for account provisioning and comfort/safety controls.

## IA clarification (locked for spec)

| Surface | Role |
| --- | --- |
| **Top-right Account profile card** | Current **xi-io user/session** identity — who is operating the app |
| **Left-rail Account settings shortcut** | Contextual entry to **current provider/mail account** settings |
| **Full settings area** | All accounts, providers, capabilities, comfort levels, policy controls |

Do not conflate global xi-io session profile with a single Gmail account card.

## Surfaces to capture

### Top-right profile card

See `docs/product/profile-card-001.md`.

### Left-rail account settings shortcut

- Jumps to active account’s settings tab
- Shows connection health at a glance when collapsed

### Per-provider account pages

- One page per `ProviderAccount`
- Connection state, scopes, sync, capabilities, comfort policies

### Full settings area (hub)

| Section | Contents |
| --- | --- |
| Connected accounts | All provider accounts + link/unlink flows (future gates) |
| Capabilities | Read/write matrix per account |
| Scopes granted | OAuth scope list + reconnect requirements |
| Token status | Valid/expired/revoked (no secret values in UI) |
| Sync status | Last sync, errors, freshness |
| Comfort / safety | Remote images, tracking, attachment thresholds |
| Render preferences | Plain vs HTML, sandbox strictness |
| Notification preferences | Feed + toast policies |
| Egress approval policy | Draft/send/archive gates |
| Ibal eligibility | Which actions Ibal may propose |
| Privacy / retention | Local cache, archive, evidence mode |

## Settings dependency

Atomic setting definitions live in `docs/architecture/provider-settings-matrix-001.md`.

## Provisioning flows (capture only)

```text
connect → capability discovery → account card → settings defaults → sync spine → notifications → reading/render policies
```

No auto-provision writes. Connect flows remain explicit OAuth + owner consent.

## Cross-links

| Doc | Relationship |
| --- | --- |
| `provider-settings-matrix-001.md` | Setting keys and gates |
| `profile-card-001.md` | Header profile UX |
| `mail-body-renderer-001.md` | Render + remote image settings |
| `notification-event-feed-001.md` | Notification comfort controls |
| `contact-file-identity-bridge-001.md` | Contact/file import policies |

## Stop lines

- No settings UI implementation now
- No OAuth scope changes
- No provider writes
- No account linking automation beyond captured specs

## Ledger

- Spec captured: `provisioning.account_settings.spec_captured`
