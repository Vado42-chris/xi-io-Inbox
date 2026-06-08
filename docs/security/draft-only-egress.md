# Draft-only Egress Policy

## Default rule

AI agents may not send email, chat messages, SMS, Slack messages, WhatsApp Business messages, or any other externally visible message by default.

```text
AI_ASSISTED_SEND = false
```

## Allowed by default

AI may:

- create draft replies
- suggest edits
- summarize threads
- extract tasks
- propose bugs
- propose calendar events
- prepare export packets
- apply local xi-io metadata
- prepare automations for review

## Blocked by default

AI may not:

- send messages
- forward messages
- delete messages
- permanently archive without confirmation
- disclose private message content to third-party automation systems
- grant provider permissions
- create irreversible external obligations

## Advanced automation

Advanced automation may exist later, but it must be off by default and gated by explicit user consent.

Any future setting that allows AI-assisted sending must require:

- clear risk warning
- explicit opt-in
- per-account scope
- per-channel scope
- per-action receipt generation
- visible disable control
- audit trail

## Suggested user warning

> By default, xi-io Inbox only creates drafts. If you enable AI-assisted sending, an agent may send messages from connected accounts according to your configured rules. Sent messages can create legal, financial, employment, relationship, privacy, or safety consequences. xi-io Inbox recommends draft-only mode unless you fully understand the risks.

## Egress gatekeeper

All provider actions must pass through an egress gatekeeper before execution. The gatekeeper validates:

- user permission
- provider permission
- action risk
- message/account scope
- data disclosure scope
- receipt requirement
- rollback availability, where applicable

Planning is not permission. Drafting is not sending. Only checked and confirmed work may advance state.
