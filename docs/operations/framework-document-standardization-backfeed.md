# Framework Document Standardization Backfeed

## Purpose

Record what should become standardized in the xi-io framework so future projects do not
recreate planning, visual, cross-lane, and componentization documents from scratch.

This is a backfeed plan for `xi-io.net#239`; it is not a claim that framework updates have
already been made.

## Framework-level document templates needed

| Template | Framework purpose |
| --- | --- |
| `level-2-visual-experience-system.md` | Brand thesis, token map, lane identity, visual QA, no-AI-slop gate. |
| `level-3-cross-pollination-map.md` | Shared object graph, related zones, handoff contracts, anti-silo gates. |
| `level-4-lane-purpose-journey-index.md` | Lane promises, start/inspect/act/verify journeys, predicted failures. |
| `level-5-componentization-consistency-index.md` | Component inventory, duplication audit, ownership, extraction order. |
| `component-anatomy-and-boundary-checks.md` | Standard `Xi*` component anatomy and required checks. |
| `slice-receipt-template.md` | Date/branch/scope/implemented/not-implemented/self-review/validation/evidence. |

## Framework-level schemas or typed contracts needed

| Contract | Required fields |
| --- | --- |
| `XiRouteTable` | `id`, `label`, `route`, `laneId`, `primaryNav`, `contextNav`, `moduleOwner`, `scopeSupported`, `receiptSurface`. |
| `XiScopeLens` | `scopeKind`, `accountId`, `workspaceId`, `projectId`, `label`, `count`, `syncState`. |
| `XiReceipt` | `id`, `objectRef`, `actor`, `state`, `evidenceRefs`, `limitations`, `continueTarget`. |
| `XiProviderGate` | `providerId`, `surfaceIds`, `permissionSummary`, `dataTouched`, `gateState`, `blockedRuntimeAction`. |
| `XiRelatedObject` | `targetLane`, `targetRoute`, `objectId`, `sourceRef`, `reason`, `blockedState`, `receiptExpectation`. |
| `XiComponentOwnership` | `name`, `owner`, `frameworkTicket`, `repoAdapter`, `templateSlots`, `promotionState`. |

## Framework-level checks needed

| Check | Purpose |
| --- | --- |
| route table consistency | Prevent label/hash/lane drift and primary nav regressions. |
| component ownership | Prevent unclear framework/repo/template ownership. |
| duplicate renderer detection | Catch repeated receipt/detail/provider/sheet patterns. |
| blocked action grammar | Keep unsafe egress visibly blocked across products. |
| visual proof artifact | Require screenshots/videos for visible UI changes. |
| framework freshness hook | Compare project components against current framework candidates. |

## What remains repo-local

- Gmail/OAuth/token/privacy implementation.
- Product-specific provider catalog copy.
- Inbox-specific mail workbench behavior.
- Final brand expression until a white-label template proves reusable.

## Backfeed rule

A pattern can move toward framework only when:

1. it has a documented anatomy,
2. it has an owner classification,
3. it appears in at least one concrete product implementation,
4. it has safety/accessibility/visual gates,
5. it does not contain repo-private provider logic,
6. the receiving framework issue references exact evidence.

## Decision value

`FRAMEWORK_BACKFEED_REQUIRES_STANDARD_LEVEL_DOC_TEMPLATES_AND_COMPONENT_CONTRACTS`

