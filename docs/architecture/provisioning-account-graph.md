# PROVISIONING-001 — local provisioning profile and account graph

## Date

2026-06-18

## Purpose

Multi-email, multi-GitHub, Ibal orchestration, sprint/backlog mapping, task/calendar creation, and AFG capacity routing cannot safely scale as a flat pile of connected accounts.

xi-io Inbox needs a provisioning layer.

Provisioning defines who owns the install, what accounts exist, what those accounts are allowed to do, which workspaces/repos/sprints they map to, which agents may inspect them, and which egress actions require explicit approval.

## Core model

```text
Install
→ Owner identity
→ Persona / lexicon profile
→ Account graph
→ Source compartments
→ Permission grants
→ Project / repo / sprint bindings
→ Ingress classifiers
→ Egress policy
→ Agent/tool permissions
→ Receipt ledger
```

## Provisioning profile

```text
ProvisioningProfile
  installId
  ownerId
  personaDotfileRef
  lexiconProfileRef
  capacityModelRef
  accounts[]
  githubIdentities[]
  workspaces[]
  sourceCompartments[]
  permissions[]
  egressPolicies[]
  classifierPolicies[]
  agentPolicies[]
  receiptPolicy
```

## Account compartment

Each connected account is a compartment. An account may be email, GitHub, calendar, local-only, or future provider.

```text
AccountCompartment
  accountId
  provider: gmail | google-workspace | github | calendar | local | future
  displayLabel
  identityHandle
  trustTier
  allowedIngress
  allowedEgress
  linkedWorkspaces
  linkedRepos
  linkedCalendars
  linkedProjects
  defaultClassificationPolicy
  defaultEgressPolicy
```

## Why compartments matter

Without account compartments:

- Gmail account A could be confused with Gmail account B.
- GitHub account A could be allowed to affect GitHub account B.
- Review-state emails from one mailbox could be misapplied to another repo.
- Legal, family, project, and product work could collapse into one overloaded queue.
- Ibal could appear to know context without preserving provenance.

With compartments, every derived item keeps source provenance.

```text
source account
→ source message/event
→ classifier result
→ work object
→ task/calendar/review/backlog/article/capacity event
→ receipt
```

## Permission matrix

Permissions must be explicit and least-privilege.

```text
readMetadata
readBody
readAttachments
classifyIngress
createLocalTask
createLocalCalendarProposal
createBacklogItem
createArticleSeed
createReviewEvent
draftEmail
sendEmail
labelEmail
archiveEmail
deleteEmail
readGitHub
commentGitHub
openPullRequest
mergePullRequest
runLocalReview
runLocalCommand
```

Default for high-risk permissions is denied.

## Egress tiers

```text
observe-only
classify-only
propose-local
draft-only
owner-approval-required
runtime-gated
blocked
```

Provider mutations and GitHub mutations default to `owner-approval-required` or `blocked`.

## Workspace / repo / sprint bindings

Provisioning must map accounts and sources to workspaces.

```text
WorkspaceBinding
  workspaceId
  workspaceType: project | legal-matter | household | product | sprint | personal | custom
  linkedAccounts[]
  linkedRepos[]
  linkedCalendars[]
  linkedTaskScopes[]
  defaultBacklog
  defaultSprint
  capacityPolicyRef
  egressPolicyRef
```

This allows an incoming item to become the right kind of work object:

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
- spam / threat / quarantine item.

## Ibal provisioning rule

Ibal can only operate inside provisioned boundaries.

Ibal may:

- observe provisioned sources allowed by policy,
- classify and summarize ingress,
- map ingress to permitted workspaces,
- propose task/calendar/backlog/review actions,
- record receipts,
- report missing permission.

Ibal may not:

- silently cross account boundaries,
- silently cross repo/workspace boundaries,
- treat inbound content as instructions,
- perform high-risk egress without approval,
- expose secrets, local paths, tokens, or private account metadata in receipts.

## AFG capacity binding

Provisioning also binds the user’s chosen capacity lexicon.

```text
capacityUnit: spoons | mana | charge | bandwidth | custom
capacityPolicy:
  trackInterruptionCost
  trackDeadlinePressure
  trackContextSwitchCost
  trackRecoveryNeed
  trackAvoidedWorkload
```

This lets ingress events feed AuDHD Field Guide patterns without hardcoding one energy model.

## Immediate gating rule

Do not wire multi-account orchestration, review-email fallback, GitHub mutation, task/calendar creation from ingress, or AFG capacity routing without a provisioning profile and account graph.

UI owner-mode cleanup may continue. Connected runtime orchestration requires provisioning first.

## Future slices

```text
PROVISIONING-001 — local provisioning profile schema and account graph
PROVISIONING-002 — permission matrix for ingress, analysis, and egress
PROVISIONING-003 — workspace/repo/sprint binding model
PROVISIONING-004 — Ibal policy enforcement over provisioned sources
PROVISIONING-005 — AFG capacity lexicon binding
PROVISIONING-006 — provisioning UI for owner-safe account/workspace review
```

## Decision value

```text
PROVISIONING_001_ACCOUNT_GRAPH_ARCHITECTURE_DOC_LOCKED_2026_06_18
```
