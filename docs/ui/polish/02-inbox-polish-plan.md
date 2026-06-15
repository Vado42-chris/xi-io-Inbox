# Inbox Polish Plan

## Page Purpose

Triage messages and threads into safe drafts, tasks, calendar proposals, evidence, and receipts.

## Primary User Job

Review an inbound thread, understand its risk, and decide the next safe action.

## Emotional / Visual Target

Premium mail client with controlled-egress intelligence.

## Information Hierarchy

1. Account and mailbox context.
2. Thread list with urgency/source metadata.
3. Selected thread summary and safe next action.
4. Evidence, attachments, draft proposal, and blocked egress.

## Primary Object Model

Thread preview with sender/source, subject, timestamp, urgency, privacy/sensitivity, linked tasks/events, and review state.

## Secondary Object Model

Mailbox views, account gates, evidence refs, attachment placeholders, draft proposals, and receipt previews.

## Navigation Behavior

Mailbox and smart-view selection filters thread list. Thread selection updates the detail area and inspector.

## Right Inspector Behavior

Inspector focuses on selected thread: why it matters, evidence, safe draft path, blocked actions, linked proposals, and future receipt.

## Empty / Loading / Blocked States

Empty mailbox shows no preview threads. Blocked provider state appears in account context, not as repeated thread badges.

## Status And Badge Usage

Thread status should be compact and prioritized: urgent, needs reply, human review, privacy sensitive. Provider block belongs at account/gate level.

## Primary Actions

- Summarize thread.
- Create draft proposal.
- Extract task proposal.
- Create calendar proposal.

## Secondary Actions

- Inspect evidence.
- Inspect attachments.
- Switch smart view.
- View receipt preview.

## Disabled / Dangerous Action Behavior

Send, forward, delete, archive, disclose, provider mutation, and repository mutation remain disabled or absent.

## Keyboard / Focus Behavior

Thread list supports arrow-ready structure later; current minimum is Tab plus Enter/Space selection with focus preservation.

## Responsive Behavior

Desktop uses mailbox rail, thread list, reading/detail pane, and inspector. Mobile uses mailbox/filter, thread list, then selected detail route.

## Visual Polish Requirements

- Use mail-native rows instead of generic cards.
- Add clear selected-thread panel.
- Replace disabled button stack with compact egress policy module.
- Separate metadata from action areas.

## Component Reuse Requirements

Reuse lane navigation, thread row, selected object panel, evidence block, draft proposal panel, and inspector grammar.

## Page-Specific Visual Distinction

Inbox must feel like message triage, not a dashboard lane.

## What Currently Fails

The current lane has better content but still leans on generic cards, repeated pills, and insufficient mail-client rhythm.

## Required Improvements

- Make account/mailbox/thread/detail structure unmistakable.
- Make the selected thread the main object.
- Show draft-only actions as proposals, not pseudo-buttons.

## Acceptance Checklist

- Inbox reads as email/message triage.
- Selected thread is visually dominant.
- Provider block is clear without badge spam.
- Dangerous egress remains blocked or absent.
