# Receipts Polish Plan

## Page Purpose

Expose proof, proposals, drafts, gates, blocked events, and future runtime evidence as a first-class audit trail.

## Primary User Job

Verify what happened, what was proposed, what was blocked, and what evidence exists.

## Emotional / Visual Target

Ledger and audit trail. It should feel trustworthy, chronological, and inspectable.

## Information Hierarchy

1. Receipt ledger.
2. Receipt type filters.
3. Selected receipt detail.
4. Related source and blocker context.

## Primary Object Model

Receipt row with type, title, source, timestamp/commit/ref, state, and evidence link.

## Secondary Object Model

Receipt class summaries, proof receipts, proposal receipts, draft receipts, provider gate changes, blocked events, and runtime evidence placeholders.

## Navigation Behavior

Receipt selection updates inspector. Filters narrow visible receipt classes.

## Right Inspector Behavior

Inspector shows selected receipt detail, source evidence, related blocker, future audit implications, and no-runtime confirmation.

## Empty / Loading / Blocked States

No runtime receipts should be explicit. Proof-only receipts remain valid planning evidence.

## Status And Badge Usage

Receipt type carries more weight than status pill. Use type chips sparingly and align them in a ledger column.

## Primary Actions

- Inspect receipt.
- Filter by class.
- Link to source lane.

## Secondary Actions

- Export packet later.
- Inspect blocked event.
- Inspect proof evidence.

## Disabled / Dangerous Action Behavior

Receipts never authorize execution. No mutation occurs from the ledger in UI-004.

## Keyboard / Focus Behavior

Ledger rows are selectable. Focus order follows chronological or filtered order.

## Responsive Behavior

Desktop uses ledger table plus inspector. Mobile uses stacked receipt rows with expandable detail route.

## Visual Polish Requirements

- Use table/list ledger structure, not generic cards.
- Make type, source, and state columns consistent.
- Make proof/proposal/draft/gate/blocked entries visually distinct.

## Component Reuse Requirements

Reuse receipt row, receipt detail, evidence block, source link, and inspector grammar.

## Page-Specific Visual Distinction

Receipts must feel like audit.

## What Currently Fails

The current page has ledger intent but still uses broad repeated panels around it.

## Required Improvements

- Strengthen ledger rhythm.
- Make selected receipt detail meaningful.
- Keep runtime evidence placeholder clearly unimplemented.

## Acceptance Checklist

- User can distinguish proof/proposal/draft/gate/blocked entries.
- No runtime receipt is implied.
- Audit entries link back to lane/source.
- Receipts feel first-class, not footer-like.
