# Owner Gate Chart (plain language)

## Purpose

One page for **what you look at** vs **what agents/scripts prove**. No decision-token jargon required.

## Two ways to see the product

| What you open | What it shows | Your question |
| --- | --- | --- |
| **Browser → http://localhost:4488** | Static preview (fixture/demo mail) | “Does the product look and feel right?” (**UI-003E**) |
| **Desktop window → `npm run tauri:dev`** | Real connected app | “Does my Gmail metadata show up after Connect + Sync?” (optional live proof) |

Agents run checks in the background. **You** judge with your eyes on those two surfaces.

## Gate status (2026-06-17)

| Gate | Status | What it means for you |
| --- | --- | --- |
| ARCH-004 runtime choice | **Done** | Tauri desktop is the primary runtime path |
| RUNTIME spine 002A→002C | **Done** | Connect, sync, refresh loop built and peer-reviewed |
| Automated structural checks | **Done** | `npm run check` on GitHub + local gate scripts |
| Tauri CI on GitHub | **Added** | Rust/runtime tests run in GitHub (separate from static preview) |
| **UI-003E scaffold proof** | **Not passed — you** | Open `:4488`, walk the runbook, send PASS or FAIL |
| Live Gmail in desktop app | **Optional** | Connect once in Tauri if you want to see real threads |
| PR #12 merge-ready | **Blocked** | Until UI-003E PASS + merge prep |
| Mail UI polish | **Blocked** | Until owner direction after runtime proof |

## What you do (minimal)

### UI-003E (required before merge prep)

1. Open **http://localhost:4488**
2. Follow `docs/ui/reviews/ui-003e-owner-session-runbook.md` (~15 min)
3. Reply **`UI_003E_PASS_OWNER_VISUAL_PROOF_COMPLETE`** or **`UI_003E_FAIL`** + what looked wrong

### Live Gmail (optional)

1. Run **`npm run tauri:dev`** (desktop window, not browser)
2. Connect Gmail → Sync now → glance at Mail lane
3. Only if you want live-mail proof — not required for UI-003E

## What agents do (no input from you)

- `npm run check` — static + structural validation (GitHub)
- `npm run check:full` — includes Rust tests locally
- `npm run gate:runtime002c -- --write-evidence` — automated runtime gate
- Ollama peer review drafts — token savings
- Governance doc/fixture updates (GOV-REFRESH)

## Commands (full paths)

Static preview:

```bash
cd "/media/chrishallberg/Storage 22/999_Work/003_Projects/017_xi-io_inbox" && npm run dev
```

Desktop app:

```bash
cd "/media/chrishallberg/Storage 22/999_Work/003_Projects/017_xi-io_inbox" && npm run tauri:dev
```

## Related

- `docs/ui/reviews/peer-review/README.md` — workspace peer review (component + IA)
- `docs/ui/reviews/ui-003e-owner-session-runbook.md`
- `docs/operations/automated-gates-runbook.md`
- `docs/operations/branch-truth.md`
