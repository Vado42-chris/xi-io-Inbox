# PROFILE-CARD-001 — top-right header account/profile card

**Status:** Capture only — **implementation not started**.  
**Ledger event:** `profile.card.spec_captured`  
**Parent:** `docs/product/provisioning-account-settings-001.md`

## Purpose

Standardize the **top-right header profile card** as the global xi-io session identity surface — distinct from per-provider mail account cards.

## Must show (capture)

| Element | Source |
| --- | --- |
| Current xi-io user identity | Local session / operator profile |
| Avatar or monogram | Local or provider avatar when linked (labeled) |
| Signed-in display name / email | Primary session label |
| Local profile status | e.g. operator mode, owner review mode |
| Connected provider count | Aggregated from control plane (no secrets) |
| Current runtime mode | `:4488` scaffold · `:8788` local web · Tauri connected |

## Quick links (capture)

| Link | Target |
| --- | --- |
| Account settings | Full settings hub → session + defaults |
| Provider connections | Connected accounts / linking hub |
| Security & privacy | Scopes, tokens status, retention |
| Notifications | Feed + toast preferences |
| Local storage | Cache paths policy summary (no secret paths) |
| Sign out / disconnect | Per-provider disconnect where applicable |

## UX rules

- **No provider-specific confusion** in the global profile dropdown (no “this is Gmail” as if it were the only identity).
- Mail account switcher lives in **Mail IA**, not the global profile card.
- Blocked capabilities link to settings matrix explanation, not silent disable.

## Framework component (capture)

- `ProfileCardTrigger` — header control
- `ProfileCardPanel` — dropdown / drawer
- `ProfileStatusRow`
- `ProfileQuickLinkList`
- `RuntimeModeBadge`

## Stop lines

- No profile drawer implementation until provisioning slice opened
- No OAuth changes
- No merge with Ibal concierge drawer without explicit IA receipt

## Ledger

- Spec captured: `profile.card.spec_captured`
