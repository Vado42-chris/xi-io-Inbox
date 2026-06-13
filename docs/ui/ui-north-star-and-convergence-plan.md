# UI North Star and Convergence Plan

## Status

```text
Type: RFC for owner ratification + convergence plan.
Supersedes (as the single UI source of truth) the competing direction in:
  docs/ui/ui-003-unified-app-shell-architecture.md   (lane-shell era)
  docs/ui/ui-005-human-operable-shell-architecture.md (operability correction)
  docs/ui/ui-007-draft-workbench-architecture.md      (draft-centered correction)
Those remain valid as history/reference. This doc reconciles them into one model.
Companion: docs/operations/multi-agent-orchestration.md
```

## 1. Diagnosis (evidence-based)

The product has a strong spine and vision but the UI has not converged. Measured facts
from the current `ui-002` preview:

- `public/inbox-preview.js`: **10,638 lines, 475 functions**, storage **schema v11**, with
  legacy keys and migrations (`MIGRATION_UI005B_KEY`, `LEGACY_STORAGE_KEY`,
  `IBAL_LEGACY_LANE`) handled redundantly across the file.
- **Three product models live at once.** The file still carries UI-003 lanes
  (`projects`, `planning`, `bugs`, `evidence`, `ibal` lane) while implementing the UI-007
  draft-workbench top nav (Mail, Drafts, Approvals). They contradict each other.
- **Three competing navigation systems** render simultaneously (observed in browser):
  top tabs (`Mail, Drafts, Approvals, Plan, Automations, Activity, Integrations`), a
  context-switching left rail (`Plan → Epics, Stories, Bugs, Evidence`), and Home bottom
  tabs (`Calendar, Tasks, Activity, Settings`). The same destinations are reachable
  multiple ways. This is the "over-complicated / duplicate / redundant" feeling directly.
- **Planning has out-run implementation.** Dozens of `ui-00x` and `polish/00-16` docs
  describe successive pivots; the implementation is a single file absorbing all of them.

Root cause: **sequential single-agent passes onto a monolith with no ratified model and no
module boundaries.** Fixing the file is necessary but not sufficient; the model and the
process must converge first.

## 2. Canonical product model (RFC — owner to ratify)

Reconcile the three eras into one. The latest owner clarification (2026-06-10, UI-007) is
the strongest signal and the others fit inside it:

```text
The received message is an INPUT.
The draft is the WORK ARTIFACT.
Send is the EVENT BOUNDARY.
Calendar, Tasks, Automations, Files, Projects, Extensions are CAPABILITIES
  triggered from the ingress → draft → send → receipt lifecycle, not peer pages.
Ibal is the CONDUCTOR/CONCIERGE, available everywhere, proposal-only.
Everything is HUMAN-OPERABLE first, AI-AUGMENTED second.
Every confirmed or simulated action produces a RECEIPT.
```

This is "more than a mail client": the mail loop is the spine, and the capability layer +
Ibal + receipts make it a personal operations command center — while privacy and
draft-only egress stay non-negotiable.

> **Decision needed from owner:** ratify the draft-centered spine as the canonical model.
> Until ratified, agents implement the shell/design-system (model-agnostic) only.

## 3. Canonical information architecture (one nav, no duplication)

Replace the three nav systems with **one** coherent model:

```text
Persistent top bar:  identity · workspace/account · provider/privacy status ·
                     command entry (opens Ibal) · Ibal concierge button

Primary spine (the work):   Home · Mail Workbench
  Mail Workbench inner flow: Inbox → Drafts → Approvals → Sent / Receipts

Capabilities (contextual + a single secondary group):
  Calendar · Tasks · Automations · Extensions · Settings / Provider Gates

Ibal:     concierge drawer + command entry. NOT a nav lane.
Receipts: audit ledger, reachable from the spine and every capability.
```

### Remove / merge list (kill the redundancy)

| Remove as a top-level destination | Fold into |
| --- | --- |
| `Plan` lane | Tasks |
| `Epics`, `Stories` | Tasks (as views/grouping within Tasks) |
| `Bugs` | Tasks (a task type) or Extensions→issue provider; not a peer lane |
| `Evidence` | Inspector evidence panel (contextual), not a lane |
| `Activity` (top + Home bottom duplicate) | Receipts / audit ledger |
| `Ibal` lane / `#/ibal` route | Ibal concierge (drawer + command) |
| Home "bottom tabs" (Calendar/Tasks/Activity/Settings) | Single capabilities nav |
| Triple navigation (top tabs + context left rail + bottom tabs) | One primary nav + contextual left rail **inside** the workbench only |

Net effect: from ~16 lane references and 3 nav systems down to **one nav**, a mail-workbench
spine, a small capability set, and a concierge. Fewer doors, clearer mental model.

## 4. Modular architecture (replace the monolith via strangler migration)

Do **not** rewrite `inbox-preview.js` in one shot. Stand up a module skeleton and migrate
behavior out of the monolith module-by-module until the monolith is empty and deleted.

