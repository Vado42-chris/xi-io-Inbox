# UI-002G CI Validation Evidence

## Purpose

Record automated validation evidence for PR #12.

## PR

`#12 UI-002: Add framework-derived static Inbox preview`

## Latest commit validated

```text
e4cd7a1a3095bd67813cfa92bee4ca9953e82716
```

## Previous validated commits

```text
ce6e9782378ab89157395fe704055bfbda1495e1
d08dfe026d3b45935930d525ad13d95f89f0e222
```

## Workflow

```text
Static Preview Check
```

## Latest workflow run

```text
run id: 27194007274
run number: 11
status: completed
conclusion: success
```

## Job

```text
job id: 80280942765
name: Static preview validation
status: completed
conclusion: success
```

## Passing steps

- Set up job
- Check out repository
- Set up Node.js
- Run static preview checks
- Post Set up Node.js
- Post Check out repository
- Complete job

## Artifacts

```text
none checked for run 11
```

No workflow artifact is expected for this validation job.

## Validation command

```bash
npm run check
```

This validates:

- required static preview files exist,
- preview JSON parses,
- preview JavaScript passes `node --check`.

## Latest-head interpretation

The current PR #12 head has fresh passing CI for static preview validation after the local proof-readiness and CI evidence updates.

The latest commits after the original CI evidence were documentation/proof-readiness updates plus TODO synchronization. The static preview check still passed on the updated head.

## Remaining blocker

Local visual/browser proof is still pending. CI proves static validity only. It does not prove visual layout quality, click behavior, keyboard behavior, browser console state, or screenshot evidence.

The local receipt target remains:

```text
docs/ui/ui-002-local-proof-status.md
```

## Decision value

`UI_002G_CI_STATIC_VALIDATION_PASSED_ON_UPDATED_HEAD_VISUAL_PROOF_PENDING`
