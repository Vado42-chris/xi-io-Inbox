# Visual QA Rubric

## Purpose

Define how owner/framework visual proof is scored before PR #12 can move out of draft.

## Score Scale

| Score | Meaning |
| --- | --- |
| 0 | Fails: unclear, misleading, inaccessible, unsafe, or visually amateur. |
| 1 | Structurally present: required content exists, but hierarchy/composition is weak. |
| 2 | Usable but not polished: understandable and safe, but below competitive product quality. |
| 3 | Competitive product quality: clear, composed, accessible, distinctive, and visually credible beside mature products. |

## Categories

### Page Purpose Clarity

- 0: user cannot tell why the page exists.
- 1: purpose is present in text only.
- 2: purpose is visible through layout.
- 3: purpose is obvious through object model, hierarchy, and actions.

### Visual Hierarchy

- 0: all objects compete.
- 1: headings exist but weight is flat.
- 2: primary and secondary areas are distinguishable.
- 3: hierarchy directs attention without extra explanation.

### Object Model Clarity

- 0: user cannot identify primary object.
- 1: object exists but resembles generic cards.
- 2: object is recognizable.
- 3: object model matches lane metaphor and user expectation.

### Interaction Clarity

- 0: interactions are ambiguous or unsafe.
- 1: route/selection works but feels rough.
- 2: interactions are predictable.
- 3: interactions feel intentional, fast, and confidence-building.

### Component Consistency

- 0: inconsistent labels/states/controls.
- 1: repeated components exist but feel generic.
- 2: components are consistent and useful.
- 3: components repeat behavior while respecting page identity.

### Page-Specific Identity

- 0: page could be any lane.
- 1: labels differentiate the page.
- 2: content and layout partly reflect lane metaphor.
- 3: page has unmistakable native metaphor.

### Status / Safety Clarity

- 0: unsafe or misleading.
- 1: status is overexposed or noisy.
- 2: safety is clear but heavy.
- 3: safety is integrated, calm, and precise.

### Density Control

- 0: cluttered or sparse without purpose.
- 1: density is uniform.
- 2: density supports scan but lacks rhythm.
- 3: density, spacing, and disclosure support expert use.

### Accessibility Readiness

- 0: keyboard/focus/labels likely fail.
- 1: basic semantics exist but are incomplete.
- 2: focus/order/labels are testable and mostly clear.
- 3: WCAG-oriented behavior is built into layout and interaction.

### Competitive Polish

- 0: prototype or AI-generated feel.
- 1: internal admin quality.
- 2: usable product beta.
- 3: credible beside mature Microsoft, Google, Samsung, Linear, Notion, Todoist, or equivalent product surfaces.

## Minimum Scores

Before implementation can be considered acceptable:

- each category must score at least 2,
- no safety/accessibility category may score below 2,
- average page score must be at least 2.2.

Before local visual proof may be marked pass:

- each category must score at least 2,
- page purpose clarity, visual hierarchy, object model clarity, status/safety clarity, and accessibility readiness must each score 3 on the shell and Inbox lane,
- average page score must be at least 2.6,
- no page may score 0 in any category.

Before PR #12 can leave draft:

- shell/navigation/inspector system must pass UI-004B rubric,
- page-specific lanes must have recorded scores or documented blockers,
- owner/framework visual review must pass,
- no runtime/provider/platform claims may be added.

## Page Score Record Format

```text
Date:
Reviewer:
Route:
Commit:
Page purpose clarity: 0|1|2|3
Visual hierarchy: 0|1|2|3
Object model clarity: 0|1|2|3
Interaction clarity: 0|1|2|3
Component consistency: 0|1|2|3
Page-specific identity: 0|1|2|3
Status/safety clarity: 0|1|2|3
Density control: 0|1|2|3
Accessibility readiness: 0|1|2|3
Competitive polish: 0|1|2|3
Average:
Pass/fail:
Notes:
Required TODO updates:
```

## Failed Score Handling

- Any 0 creates a blocker TODO.
- Any safety/accessibility score below 2 blocks visual proof.
- Any page average below 2.2 blocks implementation acceptance.
- Any shell/Inbox critical category below 3 blocks PR draft exit.
- TODO updates must name the route, category, and required correction.

## Decision

```text
UI_004A_VISUAL_QA_RUBRIC_REQUIRED_BEFORE_OWNER_VISUAL_PROOF
```
