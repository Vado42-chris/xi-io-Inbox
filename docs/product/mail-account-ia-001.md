# MAIL-ACCOUNT-IA-001 — multi-account mailbox navigation and progressive disclosure

**Status:** Capture only — do not implement during `LOCAL-WEB-RUNTIME-001H`.  
**Blocked until:** 001H owner proof PASS + atomic runtime commit.

## Problem

The left rail becomes crowded as real provider labels/folders appear. Gmail already exposes 121+ user labels and triggers horizontal scrolling. This will not scale to multiple Gmail, Microsoft, GitHub, Slack, Dropbox, or social accounts.

**Horizontal scroll is an emergency overflow guard, not the designed interaction.**

## Product rule

```text
The user should not have to think in provider accounts unless they choose to.
```

Default experience = unified mailbox across connected accounts. Every item still preserves source provider, source account, raw provider IDs, labels/folders, and reply-from default.

---

## Navigation model

### Unified layer (default)

```text
All Inboxes
  Inbox
  Unread
  Needs reply
  Drafts
  Sent
  Archive
  Trash
  Spam
```

Queries aggregate across connected accounts. Presentation is unified; **metadata is not flattened away** — each thread retains `provider`, `accountId`, `providerAccountId`, raw IDs, and label/folder membership.

### Per-account layer (progressive disclosure)

Each connected account is a **top-level collapsible accordion**:

```text
Account: hallberg1974@gmail.com
  Inbox
    Labels          ← nested, collapsed by default
  Drafts
  Sent
  Archive
  Trash
  Spam
  Account settings

Account: other@email.com
  Inbox
    Labels
  Drafts
  Sent
  Archive
  Trash
  Spam
  Account settings
```

Repeat per provider/account. Provider-neutral **Container** model (see `docs/architecture/provider-architecture-001.md`):

| Provider | Container in rail |
| --- | --- |
| Gmail | labels under Inbox |
| Microsoft | folders/categories under Inbox |
| GitHub | org/repo/notification streams (later) |
| Slack | workspace/channel (later) |

---

## Label / folder progressive disclosure

1. **Collapsed by default** under Inbox → Labels
2. **Searchable / filterable** label list (121+ labels must not render as flat scroll)
3. **Long names truncated** with tooltip / full title on hover or focus
4. **No horizontal scrollbar** as primary navigation pattern
5. Count badges must state honesty: provider unread vs provider total vs local index (see 001H label-count note)

---

## Resizable left rail

| Requirement | Detail |
| --- | --- |
| Drag handle | User-adjustable width |
| Min/max widths | Prevent collapse or full-screen rail |
| Persistence | Width stored in local user preferences |
| Responsive fallback | Narrow screens: drawer or collapsed rail |

---

## Reply-from model (future egress; capture now)

```text
Default reply-from = account/address that received the original message.
User may override via visible From dropdown.
Override must be deliberate and visible.
Future send/draft receipts must record selected sending account.
```

Protects against accidental wrong-address replies while preserving multi-account control. Applies when `GMAIL-DRAFT-EGRESS-001A` / send gates exist — **not** during 001H.

---

## Provider truth preserved

Unified views are **presentation only**. Each item retains:

- source provider
- source account
- raw provider IDs (thread/message/etc.)
- labels / folders / categories
- local unified mailbox grouping key (for queries)

Do not flatten away evidence for ledger or Ibal downstream.

---

## Relationship to provider architecture

This IA slice sits above `PROVIDER-ARCHITECTURE-001`:

```text
Unified nav (MAIL-ACCOUNT-IA-001)
  → account accordion
    → container (label/folder/stream)
      → item (thread/message/notification)
```

Same tree pattern should carry Microsoft, GitHub, Slack, Dropbox, and social adapters without rail retrofit.

---

## Ordering

1. Finish `LOCAL-WEB-RUNTIME-001H` owner proof
2. Atomic runtime commit (body, labels, copy, gate)
3. **Then** consider `MAIL-ACCOUNT-IA-001` as next UX/IA slice
4. Microsoft/GitHub/Dropbox/Slack/social implementation remains blocked until provider spine is stable

## Agent stop line

- Do not implement during 001H
- Do not alter provider egress
- Do not add send/draft behavior
- Do not start Microsoft/GitHub/Dropbox/Slack/social adapters
- Capture and reference only until owner unlocks post-001H UX work
