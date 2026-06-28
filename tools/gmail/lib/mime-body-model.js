import { decodeBase64Url } from './body-redaction.js';

function headerValue(part, name) {
  const headers = part?.headers || [];
  const match = headers.find((entry) => String(entry.name || '').toLowerCase() === name.toLowerCase());
  return match?.value || '';
}

export function flattenMimeParts(payload, acc = []) {
  if (!payload) return acc;
  acc.push(payload);
  for (const part of payload.parts || []) {
    flattenMimeParts(part, acc);
  }
  return acc;
}

function partBodyText(part) {
  if (!part?.body?.data) return '';
  return decodeBase64Url(part.body.data);
}

function normalizeContentId(value) {
  return String(value || '').replace(/^<|>$/g, '').trim().toLowerCase();
}

/** Build map of Content-ID → inline image part metadata (001B). */
export function buildInlineImageMap(parts = []) {
  const map = new Map();
  for (const part of parts) {
    const cid = normalizeContentId(headerValue(part, 'Content-ID'));
    if (!cid || !String(part.mimeType || '').startsWith('image/')) continue;
    if (part.body?.data) {
      const normalized = String(part.body.data).replace(/-/g, '+').replace(/_/g, '/');
      map.set(cid, {
        resolved: true,
        mimeType: part.mimeType,
        dataUrl: `data:${part.mimeType};base64,${normalized}`,
      });
    } else {
      map.set(cid, {
        resolved: false,
        mimeType: part.mimeType,
        reason: part.body?.attachmentId ? 'attachment_id_only' : 'missing_inline_data',
      });
    }
  }
  return map;
}

function countCidReferences(htmlText = '') {
  const matches = String(htmlText).match(/\bcid:[^"'>\s]+/gi) || [];
  return matches.length;
}

export function classifyMimeStructure(payload) {
  if (!payload) return 'unknown';
  const top = String(payload.mimeType || '').toLowerCase();
  if (top === 'text/plain') return 'text/plain';
  if (top === 'text/html') return 'text/html';
  if (top.startsWith('multipart/')) {
    if (top.includes('alternative')) return 'multipart/alternative';
    if (top.includes('related')) return 'multipart/related';
    if (top.includes('mixed')) return 'multipart/mixed';
    return top;
  }
  return top || 'unknown';
}

export function analyzeMimePayload(payload) {
  const parts = flattenMimeParts(payload);
  const plainParts = parts.filter((part) => part.mimeType === 'text/plain' && part.body?.data);
  const htmlParts = parts.filter((part) => part.mimeType === 'text/html' && part.body?.data);
  const attachmentParts = parts.filter((part) => {
    const disposition = headerValue(part, 'Content-Disposition').toLowerCase();
    const filename = part.filename || headerValue(part, 'Content-Disposition').split('filename=')[1];
    const isInline = disposition.includes('inline') && !disposition.includes('attachment');
    return Boolean((filename || part.body?.attachmentId) && !isInline);
  });
  const inlineParts = parts.filter((part) => {
    const cid = normalizeContentId(headerValue(part, 'Content-ID'));
    return Boolean(cid) && String(part.mimeType || '').startsWith('image/');
  });
  const inlineImageMap = buildInlineImageMap(parts);

  const plainText = plainParts.map(partBodyText).find(Boolean)
    || (payload.mimeType === 'text/plain' ? partBodyText(payload) : '');
  const htmlText = htmlParts.map(partBodyText).find(Boolean)
    || (payload.mimeType === 'text/html' ? partBodyText(payload) : '');

  let inlineImageResolvedCount = 0;
  for (const entry of inlineImageMap.values()) {
    if (entry.resolved) inlineImageResolvedCount += 1;
  }

  return {
    mimeStructure: classifyMimeStructure(payload),
    hasPlainText: Boolean(plainText?.trim()),
    hasHtml: Boolean(htmlText?.trim()),
    hasAttachments: attachmentParts.length > 0,
    hasInlineImages: inlineParts.length > 0,
    attachmentCount: attachmentParts.length,
    inlineImageCount: inlineParts.length,
    inlineImageResolvedCount,
    inlineImageMap,
    cidReferenceCount: countCidReferences(htmlText),
    plainText: plainText || '',
    htmlText: htmlText || '',
  };
}
