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
| Workbench agent | `public/src/workbench/` Mail -> Drafts -> Approvals -> Sent/Receipts internals | calendar/tasks/automations internals |
| Capability agents | one primary destination module each: Calendar, Tasks, Automations, Activity, Integrations | shell nav and adapter code |
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
1. Ratify amended Option B north star.
2. Complete Level 2 visual direction, Level 3 cross-pollination, Level 4 lane journey index,
   and Level 5 component ownership decisions.
3. Stand up design tokens and component contracts.
4. Create shell/router/store skeleton with one route table:
   `Home | Mail | Calendar | Tasks | Automations | Activity | Integrations`.
5. Add shared account scope lens contracts for Mail, Calendar, Tasks, and Activity.
6. Move Mail/Drafts/Approvals/Sent into workbench modules.
7. Move Calendar/Tasks/Automations/Activity/Integrations into primary destination modules.
8. Move Ibal into concierge module only.
9. Delete dead lane and migration scar tissue from the monolith only after focused receipts.
```

## Anti-patterns

- Treating `main` audits as product audits.
- Adding new features to `public/inbox-preview.js`.
- Claiming owner proof or visual proof before UI-012F and UI-003E pass.
- Keeping stale architecture docs in the reading path without supersession headers.
- Printing private snapshots or tokens into terminal logs.
- Demoting Calendar, Tasks, Home, or another primary product destination through a shell-only
  cleanup without owner sign-off and capability review.
- Treating shell/nav receipts as proof that Calendar, Tasks, GitHub, or multi-account scope
  requirements are complete.
- Extracting components before Level 5 decides whether they belong in the framework, this
  repository, or product templates.
- Calling the preview "componentized" before UI-016B adds anatomy specs, boundary checks, and
  at least one real strangler extraction under `public/src/*`.

## Decision value

`MULTI_AGENT_ORCHESTRATION_REQUIRES_ONE_MODEL_MODULE_BOUNDARIES_AND_HARD_GATES`

