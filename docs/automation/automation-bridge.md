# Automation Bridge

## Purpose

The automation bridge connects `xi-io Inbox` events to internal automations, webhooks, Zapier-style systems, MCP tools, and future automation platforms without giving those platforms unrestricted inbox control.

## Product rule

Automation may prepare and route work. It must not bypass the egress gatekeeper.

## Supported automation tiers

### Tier 1: Internal xi-io automation

Examples:

- classify legal messages
- flag deadlines
- propose tasks
- propose calendar events
- create export packets
- remind user to review a draft

### Tier 2: Generic webhook bridge

Examples:

- send minimized task proposal event to an external workflow
- receive an external event and create an Inbox proposal
- notify a project board that a user-approved export exists

### Tier 3: Platform adapters

Candidates:

- Zapier
- n8n
- Make
- MCP-compatible tools
- future xi-io automation surfaces

## Safe default events

Inbox may emit minimized events such as:

- `inbox.event.created`
- `message.important.detected`
- `draft.created`
- `task.proposal.created`
- `bug.proposal.created`
- `deadline.detected`
- `attachment.classified`
- `export.packet.created`
- `contact.candidate.detected`
- `receipt.created`

## Safe default actions

External automation may request:

- create draft
- create task proposal
- create bug proposal
- create calendar proposal
- create export packet
- apply xi-io tag
- create reminder proposal
- add contact note

## Blocked default actions

External automation may not, by default:

- send a message
- delete a message
- forward a message
- publish private content
- upload attachments externally
- grant provider permissions
- alter egress settings

## Data minimization

External automation payloads should avoid raw private message bodies by default.

Prefer:

```json
{
  "event_type": "task.proposal.created",
  "title": "Reply to client about quote",
  "risk_level": "medium",
  "due_date": null,
  "xiio_ref": "xiio://inbox/proposal/example",
  "receipt_id": "example"
}
```

Avoid:

```json
{
  "full_email_body": "...",
  "attachments": ["private-file.pdf"],
  "all_recipients": ["..."]
}
```

## Framework freshness candidate

Generic automation bridge contracts should be candidates for promotion to `xi-io.net` after Inbox validates them.
