# MAIL-BODY-RENDERER-001B — resource-aware readable rendering

**Status:** Owner review **PASS** locally (`ed6fe26` · `e688e81`) — **not pushed**  
**Next capture:** `MAIL-BODY-RENDERER-001C` — `docs/product/mail-body-renderer-001c-render-policy.md` (spec only — **do not implement** until owner approves)  
**Parent:** `MAIL-BODY-RENDERER-001A` (`37d9a76`, local, **not pushed**, **owner FAIL**)  
**Blocks:** trustworthy Ibal context · `001I` · push of 001A

## Owner review

```text
MAIL_BODY_RENDERER_001A_OWNER_REVIEW: FAIL

Reason:
The renderer is technically safe but not usable. It replaces resources inline with repeated
“[redacted-resource]” / blocked-image markers, making real emails unreadable and hiding what
was actually removed.
```

**Stop line:** Do not push `MAIL-BODY-RENDERER-001A`. Do not auto-load remote tracking pixels. Do not open attachments without a gate.

## Correct rule

```text
Do not auto-load unsafe remote resources.
Do not silently destroy the reading experience.
Do not inline noisy [redacted-resource] tokens.
Do identify what was removed and why.
Do render safe inline content when it exists in the MIME payload.
Do summarize blocked remote content outside the prose flow.
```

## Root cause investigation (2026-06-19 — not guessed)

### Failure modes in current 001A stack

| Path | Mechanism | User-visible symptom |
| --- | --- | --- |
| **Plain / redaction pass** | `tools/gmail/lib/body-redaction.js` — `REMOTE_RESOURCE_PATTERN` replaces `https?`, **`cid:`**, `data:`, `javascript:` URLs with **`[redacted-resource]`** inline | Plain text and `sanitizedPlainText` polluted with repeated tokens when URLs appear in body |
| **HTML sanitize pass** | `tools/gmail/lib/html-sanitize.js` — `replaceRemoteImages()` injects **`<span>[remote image blocked]</span>`** and **`[tracking pixel blocked]`** **inside** sanitized HTML | Marketing/newsletter HTML unreadable — one marker per `<img>` |
| **Adapter double-pass** | `tools/gmail/lib/adapter.js` `messageRowWithRedactedBody()` runs `buildBodyRenderModel()` then **`redactBodyContent()`** on plain text | Even when `renderModel.sanitizedHtml` exists, plain fields carry redaction tokens for fallback/Ibal context |
| **HTML strip helper** | `stripHtmlToText()` redacts URLs **before** tag strip | Worse when HTML path falls back to stripped text |

### Sample diagnostic (synthetic marketing HTML — repo-local probe)

| Question | Answer |
| --- | --- |
| Original HTML part exists | yes |
| Plain text part exists | yes |
| `multipart/alternative` | yes |
| `img` tags in HTML | 3 (2 remote + 1 `cid:`) |
| Remote `https` URLs in HTML | 3 |
| `cid:` references | 1 (no matching MIME part in sample) |
| `bodyRenderMode` | `sanitized_html` |
| Inline HTML markers | 3× `[remote image blocked]`, 1× `[tracking pixel blocked]` embedded in prose |
| Plain `redactBodyContent` | 1× `[redacted-resource]` for URL in plain part |
| Unsafe elements in sample | none (scripts not tested in this probe) |

### What the “[redacted-resource]” items are

They are **not message prose**. They are replacements for:

1. **Remote image URLs** (`https://…` in `src`, plain-text links, or CSS-adjacent URLs if present in text)
2. **`cid:` inline image references** — treated as “remote resource” by `body-redaction.js` even when they should be MIME-resolved inline parts
3. **`data:` URLs** — blocked by same pattern
4. **`javascript:` / `vbscript:`** — blocked (correct class, wrong UX if inlined as repeated tokens)

They are **not rendering** because:

