/**
 * MAIL-BODY-RENDERER-001A/001B — server-side HTML sanitize + resource-aware render model.
 * 001B: readable body first; blocked resources summarized in metadata, not inline spam.
 */

const BLOCKED_TAGS = new Set([
  'script', 'iframe', 'frame', 'object', 'embed', 'form', 'input', 'button', 'textarea', 'select',
  'link', 'meta', 'base', 'svg', 'math', 'style', 'noscript', 'template', 'head',
]);

const STYLE_BLOCK_PATTERN = /<style\b[^>]*>[\s\S]*?<\/style>/gi;
const NOSCRIPT_BLOCK_PATTERN = /<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi;
const TEMPLATE_BLOCK_PATTERN = /<template\b[^>]*>[\s\S]*?<\/template>/gi;
const HEAD_BLOCK_PATTERN = /<head\b[^>]*>[\s\S]*?<\/head>/gi;
const SCRIPT_BLOCK_PATTERN = /<script\b[^>]*>[\s\S]*?<\/script>/gi;
const HTML_COMMENT_PATTERN = /<!--[\s\S]*?-->/g;
const INVISIBLE_CHAR_PATTERN = /[\u200B-\u200D\uFEFF\u00AD\u2060\u034F\u061C\u115F\u1160\u17B4\u17B5\u180E\u3164\uFFA0]/g;

const ALLOWED_TAGS = new Set([
  'p', 'br', 'div', 'span', 'b', 'strong', 'i', 'em', 'u', 'a', 'ul', 'ol', 'li',
  'blockquote', 'pre', 'code', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'table', 'thead', 'tbody',
  'tr', 'th', 'td', 'hr', 'sup', 'sub', 'img',
]);

const ALLOWED_ATTRS = new Set(['href', 'title', 'colspan', 'rowspan', 'align', 'alt']);

