# BRAND-SHELL-POLISH-002 — black-shell visual system refresh

**Status:** Local commit `521d639` — **not pushed**. Owner visual review **pending**.  
**Ledger event:** `brand.shell.002.pass_pending_owner`  
**Stack role:** **002 = base visual refresh** (logo, black shell, Stack A typography, surface tokens).  
**Visual-system slice only** — not runtime, provider, or egress work.  
**Blocks:** `LOCAL-WEB-RUNTIME-001I` until brand stack approved and pushed.

## Stack (local only)

| Slice | Commit | Role |
| --- | --- | --- |
| 002 | `521d639` | Base visual refresh |
| 002B | `2bf632f` | Route token enforcement — `brand.shell.002b.token_enforcement_recorded` |
| 002C | `af0bc61` | Route audit + accessibility — `brand.shell.002c.route_audit_recorded` |

**Push blocked** until owner approves full stack. See `docs/operations/brand-stack-push-prep-notes.md`.

## GitHub / PR truth (2026-06)

| Surface | State |
| --- | --- |
| PR #12 | Open, draft, **not merge-ready**, head **`dcd2a17`** (pre-brand) |
| Local brand commits | **Not on remote** |
| 001I | **Not started** |
| Runtime/provider/egress | **Unchanged** by brand stack |

PR #12 correctly states read-only Gmail runtime only; egress, 001I, UI-003E, Microsoft/GitHub/Drive/Contacts, multi-account IA **not complete**.

## Goal

Quiet black shell so content carries detail. Blue is accent only (logo envelope blue), not background wash.

```text
Let the content carry the detail.
Let the shell get quieter.
Use blue only where attention is needed.
```

## Logo

| | Path |
| --- | --- |
| Owner drop | `_incoming/xi-io_inbox_logo_v2.png` |
| Served | `public/assets/brand/xi-io-inbox-logo.png` |
| Sampled accent | `#026bfa` → `--color-accent-blue` |

## Typography (Stack A)

| Role | Font |
| --- | --- |
| Display / H1 | Oswald Light (300) |
| UI / buttons / nav | Inter SemiBold (600) |
| Body / content | Inter Regular (400) |
| Technical / mono | JetBrains Mono |

Rules: no ultralight body; explicit roles; antialiased rendering; **self-hosted latin woff2** under `public/assets/fonts/` (no Google Fonts CDN — route smoke policy).

## Surface tokens

See `public/brand-shell-polish-002.css` — `--color-bg-root`, `--color-bg-shell`, `--color-bg-panel`, borders, text tiers, restrained warn/danger.

## CSS load order

```html
brand-shell-polish-001.css
brand-shell-polish-002.css  ← wins for owner shell base
brand-shell-polish-002b.css ← route token enforcement
brand-shell-polish-002c.css ← accessibility + route audit (required before push)
```

Scoped to `.app-shell.is-owner-shell` and `body:has(.app-shell.is-owner-shell)`.

**Owner review (2026-06):** 002 alone is **not push-ready**. See `brand-shell-polish-002b-receipt.md`.

## Acceptance

1. New logo in header without distortion  
2. Black/near-black header  
3. Blue gradients removed from main owner shell surfaces  
4. Calmer, less noisy UI  
5. Clear typography roles  
6. 001H read-only Gmail runtime unchanged (no server/provider edits)  
7. No egress/send/draft code changed  
8. Responsive layout usable  
9. `npm run check:brand002` + `npm run check:quick` pass  

## Validation

```bash
npm run check:brand002
npm run check:quick
npm run check:localwebruntime001
```

Preview: `npm run dev` → `:4488` or `npm run local:web` → `:8788` (hard refresh).

## Stop lines

- No OAuth / provider / runtime changes in this slice  
- No 001I implementation mixed in  
- Do not push without owner approval  
