# MAIL-BODY-RENDERER-001B — resource-aware readable rendering (receipt)

**Slice:** `MAIL-BODY-RENDERER-001B`  
**Branch:** `ui-002/framework-derived-static-preview`  
**Status:** Owner review **PASS** locally — **not pushed**  
**Commits:** `ed6fe26` (redaction/resource summary) · `e688e81` (CSS/style leakage fix)  
**Classification:** `MAIL-BODY-RENDERER-001B OWNER REVIEW: PASS` (2026-06-19)  
**Spec:** `docs/product/mail-body-renderer-001b.md`  
**Blocks:** `IBAL-RUNTIME-001A` unblocked after owner approves push · `LOCAL-WEB-RUNTIME-001I` still blocked

## Objective

Fix renderer correctness: readable email body first; blocked resources summarized outside prose; no inline `[redacted-resource]` or blocked-image marker spam.

## Root cause — why `[redacted-resource]` appeared

| Layer | Mechanism | Symptom |
| --- | --- | --- |
| `body-redaction.js` (001A) | `REMOTE_RESOURCE_PATTERN` replaced every `https?`, `cid:`, `data:`, `javascript:` URL with **`[redacted-resource]`** inline | Plain text and fallback paths unreadable |
| `html-sanitize.js` (001A) | Injected **`<span>[remote image blocked]</span>`** / **`[tracking pixel blocked]`** per `<img>` | Marketing HTML became a token wall |
| `adapter.js` (001A) | `messageRowWithRedactedBody()` ran `buildBodyRenderModel()` then **`redactBodyContent()`** on plain fields | Render model polluted even when sanitized HTML existed |

001B removes inline token emission, counts blocked resources, and surfaces a compact `resourcePolicySummary` banner outside the sandbox body.

## Required investigation report (marketing fixture — `mail-body-renderer-001b.mjs`)

Synthetic marketing/newsletter payload (repo-local; mirrors owner-reported failure class):

| Question | Answer |
| --- | --- |
| Has HTML part | yes |
| Has plain text part | yes |
| `multipart/alternative` | yes |
| `multipart/related` | no (separate related fixture tested below) |
| `img` tag count (HTML) | 3 |
| Remote image count | 2 (`https://cdn…`, `https://track…`) + 1 remote link URL in prose |
| Tracking pixel count | 1 (`width="1" height="1"`) |
| `cid:` reference count | 1 (`cid:logo123@mail`) |
| CID parts resolved | 0 in marketing fixture (no matching MIME part) |
| Attachments detected | no (attachment fixture tested separately) |
| Unsafe elements stripped | yes in malicious fixture (`script`, `onclick`, `onerror`) |
| Unsafe attributes stripped | yes (`onclick`, `onerror` handlers removed) |
| Why `[redacted-resource]` appeared | URL replacement in `body-redaction.js` + adapter double-pass + inline HTML marker injection in 001A |

Related CID fixture (`multipart/related`):

| Question | Answer |
| --- | --- |
| `multipart/related` | yes |
| CID reference count | 1 |
| CID parts resolved | 1 → rendered as `data:image/png;base64,…` |
| Unresolved CID fixture | summarized once as “inline image unavailable” — no inline tokens |

## Scope delivered

| Requirement | Result |
| --- | --- |
| No repeated inline `[redacted-resource]` tokens | Yes — removed from render path |
| No inline blocked-image marker spam | Yes — quiet `<img>` removal |
| Readable body text preserved | Yes — marketing prose readable |
| Resource summary outside body | Yes — `resourcePolicySummary` banner + badges |
| Remote images blocked by default | Yes — counted, not loaded |
| Tracking pixels blocked | Yes — counted separately |
| Safe local CID images when MIME part exists | Yes — data URL render after map lookup |
| Attachments detect-only | Yes — metadata only |
| Plain text fallback | Yes — `plain_text` + `plain_fallback` when HTML unreadable |
| Extended render metadata | Yes — see below |
| Provider writes blocked | Yes — read-only adapter path |
| No OAuth scope changes | Yes |
| `001I` not started | Yes |

## Render metadata (001B)

`bodyRenderMode`, `hasHtml`, `hasPlainText`, `hasAttachments`, `hasInlineImages`, `inlineImageCount`, `inlineImageResolvedCount`, `remoteImageBlockedCount`, `trackingPixelBlockedCount`, `unsafeElementStrippedCount`, `unsafeAttributeStrippedCount`, `usedPlainTextFallback`, `renderWarnings[]`, `resourcePolicySummary`

