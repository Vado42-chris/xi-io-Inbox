# BRAND-SHELL-POLISH-002C — route audit and accessibility enforcement

**Status:** Local commit `af0bc61` — **not pushed**. Owner visual review **pending**.  
**Ledger event:** `brand.shell.002c.route_audit_recorded`  
**Stack role:** **002C = route audit + accessibility enforcement** (composite tokens, WCAG static checks, focus/disabled/selected affordances, route audit matrix).  
**Final brand-stack gate before push.**

## Owner question: did we miss anything?

**Yes — partially.** 002B fixed route-token drift via CSS override enforcement, but that architecture is not yet a canonical design-system inventory. 002C adds:

1. Composite token vocabulary (surface, border, shadow, interaction states)
2. Static WCAG contrast checks on token pairs
3. Tokenized `:focus-visible` and disabled states
4. Selected-state affordance beyond color alone (inset bar + weight)
5. Route-by-route audit receipt with PASS matrix

**Do not solve drift by adding override CSS forever.** If route-specific overrides remain unsustainable, capture **DESIGN-SYSTEM-EXTRACTION-001** (future):

- Move tokens into a canonical token file / JSON source
- Route components consume token names only
- Model checks fail on local color/radius/border hacks
- Generate CSS from design-token source (W3C Design Tokens Format)

Override layers (001→002→002B→002C) are acceptable on this branch for stabilization; extraction is the long-term xi-io framework path.

## PR / branch truth

| Surface | State |
| --- | --- |
| GitHub PR #12 | Open, draft, not mergeable, head `dcd2a17` (pre-brand) |
| Local brand commits | `521d639`, `2bf632f`, 002C — **not on remote** |
| PR body update | **Deferred** until owner approves push of full 002 stack |

## CSS load order

```html
brand-shell-polish-001.css
brand-shell-polish-002.css
brand-shell-polish-002b.css
brand-shell-polish-002c.css   ← accessibility + composite tokens
```

## Token inventory (002 + 002B + 002C)

| Category | Tokens |
| --- | --- |
| Background | `--color-bg-root`, `--token-bg` |
| Surface / panel | `--token-surface`, `--token-panel`, `--token-panel-raised` |
| Border | `--token-border`, `--token-border-strong`, `--color-border-subtle` |
| Shadow | `--token-shadow`, `--token-shadow-elevated`, `--shadow-panel` |
| Radius | `--radius-none` … `--radius-pill` |
| Spacing | `--space-page-gutter`, `--space-card-padding`, `--space-section-gap` |
| Typography | `--font-display`, `--font-ui`, `--font-body`, `--font-mono` |
| Route accent | `--route-*-accent`, `--route-accent`, derived soft/border/bg/text |
| Selected | `--state-selected-bg`, `--state-selected-indicator`, `--state-selected-border` |
| Hover | `--state-hover-bg`, `--hover-bg` |
| Focus | `--focus-ring-width`, `--focus-ring-offset`, `--focus-ring-color` |
| Disabled | `--state-disabled-text`, `--state-disabled-bg` |
| Semantic | `--state-success`, `--state-warn`, `--state-danger`, `--state-info` |

## Accessibility checklist (automated + static)

| Check | Method | Result |
| --- | --- | --- |
| Text primary contrast on panel | Static ratio ≥ 4.5:1 | PASS |
| Text secondary contrast on panel | Static ratio ≥ 4.5:1 | PASS |
| Text muted contrast on panel | Static ratio ≥ 4.5:1 (002C bumps to 0.62 alpha) | PASS |
| Focus ring contrast on panel | Non-text ≥ 3:1 | PASS |
| Route accent indicator contrast | Non-text ≥ 3:1 | PASS |
| Border-strong contrast | Non-text ≥ 3:1 | PASS |
| `:focus-visible` tokenized | 002c CSS + model check | PASS |
| Keyboard focus path | `:focus-visible` on nav, rows, inputs, buttons | PASS |
| Selected not color-alone | Inset bar + font-weight + nav underline | PASS |
| Reduced motion | `@media (prefers-reduced-motion: reduce)` | PASS |
| High contrast mode | `@media (prefers-contrast: more)` token bump | PASS |
| External fonts | Self-hosted woff2 only | PASS |
| Logo asset | `public/assets/brand/xi-io-inbox-logo.png` | PASS |

Manual owner review still required for pixel-level calm and density on `:4488` / `:8788`.

## Gradient policy

| Use | Status |
| --- | --- |
| Selected state | **Forbidden** — PASS (002B neutralized) |
| Active nav | **Forbidden** — PASS (underline only) |
| Route identity | **Forbidden** — PASS (solid `--route-*-accent`) |
| Shell background wash | **Forbidden** — PASS |
| Unread/active dots | **Forbidden** — PASS (solid accent) |
| Container depth | Only via named tokens — **none in brand CSS** (flat policy) |

## Route audit matrix

| Region | Token coverage | A11y | Gradient | Radius | Border | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Home | PASS | PASS | PASS | PASS | PASS | PASS |
| Mail | PASS | PASS | PASS | PASS | PASS | PASS |
| Calendar | PASS | PASS | PASS | PASS | PASS | PASS |
| Tasks | PASS | PASS | PASS | PASS | PASS | PASS |
| Automations | PASS | PASS | PASS | PASS | PASS | PASS |
| Activity | PASS | PASS | PASS | PASS | PASS | PASS |
| Integrations | PASS | PASS | PASS | PASS | PASS | PASS |
| Shared header | PASS | PASS | PASS | PASS | PASS | PASS |
| Shared left rail | PASS | PASS | PASS | PASS | PASS | PASS |
| Shared right rail | PASS | PASS | PASS | PASS | PASS | PASS |
| Inputs / search | PASS | PASS | PASS | PASS | PASS | PASS |
| Buttons / chips / action links | PASS | PASS | PASS | PASS | PASS | PASS |
| Cards / detail panes | PASS | PASS | PASS | PASS | PASS | PASS |
| Disclosure rows | PASS | PASS | PASS | PASS | PASS | PASS |
| List rows / tables | PASS | PASS | PASS | PASS | PASS | PASS |

### Route notes

- **Mail:** Live proof route on `:8788`; thread selected = inset `--route-mail-accent` bar; body typography stays Inter Regular (not display ultralight).
- **Home / Calendar / Tasks / Automations:** Scaffold cards flat; route accent via lane class mapping in 002B.
- **Activity:** Dense ledger rows; selected uses inset bar, not gradient glow.
- **Integrations:** Provider/related cards use left accent bar, reduced border stacking.

## Validation

```bash
npm run check:brand002      # 002 + 002B + 002C
npm run check:quick
npm run check:route
npm run check:localwebruntime001
npm run check
```

## Stop lines

- No runtime/provider/OAuth/egress/001I changes in brand stack
- **Do not push** `521d639` / `2bf632f` / 002C until owner visual review passes
- Update PR #12 / `branch-truth.md` **only after** approved push

## Push sequence (owner-locked)

```text
1. Owner visual review (:4488 + :8788 Mail)
2. Push 521d639 + 2bf632f + 002C together
3. Update PR body + branch-truth for BRAND-SHELL-POLISH-002 stack
4. Open LOCAL-WEB-RUNTIME-001I
```
