#!/usr/bin/env node
import http from 'node:http';
import fs from 'node:fs/promises';
import { URL } from 'node:url';
import {
  assertLocalWebRuntimePaths,
  configureGmailRuntimeEnv,
  defaultListenPort,
  ensureRuntimeDirs,
  publicBaseUrl,
  publicRoot,
  repoRoot,
  resolveLocalWebRuntimeTokenPath,
} from './paths.mjs';

configureGmailRuntimeEnv();
assertLocalWebRuntimePaths();

const { sendHtml, sendJson, sendText, serveStaticFile } = await import('./http-utils.mjs');
const { completeGmailOAuth, startGmailOAuth } = await import('./gmail-oauth.mjs');
const {
  buildMailAccountsPayload,
  buildMailStatusPayload,
  buildMailThreadsPayload,
  isGmailConnected,
  runMailIngressSync,
} = await import('./mail-sync.mjs');
const { readSelectedThreadBody } = await import('./mail-body.mjs');

const SYNC_INTERVAL_MS = Number(process.env.XIIO_MAIL_SYNC_INTERVAL_MS || 60_000);
let syncTimer = null;
let runtimeTokenPath = await resolveLocalWebRuntimeTokenPath();

async function refreshRuntimeTokenPath() {
  runtimeTokenPath = await resolveLocalWebRuntimeTokenPath();
  return runtimeTokenPath;
}

async function tokenPresentAtRuntimePath() {
  try {
    await fs.access(runtimeTokenPath);
    return true;
  } catch {
    return false;
  }
}

async function handleApi(req, res, url) {
  if (req.method === 'GET' && url.pathname === '/api/health') {
    sendJson(res, 200, {
      ok: true,
      mode: 'local-web-runtime',
      product: 'xi-io Inbox local web command center',
      hostMode: 'browser-ui-local-backend',
      staticPreviewPort4488: 'demo-ci-only',
      repoRoot: repoRoot(),
      dataDir: process.env.GMAIL_ADAPTER_DATA_DIR,
      tokenPath: runtimeTokenPath,
      tokenPresentAtRuntimePath: await tokenPresentAtRuntimePath(),
    });
    return;
  }

  if (req.method === 'GET' && url.pathname === '/api/mail/status') {
    sendJson(res, 200, await buildMailStatusPayload());
    return;
  }

  if (req.method === 'GET' && url.pathname === '/api/mail/labels') {
    const { buildAccountLabelsPayload } = await import('./account-labels.mjs');
    sendJson(res, 200, await buildAccountLabelsPayload());
    return;
  }

  if (req.method === 'GET' && url.pathname === '/api/mail/accounts') {
    sendJson(res, 200, await buildMailAccountsPayload());
    return;
  }

  if (req.method === 'GET' && url.pathname === '/api/mail/threads') {
    const payload = await buildMailThreadsPayload({
      max: url.searchParams.get('max') || 500,
      label: url.searchParams.get('label') || undefined,
      mailbox: url.searchParams.get('mailbox') || undefined,
    });
    sendJson(res, 200, payload);
    return;
  }

  const threadBodyMatch = url.pathname.match(/^\/api\/mail\/threads\/([^/]+)\/body$/);
  if (req.method === 'GET' && threadBodyMatch) {
    const payload = await readSelectedThreadBody({
      threadId: decodeURIComponent(threadBodyMatch[1]),
      messageId: url.searchParams.get('messageId') || null,
      maxMessages: url.searchParams.get('maxMessages') || 1,
    });
    sendJson(res, payload.ok ? 200 : (payload.blocked ? 403 : 500), payload);
    return;
  }

  if (url.pathname === '/api/mail/sync' && (req.method === 'POST' || req.method === 'GET')) {
    const result = await runMailIngressSync({ reason: 'manual_repair' });
    sendJson(res, result.ok ? 200 : 500, result);
    return;
  }

  if (req.method === 'GET' && url.pathname === '/api/gmail/oauth/start') {
    try {
      const baseUrl = publicBaseUrl(url.port || defaultListenPort());
      const { authUrl } = await startGmailOAuth(baseUrl);
      res.writeHead(302, { Location: authUrl, 'Cache-Control': 'no-store' });
      res.end();
    } catch (error) {
      sendJson(res, 500, { ok: false, error: String(error.message || error) });
    }
    return;
  }

  if (req.method === 'GET' && url.pathname === '/api/gmail/oauth/callback') {
    try {
      const baseUrl = publicBaseUrl(url.port || defaultListenPort());
      await completeGmailOAuth(baseUrl, url.searchParams);
      await refreshRuntimeTokenPath();
      await runMailIngressSync({ reason: 'connect' });
      const { syncGmailAccountLabels } = await import('./account-labels.mjs');
      await syncGmailAccountLabels().catch(() => {});
      res.writeHead(302, { Location: '/#/mail?connected=1', 'Cache-Control': 'no-store' });
      res.end();
    } catch (error) {
      sendHtml(res, 400, `<p>Gmail connect failed: ${String(error.message || error)}</p><p><a href="/#/mail">Return to Mail</a></p>`);
    }
    return;
  }

  sendJson(res, 404, { ok: false, error: 'Not found' });
}

async function bootstrapSyncLoop() {
  if (await isGmailConnected()) {
    await runMailIngressSync({ reason: 'startup' });
  }
  if (syncTimer) clearInterval(syncTimer);
  syncTimer = setInterval(async () => {
    if (await isGmailConnected()) {
      await runMailIngressSync({ reason: 'interval' });
    }
  }, SYNC_INTERVAL_MS);
}

async function main() {
  await ensureRuntimeDirs();
  const port = defaultListenPort();
  const host = process.env.XIIO_LOCAL_WEB_HOST || '127.0.0.1';
  const baseUrl = publicBaseUrl(port);

  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url || '/', baseUrl);
    try {
      if (url.pathname.startsWith('/api/')) {
        await handleApi(req, res, url);
        return;
      }
      await serveStaticFile(res, publicRoot(), url.pathname);
    } catch (error) {
      sendJson(res, 500, { ok: false, error: String(error.message || error) });
    }
  });

  server.listen(port, host, async () => {
    console.log(`xi-io local web runtime: ${baseUrl}`);
    console.log(`Gmail OAuth callback: ${baseUrl}/api/gmail/oauth/callback`);
    console.log(`Data dir: ${process.env.GMAIL_ADAPTER_DATA_DIR}`);
    console.log(`Token path: ${runtimeTokenPath}`);
    console.log(`Gmail access mode: ${process.env.GMAIL_ACCESS_MODE || 'metadata'} (body read on selected thread only)`);
    console.log('Static :4488 remains demo/CI only. Live mail proof uses this server.');
    await bootstrapSyncLoop();
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
