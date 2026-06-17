import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

export function runStep(root, label, command, args, { optional = false } = {}) {
  const result = spawnSync(command, args, {
    cwd: root,
    encoding: 'utf8',
    stdio: 'pipe',
    shell: false,
  });
  const output = `${result.stdout || ''}${result.stderr || ''}`.trim();
  const ok = result.status === 0;
  if (!ok && !optional) {
    throw new Error(`${label} failed\n${output}`);
  }
  return { label, ok, output: output.split('\n').slice(-3).join('\n') };
}

export function gitHead(root) {
  const result = spawnSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' });
  if (result.status !== 0) {
    throw new Error('git rev-parse HEAD failed');
  }
  return result.stdout.trim();
}

export function gitBranch(root) {
  const result = spawnSync('git', ['rev-parse', '--abbrev-ref', 'HEAD'], { cwd: root, encoding: 'utf8' });
  if (result.status !== 0) {
    return 'unknown';
  }
  return result.stdout.trim();
}

export function liveOAuthMarkerPath(root) {
  return path.join(root, 'secrets/runtime-002c-oauth-consent.complete');
}

export function liveOAuthRecorded(root) {
  const marker = liveOAuthMarkerPath(root);
  return fs.existsSync(marker);
}

export function readLiveOAuthMarker(root) {
  if (!liveOAuthRecorded(root)) {
    return null;
  }
  return fs.readFileSync(liveOAuthMarkerPath(root), 'utf8').trim();
}

export function writeEvidence(root, { head, branch, steps, liveOAuthLine, decisionTokens }) {
  const today = new Date().toISOString().slice(0, 10);
  const lines = [
    '# RUNTIME-002C — Automated Gate Evidence',
    '',
    '```text',
    'AUTO-GENERATED — do not hand-edit decision tokens without re-running the gate.',
    '```',
    '',
    `## Date`,
    '',
    today,
    '',
    '## Branch',
    '',
    `\`${branch}\``,
    '',
    '## Commit SHA',
    '',
    `\`${head}\``,
    '',
    '## Automated checks',
    '',
    '| Step | Result |',
    '| --- | --- |',
    ...steps.map((step) => `| ${step.label} | ${step.ok ? 'Pass' : 'Fail'} |`),
    '',
    '## Live OAuth consent marker',
    '',
    liveOAuthLine,
    '',
    '## Decision values',
    '',
    ...decisionTokens.map((token) => `\`\`\`text\n${token}\n\`\`\``),
    '',
  ];
  const outPath = path.join(root, 'docs/ui/reviews/runtime-002c-automated-gate-evidence.md');
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, lines.join('\n'), 'utf8');
  return outPath;
}
