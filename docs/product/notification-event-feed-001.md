# NOTIFICATION-EVENT-FEED-001 — event inbox, toasts, actionable notifications

**Status:** Capture only — no notification UI/backend implementation now.  
**Ledger event:** `notification.feed.spec_updated` (alias: `EVENT-NOTIFICATIONS-001`)  
**Parent:** `docs/architecture/provider-control-plane-001.md`  
**Queue alias:** `EVENT-NOTIFICATIONS-001` (same slice)

## Purpose

Define the unified **notification and event feed** for provider ingress, sync outcomes, risk signals, and user-actionable cards — without enabling provider writes until capability gates approve.

**Notifications are not just toasts.** They are **provider/control-plane events** surfaced to the user with durable state, comfort controls, and ledger linkage.

Layers:

```text
ProviderEvent → NotificationEvent → toast (ephemeral) + notification feed (durable) + actionable card
```

---

## NotificationEvent model

| Field | Type / notes |
| --- | --- |
| `eventId` | Stable xi-io id |
| `eventType` | e.g. `mail.received`, `sync.completed`, `body.hydrated`, `sync.failed`, `risk.flagged` |
| `provider` | Provider id |
| `accountId` | ProviderAccount ref |
| `sourceItemId` | thread/message/issue/file id |
| `title` | Short headline |
| `summary` | One-line detail (redacted) |
| `severity` | `info` · `success` · `warn` · `error` |
| `priority` | `low` · `normal` · `high` · `urgent` |
| `createdAt` | Provider or system time |
| `observedAt` | Local ingress time |
| `actionSet` | Allowed actions for this event |
| `routeTarget` | Lane + item deep link |
| `receiptRef` | Ledger receipt id |
| `dismissedAt` | User dismissed |
| `resolvedAt` | Action completed or expired |
| `ibalEligible` | Whether Ibal de-noise/draft propose is allowed |
| `comfortLevel` | User/policy comfort tier affecting action visibility |
| `blockedActions[]` | Provider actions hidden or shown as blocked with reason |
| `readAt` | User read state |
| `snoozedUntil` | Snooze/defer |

---

## UI layers

### Toast layer

- Ephemeral: sync completed, connect success, non-blocking errors
- Auto-dismiss except errors
- Never toast provider write success until egress slice exists

### Event inbox (notification feed)

- Durable list: all notifications with **read / dismiss / snooze / defer**
- Filter by provider, account, severity, lane, comfort level
- Link to receipt and source item
- **Not equivalent to toast layer** — feed survives toast dismissal

### Actionable notification cards

Each card shows: title, summary, **event source**, provider badge, account, **provider/account/item refs**, time, **action chips** (enabled + blocked variants), **Ibal eligibility**, **route target**, **receipt link**, comfort-level explanation for blocked provider actions.

---

## Initial action set (read-only safe)

| Action | Mutates provider | Gate |
| --- | --- | --- |
| View | no | `read_metadata` |
| Ask Ibal | no (local) | Ibal slice + hydrated body when needed |
| Create local task | no (local) | tasks lane |
| Dismiss | no (local state) | — |
| Snooze | no (local state) | — |
| Mark for review | no (local flag) | — |

Comfort-level controls (from settings matrix) may hide non-essential actions without removing audit trail in feed.

---

## Provider-write actions (disabled until egress gates)

Must render as **blocked with capability explanation**, not silent no-ops:

| Blocked until gate | Examples |
| --- | --- |
| Mail egress | Reply · Send · Archive · Delete · Apply label |
| File egress | Upload file · Modify remote file |
| Other | Post comment · Modify remote state |

Each requires explicit capability from `PROVIDER-CONTROL-PLANE-001` + owner approval policy + settings matrix entry.

---

## Ibal-eligible actions

`ibalEligible: true` when:

- Source item has hydrated body or sufficient metadata per Ibal spec
- Not blocked by de-noise policy
- Provider write not required for proposed action

Ibal proposes; does not send/delete/mutate by default (`IBAL-DENOISE-RESPONSE-001`).

---

## Route targets

| eventType | routeTarget example |
| --- | --- |
| `mail.received` | Mail lane + thread id |
| `sync.failed` | Accounts hub + account card |
| `github.notification` | Integrations/GitHub + item id (future) |
| `drive.file.shared` | File library + file ref (future) |

---

## Ledger integration

Every notification with provider ingress should link `receiptRef`:

- `provider.sync.completed`
- `item.metadata.synced`
- `item.body.hydrated`
- `item.risk.flagged`

Dismiss/snooze are local-only events — optional lightweight receipts for audit mode.

---

## 001I smoke hook (future)

Read-only freshness test:

1. Owner sends test email externally  
2. Sync produces `mail.received` notification  
3. Event inbox + optional toast  
4. Select thread → body hydrate → `item.body.hydrated` receipt  
5. No provider write actions enabled  

See `docs/product/local-web-runtime-001i-read-only-freshness-smoke.md`.

---

## Framework components (capture)

- `NotificationToast`
- `EventInboxList`
- `NotificationCard`
- `ActionChip` (enabled / blocked variants)
- `SeverityBadge`
- `ReceiptLink`
- `SnoozeDeferMenu`

Backend: event bus schema, `/api/events` read-only template, ledger event templates.

---

## Stop lines

- No provider-write notification actions now
- No push notification delivery (mobile) in this slice
- No implementation until 001I explicitly opened
