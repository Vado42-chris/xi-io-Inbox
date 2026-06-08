# xi-io Framework Alignment

## Purpose

`xi-io Inbox` must remain aligned with `xi-io.net` as the framework/control-plane source of truth.

## Relationship

```text
xi-io.net = framework/control plane
Ibal = observer/conductor/orchestrator
xi-io Inbox = product/adaptor/data plane for personal communication ingress and controlled egress
```

## Inbox role in the suite

`xi-io Inbox` specializes in:

- email ingress
- message/thread normalization
- draft-only egress
- task/bug/action compilation
- calendar/schedule proposal creation
- contact and attachment intelligence
- archive/export packet generation
- automation bridge events
- model-provider routing for communication analysis

## Framework dependencies

Inbox should consume or align with framework rules for:

- provider registry
- event schema patterns
- receipts
- verifier gates
- egress permissions
- Ibal orchestration
- calendar/event archive doctrine
- task/workflow standards
- source/freshness tracking
- product registry and role contracts

## Two-way freshness

Changes made in Inbox that are generally reusable should be reported back to `xi-io.net` as framework freshness candidates.

Examples:

- egress permission schema
- portable inbox archive standard
- model-provider manifest
- automation bridge contract
- task/action compiler schema
- contact/entity dedupe pattern
- message-to-bug compiler pattern

## Do not duplicate framework logic

If a contract belongs across many xi-io products, it should be promoted to the framework instead of being trapped inside Inbox.

## Current status

Inbox has been bootstrapped with public-safe docs only. Framework adoption remains pending until source audit and schema comparison are complete.
