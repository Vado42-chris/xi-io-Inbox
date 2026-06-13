# Multi-Agent Orchestration Operating Model

## Status

```text
Author context: solo maintainer, agents run locally in Zed on Pop!_OS.
Scope: how to organize agent work so it converges into world-class software.
Authority: operating model. Product direction is ratified in
           docs/ui/ui-north-star-and-convergence-plan.md.
```

## Why this exists

The project has a strong spine (`tools/gmail` adapter, schemas, framework doctrine)
and an enormous amount of planning. It has not converged because of **how the work is
structured**, not a lack of effort:

- One UI agent at a time piles onto a single file (`public/inbox-preview.js`,
  10,638 lines, 475 functions, storage schema v11).
- Each pass adds planning docs faster than shippable, consolidated implementation.
- Three product models (UI-003 lanes, UI-005 human-operable/concierge, UI-007
  draft-centered spine) are live in the same monolith at once.

Multi-agent orchestration only helps if the work is **parallelizable and convergent**.
That requires three preconditions, which this document and the north-star plan establish:

1. **One canonical product model** (no competing architectures live at once).
2. **Module boundaries** so two agents never edit the same file.
3. **Hard gates** so parallel work cannot regress safety, privacy, or quality.

## Roles

Treat each role as a distinct Zed agent thread (or a focused session). One human
orchestrator stays in the loop; everything else is proposal-only until reviewed.

| Role | Owns | Never touches |
| --- | --- | --- |
| **Orchestrator / Architect** (you + a lead agent) | North star, decomposition, merge order, conflict resolution, gate sign-off | Implementation details of individual lanes |
| **Design-System agent** | `public/src/design/` tokens + component contracts; the visual standard | Lane business logic |
| **Shell agent** | App frame: top bar, primary nav, router, right inspector, global state store | Per-lane/capability internals |
| **Workbench agent** | Mail workbench spine: Inbox → Drafts → Approvals → Sent/Receipts | Calendar/Tasks/Automations internals |
| **Capability agents** (1 per module) | One capability each: Calendar, Tasks, Automations, Extensions, Settings/Provider Gates | Any module other than their own |
| **Ibal-Concierge agent** | Concierge drawer/command entry + contextual proposal surface | Lane data ownership (reads via contracts only) |
| **Spine/Adapter agent** | `tools/gmail/`, `schemas/`, view-model contracts, fixtures | UI rendering |
| **Security / Egress reviewer** (mandatory) | Reviews every PR for draft-only egress, secrets, redaction, no-silent-green | Feature authorship (review only) |
| **QA / Wargame agent** | Wargame scenario matrix, visual QA rubric, a11y, evidence capture | Feature authorship |

Solo-team reality: you will play Orchestrator and rotate the others. The value is that
each agent **session is scoped to one module and one contract**, so context stays small,
output stays reviewable, and sessions can run in parallel without collisions.

## Module ownership map (collision-free parallelism)

Parallel agents are safe only when ownership is exclusive. Target layout (see north-star
plan for the full modularization):

```text
public/src/design/        -> Design-System agent
public/src/shell/         -> Shell agent (frame, router, store, inspector)
public/src/workbench/     -> Workbench agent (mail/draft spine)
public/src/capabilities/calendar/      -> Calendar agent
public/src/capabilities/tasks/         -> Tasks agent
public/src/capabilities/automations/   -> Automations agent
public/src/capabilities/extensions/    -> Extensions agent
public/src/capabilities/settings/      -> Settings agent
public/src/ibal/          -> Ibal-Concierge agent
public/src/lib/, fixtures/-> Spine/Adapter agent
tools/gmail/, schemas/    -> Spine/Adapter agent
docs/                     -> Orchestrator (others propose, orchestrator merges)
```

Adopt a `CODEOWNERS` file mirroring this map. Rule: **a PR that edits files outside the
agent's owned paths is rejected** unless the orchestrator explicitly authorizes a
cross-module change (which should be rare and small).

