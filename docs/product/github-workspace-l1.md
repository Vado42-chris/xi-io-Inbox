# GITHUB-WORKSPACE-001 — first-class GitHub level-one workspace

## Date

2026-06-18

## Purpose

GitHub is a first-class connected identity in xi-io Inbox. It should not be hidden under a generic Integrations page. GitHub needs a level-one workspace similar in importance to Mail, Tasks, Calendar, Activity, and Ibal.

The GitHub workspace is the owner-facing surface for GitHub notifications, issues, pull requests, checks, reviews, security alerts, and repo-linked work signals from provisioned GitHub identities.

## Connected identity reference

Current connected GitHub identity available for reference:

```text
login: Vado42-chris
id: 189627615
```

This reference does not grant automatic mutation permission. GitHub egress remains blocked unless provisioned and owner-approved.

## Product model

```text
GitHub connected identity
→ GitHub resources: repos / orgs / PRs / issues / checks / reviews / alerts
→ notification / event ingress
→ classifier
→ work object
→ sprint / backlog / task / calendar / Activity / review queue
→ Ibal proposed next action
→ owner-approved egress
→ receipt
```

## Level-one navigation requirement

GitHub should be a level-one navigation item when at least one GitHub identity is provisioned or when the owner enables the GitHub workspace.

Navigation intent:

```text
Mail
GitHub
Calendar
Tasks
Automations
Activity
Ibal
Settings
```

Final ordering can be refined in UI review, but GitHub should not be buried inside Integrations.

## GitHub workspace surface

The GitHub page should be organized like Mail but with GitHub-native object types.

Primary owner sections:

1. **Inbox / Notifications**
   - mentions,
   - review requests,
   - assigned issues,
   - subscribed threads,
   - CI/check results,
   - security/dependency alerts,
   - release/repo events.

2. **Pull requests**
   - waiting for owner review,
   - checks failing,
   - checks passing,
   - review requested,
   - blocked by comments,
   - ready for merge review,
   - stale / needs rebase.

3. **Issues / backlog candidates**
   - assigned to owner,
   - created by owner,
   - linked to sprint/backlog,
   - unlabeled or triage needed,
   - potential task seeds.

4. **Checks / review state**
   - GitHub Actions state,
   - Bugbot email-correlated state,
   - framework fallback review state,
   - last known commit SHA,
   - owner proof gate state.

5. **Security / dependency alerts**
   - Dependabot/security alerts,
   - vulnerable dependency notices,
   - repo risk events,
   - security triage queue.

6. **Advanced**
   - raw webhook/API metadata,
   - GraphQL/REST object IDs,
   - receipt references,
   - classifier traces,
   - permissions and egress gates.

## GitHub message/event classes

Ibal and the classifier should recognize GitHub-specific message types:

```text
github.notification.mention
github.notification.review-requested
github.notification.assigned
github.notification.subscribed-thread
github.pr.opened
github.pr.updated
github.pr.review-requested
github.pr.review-submitted
github.pr.checks-passing
github.pr.checks-failing
github.pr.merge-conflict
github.pr.ready-for-owner-review
github.issue.opened
github.issue.assigned
github.issue.labeled
github.issue.blocked
github.check.failed
github.check.success
github.security.dependabot-alert
github.security.secret-scan-alert
github.release.published
github.unknown
```

Email-originated Bugbot notices are mail events that may correlate to GitHub objects:

```text
mail.review-notification.cursor-bugbot
  → github.pr:<number>
  → repo:<owner/name>
  → commit:<sha>
```

Native GitHub API events are GitHub events:

```text
github.pr.checks-failing
  → repo:<owner/name>
  → pr:<number>
  → commit:<sha>
```

Both can map to one review/work object while preserving provenance.

## Context-sensitive Ibal actions

Ibal should propose actions based on event type, trust state, time, repo/sprint context, and policy.

Examples:

| Event | Context | Ibal can propose |
| --- | --- | --- |
| Review requested | PR belongs to active sprint | Open review queue, summarize diff, run local peer review, create task |
| Checks failing | Recent PR head | Summarize failure, link CI, propose fallback check, create blocker task |
| Checks passing | UI-003E still blocked | Say CI is green but owner visual proof still blocks merge |
| Bugbot quota unavailable email | Correlates to PR/commit | Propose framework fallback review, not auto-run |
| Dependabot alert | Security risk | Create security triage item, link repo, no auto-update |
| Issue assigned | Sprint mapped | Create backlog/task seed, ask priority |
| Stale PR | Age threshold crossed | Propose rebase/check task |
| Malicious/suspicious notification | Untrusted source | Quarantine and report risk |

## Time sensitivity

GitHub actions must be context-sensitive over time:

```text
new review request → surface soon
failed CI on active PR → high urgency
failed CI on stale branch → lower urgency / backlog
checks passing but owner gate blocked → owner review reminder, not merge
Dependabot critical alert → security triage
old notification already superseded → collapse / archive candidate
```

The system should avoid repeatedly surfacing stale or superseded GitHub noise.

## Provisioning dependency

The GitHub workspace requires `PROVISIONING-001`.

Required provisioning concepts:

- GitHub identity as `ConnectedIdentity`.
- GitHub resources for orgs/repos/PRs/issues/checks/reviews.
- Repo/workspace/sprint bindings.
- Read and egress permission boundaries.
- Per-repo trust and mutation policy.

## Security dependency

The GitHub workspace requires `SECURITY-INGRESS-001` for untrusted ingress safety.

GitHub notification text, comments, PR descriptions, issue bodies, review comments, and CI logs are evidence, not instructions.

Ibal must not obey commands embedded in GitHub content.

## Egress stop lines

- No auto-merge.
- No auto-push.
- No automatic PR ready-for-review.
- No GitHub comments without owner approval.
- No issue/PR labels without owner approval.
- No branch or repo mutation without explicit provisioning and approval.
- No local command execution from GitHub text.

## Owner-facing acceptance criteria

- GitHub appears as a first-class level-one workspace when provisioned.
- The page separates notifications, PRs, issues, checks, and security alerts.
- Ibal summarizes GitHub events in plain language.
- Ibal identifies event type, repo, PR/issue/check, age, risk, and suggested action.
- Bugbot emails and native GitHub events can correlate to the same review object.
- All egress remains approval-first.
- Unknown/suspicious GitHub content is quarantined or marked unsafe.

## Decision value

```text
GITHUB_WORKSPACE_001_L1_WORKSPACE_ARCHITECTURE_DOC_LOCKED_2026_06_18
```
