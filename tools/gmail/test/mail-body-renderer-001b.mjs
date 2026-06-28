import assert from 'node:assert/strict';
import { analyzeMimePayload } from '../lib/mime-body-model.js';
import { sanitizeEmailHtml, buildBodyRenderModel, buildResourcePolicySummary } from '../lib/html-sanitize.js';
import { redactBodyContent } from '../lib/body-redaction.js';

function b64(text) {
  return Buffer.from(String(text), 'utf8').toString('base64url');
}

const marketingHtml = `
<p>Hello Chris,</p>
<img src="https://cdn.example.com/logo.png" alt="Logo">
<img src="https://track.example.com/pixel.gif" width="1" height="1">
<p>Your order ships Friday. Visit https://shop.example.com/deals for details.</p>
<img src="cid:logo123@mail">
<a href="https://shop.example.com">Shop now</a>
`;

const marketingPayload = {
  mimeType: 'multipart/alternative',
  parts: [
    {
      mimeType: 'text/plain',
      body: { data: b64('Hello Chris, order ships Friday. See https://shop.example.com/deals') },
    },
    { mimeType: 'text/html', body: { data: b64(marketingHtml) } },
  ],
};

const marketingAnalysis = analyzeMimePayload(marketingPayload);
assert.equal(marketingAnalysis.hasHtml, true);
assert.equal(marketingAnalysis.hasPlainText, true);
assert.equal(marketingAnalysis.mimeStructure, 'multipart/alternative');
assert.ok(marketingAnalysis.cidReferenceCount >= 1);

const marketingModel = buildBodyRenderModel(marketingAnalysis);
assert.doesNotMatch(marketingModel.sanitizedHtml || marketingModel.sanitizedPlainText, /\[redacted-resource\]/i);
assert.doesNotMatch(marketingModel.sanitizedHtml || '', /remote image blocked|tracking pixel blocked/i);
assert.match(marketingModel.sanitizedPlainText, /order ships Friday/i);
assert.ok(marketingModel.remoteImageBlockedCount >= 1);
assert.ok(marketingModel.trackingPixelBlockedCount >= 1);
assert.ok(marketingModel.resourcePolicySummary);
assert.match(marketingModel.resourcePolicySummary, /remote image/i);

const tracking = sanitizeEmailHtml('<p>Hi</p><img src="https://x.com/t.gif" width="1" height="1">');
assert.equal(tracking.trackingPixelBlockedCount, 1);
assert.doesNotMatch(tracking.sanitizedHtml, /tracking pixel blocked/i);

const manyImagesHtml = '<p>Sale today</p>' + '<img src="https://a.com/1.png">'.repeat(5);
const manyImages = buildBodyRenderModel(analyzeMimePayload({
  mimeType: 'text/html',
  body: { data: b64(manyImagesHtml) },
}));
assert.match(manyImages.sanitizedPlainText || manyImages.sanitizedHtml || '', /Sale today/i);
assert.equal(manyImages.remoteImageBlockedCount, 5);
assert.doesNotMatch(manyImages.sanitizedHtml || '', /\[redacted-resource\]/i);

const inlinePng = Buffer.from('fakepng').toString('base64url');
const relatedPayload = {
  mimeType: 'multipart/related',
  parts: [
    {
      mimeType: 'text/html',
      body: { data: b64('<p>Inline below</p><img src="cid:logo@mail" alt="Logo">') },
    },
    {
      mimeType: 'image/png',
      headers: [{ name: 'Content-ID', value: '<logo@mail>' }],
      body: { data: inlinePng },
    },
  ],
};

const relatedModel = buildBodyRenderModel(analyzeMimePayload(relatedPayload));
assert.equal(relatedModel.inlineImageResolvedCount, 1);
assert.match(relatedModel.sanitizedHtml, /data:image\/png;base64,/);
assert.ok(relatedModel.renderWarnings.includes('inline_images_rendered'));

const unresolvedCidPayload = {
  mimeType: 'text/html',
  body: { data: b64('<p>Missing inline</p><img src="cid:missing@mail">') },
};
const unresolvedModel = buildBodyRenderModel(analyzeMimePayload(unresolvedCidPayload));
assert.doesNotMatch(unresolvedModel.sanitizedHtml || '', /redacted-resource/i);
assert.match(unresolvedModel.resourcePolicySummary || '', /inline image.*unavailable/i);

const attachmentPayload = {
  mimeType: 'multipart/mixed',
  parts: [
    { mimeType: 'text/plain', body: { data: b64('Invoice attached') } },
    {
      mimeType: 'image/jpeg',
      filename: 'scan.jpg',
      headers: [{ name: 'Content-Disposition', value: 'attachment; filename=scan.jpg' }],
      body: { attachmentId: 'att1', size: 9000 },
    },
  ],
};
const attachmentModel = buildBodyRenderModel(analyzeMimePayload(attachmentPayload));
assert.equal(attachmentModel.hasAttachments, true);
assert.match(attachmentModel.sanitizedPlainText, /Invoice attached/);

