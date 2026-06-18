# public/src — convergence module skeleton

Strangler-style extraction target for `public/inbox-preview.js` per
`docs/ui/ui-north-star-and-convergence-plan.md`.

| Path | Owner | Status |
| --- | --- | --- |
| `shell/route-table.js` | NAV-002 route contract | **extracted** |
| `design/` | tokens/components | planned |
| `store/` | state envelope | planned |
| `workbench/` | mail inner flow | planned |
| `capabilities/` | calendar, tasks, activity, integrations | planned |
| `ibal/` | concierge drawer | planned |
| `lib/` | view-model adapters | planned |

Do not delete working UI from the monolith until a slice receipt passes route smoke and
`check:route-table`.
