# UI-VISUAL-LANGUAGE-001 — Editorial surfaces and border minimization

## Status

```text
Type: visual language correction (docs capture — planning authority for UI work)
Date: 2026-06-19
Slice: SLICE-VISUAL-LANGUAGE-001
Scope: border minimization, open surfaces, typographic hierarchy, fields/dividers, quiet proof, contextual rail
Excluded: full redesign, provider/runtime work, architecture #21–#25, UI-003E PASS claims
Supersedes: vague “polish later” without visual grammar rules
Companion: docs/ui/ui-shell-layout-001-column-scroll-and-rail-behavior.md
Related: docs/ui/ui-013-level-2-visual-experience-system.md · docs/ui/user-language-map.md
```

## Non-authority clause

This document defines **visual language constraints** for copy, CSS, and owner-mode batches. It does **not** by itself:

```text
authorize provider egress or mutation
unblock GitHub L1, ingress-card backend, or export utilities
pass UI-003E or MERGE-PREP-001
replace owner approval for gated slices
```

Implementation still requires slice DoR/DoD, `npm run check`, and active repo gates. Future CSS/token work references this doc; it is not permission to skip peer-review stop lines.

## Problem statement (owner review, 2026-06-19)

The product is becoming **structurally smarter** but still **reads like a bordered admin console**. Information architecture and quiet-proof copy are improving; presentation layer is not yet expressive enough.

```text
Backend / operator direction: improving
Visual authorship: lagging
```

Owner design preference — not “make it prettier,” but a product principle:

```text
Reduce chrome.
Use typography, spacing, background fields, alignment, and hierarchy to create structure.
Use borders only when they communicate state, selection, risk, or containment that cannot be communicated better another way.
```

This aligns with UI-013’s anti-template gate (“hierarchy depends only on borders” fails) and industry direction captured in `docs/product/competitive-inbox-ingress-positioning-2026-06.md` (interaction quality bar, calm operator).

## Design target

```text
Editorial control room, not enterprise dashboard.
```

More specifically:

```text
A dark, calm, typographic workbench with open surfaces, soft zones, clear workflow direction, and quiet proof.
```

Reference directions (conceptual, not clone targets):

```text
desktop publishing layout · magazine spread hierarchy · OS sidecar · high-trust editorial dashboard
```

The UI should feel designed by a senior UX/editorial designer — not assembled from nested cards.

## Core rules

### 1. Borders are exceptional

**Default: no border.**

| Allowed | Not allowed |
| --- | --- |
| Selected state | Wrapping every content section |
| Focus ring / focus state | Wrapping every sidebar module |
| Danger / warning gate | Wrapping every metric |
| Interactive control outline (inputs, buttons) | Wrapping explanatory paragraphs in boxes |
| High-risk containment (modal sheet edge) | Nested bordered cards inside bordered cards |
| Temporary preview/debug scaffold (Advanced, developer) | Using borders as primary grouping |

**Design token rule:**

```text
Border minimization rule:
xi-io UI uses borders only for selected state, focus, high-risk gates, and constrained debug/advanced scaffolds. Default grouping must be achieved with spacing, typography, background fields, alignment, and dividers.
```

**Owner-default rule:**

```text
No nested bordered cards in owner-default mode.
```

### 2. Use fields, not boxes

Replace default card chrome with **background fields**:

| Field type | Use |
| --- | --- |
| Page field | Canvas / lane background |
| Content field | Primary reading or work area |
| Raised work field | Selected object, active pane (elevation, not outline) |
| Muted aside field | Secondary guidance, setup notes |
| Warning / proof field | Blocked safely, proof saved, needs approval |

Boundaries come from **contrast, spacing, and placement** — not enclosing rectangles.

### 3. Dividers over borders

Prefer single-axis separators:

```text
section header divider · list row divider · rail separator · timeline divider
```

Avoid enclosing rectangles when a hairline or spacing break suffices.

### 4. Typography creates hierarchy

Systematic type roles (map to existing tokens where possible):

| Role | Job |
| --- | --- |
| Product title | App identity (top bar) |
| Page title | Lane headline |
| Section headline | Region purpose |
| Workflow instruction | What to do next (one line) |
| Object title | Thread, task, event, rule name |
| Metadata label | Small caps / label row |
| Metadata value | Supporting fact |
| Proof / status badge | Proof saved · blocked safely · preview only |
| Quiet helper text | Secondary explanation |
| Advanced / debug text | Scaffold, receipt IDs, capability names |

User should scan by **type scale and weight**, not box count.

### 5. Padding and proximity create workflow

Use intentional padding around the main work area. Group related actions by **proximity and similarity** (Gestalt grouping), not nested panels.

### 6. Right rail: contextual, not a second dashboard

Default rail content:

```text
What this page is for
What is safe now
What is blocked
One next action
Related object (optional)
```

Hide proof-heavy detail unless expanded. Rail must not visually compete with primary task column.

### 7. Quiet proof without receipt chrome

User language: **Proof saved** / **Proof missing** / **Proof needed** (`docs/ui/user-language-map.md`).

