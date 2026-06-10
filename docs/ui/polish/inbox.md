# Inbox Polish Plan

## Goal

Make Inbox feel like a high-quality email/message triage client with xi-io safety and audit behavior.

## Current Problems

- Thread rows are too tall and card-like.
- Mailbox, thread list, detail, evidence, and draft areas do not yet feel like one email workflow.
- Selected state is visible but not elegant.
- Draft/egress controls read as debug fixtures.

## Required Updates

- Use a real mail triage layout: mailbox rail, thread list, reading/detail pane, inspector.
- Make thread rows dense and scannable with sender, subject, preview, time, labels, and status.
- Add a thread toolbar: summarize, create draft, extract task, propose event, all preview-safe.
- Make selected thread detail feel like a reading pane, not a data card.
- Separate evidence, attachments, and draft into clear tabs or stacked panes.
- Replace disabled action button stack with a compact blocked-egress policy module.

## Component Pattern

- `MailboxRail`
- `SmartViewList`
- `ThreadListRow`
- `ThreadReadingPane`
- `DraftProposalPane`
- `EvidenceAttachmentTray`
- `BlockedEgressPolicy`

## Acceptance Checks

- Page is immediately recognizable as message triage.
- Three selectable preview threads preserve focus and update inspector.
- No real message body or provider data appears.
- Send/forward/delete/archive/disclose remain blocked or absent.
