#!/usr/bin/env node
import {
  providerStatus,
  providerConnectStart,
  providerDisconnect,
  providerWipeLocalData,
  gmailProfileGet,
  gmailLabelsList,
  gmailLabelsCounts,
  gmailDraftsListMetadata,
  gmailMessagesListMetadata,
  gmailMessagesSearchMetadata,
  gmailThreadsListMetadata,
  gmailThreadMetadata,
  exportMetadataSnapshot,
  bodyGateStatusCommand,
  readMessageBody,
  readThreadBodies,
  exportReadonlyBodySnapshot,
  redactBodySnapshotFile,
  runMetadataSync,
  METADATA_SYNC_JOB_PRESETS,
  resolveSyncLabelJobs,
  invokeBlocked,
  METADATA_MAILBOX_ALIASES,
} from './lib/adapter.js';

const HELP = `Gmail metadata adapter (GMAIL-002B body gate)
Default mode: metadata-only (gmail.metadata). Body read requires GMAIL_ACCESS_MODE=readonly + reconnect.
Scope: no draft write, send, mutation, or mail.google.com.

Metadata list filters (gmail.metadata — no general Gmail search, no q parameter):
  --mailbox inbox|sent|trash|spam|starred|important|draft|drafts
  --label LABEL_ID          explicit Gmail label id (e.g. INBOX, STARRED)
  --query in:<mailbox>      backward-compatible alias for safe in: values only
  General search (from:, subject:, newer:, free text) is unavailable under gmail.metadata.

Commands:
  status
  body-gate-status
  connect
  disconnect
  wipe [--dry-run]
  profile
  labels | list-labels
  labels-counts
  list-threads [--mailbox M | --label ID | --query in:<alias>] [--max N]
  list-messages [--mailbox M | --label ID | --query in:<alias>] [--max N]
  list-mailbox-metadata [--mailbox M | --label ID | --query in:<alias>] [--max N]
  search-metadata           deprecated alias for list-mailbox-metadata
  thread-metadata <threadId>
  drafts-metadata [--max N]
  export-metadata-snapshot [--mailbox M | --label ID | --job JOB] [--max N] [--max-pages N] [--max-messages N] [--out PATH]
  sync-metadata | metadata-sync [--plan | --dry-run] [--job JOB | --jobs a,b] [--mailbox M | --label ID] [--max-pages N] [--max N] [--max-messages N] [--out PATH]
  sync-plan                 alias: sync-metadata --plan
  read-message-body <messageId>
  read-thread-bodies <threadId> [--max N]
  export-readonly-body-snapshot (--message-id ID | --thread-id ID | --in PATH | --allow-batch-readonly-export) [--max N] [--max-messages N] [--out PATH]
  redact-body-snapshot --in PATH [--out PATH] [--include-payload]
  blocked <method>   (test blocked escalation: body, draft write, send, mutation)
`;

function metadataListOptions(flags) {
  if (flags.label) return { labelIds: [flags.label], maxResults: flags.max || 10 };
  if (flags.mailbox) return { query: `in:${flags.mailbox}`, maxResults: flags.max || 10 };
  return { query: flags.query || 'in:inbox', maxResults: flags.max || 10 };
}

function syncOptions(flags) {
  const jobs = [];
  if (flags.job) jobs.push(flags.job);
  if (flags.jobs) jobs.push(...flags.jobs.split(',').map((entry) => entry.trim()).filter(Boolean));
  return {
    labelIds: flags.label ? [flags.label] : [],
    mailbox: flags.mailbox,
    mailboxes: flags.mailboxes ? flags.mailboxes.split(',').map((entry) => entry.trim()).filter(Boolean) : [],
    jobs,
    query: flags.query,
    maxPages: flags.maxPages || 1,
    maxThreads: flags.max || 25,
    maxMessages: flags.maxMessages || 50,
    maxResultsPerPage: flags.maxResultsPerPage || 25,
    dryRun: Boolean(flags.dryRun),
    planOnly: Boolean(flags.planOnly),
    outputPath: flags.out,
  };
}

