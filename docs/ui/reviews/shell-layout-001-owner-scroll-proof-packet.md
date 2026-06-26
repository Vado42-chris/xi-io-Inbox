# SLICE-SHELL-LAYOUT-001 — Owner scroll proof packet

## Status

```text
Implementation: landed @ e4c3708 (stylesheet public/shell-layout-001.css)
Owner scroll proof: FAIL — owner-default Mail presentation failed product direction @ 735addf
Blocks: Activity B6 classify, UI-003E retest, Integrations IA
Follow-up: FIX-BATCH-009 (Mail owner UI state model correction) before scroll proof rerun
Does not pass: UI-003E, MERGE-PREP-001, or full owner visual proof
```

## Owner decision (2026-06-19)

### Prior defer — Mail IA (FIX-BATCH-008 landed)

Mail owner-mode folder IA was reduced below mailbox confidence. FIX-BATCH-008 restored folders and snapshot honesty; scroll rerun was next.

### Current result — product presentation fail @ 735addf

Mail scroll may be technically acceptable, but owner-default Mail failed product direction: implementation/debug state dominated primary UI (`Saved snapshot`, metadata grid in left rail). That reads as a mockup inspector, not a calm email client.

```text
SHELL_LAYOUT_001_OWNER_SCROLL_PROOF: FAIL
Reviewed by: Chris
Commit SHA reviewed: 735addf
Notes: Mail scroll may be technically acceptable, but owner UI fails product direction. The Mail screen exposes implementation/debug state as primary UI. “Saved snapshot” and snapshot metadata are useful diagnostic facts, but they should not dominate the normal mail navigation. The current UI still feels like a mockup/state inspector, not a calm email client or operator cockpit.
Evidence: owner screenshot and notes.
Decision token: SHELL_LAYOUT_001_OWNER_SCROLL_PROOF_FAIL_SHELL_FOLLOWUP_REQUIRED
```

Open **FIX-BATCH-009** (Mail owner UI state model correction). Rerun this packet only after FIX-BATCH-009 lands and agents pass the pre-owner UX self-check.

## Purpose

Record **bounded** owner verification that the shell scroll fix works before Activity B6 or further UI batches. This is not a full UI-003E session — scroll and overflow only.

## Preconditions

| Item | Value |
| --- | --- |
| Branch | `ui-002/framework-derived-static-preview` |
| Review SHA | `a5978b3` or later on branch |
| Mode | Static scaffold preview only (`npm run dev` → `:4488`) |
| Not valid | Tauri runtime, CI green alone, agent structural checks |

```bash
cd "/media/chrishallberg/Storage 22/999_Work/003_Projects/017_xi-io_inbox" && npm run dev
```

Open http://localhost:4488 and **hard-refresh** (`Cmd/Ctrl+Shift+R`) so `shell-layout-001.css` loads.

## Verification script

Mark each row **pass** or **fail** after visual check. Use long fixture content where available (Mail thread list, Activity feed, Advanced disclosure).

| # | Lane / region | Pass if |
| --- | --- | --- |
| 1 | **Mail** | Thread/list column scrolls separately from reading pane |
| 2 | **Calendar** | Month/grid or agenda area scrolls inside the lane without moving the whole page |
| 3 | **Tasks** | Owner cards stay calm; long content scrolls inside the lane (Advanced if opened) |
| 4 | **Automations** | Default stays calm; **Advanced automation details** opens and scrolls inside disclosure |
| 5 | **Activity** | Feed and detail panes scroll independently |
| 6 | **Integrations** | Catalog and detail panes scroll independently |
| 7 | **Right rail** | Contextual rail scrolls independently when content is long |
| 8 | **Page / body** | No horizontal overflow; desktop view does not accidentally scroll the full page instead of columns |

Optional sanity: toggle **showWorkflowScaffold** (Settings → Advanced) on one lane — scaffold detail still recoverable.

## Result (owner only)

Agents must **not** check PASS or invent evidence.

| Outcome | When |
| --- | --- |
| **PASS** | All eight rows pass |
| **FAIL** | Any row fails — open bounded shell follow-up only |
| **DEFER** | Not reviewed yet or blocked (environment, time) |

```text
SHELL_LAYOUT_001_OWNER_SCROLL_PROOF: PASS | FAIL | DEFER
Reviewed by:
Date:
Commit SHA reviewed:
Notes:
Evidence: (screenshot paths, short lane notes — no secrets)
```

### Decision tokens (after human-readable result)

| Outcome | Token |
| --- | --- |
| PASS | `SHELL_LAYOUT_001_OWNER_SCROLL_PROOF_PASS_READY_FOR_ACTIVITY_B6_CLASSIFY` |
| FAIL | `SHELL_LAYOUT_001_OWNER_SCROLL_PROOF_FAIL_SHELL_FOLLOWUP_REQUIRED` |
| DEFER | `SHELL_LAYOUT_001_OWNER_SCROLL_PROOF_DEFERRED` |

Default until owner records otherwise:

```text
SHELL_LAYOUT_001_IMPLEMENTATION_PASS_PENDING_OWNER_SCROLL_PROOF
```

## If PASS

Proceed to **Activity B6 visual classify** under `docs/ui/ui-visual-language-001-editorial-surfaces-and-border-minimization.md`. Do not start full UI-003E retest yet.

## If FAIL

Open a **bounded shell-layout follow-up** only:

- Fix failing scroll/overflow in `public/shell-layout-001.css` (preferred) or minimal markup if CSS cannot reach the pane
- Re-run this packet
- Do **not** start Activity B6 until scroll proof passes

## If DEFER

No downstream UI slices. Hold Activity B6, Integrations IA, COPY-LITERAL, QUIET-PROOF.

## Stop lines (unchanged)

```text
No UI-003E PASS claim from this packet
No Activity B6 implementation before scroll proof PASS
No Integrations IA yet
No COPY-LITERAL-001 / QUIET-PROOF-001 yet
No #21–#25 unblock
No return to border-heavy nested cards in owner-default mode
```

## Related

- Implementation receipt: `docs/ui/reviews/shell-layout-001-implementation-receipt.md`
- Shell spec: `docs/ui/ui-shell-layout-001-column-scroll-and-rail-behavior.md`
- Visual language: `docs/ui/ui-visual-language-001-editorial-surfaces-and-border-minimization.md`
