# UI-013C Owner-Grade Visual Direction

## Status

```text
Type: visual redesign brief (supersedes UI-013B agent self-QA).
Owner preliminary review of UI-013B: FAIL (generic AI slop).
UI-013C: first owner-grade implementation pass — agent complete, owner review pending.
```

## Design thesis

**Private Operations Cockpit** — editorial, confident, warm-dark, not a cyan-tinted admin template.

Anti-patterns to avoid:

- identical glass cards on every panel,
- red error slabs for trust states,
- cramped calendar grids,
- weak primary actions,
- debug copy as product voice.

## Typography

| Role | Treatment |
| --- | --- |
| Product mark + lane titles | Serif display stack (system: Iowan/Palatino/Georgia) |
| UI chrome + body | System UI sans |
| Metadata / labels | Uppercase tracked labels, smaller size |

No external font CDN (route smoke blocks external requests).

## Lane atmosphere

Each primary lane keeps a distinct accent but shares one composition grammar:

| Lane | Accent role | Focal object |
| --- | --- | --- |
| Home | Cyan editorial | Now / priority stack |
| Mail | Green ingress | Thread + reading stack |
| Calendar | Amber temporal | Month grid + day agenda |
| Tasks | Violet execution | Board + story detail |
| Automations | Cyan system | Rule dry-run |
| Activity | Amber audit | Receipt ledger |
| Integrations | Green trust | Provider gates |

## Calendar flagship requirements

- Month title uses display typography.
- Day cells ≥ 5.25rem height on desktop.
- Grid gives calendar main column ~2:1 over side agenda.
- Trust banner uses amber affordance, not error red.

## Trust copy voice

| Old | New |
| --- | --- |
| Provider calendar sync blocked | Calendar writes locked until you connect a provider |
| External tracker and provider sync blocked | External task sync locked until you connect a provider |

## Acceptance criteria

- [x] UI-013C CSS block in `public/inbox-preview.css`
- [x] Brand mark + display typography on product title and lane headers
- [x] Calendar layout breathing room and flagship treatment
- [x] Trust affordance styling + product voice on Calendar/Tasks banners
- [x] Primary button presence uses lane accent fill
- [ ] Owner visual review PASS (required for UI-003E)

## Decision value

`UI_013C_OWNER_GRADE_VISUAL_DIRECTION_AGENT_PASS_OWNER_REVIEW_PENDING`