## Git + Zed workflow

- **Integration branch.** Use one integration branch (e.g. the current
  `ui-002/framework-derived-static-preview` or a fresh `ui-convergence` branch) as the
  trunk for the rebuild. Agents branch off it as `cursor/<module>-<slice>-<suffix>`.
- **One worktree per parallel agent.** Use `git worktree add ../wt-<module> <branch>` so
  each Zed agent has an isolated checkout and they cannot stomp each other's working tree.
- **Small vertical slices.** Each slice is one module advancing one increment, with its
  own checks and evidence. No "big bang" rewrites.
- **Orchestrator sets merge order.** Design-System and Shell merge first (everyone depends
  on them); capabilities merge in parallel after; Ibal and QA last per cycle.
- **Rebase, don't pile.** Rebase slices onto the integration branch frequently to keep
  diffs small and reviewable.
- **AGENTS.md is the shared brief.** Zed/Cursor agents read `AGENTS.md`; it points at the
  north star and the ownership map so every session starts aligned.

## Gates (Definition of Done for every slice)

A slice is done only when **all** are true:

1. Static checks pass (`npm run check`).
2. Draft-only egress is intact: `send/forward/delete/archive/disclose/publish/deploy`
   remain disabled with a gate reason (the Security reviewer verifies in code, not just UI).
3. No secrets, tokens, credentials, or real private message bodies in code, fixtures, or
   storage. Redaction happens at the adapter boundary.
4. Uses Design-System tokens/components — no new ad-hoc color/spacing/pill systems.
5. Does **not** grow the monolith: net lines in `public/inbox-preview.js` go **down** (the
   strangler migration only removes from it).
6. a11y baseline: keyboard operable, visible focus, aria labels, plain-language empty
   states, no destructive action styled casually.
7. Evidence recorded: screenshot/video + the relevant wargame scenario result.
8. Honors the existing named gates (`GATE-RUNTIME-001`, `GATE-PROVIDER-001`,
   `GATE-AUTO-EXEC-001`, `GATE-LOCAL-OPERABILITY-001`, `GATE-DRAFT-WORKBENCH-001`).

## Security model for AI + automation (non-negotiable)

- **Least privilege:** Tier 1 preview has no provider connection, no OAuth, no secrets.
- **Draft-only by default:** AI may draft/propose; only the user sends. Enforced in code
  and re-verified by the Security reviewer on every PR.
- **Redaction at the boundary:** the adapter (`tools/gmail/lib/body-redaction.js`,
  `body-gate.js`) is the single choke point; UI consumes sanitized view models only.
- **Receipts for every confirmed/simulated action:** audit trail is first-class, not a
  reporting afterthought.
- **No-silent-green:** status must never imply success that did not happen.
- **Public-repo hygiene:** no private framework internals, personal data, or credentials.

## Convergence loop (the actual cadence)

```text
1. Freeze new planning docs. Implementation must catch up to the plan.
2. Ratify ONE product model (north-star plan) and delete scar tissue from superseded models.
3. Stand up design tokens + shell skeleton (modular), then strangle the monolith module by module.
4. Run capability agents in parallel on owned modules.
5. After each cycle: integrate, run the wargame + visual QA rubric, capture evidence, re-prioritize.
```

## Anti-patterns to stop now

- Adding features to `public/inbox-preview.js` instead of extracting modules from it.
- Authoring new architecture docs while two prior models remain unreconciled in code.
- Treating a passing static `npm run check` as product proof (it is a smoke test).
- Letting visual polish proceed without a single source-of-truth design system.
- Ibal as a lane or a decorative chatbot (it is a concierge; see UI-005 concierge model).

## Decision value

`MULTI_AGENT_ORCHESTRATION_REQUIRES_ONE_MODEL_MODULE_BOUNDARIES_AND_HARD_GATES`
