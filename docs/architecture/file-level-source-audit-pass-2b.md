# File-Level Source Audit Pass 2B

## Purpose

Audit limited-evidence source repos for reusable xi-io patterns without copying runtime code.

This pass summarizes public-safe repo evidence and updates Inbox reuse decisions.

## Scope

Repos audited in this pass:

- `Vado42-chris/xi-io_docuforge`
- `Vado42-chris/xi-io_AuDHD-field-guide`
- `Vado42-chris/xi-io-emulator`

## Findings

### xi-io_docuforge

DocuForge is highly relevant to Inbox export/archive and document-boundary work.

Reusable patterns:

- official source/provenance tracking
- permissions review before publishing generated helper artifacts
- hard boundary between public blank templates and private filled documents
- filled-form detection as a safety gate
- canonical backend field identities instead of trusting PDF field names
- xi-io ingress/analysis/lexicon/egress model for document processing

Inbox adaptation:

- exported email packets should preserve provenance, source refs, and permissions state
- private email bodies and attachments should not be treated as public library artifacts
- attachment-derived templates must distinguish blank reusable forms from filled private documents
- future form-fill flows must require explicit private workspace controls
- archive metadata should use stable semantic identities instead of provider-specific labels only

Decision: `adapt` and `promote-back` for archive/provenance/private-document boundary concepts.

### xi-io_AuDHD-field-guide

AFG is relevant to consent, cognitive-load reduction, safe export, and model-provider customization.

Reusable patterns:

- Ibal assistant spine
- export concept
- pattern engine concepts kept quieter/internal
- custom OpenAI-compatible or local API source configuration
- micro-action feedback for Commit/Purge/Export/Link
- PDF export for structured traces
- granular lexicon management with hardened confirmations
- meaning UI bins and delayed-memory routing concepts
- no therapy/medical/legal/diagnostic claims for sensitive analysis surfaces
- raw user language preservation
- no private memory/health/legal/journal export to public-safe framework outputs
- local model capability is not permission
- human approval before write actions

Inbox adaptation:

- Ibal should reduce inbox cognitive load without forcing score-centered or diagnostic framing
- email-to-action extraction must preserve raw source language and source refs
- exports need explicit user confirmation and private/public boundary checks
- model providers remain configurable, including local/OpenAI-compatible endpoints
- tags/bins should help meaning and retrieval, not overwrite raw message details

Decision: `adapt` and `promote-back` for consent/export/model-provider/meaning-UI patterns.

### xi-io-emulator

Emulator is highly relevant to proof gates, non-mutating import, failure handling, and repo workflow discipline.

Reusable patterns:

- existing engines should be wrapped instead of rewritten from scratch
- adapter manifests normalize external engines/providers
- no-silent-failure logging
- canonical documentation index for agents
- repo file wins over chat history when plans diverge
- branch policy and focused commits
- do not mix docs-only and source commits in one commit
- verification scripts before merge
- local paths remain in gitignored overlays
- non-mutating local library import
- preserve raw source identity while adding xi-io metadata projections
- physical file rename/move/delete requires separate explicit user-approved operation
- bulk hydration blocked until proof gates pass

Inbox adaptation:

- Thunderbird Android or another mail spine should be wrapped rather than rewritten from scratch
- email/provider records should be imported by reference and metadata projection where possible
- folder moves, deletes, forwards, and sends must require explicit user approval by default
- provider failures, AI failures, and export failures must be visible and ledgered
- any file/cloud storage ingestion should be non-mutating by default
- docs-only work and runtime code should remain separated

Decision: `adopt/adapt` for proof gates, non-mutating import, no-silent-failure handling, and repo workflow discipline.

## Reuse conclusions

Safe to adopt/adapt now:

- document provenance and permissions review
- private/public content boundary
- non-mutating import by default
- raw source preservation plus xi-io metadata projection
- model-provider customization with local/OpenAI-compatible endpoints
- micro-action feedback and hardened confirmations
- agent documentation index rule
- repo file wins over chat history
- proof gates before bulk ingestion
- no-silent-failure logging

Still blocked:

- copying runtime code
- importing Android mail spine
- copying private filled/user content
- direct file/cloud mutation by default
- autonomous send/delete/forward behavior

## Framework freshness candidates

Add or preserve as future framework candidates:

- private/public artifact boundary standard
- non-mutating external source import standard
- provenance and permission review standard
- local/remote model-provider configuration standard
- no-silent-failure provider/action failure standard
- proof-gated bulk ingestion standard
- source identity plus metadata projection standard

## Result

Pass 2B confirms additional reusable patterns without needing new invention. Inbox can update and adapt existing xi-io doctrine for provenance, consent, non-mutation, proof gates, and model-provider routing.