import assert from 'node:assert/strict';
import { analyzeMimePayload } from '../lib/mime-body-model.js';
import { sanitizeEmailHtml, buildBodyRenderModel } from '../lib/html-sanitize.js';

function b64(text) {
  return Buffer.from(String(text), 'utf8').toString('base64url');
}

const plainPayload = {
  mimeType: 'text/plain',
  body: { data: b64('Hello plain body') },
};

const htmlPayload = {
  mimeType: 'text/html',
  body: { data: b64('<p>Hello <strong>HTML</strong></p>') },
};

const altPayload = {
  mimeType: 'multipart/alternative',
  parts: [
    { mimeType: 'text/plain', body: { data: b64('Plain alternative part') } },
    { mimeType: 'text/html', body: { data: b64('<p>HTML alternative part</p>') } },
  ],
};

const relatedPayload = {
  mimeType: 'multipart/related',
  parts: [
    {
      mimeType: 'text/html',
      body: { data: b64('<p>Inline image below</p><img src="cid:logo@mail">') },
    },
    {
      mimeType: 'image/png',
      headers: [{ name: 'Content-ID', value: '<logo@mail>' }],
      body: { attachmentId: 'inline-1', size: 1200 },
    },
  ],
};

const mixedPayload = {
  mimeType: 'multipart/mixed',
  parts: [
    { mimeType: 'text/plain', body: { data: b64('See attachment') } },
    {
      mimeType: 'application/pdf',
      filename: 'invoice.pdf',
      headers: [{ name: 'Content-Disposition', value: 'attachment; filename=invoice.pdf' }],
      body: { attachmentId: 'att123', size: 5000 },
    },
  ],
};

const plainAnalysis = analyzeMimePayload(plainPayload);
assert.equal(plainAnalysis.mimeStructure, 'text/plain');
assert.equal(plainAnalysis.hasPlainText, true);
assert.equal(plainAnalysis.hasHtml, false);

const plainModel = buildBodyRenderModel(plainAnalysis);
assert.equal(plainModel.bodyRenderMode, 'plain_text');
assert.equal(plainModel.hasPlainText, true);
assert.equal(plainModel.sanitizedPlainText, 'Hello plain body');
assert.equal(plainModel.sanitizedHtml, null);

const htmlAnalysis = analyzeMimePayload(htmlPayload);
assert.equal(htmlAnalysis.mimeStructure, 'text/html');
assert.equal(htmlAnalysis.hasHtml, true);

const htmlModel = buildBodyRenderModel(htmlAnalysis);
assert.equal(htmlModel.bodyRenderMode, 'sanitized_html');
assert.match(htmlModel.sanitizedHtml, /<strong>HTML<\/strong>/);
assert.equal(htmlModel.hasHtml, true);

const altAnalysis = analyzeMimePayload(altPayload);
assert.equal(altAnalysis.mimeStructure, 'multipart/alternative');
assert.equal(altAnalysis.hasPlainText, true);
assert.equal(altAnalysis.hasHtml, true);

const altModel = buildBodyRenderModel(altAnalysis);
assert.equal(altModel.bodyRenderMode, 'sanitized_html');
assert.match(altModel.sanitizedHtml, /HTML alternative part/);

const trackingHtml = '<p>Newsletter</p><img src="https://evil.com/track.gif" width="1" height="1" /><p>Offer ends Friday.</p>';
const tracking = sanitizeEmailHtml(trackingHtml);
assert.equal(tracking.remoteImagesBlocked, true);
assert.equal(tracking.trackingPixelBlockedCount, 1);
assert.match(tracking.sanitizedHtml, /Offer ends Friday/);
assert.doesNotMatch(tracking.sanitizedHtml, /redacted-resource|remote image blocked|tracking pixel blocked/i);
assert.ok(tracking.warnings.includes('tracking_pixel_blocked'));

const maliciousHtml = '<script>alert(1)</script><p onclick="alert(2)">click</p><img src=x onerror=alert(3)>';
const malicious = sanitizeEmailHtml(maliciousHtml);
assert.equal(malicious.unsafeHtmlStripped, true);
assert.ok(malicious.warnings.includes('unsafe_html_stripped'));
assert.doesNotMatch(malicious.sanitizedHtml, /script|onclick|onerror|javascript:/i);

const mixedAnalysis = analyzeMimePayload(mixedPayload);
assert.equal(mixedAnalysis.mimeStructure, 'multipart/mixed');
assert.equal(mixedAnalysis.hasAttachments, true);

const mixedModel = buildBodyRenderModel(mixedAnalysis);
assert.equal(mixedModel.hasAttachments, true);
assert.equal(mixedModel.bodyRenderMode, 'plain_text');

const relatedAnalysis = analyzeMimePayload(relatedPayload);
assert.equal(relatedAnalysis.mimeStructure, 'multipart/related');
assert.equal(relatedAnalysis.hasInlineImages, true);

const relatedModel = buildBodyRenderModel(relatedAnalysis);
assert.equal(relatedModel.hasInlineImages, true);
assert.equal(relatedModel.remoteImagesBlocked, true);

console.log('mail-body-renderer-001a: pass');
