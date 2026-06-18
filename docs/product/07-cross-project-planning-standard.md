# Cross-Project Planning Standard

## Purpose

Define the planning packet every xi-io product should carry before serious implementation,
visual proof, component extraction, or framework backfeed.

This document converts the Level 1-5 wargaming pattern into a reusable planning standard.

## Required planning packet

| Level | Required document | Required outcome |
| --- | --- | --- |
| Level 1 | Branch truth + product requirements + slice plan | Agents know the correct branch, product scope, gates, and current work. |
| Level 2 | Visual experience system | Product has a named visual thesis, token plan, lane identity, and no-AI-slop gate. |
| Level 3 | Contextual cross-pollination map | Pages do not become silos; related objects and handoffs are explicit. |
| Level 4 | Lane purpose and journey index | Every lane has a memorable promise, full user journey, and predicted failures. |
| Level 5 | Componentization and consistency index | Reusable components, ownership, extraction order, and boundary checks are explicit. |

## Standard fields for every planning doc

Each planning document must include:

```text
Title
Status
Purpose
Scope
Excluded scope
Dependencies
Decisions
Acceptance criteria
Failure points
Validation / evidence
Decision value
```

For UI and component documents, also include:

```text
Lane impact
Cross-lane impact
Safety / egress claims
Framework ownership
Template impact
Screenshot/video requirement
```

## Standard gates

| Gate | Rule |
| --- | --- |
| No silent success | Failed/skipped checks must be recorded as blocked or warning. |
| No branch confusion | Planning docs must name product branch vs bootstrap branch. |
| No visual proof by assertion | Owner-quality UI needs screenshot/video evidence and visual QA. |
| No component theater | "Componentized" requires module boundary, anatomy spec, and checks. |
| No framework leakage | Repo-specific provider/private logic stays repo-local. |
| No template leakage | Product-specific copy cannot become reusable default. |
| No unsafe egress | Send/sync/delete/execute/provider mutation stays blocked unless gate explicitly opens. |

## Standard slice planning

Every slice row should state:

```text
ID
Goal
Scope
Excluded scope
Dependencies
Acceptance criteria
Validation evidence
Evidence artifact
Rollback/block condition
Ready state
Done state
Estimate impact
```

## Standard receipt shape

Every implementation receipt should include:

```text
Date
Branch
Scope
Implemented
Not implemented
Self peer review
Validation
Walkthrough evidence, if UI-visible
Decision value
```

## Standard self-review questions

Each meaningful slice must answer:

- Is this the correct fix, or are we treating a symptom?
- Did we truncate a product requirement?
- Did we hallucinate a completed capability?
- Did we duplicate an existing pattern?
- Did we weaken safety, privacy, or egress policy?
- Did we create future framework/template debt?
- What would fail silently without a check?

## Decision value

`CROSS_PROJECT_PLANNING_REQUIRES_LEVEL_1_TO_5_WARGAME_PACKET`

