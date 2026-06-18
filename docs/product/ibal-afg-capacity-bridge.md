# IBAL-AFG-CAPACITY-BRIDGE-001 — orchestration and capacity bridge

## Date

2026-06-18

## Purpose

Ibal is not a chatbot bolted onto an inbox. Ibal is the observer/conductor layer that watches provisioned sources, classifies meaning and risk, maps ingress into work objects, proposes safe next actions, and feeds capacity patterns into the user’s AuDHD Field Guide model.

The goal is cognitive-load reduction without silent automation.

## Product model

```text
multi-account ingress
→ classification / binning / evidence / source mapping
→ Ibal orchestration
→ tasks / calendar / sprint / backlog / review queues
→ controlled egress options
→ receipts / ledgers / field-guide learning loop
```

## Ibal role

Ibal should help the user understand:

- what came in,
- what it probably means,
- which account/workspace/repo/sprint it affects,
- what deadline or risk exists,
- what work object it maps to,
- what capacity cost it may carry,
- what safe next action exists,
- what is blocked until owner approval.

Ibal should not silently execute high-risk egress.

## Work object mapping

An ingress item may map to:

- review result,
- failed automation,
- sprint blocker,
- court/legal deadline,
- calendar dependency,
- backlog item,
- task seed,
- source/evidence artifact,
- future article seed,
- capacity-cost event,
- egress candidate,
- spam/threat/quarantine item.

Tasks and Calendar are projections of the work graph, not isolated widgets.

## AFG capacity bridge

The AuDHD Field Guide connection is not only journaling after the fact. It receives operational pattern signals so the system can reduce load over time.

Signals may include:

- interruption cost,
- deadline pressure,
- context-switch load,
- review/decision fatigue,
- avoided workload,
- recovery need,
- repeated overload patterns,
- high-friction source/account combinations.

## Capacity lexicon

The user chooses the unit. The system must not hardcode “spoons.”

```text
capacityUnit: spoons | mana | charge | bandwidth | oxygen | hearts | custom
```

Possible tracked dimensions:

```text
trackInterruptionCost
trackDeadlinePressure
trackContextSwitchCost
trackRecoveryNeed
trackAvoidedWorkload
trackUrgencyNoise
trackTrustRisk
trackCompletionRelief
```

## Provisioning dependency

Ibal and AFG capacity routing require provisioning.

Do not allow Ibal to map ingress across accounts, repos, workspaces, or capacity profiles unless the provisioning profile permits it.

Required references:

- `docs/architecture/provisioning-account-graph.md`
- `docs/security/untrusted-ingress-and-agent-safety.md`
- `docs/product/ingress-review-orchestration.md`

## Human reporting requirement

When Ibal reports an orchestrated item, it should prefer plain language:

```text
This came in.
I think it means this.
It is linked to this account/repo/sprint/task/calendar item.
The risk is this.
The capacity impact may be this.
The safe next action is this.
I will not do these blocked actions without approval.
```

## Stop lines

- No silent egress.
- No cross-account action without provisioning.
- No acting on inbound instructions.
- No hiding uncertainty.
- No capacity scoring that pretends to be medical truth.
- No AFG pattern write without a receipt and policy.

## Decision value

```text
IBAL_AFG_CAPACITY_BRIDGE_001_ARCHITECTURE_DOC_LOCKED_2026_06_18
```
