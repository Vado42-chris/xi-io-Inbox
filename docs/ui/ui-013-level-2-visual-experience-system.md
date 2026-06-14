# UI-013 Level 2 Visual Experience System

## Status

```text
Type: visual direction and no-AI-slop standard.
Scope: product-wide UI quality system for xi-io Inbox.
Blocks: owner UI-003E visual proof until implemented.
```

UI-013 defines the design system we must build toward before claiming the app is owner-grade.
It does not itself restyle the product. It defines what must be true when we do.

## Visual thesis

```text
Private Operations Cockpit
```

The product should feel private, composed, precise, and quietly powerful. It should not look
like a dark admin template, a debug console, or generic AI card output.

## Required design docs inside UI-013

| Section | Required content | Why |
| --- | --- | --- |
| Brand thesis | Product adjectives, anti-adjectives, visual references, tone boundaries. | Prevents agents from choosing random aesthetic directions. |
| Token map | Color, type, spacing, radius, elevation, focus, motion, density. | Makes visual work reusable and testable. |
| Lane identities | Home, Mail, Calendar, Tasks, Automations, Activity, Integrations color/shape/rhythm. | Prevents same-card sameness across lanes. |
| State grammar | Proposed, blocked, draft, approved, local-only, provider-gated, completed. | Keeps safety visible without red debug slabs. |
| Composition rules | Hero/focus area, secondary rail, inspector, empty/error/loading states. | Forces hierarchy, not widget piles. |
| Copy voice | Short, human, precise; implementation limits written as trust affordances. | Prevents debug copy from becoming product voice. |
| Visual QA checklist | Screenshots/videos required, no category below threshold, owner-review packet. | Makes polish measurable. |

## Product-level token requirements

| Token family | Standard |
| --- | --- |
| Color | One brand base, one luminous accent system, lane-specific accents, semantic safety colors. |
| Type | Display, title, body, metadata, numeric, and receipt/audit styles with fixed hierarchy. |
| Depth | Canvas, elevated surface, focused object, modal/sheet, overlay, active lane. |
| Spacing | Fewer arbitrary gaps; layout rhythm must be recognizable across lanes. |
| Motion | Minimal, purposeful transitions for focus, drawer/sheet entry, and state changes. |
| Accessibility | Contrast and focus rings cannot depend on aesthetic exceptions. |

## Lane identity standards

| Lane | Visual role | Must feel like |
| --- | --- | --- |
| Home | Command center | Prioritized, editorial, "what matters now." |
| Mail | Controlled ingress | Signal triage, conversion, safe drafting. |
| Calendar | Time pressure and negotiation | Spacious, temporal, commitment-aware. |
| Tasks | Work execution | Structured, source-linked, decisive. |
| Automations | Rehearsal / simulation | Flow-based, conditional, visibly dry-run. |
| Activity | Audit trail | Evidentiary, chronological, resumable. |
| Integrations | Trust and capability gates | Clear, permission-aware, non-threatening. |

## No-AI-slop visual gate

A UI change fails UI-013 if:

- every lane uses the same gray card/pill/panel grammar,
- hierarchy depends only on borders,
- provider-blocked copy reads like a crash/error instead of a trust state,
- dense grids make the primary object hard to identify,
- buttons/actions lack meaningful priority,
- screenshots cannot explain the lane without a verbal walkthrough,
- the design could plausibly be mistaken for a generic generated dashboard.

## Acceptance criteria

- [x] Token reset documented and implemented (`public/inbox-preview.css`, UI-013B block).
- [x] Every primary lane has a distinct but unified identity.
- [x] Calendar and Tasks are visually treated as flagship surfaces.
- [x] Visual QA checklist exists and is run against Home/Mail/Calendar/Tasks.
- [ ] Owner visual proof packet uses UI-013 screenshots/videos.
- [x] No provider/runtime safety claim is weakened by visual polish.

## Decision value

`UI_013_LEVEL_2_VISUAL_SYSTEM_REQUIRED_BEFORE_OWNER_PROOF`

