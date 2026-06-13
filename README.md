# xi-io Inbox

`xi-io Inbox` is a unified ingress, analysis, and controlled-egress command center for email first, later expanding into messages, files, contacts, tasks, bugs, calendars, schedules, and automations.

## Branch truth for agents

`main` is the planning/docs + shared-schema branch. Active static-preview product work lives
on `ui-002/framework-derived-static-preview`. Before auditing or editing UI/product work,
read `AGENTS.md` and `docs/operations/branch-truth.md`.

## Product stance

Email is the first adapter. The product is not limited to email. The long-term target is a private, auditable personal operations layer where Ibal helps the user understand incoming information and prepare safe outgoing actions.

## Core invariants

- Ingress, analysis, and controlled egress are the primary product loop.
- AI may summarize, classify, tag, draft, export, decompose, and propose actions.
- AI must not send, delete, forward, or externally disclose messages by default.
- Outbound actions must remain draft-only unless the user deliberately enables advanced automation and accepts explicit risk.
- All confirmed actions must generate receipts.
- Framework-aligned contracts should come from `xi-io.net` first.
- Runtime code imports are blocked until source, license, and privacy boundaries are documented.

## Current bootstrap status

This repository is in planning/bootstrap mode. The first pass locks public-safe documentation, source audit rules, safety defaults, and architecture decisions before importing Android mail-client code.

## Planning issues

- BOOTSTRAP-001: initialize repo governance.
- SOURCE-AUDIT-001: audit sources before code import.
- ARCH-001: decide Android mail spine and fork strategy.

## Candidate source alignment

- `Vado42-chris/xi-io.net`: framework source of truth.
- `Vado42-chris/realitypools.tv`: calendar/event/component candidate source.
- `thunderbird/thunderbird-android`: leading Android mail spine candidate.
- `Vado42-chris/google_planner`: workflow and approval-gated planning patterns.
- `Vado42-chris/xi-io_docuforge`: export/review/document packet patterns.
- `Vado42-chris/xi-io_AuDHD-field-guide`: consent, capture, and cognitive-load patterns.

## Monetization direction

The intended commercial shape is freemium-friendly. The core should remain useful without payment, with future optional support paths such as donations, tip jar / buy-me-a-coffee style support, paid convenience features, or hosted services. Monetization must not weaken privacy defaults or force unsafe AI egress.
