#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chatCompletion } from './lib/ollama-peer-review/client.mjs';
import {
  formatFileBundle,
  gatherDiffForFiles,
  gatherFileBundle,
  gatherGitContext,
} from './lib/ollama-peer-review/context.mjs';
import { getSliceProfile, listSliceIds } from './lib/ollama-peer-review/profiles.mjs';
import { buildSystemPrompt, buildUserPrompt } from './lib/ollama-peer-review/prompt.mjs';
import { resolveApiKey, resolveHost } from './lib/ollama-peer-review/secrets.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function printHelp() {
  console.log(`Usage: node scripts/ollama-peer-review.mjs --slice <profile> [options]

Automatic governance peer review using baked slice profiles (no prompt memory required).

Options:
  --slice <id>           Slice profile id (see --list-slices)
  --list-slices          Print available slice profiles
  --write                Call Ollama and write draft receipt markdown
  --dry-run              Build prompt bundle only; no API call
  --commit <sha>         Review a specific commit (default: HEAD)
  --host <local|cloud|url>  Ollama host shortcut or explicit URL
  --model <name>         Override model (default: profile cloud/local pick)
  --secrets-file <path>  Explicit API key file under repo (gitignored)
  --files <a,b,c>        Extra/required files for generic profile
  --title <text>         Override receipt title (generic profile)
  --output <path>        Draft output path (default: docs/ui/reviews/<slice>-ollama-peer-review-draft.md)

Environment:
  OLLAMA_API_KEY         API key (preferred over secrets file when set)
  OLLAMA_HOST            Base URL (e.g. https://ollama.com or http://127.0.0.1:11434)
  OLLAMA_MODEL           Model override

Examples:
  npm run peer-review:ollama -- --slice runtime-002b --dry-run
  npm run peer-review:ollama -- --slice runtime-002b --write
  npm run peer-review:ollama -- --slice generic --files public/foo.js --title "FOO-001 peer review" --write
`);
}

function parseArgs(argv) {
  const options = {
    slice: null,
    write: false,
    dryRun: false,
    listSlices: false,
    commit: null,
    host: null,
    model: null,
    secretsFile: null,
    files: [],
    title: null,
    output: null,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    switch (arg) {
      case '--slice':
        options.slice = argv[++i];
        break;
      case '--write':
        options.write = true;
        break;
      case '--dry-run':
        options.dryRun = true;
        break;
      case '--list-slices':
        options.listSlices = true;
        break;
      case '--commit':
        options.commit = argv[++i];
        break;
      case '--host':
        options.host = argv[++i];
        break;
      case '--model':
        options.model = argv[++i];
        break;
      case '--secrets-file':
        options.secretsFile = argv[++i];
        break;
      case '--files':
        options.files = argv[++i].split(',').map((item) => item.trim()).filter(Boolean);
        break;
      case '--title':
        options.title = argv[++i];
        break;
      case '--output':
        options.output = argv[++i];
        break;
      case '--help':
      case '-h':
        printHelp();
        process.exit(0);
        break;
      default:
        console.error(`Unknown argument: ${arg}`);
        printHelp();
        process.exit(1);
    }
  }

  return options;
}

function defaultOutputPath(sliceId) {
  return path.join(root, 'docs/ui/reviews', `${sliceId}-ollama-peer-review-draft.md`);
}

