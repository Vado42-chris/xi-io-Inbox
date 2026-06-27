#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

for (const file of [
  'tools/gmail/lib/mime-body-model.js',
  'tools/gmail/lib/html-sanitize.js',
  'tools/gmail/test/mail-body-renderer-001a.mjs',
  'public/mail-body-renderer-001a.css',
  'server/mail-body.mjs',
]) {
  if (!fs.existsSync(path.join(root, file))) {
    console.error(`mail-body-renderer-001a-model-check: missing ${file}`);
    process.exit(1);
  }
}

const previewJs = fs.readFileSync(path.join(root, 'public/inbox-preview.js'), 'utf8');
const indexHtml = fs.readFileSync(path.join(root, 'public/index.html'), 'utf8');
const adapterJs = fs.readFileSync(path.join(root, 'tools/gmail/lib/adapter.js'), 'utf8');
const mailBodyServer = fs.readFileSync(path.join(root, 'server/mail-body.mjs'), 'utf8');
const pkg = fs.readFileSync(path.join(root, 'package.json'), 'utf8');
const gmailPkg = fs.readFileSync(path.join(root, 'tools/gmail/package.json'), 'utf8');

for (const token of [
  'localWebBodyHasContent',
  'renderMailBodyRenderBadges',
  'renderLocalWebHydratedBody',
  'mail-body-sandbox',
  'bodyRenderMode',
  'sanitized_html',
  'Remote images blocked',
  'Attachments detected',
]) {
  if (!previewJs.includes(token)) {
    console.error(`mail-body-renderer-001a-model-check: preview missing ${token}`);
    process.exit(1);
  }
}

if (!indexHtml.includes('mail-body-renderer-001a.css')) {
  console.error('mail-body-renderer-001a-model-check: index.html missing mail-body-renderer-001a.css');
  process.exit(1);
}

const rendererCss = fs.readFileSync(path.join(root, 'public/mail-body-renderer-001a.css'), 'utf8');
if (!rendererCss.includes('MAIL-BODY-RENDERER-001A')) {
  console.error('mail-body-renderer-001a-model-check: css missing slice marker');
  process.exit(1);
}

for (const token of ['analyzeMimePayload', 'buildBodyRenderModel', 'renderModel']) {
  if (!adapterJs.includes(token)) {
    console.error(`mail-body-renderer-001a-model-check: adapter missing ${token}`);
    process.exit(1);
  }
}

for (const token of ['renderModel', 'attachmentPresence', 'deriveBodyMetadata']) {
  if (!mailBodyServer.includes(token)) {
    console.error(`mail-body-renderer-001a-model-check: mail-body server missing ${token}`);
    process.exit(1);
  }
}

for (const token of ['check:mailbody001a', 'mail-body-renderer-001a-model-check.mjs']) {
  if (!pkg.includes(token)) {
    console.error(`mail-body-renderer-001a-model-check: root package.json missing ${token}`);
    process.exit(1);
  }
}

for (const token of ['mime-body-model.js', 'html-sanitize.js', 'mail-body-renderer-001a.mjs']) {
  if (!gmailPkg.includes(token)) {
    console.error(`mail-body-renderer-001a-model-check: tools/gmail package.json missing ${token}`);
    process.exit(1);
  }
}

console.log('mail-body-renderer-001a-model-check: pass');
