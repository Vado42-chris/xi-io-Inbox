# Source Candidate Matrix

## Purpose

This matrix records what `xi-io Inbox` can reuse from existing xi-io work and what must remain blocked or reference-only.

The goal is to update/reuse proven patterns, not recreate systems unnecessarily.

## Decision states

| State | Meaning |
| --- | --- |
| `adopt` | Use the concept directly as an Inbox requirement. |
| `adapt` | Recreate as an Inbox-specific contract or component. |
| `reference` | Keep as planning context only. |
| `blocked` | Do not copy or implement yet. |
| `promote-back` | Candidate to send back to `xi-io.net` as reusable framework doctrine. |

## Candidate matrix

| Source | Evidence | Inbox decision | Why it matters |
| --- | --- | --- | --- |
| `xi-io.net` event cockpit | `xi-io.net#25` | adopt/adapt | Defines event feeds, scoped event surfaces, calendar feed, API Library feed, tags, and microsite/detail patterns. Inbox should use the same event-first model for messages, drafts, tasks, exports, and receipts. |
| `xi-io.net` calendar archive | `xi-io.net#15`, `xi-io.net#25` | adopt/adapt | Year/month/week/day calendar views, daily overviews, event detail links, and date-filtered event feeds map directly to message deadlines, follow-ups, schedules, tasks, and export histories. |
| `xi-io.net` verifier gate | `xi-io.net#132` | adopt | Locks the rule that planning is not permission and only checked work may advance state. This is mandatory for draft-only egress and automation safety. |
| `xi-io.net` EventAtom/FailureAtom | `xi-io.net#200-#211` | adapt | Unknown is not success, failures are evidence-bearing, raw evidence must remain referenced. Inbox should use this for provider failures, sync failures, AI routing failures, and export failures. |
| `xi-io.net` local AI runtime | `xi-io.net#143` | adopt/adapt | Supports local model provider contracts, device-aware engine manifests, and local/remote fallback. This maps directly to Ollama/LAN/self-hosted model routing. |
| `xi-io.net` Ibal/Workbench roadmap | `xi-io.net#70-#84` | adopt | Keeps Ibal/Workbench work phase-aware, docs-only when appropriate, and runtime-blocked until prerequisites are complete. Inbox should follow this governance discipline. |
| `xi-io.net` suite alignment | `xi-io.net#223`, `xi-io.net#212` | adopt | Defines xi-io.net as control plane and Ibal as conductor/orchestrator. Inbox is a product/data-plane specialization, not an isolated app. |
| `realitypools.tv` calendar/component audit | `realitypools.tv#7` | adapt | Candidate source for route shells, shared cards, rails, panels, calendars, loaders, error boundaries, and empty states. Copying is blocked until component coupling is inspected. |
| `google_planner` existing-system workflow | `google_planner#94`, `google_planner#95`, `google_planner#96` | adopt/adapt | Locks human-readable first, AI-assisted second, automation approval-gated always, evidence/event-backed underneath. This maps directly to email-to-task, email-to-bug, and workflow-template proposals. |
| `xi-io_docuforge` | no issue evidence found in pass 2 search | reference pending deeper file audit | Still a likely export/review/document packet source, but current pass found no issue evidence to promote. Needs file-level audit later. |
| `xi-io_AuDHD-field-guide` | no issue evidence found in pass 2 search | reference pending deeper file audit | Still a likely consent/capture/cognitive-load source, but current pass found no issue evidence to promote. Needs file-level audit later. |
| `xi-io-emulator` | no issue evidence found in pass 2 search | reference pending deeper file audit | Useful product-proof discipline is known from project context, but this pass did not find issue evidence. Needs file-level audit later. |
| `thunderbird/thunderbird-android` | external candidate | blocked until ARCH-001 complete | Leading Android mail spine candidate, but runtime import remains blocked until license, package rename, build proof, provider sign-in, and upstream strategy are documented. |

## Current safe imports

Safe to adopt now as public-facing doctrine:

- event-first product model
- verifier-gated action execution
- draft-only egress default
- human-readable first / AI-assisted second / approval-gated always
- framework-first alignment
- local/self-hosted AI provider routing as a target, not phone-hosted Ollama assumption

## Current blocked imports

Blocked until further audit:

- Android runtime code
- private `xi-io.net` implementation details
- private RealityPools component source
- provider credentials or sign-in configs
- direct cloud/email/messaging platform integrations
- automated send/delete/forward behavior

## Framework freshness candidates

Promote back to `xi-io.net` after validation:

- egress permission schema
- AI provider manifest schema
- provider manifest schema
- portable inbox archive standard
- automation bridge contract
- action proposal schema
- inbox event schema, if generalized as a communication event schema
