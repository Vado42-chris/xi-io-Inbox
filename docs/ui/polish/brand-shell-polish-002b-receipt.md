# BRAND-SHELL-POLISH-002B — route-by-route token enforcement

**Status:** Local commit `2bf632f` — **not pushed**. Owner review **pending**.  
**Ledger event:** `brand.shell.002b.token_enforcement_recorded`  
**Stack role:** **002B = route token enforcement** (route accents, radius scale, gradient/border policy overrides).  
**Follow-up to:** `521d639` (002). Requires **002C** before push.

## Why 002B exists

Owner review: 002 improved direction but **token coverage was incomplete**. UI-013B gradients, per-page accent hacks, inconsistent selected states, border clutter, and arbitrary radii still leaked through page-level CSS. 002B enforces one visual contract across all routes.

```text
If a route needs a color, radius, border, shadow, font, spacing, or selected state, it gets it from a token.
If it cannot get it from a token, the token system is incomplete.
```

## Relationship to 002

| Commit | Role |
| --- | --- |
| `521d639` (002) | Logo, black shell base, Stack A fonts, surface/accent tokens |
| **002B** (this slice) | Route accents, radius scale, border/radius/gradient enforcement |

Do **not** push 002 alone — push **`521d639 + 2bf632f + 002C`** after owner visual review (see `brand-shell-polish-002c-route-audit.md`).

## CSS load order

```html
brand-shell-polish-001.css
brand-shell-polish-002.css
brand-shell-polish-002b.css   ← wins for owner shell enforcement
```

## Route accent tokens

| Route | Token | Lane class |
| --- | --- | --- |
| Home | `--route-home-accent` | `.is-home-lane` |
| Mail | `--route-mail-accent` | `.is-inbox-lane` / `.is-mail-workbench` |
| Calendar | `--route-calendar-accent` | `.is-calendar-lane` |
| Tasks | `--route-tasks-accent` | `.is-tasks-lane` |
| Automations | `--route-automations-accent` | `.is-automations-lane` |
| Activity | `--route-activity-accent` | `.is-receipts-lane` |
| Integrations | `--route-integrations-accent` | `.is-extensions-lane` |

Active route derives: `--route-accent`, `--route-accent-soft`, `--route-accent-border`, `--route-accent-bg`, `--route-accent-text`.

## Radius scale

`--radius-none` · `--radius-xs` · `--radius-sm` · `--radius-md` · `--radius-lg` · `--radius-xl` · `--radius-pill`

## Gradient policy

- **Forbidden** in brand CSS files (001/002/002b)
- **Neutralized** on owner shell via 002b overrides of UI-013B page styles
- Selected/active states use **solid** `--route-accent` indicators only

## Route audit (implementation)

| Region | Result |
| --- | --- |
| Header / global shell | Flat `--color-bg-shell`; gradients removed |
| Mail | Mail accent; flat panels; thread selected uses `--route-accent` |
| Home | Home accent; stat/priority cards flat, no gradient wash |
| Calendar | Calendar accent; flat month/agenda; selected day ring |
| Tasks | Tasks accent; flat planning grid; selected rows use accent bar |
| Automations | Automations accent; owner workspace flat |
| Activity | Activity accent; entry cards flat, selected inset bar |
| Integrations | Integrations accent; related/provider cards flat |
| Left rail / context nav | Selected = inset bar + `--route-accent-bg` |
| Right rail / cards | Border reduced; left accent bar on related cards |
| Inputs / buttons | Radius tokens; primary uses route accent underline |
| Typography | Display / UI / body / mono roles enforced per hierarchy |

## Validation

```bash
npm run check:brand002   # includes 002B enforcement rules
npm run check:quick
npm run check:route
npm run check
npm run check:localwebruntime001
```

Preview: `npm run dev` → `:4488` or `npm run local:web` → `:8788` (hard refresh).

## Stop lines

- No runtime/provider/OAuth/egress/001I changes
- No push without owner approval
- Motion-system WIP remains out of scope
