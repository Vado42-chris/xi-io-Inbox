# GMAIL-002: Real Gmail Ingress Plan (Staged)

## Purpose

Move from fixture-only static preview toward **real product mail metadata** using least-privilege Gmail API scopes, local adapter boundaries, and explicit gates for body read, draft write, and send.

Official scope reference: [Choose Gmail API scopes | Google for Developers](https://developers.google.com/workspace/gmail/api/auth/scopes)

## Principles

1. **Narrowest scope possible** — request only scopes required for the current gate ([Google scope guidance](https://developers.google.com/workspace/gmail/api/auth/scopes)).
2. **Tokens outside browser preview** — OAuth and refresh tokens in OS keychain or gitignored local store; never `localStorage` / repo / fixtures.
3. **Honest UI** — browser preview does not imply connected Gmail until adapter receipts confirm sync.
4. **Receipts for every gate** — connect, sync, blocked escalation, and wipe events are Activity-visible.
5. **No broad `mail.google.com`** unless a documented, reviewed need exists.

## Scope map (Google-documented)

| Scope | Google classification | xi-io use |
| --- | --- | --- |
| `https://www.googleapis.com/auth/gmail.metadata` | Restricted; metadata-only | **GMAIL-002A** labels, thread/message IDs, headers, counts, snippets where API allows |
| `https://www.googleapis.com/auth/gmail.readonly` | Restricted; read messages/settings | **GMAIL-002B** read-only body gate only |
| `https://www.googleapis.com/auth/gmail.compose` | Sensitive; create/send drafts | **GMAIL-002C** local draft write (no send) |
| `https://www.googleapis.com/auth/gmail.send` | Sensitive; send only | **GMAIL-002D** send after approval |
| `https://mail.google.com/` | Restricted; full mailbox | **Blocked** for this app |

Prior art: `docs/providers/gmail/gmail-001b-local-oauth-adapter-plan.md`, `gmail-001c-metadata-adapter-receipt.md`.

---

## GMAIL-002A — Metadata bridge — **complete** (2026-06-10)

**Goal:** Expose real account metadata to the app via existing local Gmail CLI/OAuth adapter.

Receipt: `docs/ui/reviews/gmail-002a-real-gmail-metadata-ingress-receipt.md`
Provider doc: `docs/providers/gmail/gmail-002a-metadata-bridge.md`

### Allowed

- Local adapter (`tools/gmail`) OAuth loopback connect
- `gmail.profile.get`, labels, thread IDs, message IDs, headers
- Unread counts, label counts, list metadata, snippets **if returned without body scope**
- Redacted metadata cache outside repo
- Activity receipts: connect started, connect success/fail, metadata sync, gate viewed

### Blocked

- Message body read
- Draft create/update
- Send
- Browser OAuth or tokens in preview bundle
- Writing fixtures/screenshots/logs with live mail content

### App surfacing (post-bridge)

- **Integrations → Email → Gmail** shows metadata-only status from adapter receipts
- **Mail → Accounts** lists real account identity when CLI connect verified
- Environment badge may add **Metadata bridge** only when receipt proves adapter sync — not by default in static preview

### Exit criteria

- Adapter status API consumed by preview or sibling shell (read-only bridge file/IPC — design in GMAIL-002A receipt)
- Owner-visible honest states unchanged for body/draft/send
- NAV-001 shell needs no structural rework

---

## GMAIL-002B — Read-only body gate

**Goal:** Explicit operator/user approval before `gmail.readonly`.

### Allowed (after gate pass)

- Scope escalation workflow with receipt
- Local cache with redaction policy (`gmail-001b-redaction-and-fixture-policy.md`)
- Read-only body display in controlled surface

### Blocked

- Draft write
- Send
- Automatic scope upgrade without receipt + settings gate

---

## GMAIL-002C — Draft write gate

**Goal:** Local draft creation/update via `gmail.compose` **without send**.

### Allowed (after gate pass)

- Create/update drafts in Gmail
- Approval queue linkage (local + provider draft IDs)
- Receipts for draft write attempts and blocks

### Blocked

- Send
- Silent provider mutation

---

## GMAIL-002D — Send gate

**Goal:** Send only after approval, receipts, undo/error handling, and owner proof.

### Allowed (after gate pass)

- `gmail.send` or send-via-compose path per security review
- Approval receipt required per message
- Undo/send-error handling where feasible

### Blocked until proof

- Batch send without per-message approval
- Owner visual proof (UI-003E) still required before merge-ready product claim

---

## Relationship to NAV-001

NAV-001 corrected shell placement for account status and Integrations taxonomy so GMAIL-002A can land without another navigation refactor.

## Non-goals (all GMAIL-002 stages)

- Replacing Thunderbird Android spine (ARCH-002/003)
- Hosted multi-tenant OAuth in static GitHub Pages preview
- Broad mailbox scope (`mail.google.com`)

## Tracking

| Stage | Depends on | Receipt target |
| --- | --- | --- |
| GMAIL-002A | NAV-001 pass | `docs/ui/reviews/gmail-002a-real-gmail-metadata-ingress-receipt.md` |
| GMAIL-002B | GMAIL-002A stable | TBD |
| GMAIL-002C | GMAIL-002B stable | TBD |
| GMAIL-002D | Approval + UI-003E path | TBD |
