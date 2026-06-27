#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

for (const file of [
  'tools/gmail/lib/html-sanitize.js',
  'tools/gmail/lib/mime-body-model.js',
  'tools/gmail/lib/body-redaction.js',
  'tools/gmail/test/mail-body-renderer-001b.mjs',
  'docs/product/mail-body-renderer-001b.md',
]) {
  if (!fs.existsSync(path.join(root, file))) {
    console.error(`mail-body-renderer-001b-model-check: missing ${file}`);
    process.exit(1);
  }
}

const htmlSanitize = fs.readFileSync(path.join(root, 'tools/gmail/lib/html-sanitize.js'), 'utf8');
const bodyRedaction = fs.readFileSync(path.join(root, 'tools/gmail/lib/body-redaction.js'), 'utf8');
const adapterJs = fs.readFileSync(path.join(root, 'tools/gmail/lib/adapter.js'), 'utf8');
const previewJs = fs.readFileSync(path.join(root, 'public/inbox-preview.js'), 'utf8');
const pkg = fs.readFileSync(path.join(root, 'package.json'), 'utf8');
const gmailPkg = fs.readFileSync(path.join(root, 'tools/gmail/package.json'), 'utf8');

for (const token of [
  'resourcePolicySummary',
  'remoteImageBlockedCount',
  'trackingPixelBlockedCount',
  'inlineImageResolvedCount',
  'usedPlainTextFallback',
  'buildResourcePolicySummary',
]) {
  if (!htmlSanitize.includes(token)) {
    console.error(`mail-body-renderer-001b-model-check: html-sanitize missing ${token}`);
    process.exit(1);
  }
}

const mimeModel = fs.readFileSync(path.join(root, 'tools/gmail/lib/mime-body-model.js'), 'utf8');
if (!mimeModel.includes('buildInlineImageMap')) {
  console.error('mail-body-renderer-001b-model-check: mime-body-model missing buildInlineImageMap');
  process.exit(1);
}

if (bodyRedaction.includes('[redacted-resource]')) {
  console.error('mail-body-renderer-001b-model-check: body-redaction must not emit [redacted-resource] tokens');
  process.exit(1);
}

if (htmlSanitize.includes('[remote image blocked]') || htmlSanitize.includes('[tracking pixel blocked]')) {
  console.error('mail-body-renderer-001b-model-check: html-sanitize must not inject inline blocked-image marker spam');
  process.exit(1);
}

if (adapterJs.includes('redactBodyContent(rawBody)')) {
  console.error('mail-body-renderer-001b-model-check: adapter must not double-pass redactBodyContent on render model');
  process.exit(1);
}

for (const token of ['renderMailBodyResourceSummary', 'mail-body-resource-summary', 'resourcePolicySummary']) {
  if (!previewJs.includes(token)) {
    console.error(`mail-body-renderer-001b-model-check: preview missing ${token}`);
    process.exit(1);
  }
}

for (const token of ['check:mailbody001b', 'mail-body-renderer-001b-model-check.mjs']) {
  if (!pkg.includes(token)) {
    console.error(`mail-body-renderer-001b-model-check: package.json missing ${token}`);
    process.exit(1);
  }
}

if (!gmailPkg.includes('mail-body-renderer-001b.mjs')) {
  console.error('mail-body-renderer-001b-model-check: tools/gmail package.json missing 001b test');
  process.exit(1);
}

console.log('mail-body-renderer-001b-model-check: pass');
