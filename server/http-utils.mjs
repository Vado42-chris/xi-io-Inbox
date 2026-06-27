import fs from 'fs/promises';
import path from 'path';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

export function sendJson(res, statusCode, payload) {
  const body = `${JSON.stringify(payload, null, 2)}\n`;
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  });
  res.end(body);
}

export function sendText(res, statusCode, text, contentType = 'text/plain; charset=utf-8') {
  res.writeHead(statusCode, { 'Content-Type': contentType, 'Cache-Control': 'no-store' });
  res.end(text);
}

export function sendHtml(res, statusCode, html) {
  sendText(res, statusCode, html, 'text/html; charset=utf-8');
}

export async function readJsonBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  if (!chunks.length) return {};
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

export async function serveStaticFile(res, publicRoot, requestPath) {
  const safePath = path.normalize(requestPath).replace(/^(\.\.[/\\])+/, '');
  const filePath = path.join(publicRoot, safePath === '/' ? 'index.html' : safePath);
  if (!filePath.startsWith(publicRoot)) {
    sendText(res, 403, 'Forbidden');
    return;
  }
  try {
    const stat = await fs.stat(filePath);
    if (stat.isDirectory()) {
      return serveStaticFile(res, publicRoot, path.join(safePath, 'index.html'));
    }
    const ext = path.extname(filePath).toLowerCase();
    const data = await fs.readFile(filePath);
    res.writeHead(200, {
      'Content-Type': MIME[ext] || 'application/octet-stream',
      'Cache-Control': ext === '.html' ? 'no-store' : 'public, max-age=60',
    });
    res.end(data);
  } catch {
    if (!path.extname(safePath)) {
      return serveStaticFile(res, publicRoot, '/index.html');
    }
    sendText(res, 404, 'Not found');
  }
}
