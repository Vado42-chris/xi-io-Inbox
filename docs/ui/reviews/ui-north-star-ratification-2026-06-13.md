# UI North Star Ratification

## Date

2026-06-13

## Branch

`cursor/gmail-harden-5e1b`

## Decision

```text
UI_NORTH_STAR_DRAFT_CENTERED_HUMAN_FIRST_ONE_NAV_MODULAR_STRANGLER_RATIFIED
```

Proceed with the draft-centered spine as the product model:

```text
Received message = input.
Draft = work artifact.
Send = event boundary.
Receipt = audit artifact.
Capabilities support the draft lifecycle.
Ibal is concierge/command entry, not a lane.
```

## Why this path

- It preserves completed Mail/Drafts/Approvals work instead of discarding it.
- It resolves duplicate lane/nav models by defining one spine and capability layer.
- It matches existing safety invariants: AI proposes, human controls, receipts record.
- It unlocks module skeleton work without requiring a big-bang rewrite.

## Safety limits

- No irreversible deletion of working UI in this ratification pass.
- No send, draft write, provider mutation, automation execution, or runtime claims.
- Route/lane removal requires a focused migration receipt and passing route smoke.
- `public/inbox-preview.js` migration must be strangler-style.

## Self peer review

| Question | Answer |
| --- | --- |
| Best path? | Yes. It is the least destructive route because it turns existing draft work into the spine instead of replacing it. |
| Correct fix vs different approach? | Correct sequencing: ratify model first, then module skeleton, then extraction. |
| Truncation? | No. The decision references the north-star plan and preserves safety limits. |
| Hallucination? | No new product capability is claimed; this is a planning/gating decision. |
| Duplicated work? | Reduces duplicate lane models by selecting one canonical spine. |
| Efficiency improvement | Future agents can start module skeleton work without re-litigating UI-003/UI-005/UI-007 conflicts. |

## Next allowed work

1. UI-003E owner visual-proof support packet.
2. Module skeleton and route-table contract.
3. First route/nav strangler extraction.

