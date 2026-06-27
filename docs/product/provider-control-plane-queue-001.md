# Provider control plane — slice queue (ledger)

**Updated:** 2026-06-19 (renderer-only branch · 001B owner PASS · 001C capture)  
**Ledger event:** `provider.queue.updated` · `mail.body_renderer.001c.spec_captured`  
**Rule:** Capture-only slices do not authorize implementation until explicitly opened.

## Renderer-only branch note

This branch (`ui-002/mail-body-renderer-001b-clean`) carries **mail body renderer work only** — not 002D/brand/Ibal surface/boot/view-mode commits. See `docs/ui/reviews/mail-body-renderer-001b-receipt.md`.

| Layer | State |
| --- | --- |
| `MAIL-BODY-RENDERER-001A` | Landed on branch — superseded by 001B for owner purposes |
| `MAIL-BODY-RENDERER-001B` | **Owner PASS** — push pending owner approval |
| `MAIL-BODY-RENDERER-001C` | **Capture only** — sender render policy toggles |
| `IBAL-RUNTIME-001A` | **Next impl** after renderer push approval |
| `LOCAL-WEB-RUNTIME-001I` | **Blocked** |

## Product scope (ledger note)

Scope has expanded beyond mail runtime to include **capture-only** specs for:

- Provider provisioning and account settings
- Profile identity (header profile card)
- Contacts / Drive / file library / attachments bridges
- Notification event feed (not toasts alone)
- Safe HTML/MIME mail rendering
- Cross-provider account/capability truth
- Reusable xi-io framework components

**No implementation** for these areas until each slice is explicitly opened.

## Core provisioning rule

```text
Every visible action must map to a capability.
Every capability must map to a scope/policy.
Every scope/policy must map to a user-facing setting.
Every setting/action change must produce a ledger event or receipt.
```

## GitHub truth (do not misrepresent)

| Surface | State |
| --- | --- |
| PR #12 | Open, draft, **not merge-ready**, base **`9c8e698`** |
| Renderer-only branch | `ui-002/mail-body-renderer-001b-clean` — **not pushed** until owner approves |
| Owner mail body review | **001B PASS** (Todoist browser + Walmart proof) · **001C capture only** |
| Not complete on PR | egress · 001I · UI-003E · Microsoft/GitHub/Drive/Contacts impl · multi-account IA |

---

## Landed (implementation)

| Slice | SHA / receipt | Scope |
| --- | --- | --- |
| `LOCAL-WEB-RUNTIME-001H` | `ab7ff45` · `docs/ui/reviews/local-web-runtime-001-receipt.md` | **PASS for read-only Gmail runtime only** |
| `MAIL-BODY-RENDERER-001B` | clean branch · `docs/ui/reviews/mail-body-renderer-001b-receipt.md` | Readable resource-aware rendering — **owner PASS** |

---

## Capture required (no implementation)

| Slice | Doc | Ledger event |
| --- | --- | --- |
| `MAIL-BODY-RENDERER-001` | `docs/product/mail-body-renderer-001.md` | `mail.body_renderer.spec_captured` |
| `MAIL-BODY-RENDERER-001B` | `docs/product/mail-body-renderer-001b.md` | `mail.body_renderer.001b.owner_pass` |
| `MAIL-BODY-RENDERER-001C` | `docs/product/mail-body-renderer-001c-render-policy.md` | `mail.body_renderer.001c.spec_captured` |
| `PROVISIONING-ACCOUNT-SETTINGS-001` | `docs/product/provisioning-account-settings-001.md` | `provisioning.account_settings.spec_captured` |
| `PROFILE-CARD-001` | `docs/product/profile-card-001.md` | `profile.card.spec_captured` |
| `PROVIDER-SETTINGS-MATRIX-001` | `docs/architecture/provider-settings-matrix-001.md` | `provider.settings_matrix.spec_captured` |
| `EVENT-NOTIFICATIONS-001` | `docs/product/notification-event-feed-001.md` | `notification.feed.spec_updated` |
| `CONTACT-FILE-IDENTITY-BRIDGE-001` | `docs/architecture/contact-file-identity-bridge-001.md` | `contact_file_identity_bridge.spec_updated` |

### Prior capture docs (still valid)

| Slice | Doc |
| --- | --- |
| `PROVIDER-CONTROL-PLANE-001` | `docs/architecture/provider-control-plane-001.md` |
| `PROVIDER-ARCHITECTURE-001` | `docs/architecture/provider-architecture-001.md` |
| `ACCOUNT-LINKING-AUTOMATION-HUB-001` | `docs/product/account-linking-automation-hub-001.md` |
| `MAIL-ACCOUNT-IA-001` | `docs/product/mail-account-ia-001.md` |
| `LOCAL-WEB-RUNTIME-001I` | `docs/product/local-web-runtime-001i-read-only-freshness-smoke.md` |

---

## Queue (implementation order — owner-locked)

### After renderer push approval

1. **`IBAL-RUNTIME-001A`** — real Ask Ibal (**next implementation**)
2. **`MAIL-BODY-RENDERER-001C`** — capture only; implement after owner approves (refinement, not blocker for Ibal)
3. **`LOCAL-WEB-RUNTIME-001I`** — only after boot/refresh decision (separate branch)
4. **`GMAIL-DRAFT-EGRESS-001A`** — after read-only/event smoke proven

---

## Stop lines

- No push until owner approves renderer-only branch
- No `MAIL-BODY-RENDERER-001C` implementation until owner explicitly approves slice
- No tracking pixel user toggle in 001C (locked privacy status only)
- No `001I` implementation on this branch
- No OAuth scope changes
- No provider writes · no contact import · no Drive import
- No GitHub / Microsoft implementation
- No 002D/brand/Ibal surface/boot/view-mode commits on renderer-only push
