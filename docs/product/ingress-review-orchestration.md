# INGRESS-REVIEW-001 — mail-driven review orchestration

## Date

2026-06-18

## Purpose

xi-io Inbox is not only a mail client and not only a CI dashboard. The product direction is a connected local cockpit where mail, GitHub, review systems, calendar, tasks, backlog, and user capacity signals are normalized into safe next-action proposals with receipts.

This document promotes the mail-driven review orchestration plan from issue discussion into versioned repo truth.

## Core product loop

```text
mail / GitHub / runtime ingress
→ classify meaning and risk
→ normalize into a work/review event
→ map to repo / PR / sprint / backlog / task / calendar / Activity
→ propose safe next action
→ run fallback review only when policy allows
→ write receipt
→ wait for owner approval for egress
```

## Review-email loop

Bugbot, GitHub, Cursor, Dependabot, and CI notifications may arrive as email. These emails are not just ordinary messages. They are potential review-state ingress.

Target flow:

```text
1. Connect the owner mailbox in Tauri runtime.
2. Sync mail metadata first, bodies only when gated.
3. Classify incoming review messages:
   - review requested / running
   - review completed / success
   - review failed
   - usage or quota unavailable
   - ambiguous / untrusted
4. Normalize into Activity and a review queue.
5. Decide next safe action:
   - Bugbot success + CI green → eligible for owner review, not merge.
   - Bugbot fail / quota unavailable → propose framework fallback review.
   - Ambiguous / suspicious → surface to owner, no automation.
6. Framework fallback review can propose:
   - npm run check
   - npm run check:full
   - npm run gate:runtime002c
   - npm run peer-review:ollama -- --slice <id> --write
7. Receipt everything.
```

## What exists today

| Capability | Status |
| --- | --- |
| Gmail runtime connect/sync through Tauri | Built, operator proof still required |
| Browser `:4488` static preview | Fixture/static only, no live mailbox |
| Mail UI owner mode | FIX-BATCH-001 landed, owner retest pending |
| Local validation commands | Built: `npm run check`, `check:full`, `gate:runtime002c` |
| Ollama peer-review harness | Built/manual, not mail-triggered |
| GitHub notifications API ingress | Planned separately |
| Bugbot email parser | Not built |
| Review-state Activity normalization | Not built |
| Automatic fallback review proposal | Not built |
| Auto-merge / auto-push | Blocked |

## Taxonomy rule

GitHub integration should not become a fake mail account. Bugbot emails are different because they arrive in a real mailbox.

Correct model:

```text
Mail account: chris@vado42.ca
Message class: review-notification
Source system: cursor-bugbot | github-actions | github-notification | unknown
Source ref: github:pr:<number> | repo:<owner/name> | commit:<sha> | unknown
Action: propose next step, not auto-merge or auto-push
```

## Classifier shape

```text
ReviewNotificationEvent
  messageClass: review-notification
  sourceSystem: cursor-bugbot | github-actions | github-notification | dependabot | unknown
  reviewState: requested | running | success | failed | quota-unavailable | ambiguous
  repo: owner/name | unknown
  prNumber: number | unknown
  commitSha: sha | unknown
  sourceUrl: url | unknown
  confidence: high | medium | low
  trustState: trusted | known-sender | unknown | suspicious | malicious | quarantined
  senderAuth: pass | fail | unknown
  sourceAuthenticity: verified | plausible | unverified | spoofed | unknown
  riskClass: normal | spam | phishing | malware | prompt-injection | social-engineering | credential-theft | repo-takeover | ambiguous
  safeForAutomation: false
```

Default is always:

```text
safeForAutomation: false
```

## Safe next-action policy

| Detected state | Safe recommendation |
| --- | --- |
| success | Compare with current GitHub Actions state. If CI is green, propose owner review. Do not merge. |
| quota-unavailable | Propose framework fallback review using local checks / Ollama harness. |
| failed | Surface failure, link source, propose framework review. |
| ambiguous | Ask owner/agent to classify. No automation. |
| suspicious / malicious | Quarantine, report risk, no workflow action. |

## Human reporting requirement

Reports to Chris must say, in plain English:

- what email or notification was recognized,
- what state it appears to report,
- what confidence the classifier has,
- what risk class was assigned,
- what action the framework recommends,
- what is blocked or refused.

Do not report only parser tokens or batch codes.

## Stop lines

- No auto-merge.
- No auto-push.
- No PR ready-for-review without owner UI-003E token.
- No provider write/send/delete/label/archive/calendar/task mutation from email alone.
- No automatic GitHub mutation from email alone.
- No command execution from email body text.
- No attachment execution.
- No full-body parsing beyond scoped proof without approval.

## Related issues and future slices

- GitHub issue #21: `INGRESS-REVIEW-001: Bugbot email classify + framework fallback review loop`
- `PROVISIONING-001`: local provisioning profile schema and account graph
- `SECURITY-INGRESS-001`: untrusted ingress quarantine and classifier trust fields
- `SECURITY-AGENT-001`: prompt-injection and agent-instruction isolation harness
- `IBAL-ORCHESTRATION-001`: provisioned-source orchestration policy

## Decision value

```text
INGRESS_REVIEW_001_ARCHITECTURE_DOC_LOCKED_2026_06_18
```
