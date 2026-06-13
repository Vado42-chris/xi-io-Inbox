# Multi-Agent Orchestration Operating Model

## Status

```text
Scope: product-branch operating model for ui-002/framework-derived-static-preview.
Authority: process model. Product direction is in docs/ui/ui-north-star-and-convergence-plan.md.
```

## Why this exists

Peer review found that sequential passes added capabilities and receipts faster than the
application architecture converged. Parallel agents are useful only after the product model,
module boundaries, and hard gates are explicit.

## Roles and ownership

| Role | Owns | Never touches |
| --- | --- | --- |
| Orchestrator | north star, branch truth, merge order, plan updates, gate sign-off | feature internals without a receipt |
| Design-System agent | `public/src/design/` tokens and reusable components | lane business logic |
| Shell agent | `public/src/shell/` app frame, single nav, router, store, inspector | Gmail adapter |
| Workbench agent | `public/src/workbench/` Mail -> Drafts -> Approvals -> Sent/Receipts | calendar/tasks/automations internals |
| Capability agents | one module under `public/src/capabilities/` | shell nav and adapter code |
| Ibal agent | `public/src/ibal/` concierge drawer and command entry | route ownership or provider mutation |
| Spine/Adapter agent | `tools/gmail/`, `schemas/`, `public/src/lib/`, fixtures | UI rendering |
| QA/Security reviewer | receipts, smoke, privacy, no-silent-green, draft-only egress | feature authorship |

## Required gates for every slice

1. `npm run check` passes.
2. Draft-only egress remains enforced in code and visible in UI.
3. No secrets, credentials, real private bodies, or private framework internals are committed.
4. `public/inbox-preview.js` does not grow during migration work.
5. New UI uses shared tokens/components instead of another one-off visual system.
6. Browser evidence is captured for visible UI changes.
7. The relevant receipt and TODO/plan rows are updated in the same pass.

## Migration order

```text
1. Ratify draft-centered north star.
2. Stand up design tokens and component contracts.
3. Create shell/router/store skeleton with one route table.
4. Move Mail/Drafts/Approvals/Sent into workbench modules.
5. Move capabilities into separate modules.
6. Move Ibal into concierge module only.
7. Delete dead lane and migration scar tissue from the monolith.
```

## Anti-patterns

- Treating `main` audits as product audits.
- Adding new features to `public/inbox-preview.js`.
- Claiming owner proof or visual proof before UI-012F and UI-003E pass.
- Keeping stale architecture docs in the reading path without supersession headers.
- Printing private snapshots or tokens into terminal logs.

## Decision value

`MULTI_AGENT_ORCHESTRATION_REQUIRES_ONE_MODEL_MODULE_BOUNDARIES_AND_HARD_GATES`

