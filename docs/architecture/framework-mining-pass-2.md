# Framework Mining Pass 2

## Purpose

Record public-safe findings from mining existing xi-io repositories for verified planning material that can guide `xi-io Inbox`.

This file intentionally summarizes, rather than copying private implementation details.

## Reusable framework findings

### 1. Event-first control surfaces

`xi-io.net` already frames products around event feeds, scoped event surfaces, tags, calendar feeds, API Library feeds, and event detail/microsite patterns.

Inbox application:

- email/message ingress becomes events
- drafts become events
- task proposals become events
- exports become events
- provider failures become events
- receipts become events

### 2. Calendar as event archive

The framework treats Calendar as more than appointments. It is an event-backed history and snapshot surface with year/month/week/day views, daily overviews, live feeds, and links to details.

Inbox application:

- deadlines
- follow-ups
- scheduled sends, if ever permitted
- task due dates
- bug due dates
- export history
- provider sync events
- contact history

### 3. Verifier gate before execution

The framework rule is that generation is not trust and planning is not permission. A verifier gate must sit between Ibal planning and any tool/action execution.

Inbox application:

- AI can propose drafts but cannot send by default
- AI can propose automations but cannot execute risky egress by default
- provider actions require permissions and receipts
- external automation cannot bypass the egress gatekeeper

### 4. Failure evidence and unknown handling

The framework distinguishes failures into evidence-bearing atoms instead of vague red states. Unknown is not success.

Inbox application:

- failed sync is not ignored
- failed AI route is not treated as analysis complete
- failed export is not treated as generated
- missing provider permission remains visible
- uncertain task/deadline extraction must ask the user

### 5. Local AI runtime strategy

The framework tracks local model adapters, device-aware engine manifests, runtime profiles, and local/remote fallback.

Inbox application:

- Ollama is a local/server-side target
- phone-hosted Ollama is not assumed
- model routing must know device capability
- cloud fallback requires consent
- model calls produce receipts

### 6. Ibal/Workbench governance

Framework Ibal/Workbench work is phase-aware, docs-first where appropriate, and runtime-blocked until prerequisites are met.

Inbox application:

- source audit before code import
- mail-spine audit before Android import
- docs-only decisions remain labeled as such
- runtime proof comes after architecture decisions

### 7. Human-readable first workflow

Google Planner planning locks the useful rule:

```text
Human-readable first.
AI-assisted second.
Automation approval-gated always.
Evidence/event-backed underneath.
```

Inbox application:

- email-to-task proposals must be understandable before automated
- email-to-bug breakdowns must show source evidence
- calendar proposals must ask for vague/missing dates
- templates and signatures must be visible and editable

## Pass 2 limitations

- This pass used issue search and repository metadata.
- File-level code/doc audit is still pending.
- Some candidate repos had no issue-search hits for the queried terms and must be audited by file inspection later.
- No runtime source was copied.

## Result

Pass 2 confirms the current direction is framework-aligned and does not require inventing a new architecture. Inbox should adapt existing xi-io doctrine around events, verifier gates, calendar archives, local AI runtime, and approval-gated workflow.
