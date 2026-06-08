# xi-io Portable Inbox Archive v1

## Status

Draft standard.

## Purpose

Define a portable, inspectable archive format for email/message exports that supports human review, legal/admin use, long-term storage, and machine re-ingestion.

## Extension

```text
.xiia.zip
```

## Design goals

- preserve raw message records where possible
- provide printable human-readable packets
- preserve attachments
- keep metadata machine-readable
- include checksums
- include action/model receipts
- avoid vendor lock-in
- allow re-import into xi-io systems later

## Standard components

| Purpose | Format |
| --- | --- |
| Individual email | `.eml` |
| Bulk mailbox, optional | `.mbox` |
| Printable packet | `.pdf` or future PDF/A |
| Contacts | `.vcf` |
| Calendar/tasks | `.ics` |
| Metadata | `.json` / `.jsonl` |
| Container | `.zip` |
| Checksums | `checksums.sha256` |

## Proposed layout

```text
xiio-inbox-archive/
  manifest.json
  README.txt
  accounts/
    account-id/
      account.json
      threads/
        yyyy/
          mm/
            thread-id/
              thread.json
              printable.pdf
              messages/
                001_received.eml
                002_sent_reply.eml
              attachments/
                001/
                  original-filename.ext
                  attachment.json
              receipts/
                ingress-receipt.json
                analysis-receipt.json
                export-receipt.json
  contacts/
    contacts.vcf
    contacts.deduped.json
  index/
    messages.jsonl
    threads.jsonl
    entities.jsonl
    tags.jsonl
    checksums.sha256
```

## Printable packet goals

Each exported thread should support:

1. cover page
2. timeline
3. participants
4. message list
5. readable conversation
6. attachments index
7. raw email appendix
8. optional AI analysis appendix
9. receipt/checksum page

## Privacy rule

Exports should be explicit user actions. AI may prepare export packets, but user confirmation is required before sharing or transmitting them externally.

## Framework freshness candidate

If this archive standard proves useful, promote the generic parts to `xi-io.net` so other products can use the same portable archive doctrine.