const malicious = sanitizeEmailHtml('<script>alert(1)</script><p onclick="alert(2)">click</p><img src=x onerror=alert(3)>');
assert.equal(malicious.unsafeHtmlStripped, true);
assert.doesNotMatch(malicious.sanitizedHtml, /script|onclick|onerror|javascript:/i);

const plainOnly = buildBodyRenderModel(analyzeMimePayload({
  mimeType: 'text/plain',
  body: { data: b64('Plain only body') },
}));
assert.equal(plainOnly.bodyRenderMode, 'plain_text');
assert.equal(plainOnly.sanitizedPlainText, 'Plain only body');

const unreadableHtmlPayload = {
  mimeType: 'multipart/alternative',
  parts: [
    { mimeType: 'text/plain', body: { data: b64('Readable plain fallback body with enough text to prefer.') } },
    { mimeType: 'text/html', body: { data: b64('<img src="https://a.com/1.png"><img src="https://a.com/2.png">') } },
  ],
};
const fallbackModel = buildBodyRenderModel(analyzeMimePayload(unreadableHtmlPayload));
assert.equal(fallbackModel.usedPlainTextFallback, true);
assert.equal(fallbackModel.bodyRenderMode, 'plain_fallback');
assert.match(fallbackModel.sanitizedPlainText, /Readable plain fallback/i);

const redactedPlain = redactBodyContent('See https://shop.example.com/deals today');
assert.doesNotMatch(redactedPlain.sanitizedPlainText, /\[redacted-resource\]/i);
assert.match(redactedPlain.sanitizedPlainText, /See today/);

assert.match(buildResourcePolicySummary({
  remoteImageBlockedCount: 2,
  trackingPixelBlockedCount: 1,
  unsafeElementStrippedCount: 1,
}), /2 remote images blocked · 1 tracking resource blocked · unsafe HTML stripped/);

const mantineHtml = `
<style>:root, :host { --mantine-primary-color-filled: var(--mantine-color-gray-filled); }
@media (max-width: 36em) { .mantine-hidden-from-xs { display: none !important; } }</style>
<p>Chris, your due dates are lying to you</p>
<p>One field for when you'll do it, another for when it's due.</p>
`;
const mantineModel = buildBodyRenderModel(analyzeMimePayload({
  mimeType: 'multipart/alternative',
  parts: [
    { mimeType: 'text/plain', body: { data: b64("Chris, your due dates are lying to you\nOne field for when you'll do it, another for when it's due.") } },
    { mimeType: 'text/html', body: { data: b64(mantineHtml) } },
  ],
}));
assert.doesNotMatch(
  mantineModel.sanitizedHtml || mantineModel.sanitizedPlainText,
  /:root|:host|@media|--mantine|display:\s*none\s*!important/i,
);
assert.match(mantineModel.sanitizedPlainText, /due dates are lying to you/i);
assert.ok(mantineModel.styleElementStrippedCount >= 1 || mantineModel.usedPlainTextFallback);

const styleOnlyHtml = '<style>.hidden{display:none !important;}</style><p>Sale ends tonight</p>';
const styleOnlyModel = buildBodyRenderModel(analyzeMimePayload({
  mimeType: 'text/html',
  body: { data: b64(styleOnlyHtml) },
}));
assert.match(styleOnlyModel.sanitizedPlainText || styleOnlyModel.sanitizedHtml || '', /Sale ends tonight/i);
assert.doesNotMatch(styleOnlyModel.sanitizedHtml || '', /display:\s*none/i);

const cssLeakHtml = '<p>Broken title"></p><p>Real message body here with enough readable words for everyone.</p>';
const cssLeakModel = buildBodyRenderModel(analyzeMimePayload({
  mimeType: 'multipart/alternative',
  parts: [
    { mimeType: 'text/plain', body: { data: b64('Real message body here with enough readable words for everyone.') } },
    { mimeType: 'text/html', body: { data: b64(cssLeakHtml) } },
  ],
}));
assert.equal(cssLeakModel.usedPlainTextFallback, true);
assert.match(cssLeakModel.fallbackReason || '', /html_display_polluted|css_noise_stripped/);

const newsletterHtml = `
<style>.logo{width:100px;}</style>
<p>Newsletter headline</p>
<img src="https://cdn.example.com/hero.png">
<img src="https://track.example.com/p.gif" width="1" height="1">
`;
const newsletterModel = buildBodyRenderModel(analyzeMimePayload({
  mimeType: 'text/html',
  body: { data: b64(newsletterHtml) },
}));
assert.match(newsletterModel.sanitizedPlainText || newsletterModel.sanitizedHtml || '', /Newsletter headline/i);
assert.doesNotMatch(newsletterModel.sanitizedHtml || '', /\[redacted-resource\]|\.logo\{/i);
assert.ok(newsletterModel.remoteImageBlockedCount >= 1);

console.log('mail-body-renderer-001b: pass');