const IMG_TAG = /<img\b[^>]*>/gi;
const TRACKING_PIXEL = /<img\b[^>]*(?:width\s*=\s*["']?1|height\s*=\s*["']?1)[^>]*>/gi;
const TAG_PATTERN = /<\/?([a-z0-9]+)([^>]*)>/gi;
const ON_ATTR = /\s(on[a-z]+)\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi;
const JS_URL = /\b(?:javascript|vbscript):/gi;
const UNSAFE_TAG_PATTERN = /<\/?(script|iframe|frame|object|embed|form|input|button|textarea|select|link|meta|base|svg|math)\b[^>]*>/gi;

function normalizeContentId(value) {
  return String(value || '').replace(/^<|>$/g, '').trim().toLowerCase();
}

function extractImgSrc(tag) {
  const match = String(tag).match(/\bsrc\s*=\s*("([^"]*)"|'([^']*)'|([^\s>]+))/i);
  return (match?.[2] || match?.[3] || match?.[4] || '').trim();
}

function cleanPlainText(input) {
  return String(input || '')
    .replace(INVISIBLE_CHAR_PATTERN, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function htmlToPlainText(html) {
  return cleanPlainText(String(html || '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim());
}

function stripStyleAndFrameworkBlocks(html) {
  let styleElementStrippedCount = 0;
  let out = String(html || '');
  for (const pattern of [
    STYLE_BLOCK_PATTERN,
    NOSCRIPT_BLOCK_PATTERN,
    TEMPLATE_BLOCK_PATTERN,
    HEAD_BLOCK_PATTERN,
    SCRIPT_BLOCK_PATTERN,
  ]) {
    pattern.lastIndex = 0;
    const matches = out.match(pattern) || [];
    styleElementStrippedCount += matches.length;
    out = out.replace(pattern, ' ');
  }
  out = out.replace(HTML_COMMENT_PATTERN, ' ');
  return { html: out, styleElementStrippedCount };
}

function stripCssNoiseText(html) {
  let cssNoiseTextStrippedCount = 0;
  let out = String(html || '');
  const patterns = [
    /:root\s*,\s*:host\s*\{[^}]*\}/gi,
    /:root\s*\{[^}]*\}/gi,
    /:host\s*\{[^}]*\}/gi,
    /@media[^{]+\{[\s\S]*?\}/gi,
    /\.[a-z0-9_-][\w-]*\s*\{[^}]*\}/gi,
    /--[a-z0-9_-]+\s*:[^;{}]+;?/gi,
    /display\s*:\s*none\s*!important/gi,
  ];
  for (const pattern of patterns) {
    pattern.lastIndex = 0;
    const matches = out.match(pattern) || [];
    cssNoiseTextStrippedCount += matches.length;
    out = out.replace(pattern, ' ');
  }
  return { html: out.replace(/\s+/g, ' ').trim(), cssNoiseTextStrippedCount };
}

function analyzeTextNoise(text) {
  const sample = String(text || '');
  if (!sample.trim()) {
    return { htmlNoiseRatio: 0, cssNoiseScore: 0, proseScore: 0 };
  }
  const cssNoiseScore = (
    (sample.match(/:root\b/gi) || []).length
    + (sample.match(/:host\b/gi) || []).length
    + (sample.match(/@media\b/gi) || []).length
    + (sample.match(/--[a-z0-9_-]+\s*:/gi) || []).length
    + (sample.match(/\.[a-z0-9_-]+\s*\{/gi) || []).length
    + (sample.match(/display\s*:\s*none\s*!important/gi) || []).length
  );
  const proseScore = (sample.match(/\b[a-z]{4,}\b/gi) || []).length;
  const htmlNoiseRatio = cssNoiseScore / Math.max(1, cssNoiseScore + proseScore);
  return { htmlNoiseRatio, cssNoiseScore, proseScore };
}

function invisibleCharRatio(text) {
  const sample = String(text || '');
  if (!sample.length) return 0;
  const hits = (sample.match(INVISIBLE_CHAR_PATTERN) || []).length
    + (sample.match(/&nbsp;|\u00a0/gi) || []).length;
  return hits / sample.length;
}

function isHtmlCssPolluted(sanitizedHtml, plainText) {
  const text = htmlToPlainText(sanitizedHtml);
  const noise = analyzeTextNoise(text);
  if (noise.cssNoiseScore >= 3 && noise.htmlNoiseRatio > 0.12) return true;
  if (/:root\b/i.test(text) && (/:host\b/i.test(text) || /@media\b/i.test(text))) return true;
  if (/@media\b/i.test(text) && /--[a-z0-9_-]+\s*:/i.test(text)) return true;
  const plainNoise = analyzeTextNoise(cleanPlainText(plainText));
  if (plainNoise.proseScore > noise.proseScore * 1.2 && noise.cssNoiseScore >= 2) return true;
  return false;
}

function hasReadableProse(text) {
  return (String(text).match(/\b[a-z]{4,}\b/gi) || []).length >= 8;
}

function isHtmlDisplayPolluted(sanitizedHtml, plainText) {
  if (isHtmlCssPolluted(sanitizedHtml, plainText)) return true;
  const htmlText = htmlToPlainText(sanitizedHtml);
  const plain = cleanPlainText(plainText);
  if (!plain || !hasReadableProse(plain)) return false;

  if (/">\s/.test(htmlText)) return true;

  const htmlInvisible = invisibleCharRatio(htmlText);
  const plainInvisible = invisibleCharRatio(plain);
  if (htmlInvisible > 0.15 && plainInvisible < htmlInvisible * 0.2 && !hasReadableProse(htmlText)) return true;

  return false;
}

function countUnsafeElements(html) {
  UNSAFE_TAG_PATTERN.lastIndex = 0;
  return (String(html).match(UNSAFE_TAG_PATTERN) || []).length;
}

function stripBlockedTags(html) {
  let out = String(html || '');
  let stripped = 0;
  for (const tag of BLOCKED_TAGS) {
    const open = new RegExp(`<${tag}\\b[^>]*>`, 'gi');
    const close = new RegExp(`</${tag}>`, 'gi');
    const before = out;
    out = out.replace(open, '').replace(close, '');
    if (before !== out) stripped += 1;
  }
  return { html: out, unsafeElementStrippedCount: stripped };
}

function neutralizeAttributes(html) {
  let unsafeAttributeStrippedCount = 0;
  const onMatches = String(html || '').match(ON_ATTR) || [];
  unsafeAttributeStrippedCount += onMatches.length;
  const out = String(html || '')
    .replace(ON_ATTR, '')
    .replace(/\s(style|class|id)\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(JS_URL, () => {
      unsafeAttributeStrippedCount += 1;
      return 'blocked:';
    });
  return { html: out, unsafeAttributeStrippedCount };
}

function allowlistTags(html) {
  return String(html || '').replace(TAG_PATTERN, (match, tagName, attrs) => {
    const tag = String(tagName || '').toLowerCase();
    if (match.startsWith('</')) {
      return ALLOWED_TAGS.has(tag) ? `</${tag}>` : '';
    }
    if (!ALLOWED_TAGS.has(tag)) return '';
    if (tag === 'img') {
      const srcMatch = String(attrs || '').match(/\bsrc\s*=\s*("([^"]*)"|'([^']*)'|([^\s>]+))/i);
      const src = (srcMatch?.[2] || srcMatch?.[3] || srcMatch?.[4] || '').trim();
      const altMatch = String(attrs || '').match(/\balt\s*=\s*("([^"]*)"|'([^']*)'|([^\s>]+))/i);
      const alt = altMatch?.[2] || altMatch?.[3] || altMatch?.[4] || '';
      if (!/^data:image\//i.test(src)) return '';
      const safeAlt = String(alt).replace(/"/g, '&quot;');
      return `<img src="${src}" alt="${safeAlt}">`;
    }
    const safeAttrs = String(attrs || '').replace(/\s([a-z0-9-]+)\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, (attrMatch, name) => {
      return ALLOWED_ATTRS.has(String(name).toLowerCase()) ? attrMatch : '';
    });
    return `<${tag}${safeAttrs}>`;
  });
}

function processImages(html, { blockRemoteImages = true, inlineImageMap = new Map() } = {}) {
  let remoteImageBlockedCount = 0;
  let trackingPixelBlockedCount = 0;
  let inlineImageResolvedCount = 0;
  let inlineImageUnresolvedCount = 0;

  const out = String(html || '').replace(IMG_TAG, (tag) => {
    TRACKING_PIXEL.lastIndex = 0;
    const isTracking = TRACKING_PIXEL.test(tag);
    TRACKING_PIXEL.lastIndex = 0;
    const src = extractImgSrc(tag);
    if (/^cid:/i.test(src)) {
      const cid = normalizeContentId(src.replace(/^cid:/i, ''));
      const inline = inlineImageMap.get(cid);
      if (inline?.dataUrl) {
        inlineImageResolvedCount += 1;
        const altMatch = tag.match(/\balt\s*=\s*("([^"]*)"|'([^']*)'|([^\s>]+))/i);
        const alt = altMatch?.[2] || altMatch?.[3] || altMatch?.[4] || '';
        const safeAlt = String(alt).replace(/"/g, '&quot;');
        return `<img src="${inline.dataUrl}" alt="${safeAlt}">`;
      }
      inlineImageUnresolvedCount += 1;
      return '';
    }
    if (isTracking) {
      trackingPixelBlockedCount += 1;
      return '';
    }
    if (blockRemoteImages && (/^https?:/i.test(src) || /^\/\//.test(src) || !src)) {
      remoteImageBlockedCount += 1;
      return '';
    }
    remoteImageBlockedCount += 1;
    return '';
  });

  return {
    html: out,
    remoteImageBlockedCount,
    trackingPixelBlockedCount,
    inlineImageResolvedCount,
    inlineImageUnresolvedCount,
  };
}

export function buildResourcePolicySummary(counts = {}) {
  const parts = [];
  if (counts.remoteImageBlockedCount > 0) {
    parts.push(`${counts.remoteImageBlockedCount} remote image${counts.remoteImageBlockedCount === 1 ? '' : 's'} blocked`);
  }
  if (counts.trackingPixelBlockedCount > 0) {
    parts.push(`${counts.trackingPixelBlockedCount} tracking resource${counts.trackingPixelBlockedCount === 1 ? '' : 's'} blocked`);
  }
  if (counts.inlineImageResolvedCount > 0) {
    parts.push(`${counts.inlineImageResolvedCount} inline image${counts.inlineImageResolvedCount === 1 ? '' : 's'} rendered`);
  }
  if (counts.inlineImageUnresolvedCount > 0) {
    parts.push(`${counts.inlineImageUnresolvedCount} inline image${counts.inlineImageUnresolvedCount === 1 ? '' : 's'} unavailable`);
  }
  if (counts.unsafeElementStrippedCount > 0) {
    parts.push('unsafe HTML stripped');
  }
  if (counts.unsafeAttributeStrippedCount > 0) {
    parts.push('unsafe attributes stripped');
  }
  if (counts.styleElementStrippedCount > 0) {
    parts.push('style content stripped');
  }
  if (counts.cssNoiseTextStrippedCount > 0) {
    parts.push('CSS noise stripped');
  }
  if (counts.hasAttachments) {
    parts.push('attachments detected');
  }
  return parts.length ? parts.join(' · ') : null;
}

export function sanitizeEmailHtml(html, { blockRemoteImages = true, inlineImageMap = new Map() } = {}) {
  const warnings = [];
  let input = String(html || '');

  if (!input.trim()) {
    return {
      sanitizedHtml: '',
      warnings: ['empty_html'],
      unsafeHtmlStripped: false,
      remoteImagesBlocked: blockRemoteImages,
      remoteImageBlockedCount: 0,
      trackingPixelBlockedCount: 0,
      inlineImageResolvedCount: 0,
      inlineImageUnresolvedCount: 0,
      unsafeElementStrippedCount: 0,
      unsafeAttributeStrippedCount: 0,
      styleElementStrippedCount: 0,
      cssNoiseTextStrippedCount: 0,
    };
  }

  const styleBlocks = stripStyleAndFrameworkBlocks(input);
  input = styleBlocks.html;
  let styleElementStrippedCount = styleBlocks.styleElementStrippedCount;
  if (styleElementStrippedCount > 0) warnings.push('style_content_stripped');

  const unsafeElementCount = countUnsafeElements(input);
  let unsafeHtmlStripped = unsafeElementCount > 0
    || /<script|javascript:|onerror=|onload=/i.test(input);
  if (unsafeHtmlStripped) warnings.push('unsafe_html_stripped');

  const blocked = stripBlockedTags(input);
  input = blocked.html;
  const neutral = neutralizeAttributes(input);
  input = neutral.html;
  const images = processImages(input, { blockRemoteImages, inlineImageMap });
  input = images.html;

  if (images.trackingPixelBlockedCount > 0) warnings.push('tracking_pixel_blocked');
  if (images.remoteImageBlockedCount > 0) warnings.push('remote_images_blocked');
  if (images.inlineImageResolvedCount > 0) warnings.push('inline_images_rendered');
  if (images.inlineImageUnresolvedCount > 0) warnings.push('inline_images_unavailable');

  input = allowlistTags(input);
  const cssNoise = stripCssNoiseText(input);
  input = cssNoise.html;
  if (cssNoise.cssNoiseTextStrippedCount > 0) warnings.push('css_noise_stripped');
  input = input.replace(/\s+/g, ' ').trim();

  return {
    sanitizedHtml: input,
    warnings,
    unsafeHtmlStripped,
    remoteImagesBlocked: blockRemoteImages,
    remoteImageBlockedCount: images.remoteImageBlockedCount,
    trackingPixelBlockedCount: images.trackingPixelBlockedCount,
    inlineImageResolvedCount: images.inlineImageResolvedCount,
    inlineImageUnresolvedCount: images.inlineImageUnresolvedCount,
    unsafeElementStrippedCount: blocked.unsafeElementStrippedCount + unsafeElementCount,
    unsafeAttributeStrippedCount: neutral.unsafeAttributeStrippedCount,
    styleElementStrippedCount: styleElementStrippedCount,
    cssNoiseTextStrippedCount: cssNoise.cssNoiseTextStrippedCount,
  };
}

function isHtmlUnreadable(sanitizedHtml, plainText) {
  if (isHtmlDisplayPolluted(sanitizedHtml, plainText)) return true;
  const text = htmlToPlainText(sanitizedHtml);
  const plainLen = cleanPlainText(plainText).length;
  const htmlTextLen = text.length;
  if (!plainLen) return false;
  if (!htmlTextLen && plainLen > 40) return true;
  if (htmlTextLen < 24 && plainLen > htmlTextLen * 2) return true;
  return false;
}

export function buildBodyRenderModel(mimeAnalysis, { blockRemoteImages = true } = {}) {
  const warnings = [];
  const plainText = cleanPlainText(mimeAnalysis?.plainText || '');
  let sanitizedPlainText = plainText;
  let sanitizedHtml = '';
  let bodyRenderMode = 'plain_text';
  let usedPlainTextFallback = false;
  let fallbackReason = null;
  let unsafeHtmlStripped = false;
  let remoteImagesBlocked = blockRemoteImages;
  let remoteImageBlockedCount = 0;
  let trackingPixelBlockedCount = 0;
  let inlineImageResolvedCount = mimeAnalysis?.inlineImageResolvedCount || 0;
  let inlineImageUnresolvedCount = 0;
  let unsafeElementStrippedCount = 0;
  let unsafeAttributeStrippedCount = 0;
  let styleElementStrippedCount = 0;
  let cssNoiseTextStrippedCount = 0;
  let htmlNoiseRatio = 0;

  if (mimeAnalysis?.hasHtml && mimeAnalysis.htmlText) {
    const sanitized = sanitizeEmailHtml(mimeAnalysis.htmlText, {
      blockRemoteImages,
      inlineImageMap: mimeAnalysis.inlineImageMap || new Map(),
    });
    unsafeHtmlStripped = sanitized.unsafeHtmlStripped;
    remoteImagesBlocked = sanitized.remoteImagesBlocked;
    remoteImageBlockedCount = sanitized.remoteImageBlockedCount;
    trackingPixelBlockedCount = sanitized.trackingPixelBlockedCount;
    inlineImageResolvedCount = sanitized.inlineImageResolvedCount;
    inlineImageUnresolvedCount = sanitized.inlineImageUnresolvedCount;
    unsafeElementStrippedCount = sanitized.unsafeElementStrippedCount;
    unsafeAttributeStrippedCount = sanitized.unsafeAttributeStrippedCount;
    styleElementStrippedCount = sanitized.styleElementStrippedCount || 0;
    cssNoiseTextStrippedCount = sanitized.cssNoiseTextStrippedCount || 0;
    warnings.push(...sanitized.warnings);

    const noise = analyzeTextNoise(htmlToPlainText(sanitized.sanitizedHtml));
    htmlNoiseRatio = noise.htmlNoiseRatio;

    if (sanitized.sanitizedHtml && !isHtmlUnreadable(sanitized.sanitizedHtml, plainText)) {
      sanitizedHtml = sanitized.sanitizedHtml;
      bodyRenderMode = 'sanitized_html';
    } else if (plainText) {
      sanitizedPlainText = plainText;
      bodyRenderMode = 'plain_fallback';
      usedPlainTextFallback = true;
      fallbackReason = isHtmlDisplayPolluted(sanitized.sanitizedHtml, plainText)
        ? (isHtmlCssPolluted(sanitized.sanitizedHtml, plainText) ? 'css_noise_stripped' : 'html_display_polluted')
        : 'html_unreadable';
      warnings.push(fallbackReason === 'css_noise_stripped'
        ? 'css_noise_used_plain_fallback'
        : fallbackReason === 'html_display_polluted'
          ? 'html_display_used_plain_fallback'
          : 'html_unreadable_used_plain_fallback');
    } else if (sanitized.sanitizedHtml) {
      sanitizedHtml = sanitized.sanitizedHtml;
      bodyRenderMode = 'sanitized_html';
    }
  }

  if (!sanitizedPlainText && mimeAnalysis?.hasHtml && !sanitizedHtml) {
    sanitizedPlainText = htmlToPlainText(mimeAnalysis.htmlText);
    bodyRenderMode = 'plain_fallback';
    usedPlainTextFallback = true;
    fallbackReason = fallbackReason || 'html_fallback_to_text';
    warnings.push('html_fallback_to_text');
  }

  if (!sanitizedPlainText && sanitizedHtml) {
    sanitizedPlainText = htmlToPlainText(sanitizedHtml);
  }

  if (!sanitizedHtml && sanitizedPlainText) {
    bodyRenderMode = bodyRenderMode === 'plain_fallback' ? 'plain_fallback' : 'plain_text';
  }

  const resourcePolicySummary = buildResourcePolicySummary({
    remoteImageBlockedCount,
    trackingPixelBlockedCount,
    inlineImageResolvedCount,
    inlineImageUnresolvedCount,
    unsafeElementStrippedCount,
    unsafeAttributeStrippedCount,
    styleElementStrippedCount,
    cssNoiseTextStrippedCount,
    hasAttachments: Boolean(mimeAnalysis?.hasAttachments),
  });

  return {
    bodyRenderMode,
    mimeStructure: mimeAnalysis?.mimeStructure || 'unknown',
    hasHtml: Boolean(mimeAnalysis?.hasHtml),
    hasPlainText: Boolean(mimeAnalysis?.hasPlainText || sanitizedPlainText),
    hasAttachments: Boolean(mimeAnalysis?.hasAttachments),
    hasInlineImages: Boolean(mimeAnalysis?.hasInlineImages),
    inlineImageCount: mimeAnalysis?.inlineImageCount || 0,
    inlineImageResolvedCount,
    remoteImageBlockedCount,
    trackingPixelBlockedCount,
    unsafeElementStrippedCount,
    unsafeAttributeStrippedCount,
    styleElementStrippedCount,
    cssNoiseTextStrippedCount,
    htmlNoiseRatio,
    usedPlainTextFallback,
    fallbackReason,
    remoteImagesBlocked,
    unsafeHtmlStripped,
    renderWarnings: [...new Set(warnings)],
    resourcePolicySummary,
    sanitizedHtml: sanitizedHtml || null,
    sanitizedPlainText: sanitizedPlainText || '',
  };
}

export { htmlToPlainText };
