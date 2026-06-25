# Batch 002 Private Evidence Hydration Plan

Status: ready for private evidence execution.

This plan turns exported email archives, Gmail label state, and attachment inventories into canonical evidence-event metadata without committing raw private evidence to this public repo.

## Scope

Batch 002 focuses on email evidence hydration and timeline reconstruction controls.

Inputs expected in private workspace:

- exported EML or email archive ZIP
- gap report
- timeline CSV
- attachment inventory
- Gmail label audit results
- message/thread id map, if available
- prior chronological timeline checkpoints

Outputs expected in private workspace:

- canonical `evidence_email_event` JSONL ledger
- attachment manifest JSONL
- source inventory report
- date gap report
- duplicate/thread-normalization report
- label-to-canonical-tag mapping report
- timeline omission report
- human-review queue

Public repo outputs stay limited to schemas, standards, examples, and workflow docs.

## Step 1: Source inventory

Create a source inventory before classification.

Required counts:

- total archive files
- total candidate email records
- total non-email files
- total attachment-bearing emails
- total attachments
- total Gmail-only records not present in exported archive
- total archive-only records not found in Gmail search

Every skipped source must receive one skip reason:

- duplicate_same_message
- duplicate_forwarded_copy
- non_evidence_marketing
- support_context_only
- legal_help_segregated
- corrupt_or_unreadable_source
- needs_manual_review

No file may silently disappear.

## Step 2: Normalize timestamps

For every email event, store:

- original timestamp string
- parsed ISO timestamp
- timezone
- source timezone assumption
- parse confidence

Do not infer missing times. Use `unknown` plus `needs_review`.

## Step 3: Preserve source labels

Store raw Gmail labels in `source_record.source_labels[]`.

Then apply `registries/gmail-label-to-evidence-tag-map.example.json` to produce canonical metadata.

Gmail labels never replace canonical fields.

## Step 4: Classify source class

Use these classes:

- `primary_evidence`
- `support_context`
- `legal_help_material`
- `derived_work_product`
- `unknown`

Default rules:

- counsel, mediator, insurer, bank, creditor, government, service-provider correspondence: `primary_evidence`
- personal support forwards/replies: `support_context`
- lawyer intake or consultation prep: `legal_help_material`
- self-sent timeline drafts or generated summaries: `derived_work_product`

## Step 5: Assign canonical tags

At minimum every event requires:

- `matter_id`
- `event_cluster`
- `issue_lanes[]`
- `evidence_domains[]`
- `document_type`
- `evidentiary_role`
- `confidentiality`
- `retention_priority`

If any field cannot be resolved, use `unknown` and add to the human-review queue.

## Step 6: Build timeline links

Each event should identify:

- prior event it responds to, where known
- next known event in same issue lane, where known
- same-thread neighbors
- same-date cluster neighbors
- gap before/after status

Timeline reconstruction is issue-lane aware. A mediation thread can also be a vehicle-access event, debt event, or home-preservation event.

## Step 7: Attachment manifest

Each attachment receives:

- attachment id
- source event id
- redacted filename
- content type
- byte size if available
- private storage pointer
- extraction state
- review state

Attachments with invoices, signed agreements, court documents, certificates, medical-adjacent documents, or creditor notices should be marked `needs_attachment_extraction` unless already extracted.

## Step 8: No-omissions report

Before a batch is marked complete, generate a report with:

- source inventory count
- processed event count
- skipped event count with reasons
- duplicate/thread normalization count
- attachment inventory count
- label mapping count
- events with `unknown` classification fields
- timeline date gaps
- issue lanes with no next-event link
- events requiring human review

Batch 002 cannot be marked complete while high-priority primary evidence is unclassified.

## Step 9: Private/public split

Public repo may receive:

- schemas
- standards
- registries with examples
- generic workflow docs
- redacted synthetic ledger samples

Private evidence store may receive:

- raw EMLs
- raw Gmail ids
- exact email addresses
- full legal correspondence
- attachments
- lawyer consultation content
- personal support messages
- full timeline ledgers with private source pointers

## Step 10: Completion criteria

Batch 002 is complete when:

- every source is inventoried
- every candidate evidence email has a canonical event record or skip reason
- every attachment has a manifest row
- every Gmail label used in the batch is mapped or queued for review
- the no-omissions report has no silent gaps
- legal-help and support-context items are segregated
- the private timeline can be rebuilt from the JSONL ledger without using Gmail search
