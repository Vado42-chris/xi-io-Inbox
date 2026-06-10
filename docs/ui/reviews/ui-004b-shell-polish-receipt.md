# UI-004B Shell Polish Receipt

## Metadata

| Field | Value |
| --- | --- |
| Date | 2026-06-10 |
| Branch | `ui-002/framework-derived-static-preview` |
| PR | `#12` draft |
| Baseline | UI-004A.6 receipt `docs/ui/reviews/ui-004a6-wargame-review.md` |
| Scope | shell/topbar/lane navigation/global safety/right inspector system |
| Product UI code changed | yes |
| Fixture data changed | no |

## Before-State Summary (UI-004A.6 Blockers)

- UI-004A6-BLOCKER-001: shell hierarchy too uniform; top status, safety banner, lane header, pills, panels, and inspector competed.
- UI-004A6-BLOCKER-002: safety correct but visually overexposed as a warning slab.
- UI-004A6-BLOCKER-003: right inspector not a consistent selected-object intelligence system across lanes.
- UI-004A6-BLOCKER-004: lanes shared too much card/pill rhythm (page polish deferred).
- UI-004A6-BLOCKER-005: page-specific polish blocked until shell/nav/trust/inspector corrected.

## Files Changed

| File | Change |
| --- | --- |
| `public/inbox-preview.css` | shell chrome hierarchy, trust rail, quieter nav/inspector frame |
| `public/inbox-preview.js` | trust grammar, inspector focus model, cross-lane selection wiring |
| `docs/ui/reviews/ui-004b-shell-polish-receipt.md` | this receipt |
| `TODO.md` | UI-004B status and next-slice update |

## Excluded Scope

- page-specific lane polish (UI-004C–G)
- fixture/content changes in `public/data/inbox-events.preview.json`
- provider connections, credentials, runtime writes
- automation execution, local cloud behavior, platform/runtime claims
- visual proof completion, PR draft exit
- direct framework import claim

## Implementation Summary

### Shell hierarchy

- Removed heavy global shadow treatment from lane navigation and right inspector chrome.
- Kept primary attention on the center lane surface with lighter shell framing.
- Reduced lane header dominance and replaced dual status pills with a compact status line.

### Top bar and trust grammar

- Replaced three workspace pills with compact trust tokens.
- Removed the loud amber safety banner slab.
- Added an integrated trust rail with concise preview safety facts and expandable trust details.

### Lane navigation

- Removed per-lane status pills from navigation links.
- Added subtle gated/proposal hints only where needed.
- Preserved route labels and active-lane treatment.

### Right inspector system

- Restructured inspector into selected-object intelligence blocks:
  - what is selected
  - why it matters
  - evidence
  - safe next action
  - blocked actions
  - Ibal proposal
  - receipt expectation
- Added inspector focus state across inbox threads, home priorities, calendar agenda items, and task cards.
- Preserved disabled dangerous egress actions in inspector.

### Status/badge reduction

- Reduced global pill noise in top bar, lane navigation, and lane header.
- Preserved text labels for trust and lane state.

## Route Smoke Result

Static asset smoke against local preview server:

```text
index.html: 200
inbox-preview.css: 200
inbox-preview.js: 200
inbox-events.preview.json: 200
route fixtures present: #/home #/inbox #/calendar #/tasks #/automations #/extensions #/receipts #/ibal #/settings
external requests during smoke: 0 (local 127.0.0.1 only)
preview server stopped after smoke: yes
```

## Keyboard / Focus Result

```text
Inbox thread selection: preserved
Inspector focus targets: added for priority, agenda, task, and inbox thread objects
Enter/Space activation on inspector-focus targets: implemented
Lane hash navigation: preserved
```

## Inspector Result

```text
Lane default context: pass
Inbox selected-thread context: pass
Non-inbox selected-object context: partial (home/calendar/tasks wired; receipts/automations/extensions/settings remain lane-default until page polish)
Structured intelligence sections: pass
Disabled egress actions visible: pass
```

## Safety / Egress Result

```text
provider connection: absent
credentials: absent
runtime action execution: absent
automation execution: absent
local cloud behavior: absent
platform/runtime claim: blocked/undecided only
send/forward/delete/archive/disclose/publish/deploy/mutate: blocked
```

## Visual QA Delta Estimate

| System | UI-004A.6 Avg | UI-004B Estimate | Notes |
| --- | --- | --- | --- |
| Shell/system | 1.5 | 2.3 | hierarchy, trust grammar, inspector structure improved |
| Overall routes | 1.5–1.8 | 1.7–2.0 | page rhythm still generic by design in this slice |

Shell-specific blockers are materially improved. Competitive visual proof remains blocked.

## Remaining Blockers

- Owner/framework visual proof still incomplete.
- Page-specific card/pill rhythm remains for UI-004C–G.
- Inspector focus not yet wired for every object type in every lane.
- PR #12 must remain draft.
- Pass 4, ARCH-004, ARCH-002, provider/runtime work remain blocked.
- Direct framework export remains blocked by `xi-io.net#239`.

## Framework Freshness Impact

Reusable shell candidates strengthened in preview behavior:

- XiTrustCluster
- XiContextInspector
- XiAppShell

No `xi-io.net#239` comment required in this pass.

## Next Recommended Pass

1. UI-004C Inbox lane polish
2. Owner review packet after UI-004C or broader UI-004 page slices
3. UI-003E owner/framework visual proof only after page polish slices complete

## Decision

```text
UI_004B_PASS_SHELL_SYSTEM_READY_FOR_PAGE_POLISH
```

Shell/nav/trust/inspector blockers from UI-004A.6 are addressed enough to begin page-specific polish. Visual proof and merge remain blocked.