function wrapDraftReceipt({ body, profile, gitContext, model, host, keySource }) {
  const today = new Date().toISOString().slice(0, 10);
  const meta = [
    '<!--',
    '  AUTO-GENERATED DRAFT — do not treat as final until validated.',
    '  Validate checks locally, then rename/copy to the canonical *-peer-review-receipt.md if approved.',
    `  Generated: ${today}`,
    `  Slice profile: ${profile.id}`,
    `  Reviewed SHA: ${gitContext.head}`,
    `  Model: ${model}`,
    `  Host: ${host}`,
    `  Key source: ${keySource || 'none (local)'}`,
    '-->',
    '',
  ].join('\n');
  return `${meta}${body}\n`;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));

  if (options.listSlices) {
    console.log('Available slice profiles:');
    for (const id of listSliceIds()) {
      const profile = getSliceProfile(id);
      console.log(`- ${id} (${profile.id})`);
    }
    process.exit(0);
  }

  if (!options.slice) {
    printHelp();
    process.exit(1);
  }

  if (options.write && options.dryRun) {
    console.error('Choose either --write or --dry-run, not both.');
    process.exit(1);
  }
  if (!options.write && !options.dryRun) {
    options.dryRun = true;
  }

  const profile = getSliceProfile(options.slice);
  const fileEntries = [...profile.files];
  if (options.files.length) {
    for (const filePath of options.files) {
      fileEntries.push({ path: filePath, focus: 'operator supplied' });
    }
  }
  if (profile.requiresFiles && fileEntries.length === 0) {
    console.error('Generic profile requires --files.');
    process.exit(1);
  }

  const gitContext = gatherGitContext(root, { commit: options.commit });
  const { bundle, totalBytes } = gatherFileBundle(root, fileEntries);
  const filePaths = fileEntries.map((entry) => (typeof entry === 'string' ? entry : entry.path));
  const diffText = gatherDiffForFiles(root, filePaths, { commit: options.commit });
  const fileBundleText = formatFileBundle(bundle);

  const { apiKey, source: keySource } = resolveApiKey({
    root,
    secretsFile: options.secretsFile,
  });
  const host = resolveHost({ hostFlag: options.host, apiKeyPresent: Boolean(apiKey) });
  const usingCloud = host.includes('ollama.com');
  const model = options.model
    || process.env.OLLAMA_MODEL
    || (usingCloud ? profile.modelCloud : profile.modelLocal);

  const systemPrompt = buildSystemPrompt();
  const userPrompt = buildUserPrompt({
    profile,
    gitContext,
    fileBundleText,
    diffText,
    customTitle: options.title,
  });

  const outputPath = options.output
    ? (path.isAbsolute(options.output) ? options.output : path.join(root, options.output))
    : defaultOutputPath(options.slice);

  console.log(`ollama-peer-review: slice=${options.slice} sha=${gitContext.shortHead} files=${filePaths.length} contextBytes=${totalBytes}`);
  console.log(`ollama-peer-review: host=${host} model=${model} keySource=${keySource || 'none'}`);

  if (options.dryRun) {
    console.log(`ollama-peer-review: dry-run only (prompt bytes=${Buffer.byteLength(userPrompt, 'utf8')})`);
    console.log(`ollama-peer-review: draft would write to ${path.relative(root, outputPath)}`);
    console.log('ollama-peer-review: pass');
    process.exit(0);
  }

  if (usingCloud && !apiKey) {
    console.error('ollama-peer-review: cloud host selected but no API key found.');
    console.error('Set OLLAMA_API_KEY or add secrets/API Key/olamma-api-xi-io.txt (gitignored).');
    process.exit(1);
  }

  const result = await chatCompletion({
    host,
    model,
    apiKey,
    systemPrompt,
    userPrompt,
  });

  const wrapped = wrapDraftReceipt({
    body: result.content,
    profile,
    gitContext,
    model: result.model,
    host,
    keySource,
  });

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, wrapped, 'utf8');

  console.log(`ollama-peer-review: wrote ${path.relative(root, outputPath)}`);
  if (result.promptEvalCount != null) {
    console.log(`ollama-peer-review: promptEvalCount=${result.promptEvalCount} evalCount=${result.evalCount}`);
  }
  console.log('ollama-peer-review: next steps:');
  console.log('  1. Run the slice validation commands from the draft receipt.');
  console.log('  2. Human or Cursor agent edits/finalizes the canonical *-peer-review-receipt.md.');
  console.log('  3. Do not commit secrets or treat draft as PASS without validation.');
  console.log('ollama-peer-review: pass');
}

main().catch((error) => {
  console.error(`ollama-peer-review: fail — ${error.message}`);
  process.exit(1);
});
