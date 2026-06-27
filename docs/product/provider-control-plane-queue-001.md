# Provider control plane — slice queue (ledger)

**Updated:** 2026-06-27  
**Ledger event:** `provider.queue.updated`  
**Rule:** Capture-only slices do not authorize implementation until explicitly opened.

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
| PR #12 | Open, draft, **not merge-ready**, head **`dcd2a17`** |
| Branch claim | Read-only Gmail runtime only (`LOCAL-WEB-RUNTIME-001H`) |
| Not complete on PR | egress · 001I · UI-003E · Microsoft/GitHub/Drive/Contacts impl · multi-account IA |
| Local only (unpushed) | Brand stack `521d639` + `2bf632f` + `af0bc61` |

Do **not** update PR #12 / `branch-truth.md` for brand until owner approves push. Prep: `docs/operations/brand-stack-push-prep-notes.md`.

---

## Landed (implementation)

| Slice | SHA / receipt | Scope |
| --- | --- | --- |
| `LOCAL-WEB-RUNTIME-001H` | `ab7ff45` · `docs/ui/reviews/local-web-runtime-001-receipt.md` | **PASS for read-only Gmail runtime only** |
| Capture docs (001H era) | `64c54d3` · `c5fd46c` | IA/desktop/Ibal/provider-architecture/001I specs |

---

## Local pending (not pushed)

| Slice | Commits | Ledger events | Scope |
| --- | --- | --- | --- |
| `BRAND-SHELL-POLISH-002` | `521d639` | `brand.shell.002.pass_pending_owner` | Base visual refresh |
| `BRAND-SHELL-POLISH-002B` | `2bf632f` | `brand.shell.002b.token_enforcement_recorded` | Route token enforcement |
| `BRAND-SHELL-POLISH-002C` | `af0bc61` | `brand.shell.002c.route_audit_recorded` | Route audit + a11y |

**Push blocked** until owner visual review. **001I not started.**

---

## Capture required (this ledger update — no implementation)

| Slice | Doc | Ledger event |
| --- | --- | --- |
| `MAIL-BODY-RENDERER-001` | `docs/product/mail-body-renderer-001.md` | `mail.body_renderer.spec_captured` |
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

### Now

1. **Ledger/spec capture** — this update (complete before more implementation)
2. **Brand stack local** — owner visual review on `:4488` / `:8788`
3. **Do not push** brand until approved

### After brand push (if approved)

4. Update PR #12 + `branch-truth.md` (visual polish only; 001I still not started)
5. **Decision:** does `MAIL-BODY-RENDERER-001` block `001I` reading-pane review?
6. `LOCAL-WEB-RUNTIME-001I` — read-only freshness + notification smoke (**only after brand + decision**)
7. `MAIL-BODY-RENDERER-001` — if required before draft/send or 001I sign-off
8. `GMAIL-DRAFT-EGRESS-001A` — after read-only/event smoke proven
9. `GMAIL-SEND-EGRESS-001A` — send-to-self only, later
10. `MAIL-ACCOUNT-IA-001` — after account/settings/provisioning truth captured
11. `PROVISIONING-ACCOUNT-SETTINGS-001` + `PROFILE-CARD-001` + matrix — settings UI (future)
12. `PROVIDER-ARCHITECTURE-001` — Microsoft mail mapping · GitHub · Contacts/Drive read · etc.

---

## Stop lines (all capture + brand)

- No push of brand stack until owner approval
- No `001I` implementation until brand decision + queue gate
- No OAuth scope changes
- No provider writes · no contact import · no Drive import
- No GitHub / Microsoft implementation
- No notification center implementation
- No HTML renderer implementation unless `MAIL-BODY-RENDERER-001` explicitly opened
- No runtime/provider/egress code changes in ledger-only updates
