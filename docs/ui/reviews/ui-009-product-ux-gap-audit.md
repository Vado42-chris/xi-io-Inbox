# UI-009 Product UX Gap Audit

## Date

2026-06-10

## Owner verdict

```text
UI_003E_FAIL_PRODUCT_UX_NOT_USER_FACING
```

The static preview still reads as a **developer audit shell**, not a product users would adopt. UI-008 incorrectly interpreted “account settings” as **preview fixture provisioning** instead of **real multi-account connection UX**.

## Root cause

| Mistake | What we built | What users expect |
| --- | --- | --- |
| Account UX | Seeded “Personal Gmail preview” fixtures + local rename form | Add real email accounts (Gmail, etc.), test connection, see sync state |
| Lane pages | Governance cards with `GATED`, `preview only`, fixture labels | Familiar surfaces: inbox, month/week calendar, task board, automation rules |
| Receipts | Audit taxonomy for agents | Understandable activity history with filters and actions |
| Tasks | Flat status chips | Sprint/board views, related tasks from mail, assignees, due dates |
| Trust chrome | “Draft-only egress”, “Runtime undecided” always visible | Safety info in help/trust panel, not primary chrome |

## Hard boundary (not an excuse for fake UX)

**Real Gmail connect, sync, send, and calendar write cannot work in Tier 1 static preview.** That requires provider runtime (ARCH-004, OAuth, credentials boundary, adapter implementation).

**Still our failure:** showing fake connected accounts and “preview” forms **implies** capability we do not have. Correct Tier-1 UX is:

1. Empty account list until user adds one
2. “Add email account” wizard (address → provider → Connect)
3. Honest blocked state: “Provider runtime not enabled in this build” with what’s missing
4. **No** pre-seeded “Personal Gmail preview” in user-facing account UI

## Page-by-page gap

| Page | User expectation | Current state | Tier-1 fix | Requires runtime |
| --- | --- | --- | --- | --- |
| User card / accounts | Identity + N real accounts, add/remove, connection status | Fixture accounts, preview labels, session form noise | Real wizard shell, empty default, connection status grammar | OAuth, IMAP/API sync |
| Mail | Modern inbox: folders, threads, reading, compose | Improved but still fixture-heavy, jargon in body | Thread styling, hide fixture copy in reading pane, unified folders | Live mail fetch |
| Calendar | Month/week/day grid, events on dates | Vertical fixture list | Grid UI with fixture events placed on dates | Provider calendar |
| Tasks | Board/list, sprints, related mail tasks | Chip list, no relations | Import sprint/board layout from reference system; show `sourceRef` links | Task provider write |
| Automations | Rules: trigger → action, enable/disable | Template cards only | Rule builder UI (disabled run) | Automation runtime |
| Extensions | Install/connect integrations | Provider blocked list | Marketplace-style cards + connect CTA (blocked) | Provider adapters |
| Activity (Receipts) | “What happened?” filterable history | Agent audit taxonomy | Rename user-facing label; filter by type/account; drill-down | Live action stream |
| Settings | User prefs + accounts + privacy | Gates/policies engineering panel | Split: **User settings** vs **Advanced / Provider** (collapsed) | Policy apply |

## Receipts — purpose and naming

Per `docs/product/invariants.md`, **Receipts are not server logs**. They are **audit records for confirmed or attempted actions** (draft saved, proposal created, send blocked, gate changed).

User-facing recommendation:

- **Nav label:** `Activity` (subtitle: audit trail)
- **User can:** filter by account/action type, open source thread/draft, export packet, see why something was blocked
- **Not:** raw dev logs, CI receipts, or commit SHAs in primary view (move to Advanced → Build evidence)

## Competitive baseline

Users will not switch from Gmail/Outlook/Spark/Fantastical without:

1. **Baseline parity:** real accounts, readable mail, calendar grid, task list
2. **Trust without jargon:** safety visible but not dominant
3. **Differentiators on top:** draft-first egress, Ibal proposals, audit activity — only after baseline feels real

Current preview delivers (3) before (1) and exposes (2) as primary chrome.

## UI-009 execution slices (forward work)

| Slice | Scope | Passes est. |
| --- | --- | --- |
| UI-009A | Remove fixture accounts from user UI; real Add Account wizard shell; user card identity | 1 |
| UI-009B | Calendar month-grid shell (fixture events on dates) | 1 |
| UI-009C | Tasks board/sprint layout + mail `sourceRef` links | 1–2 |
| UI-009D | Activity rename + user-facing ledger filters | 1 |
| UI-009E | Settings split: User vs Advanced; demote gate jargon | 1 |
| UI-009F | Mail reading polish v2; hide fixture vocabulary in primary pane | 1 |
| UI-010+ | Provider runtime (Gmail connect proof) | ARCH-004 / Pass 4 |

**Total before credible owner re-review:** ~5–7 agent passes (Tier-1 product shell only) + provider runtime track separate.

## Stop / start

**Stop:** seeding fake Gmail accounts; “preview” account CRUD; developer status as primary nav labels; claiming UI-008 addressed account UX.

**Start:** product-facing shells with honest empty/connect states; reference sprint/board patterns for Tasks; calendar grid; Activity naming; user settings first.

## Owner decision block

```text
UI_003E_FAIL_<reason>
```

Do not mark visual proof complete. PR #12 remains draft.