- HTML path **blocks** `<img>` and injects inline placeholder spans instead of resolving safe inline MIME or omitting quietly
- Plain path **replaces every URL** with `[redacted-resource]` instead of preserving readable text and summarizing blocked resources externally
- **CID inline images** are not resolved from `multipart/related` parts in 001A — counted in `mime-body-model.js` but not rendered

## Required behavior changes

1. **Remove inline `[redacted-resource]` markers** from rendered body flow.
2. **Remove inline `[remote image blocked]` / `[tracking pixel blocked]` spam** from prose — use quiet omission or minimal layout placeholders only where layout requires.
3. **Resource summary banner** outside body (counts when known):
   - Remote images blocked
   - Tracking resources blocked
   - Inline images rendered / unavailable
   - Attachments detected
   - Unsafe HTML stripped
4. Preserve **readable text flow** first; prefer **clean plain text** when sanitized HTML is unreadable (`usedPlainTextFallback`).
5. **CID policy:** if `cid:` matches a MIME part in the same message → safe local blob/data render after validation; if unresolved → summarize once as “inline image unavailable” — **not** repeated inline redactions.
6. **Remote image policy:** remain blocked by default; summarize counts — no auto-load; no “load remote images” unless separately approved.

## Render metadata (extend 001A model)

| Field | Notes |
| --- | --- |
| `bodyRenderMode` | `sanitized_html` · `plain_text` · `plain_fallback` |
| `hasHtml` / `hasPlainText` / `hasAttachments` / `hasInlineImages` | existing |
| `inlineImageCount` / `inlineImageResolvedCount` | CID resolve stats |
| `remoteImageBlockedCount` / `trackingPixelBlockedCount` | for banner |
| `unsafeElementStrippedCount` / `unsafeAttributeStrippedCount` | for banner |
| `usedPlainTextFallback` | auto when HTML unreadable |
| `renderWarnings[]` | structured codes |
| `resourcePolicySummary` | human-readable one-liner for banner |

## UI requirements

- Body **readable first**.
- Warnings/badges **outside** main prose (`mail-body-render-badges` / new resource summary banner).
- No repeated token wall in reading pane.
- Plain-text fallback visible when used.

## Tests (fixtures)

- Marketing email with many remote images
- Newsletter with tracking pixel
- HTML with useful text + many images
- `multipart/related` with CID inline image (resolved + unresolved)
- Attachment image not inline
- Malicious script / `on*` handlers
- Plain-text fallback when HTML unreadable
- HTML sanitized-to-unreadable → auto plain fallback

## Acceptance

1. Selected real marketing email is **readable**.
2. No repeated `[redacted-resource]` tokens inline.
3. Remote images remain blocked by default.
4. CID inline images rendered when safely available in MIME payload.
5. Unresolved resources summarized **outside** body flow.
6. Unsafe HTML still stripped.
7. Plain-text fallback works.
8. Provider writes remain blocked.
9. No OAuth scope changes unless investigation proves read-only attachment scope gap — **stop and report** if so.
10. Checks pass.
11. `001I` not started.

## Changed files (expected at implementation)

```text
tools/gmail/lib/body-redaction.js       — stop inline [redacted-resource] in render path
tools/gmail/lib/html-sanitize.js        — resource counts; no inline marker spam
tools/gmail/lib/mime-body-model.js      — CID resolve map
tools/gmail/lib/adapter.js              — separate preview redaction vs render model
tools/gmail/test/mail-body-renderer-001b.mjs
public/inbox-preview.js                 — resource summary banner UI
scripts/mail-body-renderer-001b-model-check.mjs
docs/ui/reviews/mail-body-renderer-001b-receipt.md
```

## Ordering

**Before** `IBAL-RUNTIME-001A` — Ibal cannot reason on body text that is a redaction token wall.

## Decision token (owner only)

```text
MAIL_BODY_RENDERER_001B_PASS_READY_FOR_IBAL_RUNTIME
```
