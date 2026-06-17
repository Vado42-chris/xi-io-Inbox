import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const MAX_FILE_BYTES = 80_000;
const MAX_TOTAL_BYTES = 220_000;
const EXTRACT_CONTEXT_LINES = 40;

function runGit(root, args) {
  const result = spawnSync('git', args, { cwd: root, encoding: 'utf8' });
  if (result.status !== 0) {
    throw new Error(`git ${args.join(' ')} failed: ${result.stderr || result.stdout}`);
  }
  return (result.stdout || '').trim();
}

export function gatherGitContext(root, { commit } = {}) {
  const branch = runGit(root, ['rev-parse', '--abbrev-ref', 'HEAD']);
  const head = commit || runGit(root, ['rev-parse', 'HEAD']);
  const shortHead = runGit(root, ['rev-parse', '--short', 'HEAD']);
  let status = runGit(root, ['status', '--short']);
  if (!status) {
    status = '(clean working tree)';
  }
  return { branch, head, shortHead, status };
}

function readLineWindow(sourceLines, centerLine) {
  const start = Math.max(1, centerLine - EXTRACT_CONTEXT_LINES);
  const end = Math.min(sourceLines.length, centerLine + EXTRACT_CONTEXT_LINES);
  const chunk = [];
  for (let line = start; line <= end; line += 1) {
    chunk.push(`${String(line).padStart(6, ' ')}| ${sourceLines[line - 1] ?? ''}`);
  }
  return chunk.join('\n');
}

function extractByPatterns(root, relativePath, patterns) {
  const absolute = path.join(root, relativePath);
  if (!fs.existsSync(absolute)) {
    return { content: '', note: 'file missing at review time', missing: true };
  }
  const source = fs.readFileSync(absolute, 'utf8');
  const sourceLines = source.split('\n');
  const seen = new Set();
  const chunks = [];

  for (const pattern of patterns) {
    const result = spawnSync('rg', ['-n', pattern, absolute], { encoding: 'utf8' });
    if (result.status !== 0 || !result.stdout.trim()) {
      continue;
    }
    for (const line of result.stdout.trim().split('\n')) {
      const lineNumber = Number(line.split(':')[0]);
      if (!Number.isFinite(lineNumber) || seen.has(lineNumber)) {
        continue;
      }
      seen.add(lineNumber);
      chunks.push(`--- match: ${pattern} @ line ${lineNumber} ---\n${readLineWindow(sourceLines, lineNumber)}`);
    }
  }

  if (!chunks.length) {
    return {
      content: source.slice(0, MAX_FILE_BYTES),
      note: `no pattern matches; truncated to ${MAX_FILE_BYTES} bytes`,
      missing: false,
    };
  }

  let content = chunks.join('\n\n');
  let note = `extracted ${chunks.length} pattern window(s)`;
  if (Buffer.byteLength(content, 'utf8') > MAX_FILE_BYTES) {
    content = content.slice(0, MAX_FILE_BYTES);
    note += `; truncated to ${MAX_FILE_BYTES} bytes`;
  }
  return { content, note, missing: false };
}

function readFileSnippet(root, relativePath, { extractPatterns } = {}) {
  if (extractPatterns?.length) {
    const extracted = extractByPatterns(root, relativePath, extractPatterns);
    return { path: relativePath, ...extracted };
  }

  const absolute = path.join(root, relativePath);
  if (!fs.existsSync(absolute)) {
    return { path: relativePath, missing: true, content: '', note: 'file missing at review time' };
  }
  const stat = fs.statSync(absolute);
  if (!stat.isFile()) {
    return { path: relativePath, missing: true, content: '', note: 'not a regular file' };
  }
  let content = fs.readFileSync(absolute, 'utf8');
  let note = '';
  if (Buffer.byteLength(content, 'utf8') > MAX_FILE_BYTES) {
    content = content.slice(0, MAX_FILE_BYTES);
    note = `truncated to ${MAX_FILE_BYTES} bytes`;
  }
  return { path: relativePath, missing: false, content, note };
}

export function gatherFileBundle(root, fileEntries) {
  const bundle = [];
  let totalBytes = 0;

  for (const entry of fileEntries) {
    const relativePath = typeof entry === 'string' ? entry : entry.path;
    const focus = typeof entry === 'string' ? '' : (entry.focus || '');
    const snippet = readFileSnippet(root, relativePath, {
      extractPatterns: entry.extractPatterns,
    });
    const bytes = Buffer.byteLength(snippet.content, 'utf8');
    if (totalBytes + bytes > MAX_TOTAL_BYTES) {
      bundle.push({
        ...snippet,
        focus,
        skipped: true,
        note: 'skipped — total context budget exceeded',
        content: '',
      });
      continue;
    }
    totalBytes += bytes;
    bundle.push({ ...snippet, focus, skipped: false });
  }

  return { bundle, totalBytes };
}

export function gatherDiffForFiles(root, filePaths, { commit } = {}) {
  if (!filePaths.length) {
    return '(no files listed for diff)';
  }
  const args = commit
    ? ['show', '--stat', '--patch', '--unified=3', commit, '--', ...filePaths]
    : ['diff', '--unified=3', 'HEAD', '--', ...filePaths];
  const result = spawnSync('git', args, { cwd: root, encoding: 'utf8', maxBuffer: 4 * 1024 * 1024 });
  if (result.status !== 0) {
    return `(diff unavailable: ${result.stderr || result.stdout || 'unknown error'})`;
  }
  const diff = (result.stdout || '').trim();
  if (!diff) {
    return '(no diff for listed files — review committed tree content)';
  }
  if (Buffer.byteLength(diff, 'utf8') > MAX_TOTAL_BYTES) {
    return `${diff.slice(0, MAX_TOTAL_BYTES)}\n\n... diff truncated ...`;
  }
  return diff;
}

export function formatFileBundle(bundle) {
  return bundle.map((item) => {
    const header = [`### ${item.path}`];
    if (item.focus) header.push(`Focus: ${item.focus}`);
    if (item.missing) header.push('Status: missing');
    if (item.skipped) header.push(`Status: skipped (${item.note})`);
    if (item.note && !item.skipped) header.push(`Note: ${item.note}`);
    header.push('');
    header.push('```text');
    header.push(item.content || '(empty)');
    header.push('```');
    return header.join('\n');
  }).join('\n\n');
}
