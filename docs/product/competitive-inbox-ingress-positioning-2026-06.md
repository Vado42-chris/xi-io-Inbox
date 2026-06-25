# Industry inbox and ingress positioning capture

## Status

```text
Type: industry pattern capture (docs only — not roadmap authority)
Date: 2026-06-19
Scope: UI language, skip list, include-later list, quiet proof, five literal jobs
Excluded: product code, provider utilities, architecture implementation (#21–#25)
Supersedes: ad-hoc competitor naming in agent chat (no competitor names in xi-io identifiers)
```

## Non-authority clause

This document captures **industry UX direction** for copy and prioritization. It does **not** authorize:

```text
product-code implementation by itself
provider egress or mutation
GitHub level-one workspace implementation
utility export implementation (PDF, Drive, Sheets, etc.)
gate bypass or UI-003E PASS
unblocking issues #21–#25
```

Any implementation still requires the relevant slice plan, owner approval where required, and active repo gates (`AGENTS.md`, `03-sprint-slice-plan.md`, architecture decision tokens). Agents must not cite this doc as permission to ship blocked features.

## Naming rule (mandatory)

This document captures **industry direction** from competitive research. It is a standard product patch, not a fork and not a vendor roadmap.

```text
Competitor product names may appear ONLY in the Discovery matrix section of this document.
They must NOT appear in:
  xi-io slice IDs
  decision tokens
  user-facing UI copy
  schemas, code identifiers, or file names (except this analysis doc title)
  framework export candidates
```

When agents refer to this work in receipts or commits, use **industry UX direction**, **literal job language**, or **quiet proof** — not competitor brand names.

## Purpose

Prevent competitor discovery from becoming product sprawl. Lock scope discipline and user-language direction on top of architecture already committed at `17f1cd3`:

- `docs/product/ingress-review-orchestration.md` — `INGRESS_REVIEW_001_ARCHITECTURE_DOC_LOCKED_2026_06_18`
- `docs/architecture/provisioning-account-graph.md` — `PROVISIONING_001_GITHUB_FIRST_CLASS_CONNECTED_IDENTITY_CORRECTION_2026_06_18`
- `docs/security/untrusted-ingress-and-agent-safety.md` — `SECURITY_INGRESS_001_UNTRUSTED_INGRESS_DOC_LOCKED_2026_06_18`
- `docs/product/ibal-afg-capacity-bridge.md` — `IBAL_AFG_CAPACITY_BRIDGE_001_ARCHITECTURE_DOC_LOCKED_2026_06_18`
- `docs/product/github-workspace-l1.md` — `GITHUB_WORKSPACE_001_L1_WORKSPACE_ARCHITECTURE_DOC_LOCKED_2026_06_18`

## User-facing objective (protect this narrative)

Agents may use internal slice IDs underneath. The product promise above the fold should collapse to:

```text
Make the UI calm, literal, and safe:
  five obvious actions
  quiet proof
  clear blocked states
  independent column scrolling
  no advanced receipts unless requested
```

## xi-io wedge (not a utility grid)

```text
Industry pattern A: choose a tool → run one mailbox/cloud job.
Industry pattern B: AI assistant + shared inbox → team routing in Gmail.
Industry pattern C: AI agents + workflows → cross-system ticket resolution.

xi-io counter-position:
  drop input → classify → explain → propose safe actions → preview egress → quietly save proof
```

Lead with calm operator state, not a tool grid or chatbot:

```text
What came in?
What is it?
What can safely happen next?
What proof is saved?
What needs me?
```

## Discovery matrix (competitors named here only)

First-pass set. Discovery is **useful but incomplete** — expand before declaring market framing final.

### Competitor buckets

```text
utility tools          — literal Gmail/cloud jobs, export/save/share wizards
AI shared inbox        — team routing, shared drafts, AI sort/dispatch in mailbox
developer/project orchestration — GitHub, issues, PRs, agent review handoff
premium speed/attention UX — keyboard flow, split views, reminders, polished interaction quality
```

