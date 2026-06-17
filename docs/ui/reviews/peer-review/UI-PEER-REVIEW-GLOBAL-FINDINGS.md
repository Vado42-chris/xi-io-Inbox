# UI peer review — global findings (all workspaces)

## Date

2026-06-17 · Owner screenshot pass across all primary nav items + Account + Ibal overlays.

## Host mode noted

Screenshots taken on **static preview** (`npm run dev` → `:4488`) with imported metadata snapshot (`hallberg1974@gmail.com`, 25 threads). Not Tauri live sync unless separately recorded.

---

## P0 — Trust and usability (fix before polish claims)

| ID | Finding | Workspaces affected |
| --- | --- | --- |
| G-P0-001 | **Live mail implied but not delivered** — UI shows real email + counts while data is snapshot/import or partial (25 of 12,470). | Mail, Home, header badge |
| G-P0-002 | **Activity table text overlap** — WHAT HAPPENED / SOURCE columns unreadable. | Activity |
| G-P0-003 | **Thread list layout stress** — overlapping sender/subject/snippet rows in Mail list. | Mail |
| G-P0-004 | **Same status repeated 4–7×** — PREVIEW/METADATA/local snapshot in badge, account chip, banners, reading pane, inspector. | All |
| G-P0-005 | **Fixture narratives as product** — GoDaddy attention, family transport, GitHub review fixtures presented as operational objects. | Home, Calendar, Tasks, Ibal |

---

## P1 — Component framework drift

| ID | Element | Expected (UI-013C / tokens) | Actual in screenshots | Workspaces |
| --- | --- | --- | --- | --- |
| G-P1-001 | Chrome radius | `--radius-chrome: 3px` on shell, inputs, nav | Mix of pills, 8–20px cards, glowing nav capsules | All |
| G-P1-002 | Primary button | One primary family, 3px or documented pill set | Gradient glow pills vs flat vs blocked gray | All |
| G-P1-003 | Page title | `--type-display` once per main column | Duplicate titles (lane nav + main + inspector) | All |
| G-P1-004 | Warning surfaces | One setup card, one CTA | Yellow slabs + badge row + inspector gate copy | Mail, Calendar, Tasks, Automations, Account |
| G-P1-005 | Right inspector | Page-specific contextual rail | Same template: Overview, Actions, Ask Ibal, Related, Provider gate, Advanced | All lanes |
| G-P1-006 | Scope lens | Optional; not redundant with account | All accounts / email pills on every lane | Calendar, Tasks, Activity, Mail (scaffold) |
| G-P1-007 | Typography | title → section → meta hierarchy | ALL CAPS labels, meta grids, CLI monospace in user paths | Account, Mail reading pane, Activity detail |
| G-P1-008 | Lane accent vs chrome | Accent for selection only; chrome tokens shared | Lane glow colors OK; chrome (padding/radius) not shared | Calendar, Tasks, Mail |

---

## P1 — Information architecture overload

| ID | Finding | Workspaces |
| --- | --- | --- |
| G-P1-101 | **Four-column permanent layout** — left rail + main + detail + inspector always visible. | Calendar, Tasks, Automations, Activity |
| G-P1-102 | **Duplicate Ask Ibal** — header button + inspector Actions + drawer. | All + Ibal |
| G-P1-103 | **Drafts/Approvals scaffold in Mail nav** — egress proof exposed as primary nav (owner Mail UX addresses partially). | Mail (scaffold mode) |
| G-P1-104 | **Integrations as catalog** — taxonomy + filters + empty detail; not connect-first. | Integrations |
| G-P1-105 | **Automations museum layout** — empty center surrounded by templates/library/inspector. | Automations |
| G-P1-106 | **Activity filter stack** — sidebar + tabs + dropdowns + pill groups before list. | Activity |

---

## P1 — AI-heavy, input-light

| ID | Finding | Workspaces |
| --- | --- | --- |
| G-P1-201 | Inspector **Why now / Limit / Source** blocks dominate over user inputs. | All lanes |
| G-P1-202 | Ibal **proposal cards** duplicated (chat + selected + receipt). | Ibal |
| G-P1-203 | **Blocked buttons** as primary row (Send blocked, Sync blocked, Connect in browser blocked). | Mail, Calendar, Account |
| G-P1-204 | **CLI commands in UI** — terminal strings in Account sync panel. | Account |
| G-P1-205 | Home **Ibal recommendation** in inspector vs user triage actions. | Home |

---

## Fix batching (component-first)

| Batch | Components | Pulls from |
| --- | --- | --- |
| B1 | Shell status — single env line; move detail to Settings | G-P0-004, G-P1-004 |
| B2 | `XiInspectorRail` — collapse default; page-specific content only | G-P1-005, G-P1-201 |
| B3 | `XiSetupGuide` — one card pattern (owner Mail started) | G-P0-001, G-P1-004 |
| B4 | Button/chip token enforcement — 3px chrome set | G-P1-001, G-P1-002 |
| B5 | Owner mode hide scaffold nav sections | owner-vs-scaffold-mode.md |
| B6 | Activity table layout fix | G-P0-002 |
| B7 | Mail reading pane — message view not metadata spec sheet | G-P0-003, G-P1-007 |

---

## Findings log (append-only)

| Date | Reviewer | Notes |
| --- | --- | --- |
| 2026-06-17 | Owner screenshot pass + Cursor capture | Initial global list from full nav walkthrough |
