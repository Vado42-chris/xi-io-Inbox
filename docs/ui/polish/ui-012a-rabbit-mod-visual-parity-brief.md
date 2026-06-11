# UI-012A Rabbit_mod Visual Parity Brief

## Status

```text
Structure: LOCKED (Inbox governance)
Content: PARTIAL — awaiting Rabbit_mod peer review (ChatGPT / owner)
Implementation: BLOCKED until UI-011I complete
```

## Purpose

Capture **visual and interaction polish targets** from [`xi-io-Rabbit_mod`](https://github.com/Vado42-chris/xi-io-Rabbit_mod) for xi-io Inbox **without** implementing CSS/icons in this pass.

Parent governance: `ui-012-visual-polish-governance.md`

## Comparison scope

| In scope | Out of scope |
| --- | --- |
| Color, type, spacing, icons | Rabbit device adapter / runtime |
| Nav density, list rows, panes | OAuth, Gmail, provider connect |
| Empty/loading/focus states | Send, archive, delete mutations |
| Icon vs text rules | Copying Rabbit pages 1:1 into Inbox lanes |

## Rabbit_mod assets to review

Auditors should inspect on GitHub or local clone:

| Path | Review for |
| --- | --- |
| `public/style.css` | Tokens, variables, base typography |
| `public/index.html` | Shell landmarks, meta, font loading |
| `public/pages/` | Page-level layout patterns |
| `public/device/` | **Reference only** — do not port to Inbox Tier 1 |
| `public/app.js`, `router.js` | IA patterns, not runtime behavior |

## Inbox baseline (post UI-011B)

Current Inbox static preview:

- `public/inbox-preview.css` — monolithic styles
- `public/inbox-preview.js` — shell + lanes
- Mail baseline nav: folders, labels, search (fixture-backed)

Gap hypothesis (to verify in peer review):

- Inbox lacks unified **design token layer** (Rabbit likely centralizes in `style.css`)
- Inbox **icon system** minimal or absent
- Inbox **list/reading density** below Rabbit mail-like surfaces
- Inbox **page rhythm** (padding, section headers) less refined

## Parity checklist (fill during audit)

Score each: **match / partial / gap / n/a**

### Global shell

| ID | Target | Rabbit evidence | Inbox evidence | Score | Notes |
| --- | --- | --- | --- | --- | --- |
| VIS-001 | Primary/accent colors | TBD | `--accent` in inbox-preview.css | partial | |
| VIS-002 | Typography scale | TBD | system stack | partial | |
| VIS-003 | Spacing grid (4/8px) | TBD | mixed rem | partial | |
| VIS-004 | Focus visible | TBD | partial focus styles | partial | |
| VIS-005 | Icon set + size rules | TBD | mostly text buttons | gap | |

### Mail (priority)

| ID | Target | Rabbit evidence | Inbox evidence | Score | Notes |
| --- | --- | --- | --- | --- | --- |
| VIS-MAIL-001 | Thread list row height/density | TBD | UI-011B list pane | partial | |
| VIS-MAIL-002 | Unread visual weight | TBD | `.is-unread` | partial | |
| VIS-MAIL-003 | Folder/nav iconography | TBD | text-only nav | gap | |
| VIS-MAIL-004 | Reading pane hierarchy | TBD | mail-reading-pane | partial | |
| VIS-MAIL-005 | Compose sheet polish | TBD | compose sheet | partial | |

### Other lanes (after Mail)

| ID | Lane | Score | Notes |
| --- | --- | --- | --- |
| VIS-CAL-001 | Calendar grid | gap | UI-011D capability first |
| VIS-TASK-001 | Kanban/board | partial | |
| VIS-AUTO-001 | Rule builder | gap | |
| VIS-EXT-001 | Marketplace cards | partial | UI-010D |

## Promotion to framework (`xi-io.net#239`)

When UI-012B+ proves a pattern, add candidates to `16-white-label-framework-feedback-plan.md`:

- XiVisualTokens
- XiIconGrammar
- XiMailListRow
- XiNavDensity

No `#239` comment required for UI-012A docs-only lock.

## UI-012B+ implementation order (when unblocked)

1. Tokens + typography (shell)
2. Mail list + reading (highest user visibility)
3. Calendar + Tasks
4. Automations + Integrations + Activity + Settings
5. Visual QA receipt (UI-012F)

## Acceptance for UI-012A complete

- [ ] All VIS-* rows scored with evidence links or file paths
- [ ] Top 10 visual gaps listed with priority
- [ ] Explicit “do not port from Rabbit” list confirmed
- [ ] UI-012B scope estimate (passes) recorded
- [ ] No product code changed in UI-012A

## Decision value (when audit complete)

```text
UI_012A_PASS_VISUAL_PARITY_BRIEF_READY
```

Until audit completes:

```text
UI_012A_PARTIAL_AWAITING_RABBIT_PEER_REVIEW
```
