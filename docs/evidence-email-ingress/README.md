# Evidence Email Ingress Metadata Standard

This module defines a privacy-preserving way to hydrate email evidence into the xi-io Inbox model without relying on Gmail labels as the final taxonomy.

Core rule: Gmail labels are ingress hints. Repo metadata is the canonical record.

This public repo stores schemas, standards, examples, and workflow rules only. Raw email bodies, private message identifiers, attachment payloads, legal-help communications, and personal support messages belong in a controlled private evidence store unless explicit publication is approved.

## Goals

1. Make every relevant email discoverable by matter, event cluster, issue lane, evidence domain, document type, and processing state.
2. Preserve timeline reconstruction with no silent omissions.
3. Keep primary evidence, support context, and legal-help material separated.
4. Support deterministic replay from exported Gmail, EML, PDF, and source records.
5. Keep raw evidence out of public repos while retaining a complete audit trail in the private archive.

## Ingress model

Each email becomes one `evidence_email_event` record. Attachments become child records in an attachment manifest. Threads help navigation, but the canonical timeline is event-based, not thread-based.

Required reconstruction anchors:

- stable event id
- source system
- source account or mailbox alias
- sent/received timestamp with timezone
- sender and recipient roles
- normalized subject
- event cluster
- issue lanes
- evidence domains
- document type
- evidentiary role
- confidentiality class
- source labels as raw ingress hints
- processing state
- attachment state
- omission and gap-check state

## Source classes

Primary evidence is direct correspondence with a source-of-record participant such as counsel, mediator, court, insurer, creditor, service provider, bank, or government.

Support context includes personal support messages, forwarded copies to friends or family, memory aids, or commentary. It may help reconstruct contemporaneous state, but it is not primary evidence unless later promoted with a clear reason.

Legal-help material includes intake, consultation, draft strategy, or work-product style material. It must remain segregated from general evidence.

## Timeline reconstruction rule

Every event must answer:

1. What happened?
2. When did it happen?
3. Who sent and received it?
4. What issue lane does it affect?
5. What prior event does it respond to?
6. What later event confirms, contradicts, escalates, or resolves it?
7. Is the source primary evidence, support context, legal-help material, or derived work product?
8. Has the original raw source been preserved outside the public repo?

If an answer is unknown, store `unknown` or `needs_review`; do not infer.

## No-omissions controls

A timeline batch is incomplete until it includes:

- source inventory count
- processed event count
- skipped event count with reason
- duplicate-thread handling report
- attachment manifest count
- date gap report
- source-label mapping report
- segregation report
- unresolved `needs_review` list
