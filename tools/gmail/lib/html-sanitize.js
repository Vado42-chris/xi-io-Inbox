/**
 * MAIL-BODY-RENDERER-001A — server-side HTML sanitize (allowlist subset).
 * No remote image load, no scripts, no unsafe iframes/forms.
 */

const BLOCKED_TAGS = new Set([
  'script', 'iframe', 'frame', 'object', 'embed', 'form', 'input', 'button', 'textarea', 'select',
  'link', 'meta', 'base', 'svg', 'math',
]);

const ALLOWED_TAGS = new Set([
  'p', 'br', 'div', 'span', 'b', 'strong', 'i', 'em', 'u', 'a', 'ul', 'ol', 'li',
  'blockquote', 'pre', 'code', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'table', 'thead', 'tbody',
  'tr', 'th', 'td', 'hr', 'sup', 'sub',
]);

const ALLOWED_ATTRS = new Set(['href', 'title', 'colspan', 'rowspan', 'align']);

const REMOTE_IMG = /<img\b[^>]*>/gi;
const TRACKING_PIXEL = /<img\b[^>]*(?:width\s*=\s*["']?1|height\s*=\s*["']?1)[^>]*>/gi;
const TAG_PATTERN = /<\/?([a-z0-9]+)([^>]*)>/gi;
const ON_ATTR = /\s(on[a-z]+)\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi;
const JS_URL = /\b(?:javascript|vbscript|data):/gi;

function stripBlockedTags(html) {
  let out = String(html || '');
  for (const tag of BLOCKED_TAGS) {
    const open = new RegExp(`<${tag}\\b[^>]*>`, 'gi');
    const close = new RegExp(`</${tag}>`, 'gi');
    out = out.replace(open, '').replace(close, '');
  }
  return out;
}

function neutralizeAttributes(html) {
  return String(html || '')
    .replace(ON_ATTR, '')
    .replace(/\s(style|class|id)\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(JS_URL, 'blocked:');
}

function allowlistTags(html) {
  return String(html || '').replace(TAG_PATTERN, (match, tagName, attrs) => {
    const tag = String(tagName || '').toLowerCase();
    if (match.startsWith('</')) {
      return ALLOWED_TAGS.has(tag) ? `</${tag}>` : '';
    }
    if (!ALLOWED_TAGS.has(tag)) return '';
    const safeAttrs = String(attrs || '').replace(/\s([a-z0-9-]+)\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, (attrMatch, name) => {
      return ALLOWED_ATTRS.has(String(name).toLowerCase()) ? attrMatch : '';
    });
    return `<${tag}${safeAttrs}>`;
  });
}

function replaceRemoteImages(html) {
  return String(html || '')
    .replace(TRACKING_PIXEL, '<span class="mail-body-blocked-pixel">[tracking pixel blocked]</span>')
    .replace(REMOTE_IMG, '<span class="mail-body-blocked-image">[remote image blocked]</span>');
}

export function sanitizeEmailHtml(html, { blockRemoteImages = true } = {}) {
  const warnings = [];
  let unsafeHtmlStripped = false;
  let input = String(html || '');

  if (!input.trim()) {
    return {
      sanitizedHtml: '',
      warnings: ['empty_html'],
      unsafeHtmlStripped: false,
      remoteImagesBlocked: blockRemoteImages,
    };
  }

  if (/<script|javascript:|onerror=|onload=/i.test(input)) {
    unsafeHtmlStripped = true;
    warnings.push('unsafe_html_stripped');
  }
  TRACKING_PIXEL.lastIndex = 0;
  if (TRACKING_PIXEL.test(input)) {
    warnings.push('tracking_pixel_blocked');
  }
  TRACKING_PIXEL.lastIndex = 0;
  if (blockRemoteImages && /<img\b/i.test(input)) {
    warnings.push('remote_images_blocked');
  }

  input = stripBlockedTags(input);
  input = neutralizeAttributes(input);
  if (blockRemoteImages) {
    input = replaceRemoteImages(input);
  }
  input = allowlistTags(input);

  input = input.replace(/\s+/g, ' ').trim();

  return {
    sanitizedHtml: input,
    warnings,
    unsafeHtmlStripped,
    remoteImagesBlocked: blockRemoteImages,
  };
}

export function buildBodyRenderModel(mimeAnalysis, { blockRemoteImages = true } = {}) {
  const warnings = [];
  const plainText = String(mimeAnalysis?.plainText || '').trim();
  let sanitizedPlainText = plainText;
  let sanitizedHtml = '';
  let bodyRenderMode = 'plain_text';
  let unsafeHtmlStripped = false;
  let remoteImagesBlocked = blockRemoteImages;

  if (mimeAnalysis?.hasHtml && mimeAnalysis.htmlText) {
    const sanitized = sanitizeEmailHtml(mimeAnalysis.htmlText, { blockRemoteImages });
    unsafeHtmlStripped = sanitized.unsafeHtmlStripped;
    remoteImagesBlocked = sanitized.remoteImagesBlocked;
    warnings.push(...sanitized.warnings);
    if (sanitized.sanitizedHtml) {
      sanitizedHtml = sanitized.sanitizedHtml;
      bodyRenderMode = 'sanitized_html';
    }
  }

  if (!sanitizedPlainText && mimeAnalysis?.hasHtml && !sanitizedHtml) {
    sanitizedPlainText = mimeAnalysis.htmlText.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    bodyRenderMode = 'plain_fallback';
    warnings.push('html_fallback_to_text');
  }

  if (!sanitizedPlainText && sanitizedHtml) {
    sanitizedPlainText = sanitizedHtml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  }

  if (!sanitizedHtml && sanitizedPlainText) {
    bodyRenderMode = 'plain_text';
  }

  return {
    bodyRenderMode,
    mimeStructure: mimeAnalysis?.mimeStructure || 'unknown',
    hasHtml: Boolean(mimeAnalysis?.hasHtml),
    hasPlainText: Boolean(mimeAnalysis?.hasPlainText || sanitizedPlainText),
    hasAttachments: Boolean(mimeAnalysis?.hasAttachments),
    hasInlineImages: Boolean(mimeAnalysis?.hasInlineImages),
    remoteImagesBlocked,
    unsafeHtmlStripped,
    renderWarnings: [...new Set(warnings)],
    sanitizedHtml: sanitizedHtml || null,
    sanitizedPlainText: sanitizedPlainText || '',
  };
}