async function main() {
  const [,, cmd, ...rest] = process.argv;
  if (!cmd || cmd === 'help' || cmd === '--help') {
    console.log(HELP);
    return;
  }

  const flags = { _: null };
  for (let i = 0; i < rest.length; i += 1) {
    if (rest[i] === '--max') flags.max = Number(rest[++i]);
    else if (rest[i] === '--max-pages') flags.maxPages = Number(rest[++i]);
    else if (rest[i] === '--max-messages') flags.maxMessages = Number(rest[++i]);
    else if (rest[i] === '--max-results-per-page') flags.maxResultsPerPage = Number(rest[++i]);
    else if (rest[i] === '--query') flags.query = rest[++i];
    else if (rest[i] === '--label') flags.label = rest[++i];
    else if (rest[i] === '--mailbox') flags.mailbox = rest[++i];
    else if (rest[i] === '--mailboxes') flags.mailboxes = rest[++i];
    else if (rest[i] === '--job') flags.job = rest[++i];
    else if (rest[i] === '--jobs') flags.jobs = rest[++i];
    else if (rest[i] === '--dry-run') flags.dryRun = true;
    else if (rest[i] === '--plan') flags.planOnly = true;
    else if (rest[i] === '--message-id') flags.messageId = rest[++i];
    else if (rest[i] === '--thread-id') flags.threadId = rest[++i];
    else if (rest[i] === '--allow-batch-readonly-export') flags.allowBatchReadonlyExport = true;
    else if (rest[i] === '--out') flags.out = rest[++i];
    else if (rest[i] === '--in') flags.in = rest[++i];
    else if (rest[i] === '--include-payload') flags.includePayload = true;
    else if (!flags._) flags._ = rest[i];
  }

  let result;
  try {
    switch (cmd) {
      case 'status':
        result = await providerStatus();
        break;
      case 'body-gate-status':
      case 'body-gate':
        result = await bodyGateStatusCommand();
        break;
      case 'connect':
        result = await providerConnectStart();
        break;
      case 'disconnect':
        result = await providerDisconnect();
        break;
      case 'wipe':
        result = await providerWipeLocalData({ dryRun: rest.includes('--dry-run') });
        break;
      case 'profile':
        result = await gmailProfileGet();
        break;
      case 'labels':
      case 'list-labels':
        result = await gmailLabelsList();
        break;
      case 'labels-counts':
        result = await gmailLabelsCounts();
        break;
      case 'list-threads': {
        const opts = metadataListOptions(flags);
        result = await gmailThreadsListMetadata({ ...opts, maxResults: flags.max || opts.maxResults });
        break;
      }
      case 'list-messages': {
        const opts = metadataListOptions(flags);
        result = await gmailMessagesListMetadata({ ...opts, maxResults: flags.max || opts.maxResults });
        break;
      }
      case 'search-metadata':
      case 'list-mailbox-metadata': {
        const opts = metadataListOptions(flags);
        result = await gmailMessagesSearchMetadata({ ...opts, maxResults: flags.max || opts.maxResults });
        break;
      }
      case 'thread-metadata':
        result = await gmailThreadMetadata({ threadId: flags._ });
        break;
      case 'drafts-metadata':
        result = await gmailDraftsListMetadata({ maxResults: flags.max || 10 });
        break;
      case 'export-metadata-snapshot':
        result = await exportMetadataSnapshot({
          ...syncOptions(flags),
          includePayload: Boolean(flags.includePayload),
        });
        break;
      case 'sync-metadata':
      case 'metadata-sync':
      case 'sync-plan':
        result = await runMetadataSync({
          ...syncOptions(flags),
          planOnly: cmd === 'sync-plan' ? true : Boolean(flags.planOnly),
        });
        break;
      case 'read-message-body':
        result = await readMessageBody({ messageId: flags._ || flags.messageId });
        break;
      case 'read-thread-bodies':
        result = await readThreadBodies({ threadId: flags._ || flags.threadId, maxMessages: flags.max || 5 });
        break;
      case 'export-readonly-body-snapshot':
        result = await exportReadonlyBodySnapshot({
          messageId: flags.messageId,
          threadId: flags.threadId || flags._,
          inputPath: flags.in,
          allowBatchReadonlyExport: Boolean(flags.allowBatchReadonlyExport),
          maxThreads: flags.max || 5,
          maxMessages: flags.maxMessages || 10,
          outputPath: flags.out,
          includePayload: Boolean(flags.includePayload),
        });
        break;
      case 'redact-body-snapshot':
        result = await redactBodySnapshotFile({
          inputPath: flags.in,
          outputPath: flags.out,
          includePayload: Boolean(flags.includePayload),
        });
        break;
      case 'blocked':
        result = await invokeBlocked(flags._ || 'gmail.messages.getBody');
        break;
      default:
        console.error(`Unknown command: ${cmd}`);
        console.log(HELP);
        console.error(`Allowed sync jobs: ${Object.keys(METADATA_SYNC_JOB_PRESETS).join(', ')}`);
        console.error(`Allowed metadata mailboxes: ${METADATA_MAILBOX_ALIASES.join(', ')}`);
        process.exit(1);
    }
  } catch (err) {
    result = {
      success: false,
      blocked: false,
      error: err.message || String(err),
    };
    process.exitCode = 1;
  }

  console.log(JSON.stringify(result, null, 2));
}

main();
