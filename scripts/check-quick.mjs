import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function run(label, cmd, args) {
  const result = spawnSync(cmd, args, { cwd: root, encoding: 'utf8', stdio: 'pipe' });
  if (result.status !== 0) {
    console.error(`${label}: fail`);
    if (result.stdout) process.stdout.write(result.stdout);
    if (result.stderr) process.stderr.write(result.stderr);
    process.exit(result.status ?? 1);
  }
  process.stdout.write(result.stdout || '');
}

run('check:files', 'npm', ['run', 'check:files', '--silent']);
run('check:json', 'npm', ['run', 'check:json', '--silent']);
run('check:js', 'npm', ['run', 'check:js', '--silent']);
run('check:acc', 'npm', ['run', 'check:acc', '--silent']);
run('check:mail', 'npm', ['run', 'check:mail', '--silent']);
run('check:ui012d', 'npm', ['run', 'check:ui012d', '--silent']);
run('check:ui012e', 'npm', ['run', 'check:ui012e', '--silent']);
run('check:ui013c', 'npm', ['run', 'check:ui013c', '--silent']);
run('check:components', 'npm', ['run', 'check:components', '--silent']);

console.log('check:quick: pass (gmail deferred — run npm run check before slice close)');
