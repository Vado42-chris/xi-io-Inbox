# LOCAL-WEB-RUNTIME-001I — read-only freshness smoke test (capture only)

**Status:** Spec note — do not implement until `LOCAL-WEB-RUNTIME-001H` owner proof PASS.  
**Precedes:** `GMAIL-DRAFT-EGRESS-001A`, `GMAIL-SEND-EGRESS-001A`, `MAIL-SMOKE-HARNESS-001`

## Purpose

Formal read-only smoke test proving receive → sync → label metadata → selected body → refresh **without** provider writes.

This is **not** draft/send testing. Egress slices require separate OAuth scopes, owner approval, and ledger gates.

## Staged smoke model

```text
Stage 1 — READ-ONLY (001I):
  receive → sync → label metadata → selected body → refresh

Stage 2 — DRAFT (GMAIL-DRAFT-EGRESS-001A):
  create draft only → detect draft → ledger event → never send

Stage 3 — SEND (GMAIL-SEND-EGRESS-001A):
  send-to-self only → explicit owner approval → receive loop confirms delivery
```

## 001I allowed

- Detect a new inbound test message (owner sends from Gmail web or another client)
- Sync metadata via existing `/api/mail/sync` or background refresh
- Confirm label/folder provider totals update or local index reflects new thread
- Hydrate selected message body read-only
- Record local smoke-test event / receipt
- Update local ledger / read-only proof artifact

## 001I not allowed

- Creating Gmail drafts
- Sending email
- Mark read/unread, archive, delete, apply labels
- Any Gmail mutation
- Requesting `gmail.compose`, `gmail.send`, or `gmail.modify` scopes

## OAuth scope truth

| Scope | Use |
| --- | --- |
| `gmail.readonly` | View messages/settings; body read with `format=full` when **only** this Gmail scope is on token |
| `gmail.metadata` | Metadata only — **cannot** read bodies; must not coexist with readonly on same token for body hydration |
| `gmail.compose` / `gmail.send` / `gmail.modify` | **Blocked** until explicit egress slices |

Reference: [Choose Gmail API scopes](https://developers.google.com/workspace/gmail/api/auth/scopes)

## Manual smoke procedure (owner + agent)

1. Record baseline: `GET /api/mail/status` (index counts, label sync, body gate)
2. Owner sends unique test subject to connected account from external client
3. Trigger refresh: wait for interval or `POST /api/mail/sync`
4. Agent verifies:
   - Index thread/message count increased or new thread id appears
   - New thread visible in thread list
   - Selected body hydrates with read-only text + `derivedMetadata`
   - Provider write gates remain blocked
5. Record PASS/FAIL with timestamps and curl evidence

## Label count honesty (001H follow-up)

Provider label API returns both `messagesTotal` and `messagesUnread`. Current UI prefers unread when present (`runtimeLabelCount`). Folder names without qualifier can look wrong (e.g. Inbox showing unread-only count). 001I receipt should state whether displayed counts are **provider unread**, **provider total**, or **local index** counts.

## Agent stop line

- Do not implement draft/send during 001H or 001I
- Do not broaden OAuth scopes
- Do not commit until 001H owner PASS is recorded
