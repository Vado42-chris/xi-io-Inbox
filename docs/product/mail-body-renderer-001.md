# MAIL-BODY-RENDERER-001 — safe HTML/MIME email rendering

**Status:** Capture only — **implementation not started**.  
**Ledger event:** `mail.body_renderer.spec_captured`  
**Parent:** `docs/architecture/provider-control-plane-001.md` · `LOCAL-WEB-RUNTIME-001H` (metadata + body hydrate)

## Purpose

Define how xi-io Inbox renders **provider message bodies** safely in the reading pane — without injecting raw provider HTML into the main DOM, without silent remote resource loads, and without claiming “complete Inbox reading” until this slice is proven.

```text
001H proves body bytes can hydrate read-only.
MAIL-BODY-RENDERER-001 proves those bytes render safely and predictably in product UI.
```

## Scope boundary

| In scope (spec) | Out of scope (now) |
| --- | --- |
| MIME structure handling rules | Provider send/draft/reply |
| Sanitization + isolation strategy | OAuth scope expansion |
| Plain-text fallback policy | Attachment download egress |
| Render metadata surfacing | Drive mirror / file library |

## MIME / content types

| Type | Requirement |
| --- | --- |
| `text/plain` | Primary readable fallback; preserve wrapping; no HTML injection |
| `text/html` | Sanitized subset only; never raw innerHTML from provider |
| `multipart/alternative` | Prefer sanitized HTML when policy allows; else plain |
| `multipart/related` | Resolve inline parts; map `Content-ID` → local blob refs |
| `multipart/mixed` | Body part vs attachment parts separated in UI model |
| `message/rfc822` | Forwarded `.eml` / nested message — nested renderer context |
| Attachments | Metadata row + explicit fetch gate; no auto-download |
| Inline images | `cid:` refs; blocked until user policy allows |

## Safety policy (must capture before impl)

| Policy | Default |
| --- | --- |
| Remote images | **Blocked** — user setting + per-message override |
| Tracking pixels | **Blocked** — strip or never load 1×1 remote |
| Scripts / iframes / forms | **Removed** in sanitize pass |
| External links | Visible; open with user confirmation (desktop shell) |
| Raw provider HTML in main DOM | **Forbidden** — sandbox/isolated subtree only |
| Plain-text fallback | Always available when HTML path fails or policy denies |

## Sanitization / isolation strategy (capture)

1. **Parse** MIME tree server-side or trusted worker — UI receives render model, not raw HTML string only.
2. **Sanitize** HTML allowlist (structural tags, safe attrs; strip `on*`, `javascript:`, embedded handlers).
3. **Isolate** rendered body in dedicated container (`shadow DOM` and/or `iframe` `sandbox` — decision at impl).
4. **CSP** for renderer subtree: no `script`, no remote `img` unless policy on.
5. **Render metadata** panel: content-type, parts count, remote resource count, sanitize warnings.

## Render model (capture)

| Field | Notes |
| --- | --- |
| `messageId` | Provider message id |
| `preferredView` | `plain` · `sanitized_html` · `blocked_html` |
| `plainTextBody` | Escaped text for fallback |
| `sanitizedHtmlRef` | Blob or inline sanitized fragment id |
| `inlineParts[]` | `contentId`, `mimeType`, `localRef`, `blockedReason` |
| `attachments[]` | metadata only until fetch slice |
| `remoteResourceCount` | blocked count for honesty |
| `warnings[]` | e.g. `tracking_pixel_stripped`, `html_truncated` |
| `receiptRef` | `item.body.rendered` ledger hook |

## Ordering vs other slices

| Option | When |
| --- | --- |
| Before `001I` | If reading-pane quality blocks freshness/event review |
| After `001I` | If freshness smoke passes with plain/minimal HTML only |
| Before draft/send confidence | **Required** — egress slices must not rely on unsafe render |

Owner decision token (future): `MAIL_BODY_RENDERER_001_SPEC_APPROVED_FOR_IMPL`

## Framework components (capture)

- `MailBodyRenderer` — isolated host
- `MailBodyPlainView`
- `MailBodySanitizedHtmlView`
- `MailBodyRenderMetadata`
- `RemoteImagePolicyBanner`
- `AttachmentMetadataList`

## Stop lines

- No HTML renderer implementation until slice explicitly opened
- No new OAuth scopes
- No provider writes
- No raw Gmail HTML pasted into `inbox-preview.js` render paths long-term

## Ledger

- Spec captured: `mail.body_renderer.spec_captured`
- Implementation PASS (future): `mail.body_renderer.impl_pass` + receipt