The fourth bucket covers speed-and-attention products (for example Superhuman, Spark). xi-io does not copy their feature sets; it learns the **interaction quality bar** — especially while shell scrolling and column layout remain owner-verify items (`SLICE-UI-SHELL-001`).

| Competitor | User promise | Primary UI model | What to learn | What to avoid | xi-io counter-position |
| --- | --- | --- | --- | --- | --- |
| CloudHQ | Many one-click Gmail/cloud utilities | Extension/app grid, wizards | Literal job naming; users understand “save/export/share” immediately | Dozens of micro-apps; marketing automation; tracking ethics | Safe ingress operator; five jobs, not sixty tools |
| Gmelius | AI assistant + shared inbox in Gmail | Gmail-native team workflow | AI sort/draft/dispatch language; shared labels/drafts/notes | Becoming only a shared inbox widget | Proof + cross-repo/project operator with owner-gated egress |
| Hiver | AI customer service across systems | Helpdesk workflows, AI agents | Guardrails, observability, procedure language | Support-only framing; silent cross-system mutation | General project ingress + quiet proof, not ticket desk clone |
| Superhuman | Fast email with AI replies and attention tools | Keyboard-first inbox, split views, snippets | Speed, polish, attention management, interaction quality | Read-receipt ethics; becoming “email client only” | Calm operator + proof; learn interaction bar via UI-SHELL-001, not feature clone |

### Discovery still open

| Area | Question |
| --- | --- |
| Gmelius | Current UI and onboarding flow (beyond marketing) |
| Hiver | AI agent/workflow UI and observability model |
| Front / Missive | Shared inbox and team collaboration patterns |
| Superhuman / Spark | Speed, modern interaction, keyboard-first flows |
| Linear / GitHub Projects / Jira | Work-object and issue flow design |
| Cursor / CodeRabbit / Jules-like agents | AI review and code-agent handoff |
| Utility vendors | Post-install extension UX, not homepage copy only |

Key UX question for next discovery pass:

```text
Do competitors lead with a tool grid, an inbox, an AI assistant, a workflow board, or a command surface?
```

## Industry patterns → xi-io translation

Map competitor **jobs** to xi-io concepts. Do not copy features one-for-one.

| Industry job pattern | xi-io user language | Internal concept | Near-term |
| --- | --- | --- | --- |
| Save/export to PDF, Drive, Sheets | Preserve as proof · Export summary | Receipt + local artifact | Summary yes; external export later |
| Email → structured data | This looks like… (invoice, lead, task, review) | Ingress classification | After PROVISIONING-001 + SECURITY-INGRESS-001 |
| Label / folder sharing | Share work packet | Scoped case folder | Later |
| Multi-item forward / batch | Batch review | Multi-ingress classify | Later |
| Templates / scheduled follow-up | Draft reply · Remind me | Draft + calendar proposal | Draft spine exists; scheduling proposal-only |
| Notes / annotations | Add note to proof | Annotation on ingress object | Later |
| Security / audit reassurance | Proof saved · Why blocked | Capability ACL, body-gate | Partial — Settings/Account overlays |
| One-click literal naming | Command lexicon above the fold | Same events/receipts internally | Yes — see `docs/ui/user-language-map.md` |

Companion artifact: **`docs/ui/user-language-map.md`** — design-system dependency for copy and QA.

## Five literal jobs (owner default)

These are the first obvious actions. They appear as contextual commands or card actions, not a giant toolbar.

```text
1. Preserve as proof
2. Export summary
3. Create task / issue
4. Share work packet
5. Draft reply / response
```

Provider/runtime execution of these jobs remains blocked until egress gates pass. Static preview may simulate proposals and dry-run only.

## Quiet proof model (protect)

Competitors can copy export buttons and AI summaries. Harder to copy: coherent proof across mail, GitHub, files, local execution, and framework reporting.

User-facing proof states:

```text
Proof saved
Proof missing
Proof needed
```

Hide raw receipt IDs, pass tokens, framework refs, commit SHAs, and agent labels from primary UI. Full proof remains one click away under **Why · Details · Proof**.

Internal term **receipt** stays in code, schemas, and agent docs.

