# Provider control plane — slice queue (ledger)

**Updated:** 2026-06-27  
**Rule:** Capture-only slices do not authorize implementation until explicitly opened.

## Landed

| Slice | SHA / receipt | Scope |
| --- | --- | --- |
| `LOCAL-WEB-RUNTIME-001H` | `ab7ff45` · `docs/ui/reviews/local-web-runtime-001-receipt.md` | Read-only Gmail runtime only |
| Capture docs (001H era) | `64c54d3` | IA/desktop/Ibal/provider-architecture/001I specs |

## Capture only (this update)

| Slice | Doc |
| --- | --- |
| `PROVIDER-CONTROL-PLANE-001` | `docs/architecture/provider-control-plane-001.md` |
| `ACCOUNT-LINKING-AUTOMATION-HUB-001` | `docs/product/account-linking-automation-hub-001.md` |
| `CONTACT-FILE-IDENTITY-BRIDGE-001` | `docs/architecture/contact-file-identity-bridge-001.md` |
| `NOTIFICATION-EVENT-FEED-001` | `docs/product/notification-event-feed-001.md` (`EVENT-NOTIFICATIONS-001`) |

## Queue (implementation order)

1. Branch hygiene — finalize uncommitted WIP separation; no push until clean  
2. `LOCAL-WEB-RUNTIME-001I` — read-only freshness + notification smoke  
3. `GMAIL-DRAFT-EGRESS-001A` — draft-only  
4. `GMAIL-SEND-EGRESS-001A` — send-to-self  
5. `MAIL-ACCOUNT-IA-001` — All Inboxes / accordions / resizable rail  
6. `PROVIDER-ARCHITECTURE-001` + `PROVIDER-CONTROL-PLANE-001` — Microsoft mail mapping  
7. GitHub workspace · Google Contacts/Drive read · Slack/Dropbox · socials v2  

## Stop lines (all capture slices)

No new OAuth scopes · no provider writes · no Contacts/Drive/GitHub/Microsoft implementation · no automations mutating providers · no push until branch hygiene confirmed.
