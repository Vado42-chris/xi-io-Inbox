# Page Leveling And Wargame Standard

## Purpose

Define how `xi-io Inbox` pages move from current structural preview toward competitive, framework-grade UI quality.

This document adds a process layer above the UI-004A visual standard and page plans. It does not implement UI code and does not complete visual proof.

## Two Separate Measures

### Visual QA Score

Visual QA uses the existing 0-3 rubric in:

```text
docs/ui/polish/12-visual-qa-rubric.md
```

It scores a screenshot or browser state across purpose, hierarchy, object clarity, interaction clarity, component consistency, page identity, safety, density, accessibility readiness, and competitive polish.

### Page Maturity Level

Page maturity uses Levels 0-5.

It measures whether a page is ready to drive implementation, product review, framework reuse, and future proof receipts.

## Maturity Levels

| Level | Name | Meaning |
| --- | --- | --- |
| 0 | not viable | Page fails purpose, safety, or basic comprehension. |
| 1 | structural | Required content and route structure exist. |
| 2 | usable | User can complete core read/inspect tasks without unsafe action. |
| 3 | product | Page has a native metaphor, object model, and clear workflow. |
| 4 | competitive | Visual hierarchy, interaction, accessibility, and rhythm are credible beside mature products. |
| 5 | framework-grade | Pattern is reusable, documented, wargamed, scored, receipted, and ready to feed back to `xi-io.net`. |

## Level 0: Not Viable

Meaning:

- page purpose is unclear,
- safety or egress state is misleading,
- primary object cannot be identified,
- user cannot tell what to do next.

Required evidence:

- current screenshot or route note,
- failing visual QA score,
- blocking TODO entry.

Exit criteria:

- page reaches Level 1 structural completeness,
- no dangerous action is implied as available.

## Level 1: Structural

Meaning:

- route exists,
- required lane content exists,
- navigation reaches the page,
- inspector is present,
- no-runtime policy remains visible.

Required evidence:

- route loads,
- lane appears in navigation,
- static fixture content exists,
- no product UI code claims runtime readiness.

Exit criteria:

- visual QA has no 0 in page purpose, safety, or accessibility readiness,
- page has at least one explicit primary object.

## Level 2: Usable

Meaning:

- user can complete the primary read/inspect task,
- page has a predictable route and selection path,
- blocked actions are understandable,
- inspector answers the selected-context questions.

Required evidence:

- at least two wargame scenarios pass,
- keyboard path is documented,
- egress and provider blocks are visible,
- no runtime write path exists.

Exit criteria:

- visual QA average is at least 2.2,
- safety and accessibility readiness are at least 2,
- failed scenarios have TODO entries.

## Level 3: Product

Meaning:

- page has a lane-specific metaphor,
- primary and secondary object models are clear,
- action hierarchy is visible,
- page no longer feels like generic card/pill output.

Required evidence:

- page plan references the native metaphor,
- scenario matrix includes lane-specific task flow,
- inspector behavior is page-specific,
- status tokens are layered by scope.

Exit criteria:

- page-specific identity score is at least 2,
- object model clarity score is at least 2,
- at least one scenario exercises cross-lane context where applicable.

## Level 4: Competitive

Meaning:

- page can plausibly sit beside mature products in visual discipline,
- density, rhythm, type, and spacing are intentional,
- interactions are predictable and polished,
- safety is integrated rather than pasted on.

Required evidence:

- desktop and mobile screenshots,
- visual QA average is at least 2.6,
- no category below 2,
- owner/framework review notes,
- a11y and egress checks pass for the page scope.

Exit criteria:

- visual hierarchy, purpose, status/safety, and accessibility readiness score at least 3 for shell/Inbox critical routes,
- no major visual-composition blocker remains open.

## Level 5: Framework-Grade

Meaning:

- page pattern is stable enough to become a reusable xi-io framework candidate,
- component anatomy and interaction contract are documented,
- wargame scenarios pass,
- visual QA receipt exists,
- feedback has been reported to `xi-io.net#239` when relevant.

Required evidence:

- Level 4 pass,
- component inventory link,
- interaction standard link,
- visual QA score receipt,
- wargame result receipt,
- framework feedback disposition.

Exit criteria:

- reusable candidates are identified as promote now, promote later, or product-local only,
- no duplicate competing local pattern remains undocumented,
- TODO reflects any remaining framework follow-up.

## Moving Up A Level

A page may move up only when:

- required evidence for the next level exists,
- failed scenarios have TODO entries,
- no safety/accessibility blocker is ignored,
- owner/framework notes are recorded when human review occurred.

## Regression

A page regresses when:

- route or navigation breaks,
- a safety/egress claim becomes misleading,
- visual QA category drops below required threshold,
- provider/runtime/platform behavior is implied without proof,
- page starts duplicating a generic layout instead of its native metaphor.

Regression creates a TODO entry with:

```text
route:
previous level:
new level:
reason:
blocking category:
required repair:
```

## Failure To TODO Rule

Every failed scenario must create a concrete TODO:

- route,
- scenario id,
- failed expectation,
- affected component,
- required correction,
- whether blocking or advisory.

## Owner / Framework Review Receipt

Owner or framework review must record:

```text
date:
reviewer:
route:
commit:
screenshots:
level before:
level after:
visual QA score:
wargame scenarios reviewed:
decision:
blockers:
next action:
```

## Simulated Wargame Limits

Simulated user testing is a preflight filter.

It can find:

- unclear hierarchy,
- missing safety feedback,
- generic page identity,
- broken task paths,
- missing inspector answers,
- framework reuse candidates.

It cannot prove:

- real user comprehension,
- owner visual approval,
- WCAG conformance,
- runtime security,
- provider behavior,
- platform architecture.

## Acceptance

This standard is valid when:

- visual score and maturity level stay separate,
- every level has evidence and exit criteria,
- simulated testing cannot be mistaken for final proof,
- failures produce TODOs and receipts.

## Decision

```text
UI_004A5_PAGE_LEVELING_AND_WARGAME_STANDARD_REQUIRED_BEFORE_UI_004B
```