Proof badges are **low-noise markers** — not bordered ledger panels in the primary path. Full proof stays under **Why · Details · Proof** or Activity advanced.

## Per-surface direction (owner-default)

These constraints apply to **future** owner-mode and global CSS passes. FIX-BATCH overlays should converge toward this grammar; new batches must not add bordered-card habit.

### Automations (FIX-BATCH-007 baseline)

| Keep | Change visually |
| --- | --- |
| Calm default, dry-run first, Advanced hidden | Owner status → open hero/status strip, not full border box |
| “Preview only — nothing runs automatically” | Metric boxes → inline stat chips or soft columns |
| Advanced disclosure | Slim disclosure row; no nested panels inside panels |

### Mail

| Keep | Change visually |
| --- | --- |
| List + reading pane structure | Selected thread → editorial reading pane |
| Action rail affordances | Reply / Mark read / Defer / task / schedule as **action clusters**, not boxed stacks |
| Advanced | Quieter command text; fewer nested borders on body placeholder |

### Calendar

| Keep | Change visually |
| --- | --- |
| Month grid cell structure (cells need subtle structure) | Surrounding chrome opens up; large month title |
| Event chips | Softer chips, less panel weight |
| Right rail | Summarize proposals/conflicts — not duplicate proof cards |

### Tasks

| Keep | Change visually |
| --- | --- |
| Personal tasks first, backlog in Advanced | “Your tasks” → calm open workspace, not empty admin board |
| New task primary action | Obvious without boxed empty-state frame |
| Planning scaffold | Quieter “Planning scaffold” disclosure |

### Activity (strongest rethink — classify before batch)

Default should not read as receipt database / admin filters.

| Target default | Hide in Advanced |
| --- | --- |
| Proof & history search | Raw receipt IDs |
| Recent activity timeline | Full filter form chrome |
| Chips: Recent · Blocked · Proposed · Proof saved | Native-default select styling as primary UI |
| Human event names first | Capability area jargon |

Example row (default):

```text
Mail account selected
Recorded · Proof saved · Mail
```

Expanded only:

```text
receipt id · source object · capability area · why blocked · timestamp
```

Activity B6 classify and any FIX-BATCH must follow this doc **before** more bordered owner-mode patches.

### Integrations

| Direction |
| --- |
| Top: what can connect now / what is blocked / what is internal |
| Group by user job before provider catalog |
| Internal xi-io capabilities feel native, not provider cards |
| External providers visibly gated |

## Relationship to UI-013

UI-013 defines the Level 2 visual experience system and no-AI-slop gate. UI-VISUAL-LANGUAGE-001 **narrows and operationalizes** UI-013 for the current “bordered admin console” failure mode:

| UI-013 | UI-VISUAL-LANGUAGE-001 |
| --- | --- |
| Private Operations Cockpit thesis | Editorial control room execution |
| Token map (color, type, depth) | Field/divider/border-exception rules |
| Lane identities | Per-surface open-surface notes above |
| No hierarchy-by-borders-only | Explicit border minimization token rule |

Future CSS work (global chrome reduction pass) implements tokens; this doc is the acceptance spec.

## Implementation phases (not started)

| Phase | Slice | Work |
| --- | --- | --- |
| 1 | **SLICE-VISUAL-LANGUAGE-001** (this doc) | Planning capture — **complete on commit** |
| 2 | **SLICE-SHELL-LAYOUT-001** | Functional shell: scroll, `100dvh`, rails — see companion doc |
| 3 | Global CSS/token pass | Reduce chrome in `inbox-preview.css` + owner-mode CSS using field/divider rules |
| 4 | Surface batches | Activity B6 → Integrations IA → owner-mode overlays aligned to this grammar |
| 5 | UI-003E retest | After visual-language constraint + Activity/Integrations review handled |

Do **not** keep patching Activity/Integrations visually without phases 1–2 locked. Do **not** run full UI-003E owner retest until Activity/Integrations review uses these constraints.

## Acceptance criteria (implementation slice)

- [ ] Owner-default lanes use fields/dividers; no nested bordered cards
- [ ] Borders appear only for selection, focus, risk, controls, Advanced scaffold
- [ ] Proof uses badge/row grammar, not ledger panels above the fold
- [ ] Right rail reads contextual (Why / Next / Related), not second dashboard
- [ ] Activity default is timeline + chips, not admin filter form
- [ ] Visual QA checklist includes border-minimization audit
- [ ] `npm run check` passes after CSS changes

## Validation

| Check | When |
| --- | --- |
| Doc review | This pass |
| Owner `:4488` screenshot against rules | After global CSS pass + Activity batch |
| UI-003E | Owner only — not from this doc |

## Decision

```text
VISUAL_LANGUAGE_001_EDITORIAL_SURFACES_BORDER_MINIMIZATION_DOC_LOCKED_2026_06_19
```

Planning authority for visual correction. Does not pass UI-003E. Next near-term work: SLICE-SHELL-LAYOUT-001, then Activity B6 classify under these constraints.