## Include now (UX direction only)

```text
Literal job labels in owner-mode default UI
Quiet proof badges on cards and actions
Clear blocked / needs approval / done states
Independent column scrolling (shell hygiene)
Ingress cards as a future visual pattern (fixture/mock first)
GitHub work-object human states as a future visual pattern (fixture/mock first)
Trust details behind disclosure (model route, body-gate, storage policy)
```

## Include later (after gates)

```text
Save to Drive / Dropbox / OneDrive / S3
Export to Sheets
PDF export packet
Shared team inbox workflows
Analytics by tag / project / source
Automation rules with runtime execution
GitHub level-one workspace (implementation)
Ingress-card backend normalization
```

## Skip for now (explicit)

```text
Mass email campaigns
Open tracking as a core feature
SMS forwarding / full-content SMS alerts
HTML email editor / campaign templates
Auto-BCC as a first-class feature
Full cloud-to-cloud migration / backup
Dozens of extension-style micro-apps
Visible receipt dashboards as primary navigation
Competitor-style utility grid as home screen
Provider mutation without owner-approved egress preview
```

## Sequencing (repo gates)

Product direction in this doc is **approved for planning**. Implementation sequencing remains gated:

| Step | Status |
| --- | --- |
| UI peer-review owner-mode batches (001–006) | Landed — owner retest pending |
| FIX-BATCH-007 Automations owner-mode | Next implementation unless stop-line conflict |
| Activity B6 visual classify | Before Activity batch |
| Integrations IA decision | Before Integrations batch |
| UI-003E owner visual proof | **NOT passed** — owner only |
| MERGE-PREP-001 | Blocked until UI-003E PASS |
| Issues #21–#25 implementation | Blocked — architecture docs locked only |
| Planned slices below | Documented — not started |

Do **not** implement utility exports, ingress-card backend, or GitHub L1 workspace until current owner-mode and UI-003E gates are resolved.

## Planned slices (xi-io IDs only)

Linked from `docs/product/03-sprint-slice-plan.md`. Names describe **our** work, not competitors.

| Slice ID | Goal | Blocked by |
| --- | --- | --- |
| SLICE-UI-SHELL-001 | Independent column scroll; `100dvh`; `min-height: 0`; no broken overflow | Owner verify during UI-003E |
| SLICE-QUIET-PROOF-001 | Proof saved / missing / needed badges; receipts behind disclosure | UI-003E; Activity owner-mode |
| SLICE-COPY-LITERAL-001 | Five literal jobs + user-language map in owner default UI | `docs/ui/user-language-map.md`; UI-003E |
| SLICE-INGRESS-CARD-001 | File, URL, GitHub ref, screenshot/log ingress cards | PROVISIONING-001, SECURITY-INGRESS-001 |
| SLICE-GITHUB-WORK-OBJECT-001 | Human GitHub states (needs eyes, failed check, proof missing, etc.) | GITHUB-WORKSPACE-001 implementation scope |

## Failure points

| Risk | Severity | Mitigation |
| --- | --- | --- |
| Competitor checklist becomes backlog explosion | High | Skip list + five jobs cap |
| Internal jargon remains above the fold | High | User-language map + COPY-LITERAL-001 |
| Quiet proof feels like surveillance | Medium | “Proof saved for you” not “audit log” |
| Utility grid copied before operator UX is calm | High | Finish peer-review owner-mode first |
| Discovery overfit to one vendor | Medium | Three-bucket matrix; expand discovery before final framing |

## Validation

| Check | When |
| --- | --- |
| Doc review | This pass |
| `npm run check:quick` | After doc commit |
| Owner `:4488` retest | After FIX-BATCH-007 Automations |
| UI-003E PASS | Owner only — not inferred from this doc |

## Decision

```text
INDUSTRY_UX_001_INBOX_INGRESS_POSITIONING_CAPTURED_2026_06_19
```

Industry direction captured. No product code. No competitor names in xi-io naming structures. Next implementation lane: FIX-BATCH-007 Automations owner-mode unless owner directs otherwise.
