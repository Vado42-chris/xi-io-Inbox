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
    const filename = part.filename || headerValue(part, 'Content-Disposition').split('filename=')[1];
    return Boolean(filename || part.body?.attachmentId);
  });
  const inlineParts = parts.filter((part) => {
    const cid = headerValue(part, 'Content-ID').replace(/^<|>$/g, '');
    return Boolean(cid) && part.mimeType?.startsWith('image/');
  });

  const plainText = plainParts.map(partBodyText).find(Boolean)
    || (payload.mimeType === 'text/plain' ? partBodyText(payload) : '');
  const htmlText = htmlParts.map(partBodyText).find(Boolean)
    || (payload.mimeType === 'text/html' ? partBodyText(payload) : '');

  return {
    mimeStructure: classifyMimeStructure(payload),
    hasPlainText: Boolean(plainText?.trim()),
    hasHtml: Boolean(htmlText?.trim()),
    hasAttachments: attachmentParts.length > 0,
    hasInlineImages: inlineParts.length > 0,
    attachmentCount: attachmentParts.length,
    inlineImageCount: inlineParts.length,
    plainText: plainText || '',
    htmlText: htmlText || '',
  };
}
