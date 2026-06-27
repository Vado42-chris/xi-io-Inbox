# CONTACT-FILE-IDENTITY-BRIDGE-001 — contacts, Drive/files, attachments, identity linking

**Status:** Capture only — no Contacts/Drive import or file library implementation now.  
**Parent:** `docs/architecture/provider-control-plane-001.md`  
**Alias in queue:** `CONTACT-FILE-IDENTITY-BRIDGE-001` (same slice)

## Purpose

Define how xi-io links **people**, **files**, and **identities** across Gmail, Google Contacts, Google Drive, Microsoft, GitHub, and local ledger — without overwriting provider data or auto-merging identities without confidence/owner review.

---

## Contacts

### ProviderContact (local view)

| Field | Notes |
| --- | --- |
| `contactId` | xi-io stable id |
| `sourceProvider` | `google_contacts` · `microsoft_contacts` · `local` · `manual` |
| `sourceAccountId` | ProviderAccount ref |
| `providerContactId` | Raw provider id |
| `displayName` | |
| `emailAddresses[]` | typed: work/personal/other |
| `phoneNumbers[]` | when available from provider |
| `aliases[]` | |
| `organizations[]` | |
| `confidence` | `provider_authoritative` · `derived` · `manual_link` · `low` |
| `linkedIdentities[]` | GitHub login, Slack id, etc. when linked |
| `ledgerRefs[]` | import/sync/link receipts |

### Rules

- **Never overwrite provider contacts** unless explicit write gate (`modify` capability + owner approval)
- Read-only sync imports metadata into local index; provider remains source of truth
- De-dupe within account by provider id + email hash — not cross-provider merge without review

### Gmail ↔ Contacts bridge

- Message `From` / `To` / `Cc` → lookup `ProviderContactRef` by email
- Show contact card in reading pane when confidence ≥ threshold
- Unknown sender → “Not in contacts” + optional local note (no provider write)

---

## Files / Drive / attachments

### ProviderFileRef

| Field | Notes |
| --- | --- |
| `fileId` | xi-io id |
| `sourceProvider` | `google_drive` · `onedrive` · `dropbox` · `gmail_attachment` · `local_library` |
| `providerFileId` | Raw provider file id |
| `name` | |
| `mimeType` | |
| `sizeBytes` | |
| `modifiedAt` | |
| `labelsTags[]` | Drive labels, local tags |
| `contentHash` | For dedupe |
| `storageClass` | `provider_only` · `local_cache` · `library_archive` |
| `linkedMessageRefs[]` | Messages that reference this file |
| `ledgerRefs[]` | |

### Attachment storage threshold policy

| Tier | Policy |
| --- | --- |
| Metadata only | Default — filename, size, mime, provider attachment id |
| Inline small | Optional local cache under size cap (e.g. 256KB) for read-only preview |
| Large / binary | Provider fetch on demand; no silent full mailbox download |
| Library archive | Explicit owner action + evidence mode; receipt required |

### Long-term file library

- **Local vs provider:** UI must label whether bytes live on provider vs xi-io library cache
- **Archive policy:** Owner-configured retention; legal/evidence preservation mode overrides delete
- **Backup policy:** Export receipts + metadata; no secret paths in git
- **Dedupe/hash:** Same hash + same account → single library entry with multiple refs
- **Privacy:** No cross-account file merge without manual link

### Message attachment bridge

```text
Gmail message → ProviderAttachmentRef → optional ProviderFileRef (Drive copy) → library entry
```

Hydration slice order: metadata ref first (001H) → fetch bytes on demand → Drive mirror later (separate slice).

---

## Identity bridge

Link types (all require confidence + audit):

| Link | Example |
| --- | --- |
| email ↔ contact | `hallberg1974@gmail.com` ↔ Google contact |
| contact ↔ Drive actor | file owner/editor email ↔ contact |
| contact ↔ GitHub | manual link or high-confidence email match → `Vado42-chris` |
| GitHub issue/PR ↔ email thread | manual or rule-based with receipt |
| attachment ↔ library item | hash + message id |

### Never auto-merge without review

| Confidence | Behavior |
| --- | --- |
| `provider_authoritative` | Same provider account — safe display link |
| `derived` | Same email on same Google account — suggest link |
| `manual_link` | Owner confirmed — store in ledger |
| `low` | Show as separate identities; do not unify UI |

**Observed:** Google Gmail/Contacts/Drive share profile; GitHub is separate login — default **two account cards** with optional **linked identity** edge, not forced single user object.

---

## Evidence / legal mode (capture)

When enabled (future owner flag):

- Preserve message + attachment refs immutably in ledger
- Block destructive provider actions without override receipt
- Export pack for operator — no automated provider delete

---

## Stop lines

- No Contacts API import implementation now
- No Drive file library implementation now
- No attachment bulk download
- No provider contact/file writes
- No new OAuth scopes on current branch

## Ordering

After `LOCAL-WEB-RUNTIME-001I` and mail IA planning — implement read contacts metadata before write paths.
