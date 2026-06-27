# MAIL-BODY-RENDERER-001C — sender render policy toggles

**Status:** **Capture only** — **implementation not started** (2026-06-19 owner direction)  
**Ledger event:** `mail.body_renderer.001c.spec_captured`  
**Parent:** `MAIL-BODY-RENDERER-001B` (`ed6fe26` · `e688e81`, local, owner PASS, **not pushed**)  
**Blocks:** nothing until owner explicitly approves 001C implementation  
**Related:** `docs/architecture/provider-settings-matrix-001.md` · `docs/product/provider-control-plane-queue-001.md`

## Owner direction (point of order)

Use the **existing render summary strip** between sender details and message content. **Do not** create a large separate settings panel.

The current badges:

- Sanitized HTML
- Remote images blocked
- Tracking resources blocked
- Style content stripped

should become **user-facing render policy toggles** where appropriate — not passive status pills.

**Visual:** square-edged toggle chips with a small check indicator — **not** rounded pill badges and **not** normal checkbox styling. Preserve the clean mail-client / black-shell look while giving the user agency.

**Ordering:** Capture now. **Do not implement** until owner explicitly approves 001C. **Do not implement before Ibal** unless static choices block runtime work. `001B` fixed readability; `001C` is the next refinement: user agency and remembered sender policies.

## Purpose

Give the user direct control over what is rendered for this sender/message, while keeping safe defaults.

## UI placement

| Rule | Detail |
| --- | --- |
| Surface | Existing render summary area **above** the message body (between sender block and body) |
| Context | Tied to the exact sender/message being viewed |
| Avoid | Giant settings panel · account-settings relocation in first pass |

## Visual rules

- No rounded pill badges for policy controls
- Square / low-radius toggle chips consistent with black-shell design
- Text remains readable
- Active/inactive state must be obvious (check indicator on active chip)
- Do not move controls to account settings in 001C first pass

## Controls (001C)

| Control | Default | Toggle? | Notes |
| --- | --- | --- | --- |
| **Sanitized HTML** | on when safe | yes | checked = show sanitized HTML when safe; unchecked = prefer plain text for this sender/message |
| **Remote images** | blocked | yes | unchecked by default; checked = allow remote images per selected scope |
| **Tracking resources** | blocked | **locked** | **Not a normal checkbox in 001C.** Show locked status + explanation |
| **Style/layout** | strip unsafe | maybe | safe-only by default; checked = allow safe style/layout for sender — never scripts/events/forms |
| **Inline images (CID)** | render safe | yes | safe local CID only; remote images remain separate control |

### Tracking resources — locked privacy rule (owner recommendation)

Do **not** expose tracking pixels as a normal user checkbox in 001C.

```text
Tracking resources blocked 🔒
Tracking pixels stay blocked for privacy.
```

Rationale: avoids accidentally teaching the app to enable surveillance. A future **high-risk override gate** may be defined separately — not in 001C.

## Interaction — scope modal

When the user toggles an actionable control, show a modal:

**Title:** Apply rendering preference?

**Options:**

- This message only
- All messages from this sender
- All messages from this domain

**Additional checkbox:** Remember this selection

**Buttons:** Apply · Cancel

When disabling a previously allowed policy, ask the same scope question (message / sender / domain).

## Sender identity (already known)

Derive from selected message metadata:

```text
senderEmail = notifications-noreply@linkedin.com
senderDomain = linkedin.com
```

No new provider fetch required for 001C scope prompts.

## Policy scope (capture)

| Scope | 001C required? |
| --- | --- |
| `message` | yes |
| `sender` (email) | yes |
| `domain` | capture in modal; implement if easy |
| `account` default | later |
| `global` default | later |

Initial implementation **may** support message + sender email only; domain/account/global captured in spec.

## Policy object (local store)

```json
{
  "scope": "message | sender | domain",
  "provider": "gmail",
  "accountId": "...",
  "senderEmail": "...",
  "senderDomain": "...",
  "renderMode": "auto_safe | plain_text | sanitized_html",
  "remoteImages": "block | allow_once | allow_sender | allow_domain",
  "trackingPixels": "block",
  "styles": "strip_unsafe | safe_allowlist | prefer_plain_text",
  "inlineCidImages": "render_safe | block",
  "updatedAt": "...",
  "receiptRef": "..."
}
```

## Policy behavior

- User allows remote images for sender → apply to future messages from that sender (when scope = sender)
- User unchecks → prompt scope for disable (message / sender / domain)
- Changes must be **reversible**
- Remote images load **only** after explicit user policy — never by default
- Tracking pixels remain blocked unless future high-risk gate approved

## Safety (non-negotiable)

- No scripts
- No event handlers
- No unsafe iframes/forms
- No auto-open/download attachments
- No Gmail/provider mutation
- No OAuth scope changes in 001C
- Provider writes remain blocked

## Ledger events (local)

| Event | When |
| --- | --- |
| `mail.render_policy.changed` | Any policy field change |
| `mail.render_policy.sender_allowed` | Sender-scoped allow (e.g. remote images) |
| `mail.render_policy.sender_blocked` | Sender-scoped revert to block |
| `mail.render_policy.message_override` | One-message override |
| `mail.render_policy.reset` | Clear policy for scope |

Each change should include `receiptRef`, `senderEmail`, `scope`, and diff of effective policy.

## Acceptance (001C)

1. Render summary strip becomes actionable without clutter
2. Toggle chips are square/low-radius — not pill-rounded
3. User can toggle HTML/plain preference
4. User can allow/block remote images for message or sender
5. Tracking resources stay blocked or locked — not a normal checkbox
6. Modal asks scope: message / sender / domain
7. Sender policy persists locally
8. Future messages from same sender use stored policy
9. User can reverse the choice
10. Ledger event records policy change
11. Provider writes remain blocked
12. No OAuth changes
13. `001I` not started

## Expected files (when implementation opens)

```text
docs/product/mail-body-renderer-001c-render-policy.md     (this file)
public/inbox-preview.js                                   (toggle chips + modal)
public/mail-body-renderer-001a.css or 001c CSS            (chip styles)
public/src/runtime/mail-render-policy-store.js            (local persistence — target path)
tools/gmail/lib/html-sanitize.js                          (apply policy at render time)
server/mail-render-policy.mjs                             (optional local API)
scripts/mail-body-renderer-001c-model-check.mjs
tools/gmail/test/mail-body-renderer-001c.mjs
docs/ui/reviews/mail-body-renderer-001c-receipt.md
```

## Stop lines

- **Do not implement** until owner explicitly approves 001C implementation
- Do not implement before `IBAL-RUNTIME-001A` unless owner reorders
- Do not push `001B` commits as part of 001C capture
- Do not enable tracking pixel toggle in 001C
- Do not open `LOCAL-WEB-RUNTIME-001I`

## Decision token (owner only — when implementation PASS)

```text
MAIL_BODY_RENDERER_001C_PASS_READY_FOR_SENDER_POLICY_PERSISTENCE
```