```text
public/src/
  design/        tokens.css, components/ (pills, cards, banners, buttons), visual standard
  shell/         app-frame, top-bar, primary-nav, router (hash routes), right-inspector
  store/         single state store + ONE storage envelope (reset schema, drop v1–v11 cruft)
  workbench/     inbox, drafts, approvals, sent — the draft-centered spine
  capabilities/  calendar/ tasks/ automations/ extensions/ settings/
  ibal/          concierge drawer, command-entry integration, contextual proposals
  lib/           view-model adapters, formatting, sanitization consumers
fixtures/        lane/capability preview data (no real bodies, no secrets)
```

Migration order (also the multi-agent merge order):

```text
1. design/ tokens + core components        (Design-System agent)
2. shell/ frame + router + store           (Shell agent)
3. workbench/ inbox→drafts→approvals→sent   (Workbench agent)   ← the spine first
4. capabilities/* in parallel              (Capability agents)
5. ibal/ concierge                          (Ibal agent)
6. delete dead lanes + reset storage schema (Orchestrator)
```

Each step removes code from `inbox-preview.js` (DoD rule: monolith line count goes down).

## 5. Design system as the single source of visual truth

The `docs/ui/polish/00-16` packet is the right intent but scattered. Consolidate it into a
real, code-level system so "visually competitive" becomes objective and reusable:

- **Tokens:** color, type scale, spacing, radius, elevation, motion — one file, themed.
- **Component contracts:** status pill (no-silent-green), event/thread card, banner,
  button, command entry, inspector section, empty state. One implementation each.
- **Density modes:** comfortable vs compact (Tasks was overwhelming because it had no
  density discipline).
- **Visual QA rubric** (from `polish/12`) becomes the acceptance bar QA runs every cycle.

Candidates to promote back to `xi-io.net` after Level 4/5 proof (`xi-io.net#239`):
`XiAppFrame`, `XiPrimaryNav`, `XiInspector`, `XiStatusPill`, `XiIbalConcierge`,
`XiCommandEntry`, `XiContextProposal`, `XiProposalReceipt`.

## 6. Human-first principles

- The user can **enter, change, and review** before AI adds value (UI-005 Tier 1).
- **Speed and keyboard-first:** every primary action has a shortcut; selection survives
  re-render (a known prior bug — keep it fixed).
- **Plain language**, no jargon in primary copy; evidence/details collapse into `<details>`.
- **Calm density:** progressive disclosure; the inspector is command-oriented, not a wall
  of evidence text.
- **Trust is visible:** privacy mode, provider gates, and draft-only state are always legible.

## 7. Competitor bar (and how we exceed it)

| Competitor | Their strength | How xi-io exceeds |
| --- | --- | --- |
| Superhuman | keyboard speed, focus | same speed **+** local-first privacy + receipts |
| Shortwave | AI triage/summaries | AI proposals **with evidence + draft-only gate**, not opaque actions |
| Missive | shared inbox/collab | single-user operations spine with auditable receipts |
| Spark | smart inbox | smart **+** transparent provider/AI gates, no silent automation |
| Notion Calendar / Linear | crisp scheduling / task crispness | calendar & tasks as **draft-triggered capabilities**, unified with mail |

Differentiator: **a privacy-first, human-operable, fully auditable personal operations
command center** where AI never acts without a receipt and a human gate — not just a faster
mail client.

## 8. Agent-executable backlog (parallel after shell lands)

```text
SHELL-1  design tokens + core components            (blocks all)
SHELL-2  app frame + single nav + router + store     (blocks lanes)
WB-1     Inbox triage (read, select, keyboard)
WB-2     Drafts: local compose/reply (Tier 1)
WB-3     Approvals queue + pre-send checks (no send)
WB-4     Sent/Receipts ledger
CAP-CAL  Calendar capability (local proposals)
CAP-TSK  Tasks capability (folds epics/stories/bugs/evidence as views)
CAP-AUT  Automations (dry-run only)
CAP-EXT  Extensions / provider gates (preview-gated)
CAP-SET  Settings / Provider Gates (editable local policy)
IBAL-1   Concierge drawer + command entry + contextual proposals
CLEAN-1  delete superseded lanes; reset storage to schema v1 (new modular store)
```

WB-* and CAP-* are parallelizable once SHELL-1/2 land, because each owns a separate module.

## 9. Documentation hygiene

Stop the doc sprawl: this file is the UI source of truth. Mark `ui-003/005/007` and the
`polish/*` packet as **reference/history**. New UI decisions update *this* doc (and the
design tokens), not a new `ui-00x` file, unless the orchestrator opens a deliberate RFC.

## Decision value

`UI_NORTH_STAR_DRAFT_CENTERED_HUMAN_FIRST_ONE_NAV_MODULAR_STRANGLER_PENDING_OWNER_RATIFICATION`
