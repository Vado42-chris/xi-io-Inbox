# PROVISIONING-001 — local provisioning profile and account graph

## Date

2026-06-18

## Purpose

Multi-email, multi-GitHub, Ibal orchestration, sprint/backlog mapping, task/calendar creation, and AFG capacity routing cannot safely scale as a flat pile of connected accounts.

xi-io Inbox needs a provisioning layer.

Provisioning defines who owns the install, what first-class connected identities exist, what those identities are allowed to do, which workspaces/repos/sprints they map to, which agents may inspect them, and which egress actions require explicit approval.

## Critical taxonomy correction

GitHub identities are first-class connected identities in xi-io Inbox, the same class of object as email accounts.

GitHub should not be demoted to a secondary widget or generic integration. GitHub is a work-source identity that can ingress issues, PRs, checks, review comments, CI state, security alerts, Dependabot items, and repository events. It can also create high-risk egress if allowed: comments, review submissions, labels, branch changes, PR creation, and merges.

Correct model:

```text
ConnectedIdentity
  → Email identity / mailbox resources
  → GitHub identity / repository resources
  → Calendar identity / calendar resources
  → Local identity / local resources
```

Email and GitHub are different providers with different resource models, but both are first-class sources of truth in the account graph.

Bugbot emails remain mail ingress. Native GitHub API events remain GitHub ingress. Both can map to the same review/work object with preserved provenance.

## Core model

```text
Install
→ Owner identity
→ Persona / lexicon profile
→ Connected identity graph
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
  connectedIdentities[]
  sourceCompartments[]
  workspaces[]
  permissions[]
  egressPolicies[]
  classifierPolicies[]
  agentPolicies[]
  receiptPolicy
```

## Connected identity

A connected identity is a first-class account-level object. Email, GitHub, calendar, and local identities all use this shared identity slot before provider-specific resource mapping.

```text
ConnectedIdentity
  identityId
  provider: gmail | google-workspace | github | calendar | local | future
  identityKind: email | source-control | calendar | local | custom
  displayLabel
  identityHandle
  trustTier
  authMode
  allowedIngress
  allowedEgress
  linkedWorkspaces
  defaultClassificationPolicy
  defaultEgressPolicy
  resources[]
```

## Provider resource examples

Provider resources are children of a first-class connected identity.

```text
EmailResource
  resourceId
  identityId
  address
  mailboxLabels
  syncPolicy
  bodyReadPolicy
  attachmentPolicy
```

```text
GitHubResource
  resourceId
  identityId
  accountLogin
  installationId
  repos[]
  organizations[]
  pullRequestScopes[]
  issueScopes[]
  checksPolicy
  reviewPolicy
  mutationPolicy
```

```text
CalendarResource
  resourceId
  identityId
  calendars[]
  eventReadPolicy
  eventWritePolicy
```

## Source compartment

Each connected identity and resource maps into compartments. A compartment may be email, GitHub, calendar, local-only, or future provider.

```text
SourceCompartment
  compartmentId
  identityId
  resourceId
  provider: gmail | google-workspace | github | calendar | local | future
  displayLabel
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
- GitHub org/repo A could be confused with GitHub org/repo B.
- Review-state emails from one mailbox could be misapplied to another repo.
- Native GitHub checks from one repo could be misapplied to another sprint or product lane.
- Legal, family, project, and product work could collapse into one overloaded queue.
- Ibal could appear to know context without preserving provenance.

With compartments, every derived item keeps source provenance.

```text
connected identity
→ provider resource
→ source account/event/message
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
readGitHubChecks
readGitHubReviews
commentGitHub
labelGitHubIssue
openPullRequest
submitPullRequestReview
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

Provisioning must map connected identities and source compartments to workspaces.

```text
WorkspaceBinding
  workspaceId
  workspaceType: project | legal-matter | household | product | sprint | personal | custom
  linkedIdentities[]
  linkedSourceCompartments[]
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
- map GitHub issues, PRs, checks, and reviews to work objects,
- propose task/calendar/backlog/review actions,
- record receipts,
- report missing permission.

Ibal may not:

- silently cross account boundaries,
- silently cross GitHub identity, org, repo, or workspace boundaries,
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

Do not wire multi-account orchestration, review-email fallback, GitHub mutation, task/calendar creation from ingress, or AFG capacity routing without a provisioning profile and connected identity graph.

UI owner-mode cleanup may continue. Connected runtime orchestration requires provisioning first.

## Future slices

```text
PROVISIONING-001 — local provisioning profile schema and connected identity graph
PROVISIONING-002 — permission matrix for ingress, analysis, and egress
PROVISIONING-003 — workspace/repo/sprint binding model
PROVISIONING-004 — Ibal policy enforcement over provisioned sources
PROVISIONING-005 — AFG capacity lexicon binding
PROVISIONING-006 — provisioning UI for owner-safe account/workspace review
```

## Decision value

```text
PROVISIONING_001_GITHUB_FIRST_CLASS_CONNECTED_IDENTITY_CORRECTION_2026_06_18
```