Example banner:

```text
2 remote images blocked · 1 tracking resource blocked · unsafe HTML stripped
```

## Changed files (001B slice)

```text
tools/gmail/lib/mime-body-model.js              — buildInlineImageMap, cidReferenceCount
tools/gmail/lib/html-sanitize.js                — quiet img policy, counts, CID resolve, plain fallback
tools/gmail/lib/body-redaction.js               — silent URL removal; no inline tokens
tools/gmail/lib/adapter.js                      — render model pass-through; no double redaction
tools/gmail/test/mail-body-renderer-001a.mjs    — tracking-only warning expectation
tools/gmail/test/mail-body-renderer-001b.mjs    — new comprehensive fixtures
tools/gmail/package.json                        — 001b test in check chain
public/inbox-preview.js                         — renderMailBodyResourceSummary banner
public/mail-body-renderer-001a.css              — resource summary + sandbox img styles
scripts/mail-body-renderer-001b-model-check.mjs — structural gate
package.json                                    — check:mailbody001b wired into check
docs/product/mail-body-renderer-001b.md         — spec (status updated)
docs/ui/reviews/mail-body-renderer-001b-receipt.md — this file
```

## Tests

| Fixture | Result |
| --- | --- |
| Marketing email with remote images + CID + tracking pixel | pass — readable prose, external summary |
| Many remote images + useful text | pass — text preserved, counts in summary |
| Tracking pixel only | pass — no inline markers |
| `multipart/related` CID resolved | pass — data URL inline |
| CID reference without MIME part | pass — unavailable summary, no spam |
| Attachment image not inline | pass — detect-only |
| Malicious script / `on*` handlers | pass — stripped |
| Plain text only | pass |
| HTML unreadable → plain fallback | pass — `usedPlainTextFallback: true` |
| Legacy redactBodyContent snapshot path | pass — URLs removed silently |

## Validation (2026-06-19)

```bash
npm run check:mailbody001b   # pass
npm run check:mailbody001a   # pass
npm run check --prefix tools/gmail   # pass (includes 001a + 001b tests)
npm run check                # pass
```

## Real-thread owner proof (:8788 — 2026-06-19)

**Server:** `npm run local:web` → http://127.0.0.1:8788 (restarted to load 001B adapter code)

### Primary thread (same failure class as owner report)

| Field | Value |
| --- | --- |
| Safe identifier | thread `19f046e2ef6756a7` · message `19f046e2ef6756a7` |
| Subject | Everyday grocery picks at low prices 🧺 |
| Sender | Walmart Canada `<offers@e.walmart.ca>` |
| bodyRenderMode | `sanitized_html` |
| hasHtml | yes |
| hasPlainText | yes |
| remoteImageBlockedCount | 30 |
| trackingPixelBlockedCount | 5 |
| cid reference count | 0 |
| inlineImageResolvedCount | 0 |
| attachmentCount | 0 (`hasAttachments: false`) |
| unsafeElementStrippedCount | 9 |
| unsafeAttributeStrippedCount | 0 |
| usedPlainTextFallback | false |
| renderWarnings | `unsafe_html_stripped`, `tracking_pixel_blocked`, `remote_images_blocked` |
| resourcePolicySummary | `30 remote images blocked · 5 tracking resources blocked · unsafe HTML stripped` |

**Before (001A server, pre-restart):** body sample was a wall of repeated `[redacted-resource]` tokens (28+ in first 500 chars); `renderModel` absent.

**After (001B):** `[redacted-resource]` count **0**; inline blocked-image markers **0**; remote `https` `<img>` tags in sanitized HTML **0**; marketing prose readable; summary in `resourcePolicySummary` / `derivedMetadata.renderModel`.

### Secondary Walmart thread (consistency)

| Field | Value |
| --- | --- |
| thread | `19eeb8033367cf03` |
| Subject | Membership that delivers.™ — get up to 6 months free! 😍 |
| resourcePolicySummary | `19 remote images blocked · 1 tracking resource blocked · unsafe HTML stripped` |
| `[redacted-resource]` inline | **0** |

### Proof checklist

