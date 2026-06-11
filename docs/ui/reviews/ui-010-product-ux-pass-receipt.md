# UI-010 Product UX Pass Receipt

## Date

2026-06-10

## Scope

Second product UX pass after UI-009 shells. Demotes global dev chrome; product-facing Home, Automations, Integrations, Activity, account panel, inspector rail; fixture data cleanup.

| Slice | Change |
| --- | --- |
| UI-010A | Trust chrome → collapsed Help panel; remove top-bar trust tokens; nav hints removed |
| UI-010B | Home dashboard workspace (stats, needs-attention, quick links) |
| UI-010C | Automations rule-flow UI; templates collapsed; user copy |
| UI-010D | Integrations marketplace cards + detail pane |
| UI-010E | Activity human labels + Open in Mail/draft drill-down |
| UI-010F | Account panel → product identity; workspace collapsed |
| UI-010G | Sample thread copy in JSON demoted |
| UI-010H | Calendar/tasks fixture meta demoted; task due on cards |
| UI-010I | Inspector rail product language (Actions, mode labels) |

## Validation

| Check | Result |
| --- | --- |
| `npm run check` | pass |

## UI-010J–K follow-up (same pass series)

| Slice | Change |
| --- | --- |
| UI-010J | Calendar week strip; compose/Ibal product copy; mail list density; status message demotion |
| UI-010K | JSON lane content demotion (nav, calendar, tasks, automations, integrations, activity rows) |

## Not claimed

UI-003E PASS, PR #12 merge, live Gmail sync, runtime connect.
