# xi-io Inbox

`xi-io Inbox` is a unified ingress, analysis, and controlled-egress command center for email first, later expanding into messages, files, contacts, tasks, bugs, calendars, schedules, and automations.

## Product stance

Email is the first adapter. The product is not limited to email. The long-term target is a private, auditable personal operations layer where Ibal helps the user understand incoming information and prepare safe outgoing actions.

## Framework alignment

`xi-io.net` is the framework source of truth. Inbox must obey the current framework standards for chatbot ingress, project kernels, provider gates, active consumer feedback, repo census, and legal/private boundaries when evidence workflows are involved.

Planning/compliance docs in this repo:

- [`docs/INBOX-STATUS-20260624.md`](docs/INBOX-STATUS-20260624.md)
- [`docs/EMAIL-EVIDENCE-ARCHIVE-ARCHITECTURE.md`](docs/EMAIL-EVIDENCE-ARCHIVE-ARCHITECTURE.md)
- [`docs/PORTABLE-DEPLOYMENT-ARCHITECTURE.md`](docs/PORTABLE-DEPLOYMENT-ARCHITECTURE.md)
- [`docs/PRIVATE-DATA-BOUNDARY.md`](docs/PRIVATE-DATA-BOUNDARY.md)

## Core invariants

- Ingress, analysis, and controlled egress are the primary product loop.
- AI may summarize, classify, tag, draft, export, decompose, and propose actions.
- AI must not send, delete, forward, or externally disclose messages by default.
- Outbound actions must remain draft-only unless the user deliberately enables advanced automation and accepts explicit risk.
- All confirmed actions must generate receipts.
- Framework-aligned contracts should come from `xi-io.net` first.
- Runtime code imports are blocked until source, license, and privacy boundaries are documented.
- Private email, evidence packages, account tokens, attachments, and manifests must not be placed under public deploy folders.
- Evidence archive work starts offline with exported `.eml` files before any live account connector is added.

## Current bootstrap status

This repository is in planning/bootstrap mode. The first pass locks public-safe documentation, source audit rules, safety defaults, architecture decisions, portable deployment boundaries, and evidence-export direction before importing Android mail-client code or connecting live accounts.

## Planning issues

- BOOTSTRAP-001: initialize repo governance.
- SOURCE-AUDIT-001: audit sources before code import.
- ARCH-001: decide Android mail spine and fork strategy.
- EVIDENCE-ARCHIVE-001: offline `.eml` evidence archive design.
- DEPLOYMENT-001: portable deployment profile design.
- PRIVATE-DATA-001: public/private data boundary enforcement.

## Candidate source alignment

- `Vado42-chris/xi-io.net`: framework source of truth.
- `Vado42-chris/realitypools.tv`: calendar/event/component candidate source.
- `thunderbird/thunderbird-android`: leading Android mail spine candidate.
- `Vado42-chris/google_planner`: workflow and approval-gated planning patterns.
- `Vado42-chris/xi-io_docuforge`: export/review/document packet patterns.
- `Vado42-chris/xi-io_AuDHD-field-guide`: consent, capture, and cognitive-load patterns.

## Monetization direction

The intended commercial shape is freemium-friendly. The core should remain useful without payment, with future optional support paths such as donations, tip jar / buy-me-a-coffee style support, paid convenience features, or hosted services. Monetization must not weaken privacy defaults or force unsafe AI egress.