| # | Criterion | Result |
| --- | --- | --- |
| 1 | Same Walmart/marketing thread | pass |
| 2 | No repeated inline `[redacted-resource]` | pass |
| 3 | Readable prose preserved | pass |
| 4 | Blocked resources summarized outside body | pass (`resourcePolicySummary`) |
| 5 | Remote images not auto-loaded | pass (0 remote `<img>` in sanitized HTML) |
| 6 | Tracking pixels blocked | pass (counts in summary) |
| 7 | Plain text fallback available | pass (`hasPlainText: true`, 9840 chars) |
| 8 | Attachments detect-only | pass (N/A on these threads; no open/download) |
| 9 | Provider writes blocked | pass (readonly adapter path) |
| 10 | No OAuth scope changes | pass (`GMAIL_ACCESS_MODE=readonly`) |
| 11 | 001I not started | pass |

## Peer review follow-up — CSS/style leakage (001B-FIX)

**Classification after owner screenshot:** `MAIL-BODY-RENDERER-001B: PARTIAL PASS / NEW FAILING CASE`

### Todoist investigation

| Field | Value |
| --- | --- |
| Safe identifier | thread/message `19f0a5591ce4f396` |
| Subject | Chris, your due dates are lying to you |
| Sender | Denise from Todoist `<no-reply@todoist.com>` |
| `<style>` tags in HTML | yes (13 blocks stripped) |
| CSS in body before fix | yes — Mantine `:root/:host`, `@media`, `--mantine-*` leaked when `<style>` tags were removed without their contents |
| CSS source | `<style>` blocks (framework-injected email CSS) |
| Plain text cleaner than polluted HTML | yes — plain part has readable prose; HTML path had CSS + broken attribute/preheader noise |
| Fix | Strip `<style>`/`<head>`/`<noscript>`/`<template>` blocks with contents; detect CSS/display pollution; prefer plain fallback when HTML is worse |

### Real-thread proof after CSS fix (`:8788` restart required)

| Thread | Mode | CSS noise | `[redacted-resource]` | Prose | Summary outside body |
| --- | --- | --- | --- | --- | --- |
| Walmart `19f046e2ef6756a7` | `sanitized_html` | none | none | yes | yes |
| Todoist `19f0a5591ce4f396` | `plain_fallback` (`html_display_polluted`) | none | none | yes | yes |

Todoist metadata example:

```text
bodyRenderMode: plain_fallback
styleElementStrippedCount: 13
fallbackReason: html_display_polluted
resourcePolicySummary: 8 remote images blocked · 6 tracking resources blocked · unsafe HTML stripped · style content stripped
renderWarnings: style_content_stripped, html_display_used_plain_fallback, ...
```

## Stop lines honored

- No push
- No `LOCAL-WEB-RUNTIME-001I`
- No `IBAL-RUNTIME-001A`
- No provider egress / OAuth scope changes
- No remote image auto-load
- No attachment open/download
- No view modes, labels accordion, rail resize, GitHub/Contacts nav, or account provisioning mixed in

## Owner review (2026-06-19)

```text
MAIL_BODY_RENDERER_001B_OWNER_REVIEW: PASS
```

**Host:** `npm run local:web` → http://127.0.0.1:8788 (hard refresh after restart)

| Subcase | Proof | Result |
| --- | --- | --- |
| Todoist CSS/style leakage (`19f0a5591ce4f396`) | Owner browser screenshot | **PASS** — plain text fallback; no Mantine/CSS in pane; badges outside body |
| Walmart redacted-resource wall (`19f046e2ef6756a7`) | Agent `:8788` final proof post-restart | **PASS** — no `[redacted-resource]` wall; readable prose; resource summary outside body |

### Walmart final proof snapshot

| Check | Result |
| --- | --- |
| No inline `[redacted-resource]` wall | pass |
| Readable prose preserved | pass |
| Blocked resources summarized outside body | pass |
| Remote images not auto-loaded | pass |
| Tracking pixels blocked | pass |
| Provider writes blocked | pass |
| OAuth unchanged | pass |
| `001I` not started | pass |

**Push:** blocked until owner explicitly approves scoped push of `ed6fe26` + `e688e81`.

Decision tokens:

```text
MAIL_BODY_RENDERER_001B_OWNER_REVIEW: PASS
MAIL_BODY_RENDERER_001B_PASS_READY_FOR_IBAL_RUNTIME
```

Scoped push when owner approves (not executed):

```text
ed6fe26 — MAIL-BODY-RENDERER-001B redaction/resource summary fix
e688e81 — MAIL-BODY-RENDERER-001B CSS/style leakage fix
```
