# MAIL-BODY-RENDERER-001A — safe HTML/MIME render proof (receipt)

**Slice:** `MAIL-BODY-RENDERER-001A`  
**Branch:** `ui-002/framework-derived-static-preview`  
**Status:** Implementation complete — **not pushed** (owner approval required)  
**Blocks:** `LOCAL-WEB-RUNTIME-001I` until owner review + decision  
**Parent spec:** `docs/product/mail-body-renderer-001.md`

## Scope delivered

| Requirement | Result |
| --- | --- |
| Read-only selected Gmail body rendering | Yes — via existing `/api/mail/threads/{id}/body` path |
| Plain text preserved | Yes — `plain_text` mode unchanged |
| HTML detect + sanitize | Yes — `sanitized_html` mode with allowlist |
| MIME classify | Yes — `text/plain`, `text/html`, `multipart/alternative`, `multipart/related`, attachments |
| Safe render metadata | Yes — `bodyRenderMode`, `hasHtml`, `hasPlainText`, `hasAttachments`, `hasInlineImages`, `remoteImagesBlocked`, `unsafeHtmlStripped`, `renderWarnings` |
| Remote images blocked | Yes — default blocked; tracking pixels labeled |
| Unsafe HTML stripped | Yes — scripts, handlers, unsafe tags removed |
| Isolated sandbox CSS | Yes — `mail-body-renderer-001a.css` |
| No provider writes | Yes — read-only adapter path only |
| No 001I | Yes — not started |

## Changed files (001A slice)

```text
tools/gmail/lib/mime-body-model.js          (new)
tools/gmail/lib/html-sanitize.js            (new)
tools/gmail/lib/body-redaction.js           (decodeBase64Url export)
tools/gmail/lib/adapter.js                  (renderModel on body rows)
tools/gmail/test/mail-body-renderer-001a.mjs (new)
tools/gmail/package.json                    (check chain)
server/mail-body.mjs                        (renderModel in derived metadata)
public/mail-body-renderer-001a.css          (new)
public/index.html                           (css link)
public/inbox-preview.js                     (sandbox render + badges)
scripts/mail-body-renderer-001a-model-check.mjs (new)
package.json                                (check:mailbody001a)
docs/ui/reviews/mail-body-renderer-001a-receipt.md (this file)
```

## Render modes tested (fixtures)

| Fixture | Mode | Notes |
| --- | --- | --- |
| `text/plain` | `plain_text` | Plain body preserved |
| `text/html` | `sanitized_html` | Allowlisted tags only |
| `multipart/alternative` | `sanitized_html` | HTML preferred when safe |
| Tracking pixel HTML | `sanitized_html` | Pixel blocked + warning |
| Malicious script/on* HTML | `sanitized_html` | Unsafe stripped + warning |
| `multipart/mixed` + attachment | `plain_text` | Attachment marker only |
| `multipart/related` + inline CID | `sanitized_html` | Inline image refs detected |

## Validation

Run on committed tree before push:

```bash
npm run check:mailbody001a
npm run check --prefix tools/gmail
npm run check:localwebruntime001
npm run check:quick
npm run check
```

## Owner review (:8788 local web)

1. Select a plain-text thread — expect **Plain text** badge.
2. Select an HTML newsletter — expect **Sanitized HTML**, **Remote images blocked**.
3. Confirm app shell typography/colors unchanged outside sandbox.
4. Confirm attachments show **Attachments detected (open blocked)** only.

## Decision token (after owner review)

```text
MAIL_BODY_RENDERER_001A_PASS_READY_FOR_001I_DECISION
```

Do **not** set until owner confirms reading-pane trust on real mail samples.

## Explicit non-goals (still blocked)

- `LOCAL-WEB-RUNTIME-001I`
- Notification center
- Attachment open/download
- Remote image auto-load
- Provider draft/send/reply
- OAuth scope changes
