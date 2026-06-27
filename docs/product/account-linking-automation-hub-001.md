# ACCOUNT-LINKING-AUTOMATION-HUB-001 — connected accounts, capabilities, automations UI

**Status:** Capture only — UI/product spec. No implementation during 001H/001I unless explicitly approved.  
**Parent:** `docs/architecture/provider-control-plane-001.md`

## Purpose

Define the operator-facing **Accounts / Connections / Automations** hub where connected providers, scopes, health, pending actions, and automation rules are visible and gated.

The user should see **what is connected**, **what each connection can do**, and **what remains blocked** — without hunting per-lane integration screens.

## Top-level navigation (future)

```text
Settings / Automations hub
├── Connected accounts
├── Add connection
├── Capabilities & scopes
├── Sync health
├── Pending actions (blocked + approved queue)
├── Automation rules (dry-run first)
├── Audit receipts
└── Disconnect / reconnect / upgrade permissions
```

Not a replacement for Mail lane — a **control plane** overlay reachable from Settings and from provider status affordances in Mail/Integrations.

## Connected account card (component spec)

Each `ProviderAccount` renders as a card:

| Element | Content |
| --- | --- |
| Header | Provider icon, displayName, displayEmail |
| Status badge | connected · syncing · error · cached_offline · disconnected |
| Scope summary | Human-readable granted scopes (not raw URLs only) |
| Capability chips | read_metadata · read_body · create_draft (blocked) · send (blocked) |
| Last sync | `lastSyncAt` + mode |
| Last error | Redacted one-liner + “View receipt” |
| Actions | Reconnect · Disconnect · Upgrade permissions (future) · View receipts |

**Example observed plane:** Gmail + Google Contacts + Google Drive share Google identity; GitHub card shows `Vado42-chris` — cards must support **manual link** between Google email and GitHub login when auto-link confidence is low.

## Permission upgrade path

```text
Read-only baseline (default) → explicit opt-in per capability slice
```

Each upgrade step:

1. Show required scopes and mutations
2. Owner approval (click + receipt)
3. OAuth reconnect with narrowed/new scopes per slice policy
4. Never silently expand scopes on background refresh

## Workflow shape (beginning / middle / end)

### Beginning

- Connect provider
- Choose allowed capabilities (read-only baseline first)
- Review scopes in consent/scope review component
- Approve read-only baseline → `provider.connected` receipt

### Middle

- Sync provider metadata
- Hydrate content on demand (body, file preview, contact detail)
- Derive local metadata + risk signals
- Create notifications, tasks, **local** draft proposals
- Show receipts and capability-blocked affordances

### End

- Action completed (with receipt)
- Action dismissed
- Draft saved locally or provider draft created (egress slice)
- Send approved/completed (egress slice)
- Provider write blocked (explicit UI + receipt)
- Error resolved or escalated
- Receipt archived in ledger

## Automations hub rules

| Rule | Policy |
| --- | --- |
| Default mode | Dry-run / propose only |
| Provider mutation | Requires capability + owner approval per rule |
| External recipients | Stop line until send slice approved |
| Receipt | Every automated action emits ledger event |
| Kill switch | Global “pause automations” without disconnecting read |

## Blocked actions surface

When user clicks Send, Reply, Upload, Apply label, etc. without gate:

- Show **which capability** is missing
- Show **which slice** unlocks it (e.g. `GMAIL-DRAFT-EGRESS-001A`)
- Link to Accounts hub upgrade path — not a dead disabled button without explanation

## Framework components (capture list)

- `AccountCard`
- `ProviderStatusBadge`
- `CapabilityChip`
- `ScopeReviewPanel`
- `ConsentUpgradeFlow`
- `SyncHealthLine`
- `PendingActionQueue`
- `AutomationRuleEditor` (dry-run first)
- `ReceiptTimeline`
- `DisconnectConfirm` (with local cache policy copy)

Centralized CSS tokens — align with `MAIL-ACCOUNT-IA-001` accordion rail, not one-off integration pages.

## Stop lines

- No live automations that mutate providers until egress slices land
- No hidden scope escalation
- No implementation in current branch without approval
