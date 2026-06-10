# Receipts Polish Plan

## Goal

Make Receipts feel like a trustworthy audit ledger.

## Current Problems

- Ledger rows are useful but too plain.
- Proof, proposal, draft, gate, and blocked entries need stronger type grammar.
- Receipt classes feel like cards rather than audit filters.
- Runtime evidence placeholder needs careful wording.

## Required Updates

- Use ledger/table layout with stable columns.
- Add filter tabs for Proof, Proposal, Draft, Gate, Blocked.
- Add entry type icons or tokens.
- Make receipt detail open in inspector.
- Keep runtime evidence clearly unavailable until runtime exists.

## Component Pattern

- `ReceiptLedgerTable`
- `ReceiptTypeFilter`
- `ReceiptTypeToken`
- `ReceiptDetailInspector`
- `RuntimeEvidencePlaceholder`

## Acceptance Checks

- Receipts feel first-class, not footer metadata.
- User can distinguish proof/proposal/draft/gate/blocked entries.
- No runtime receipt is implied.
- Audit entries link back to lane/source.
