# BRAND-SHELL-POLISH-002 — black-shell visual system refresh

**Status:** Visual-system slice — **not** runtime, provider, or egress work.  
**Blocks:** `LOCAL-WEB-RUNTIME-001I` (intentionally — reduces owner review friction first).

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
