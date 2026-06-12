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
  invokeBlocked,
} from './lib/adapter.js';

const HELP = `Gmail metadata adapter (GMAIL-002A)
Scope: gmail.metadata only — no body read, draft write, or send.
Commands:
  status
  connect
  disconnect
  wipe [--dry-run]
  profile
  labels | list-labels
  labels-counts
  list-threads [--query Q] [--max N]
  list-messages [--query Q] [--max N]
  search-metadata [--query Q] [--max N]
  thread-metadata <threadId>
  drafts-metadata [--max N]
  export-metadata-snapshot [--max N] [--max-messages N] [--out PATH]
  blocked <method>   (test blocked escalation: body, draft write, send)
`;

async function main() {
  const [,, cmd, ...rest] = process.argv;
  if (!cmd || cmd === 'help' || cmd === '--help') {
    console.log(HELP);
    return;
  }

  const flags = { _: null };
  for (let i = 0; i < rest.length; i += 1) {
    if (rest[i] === '--max') flags.max = Number(rest[++i]);
    else if (rest[i] === '--max-messages') flags.maxMessages = Number(rest[++i]);
    else if (rest[i] === '--query') flags.query = rest[++i];
    else if (rest[i] === '--out') flags.out = rest[++i];
    else if (!flags._) flags._ = rest[i];
  }

  let result;
  try {
    switch (cmd) {
      case 'status':
        result = await providerStatus();
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
      case 'list-threads':
        result = await gmailThreadsListMetadata({ query: flags.query || 'in:inbox', maxResults: flags.max || 10 });
        break;
      case 'list-messages':
        result = await gmailMessagesListMetadata({ query: flags.query || 'in:inbox', maxResults: flags.max || 10 });
        break;
      case 'search-metadata':
        result = await gmailMessagesSearchMetadata({ query: flags.query || 'in:inbox', maxResults: flags.max || 5 });
        break;
      case 'thread-metadata':
        result = await gmailThreadMetadata({ threadId: flags._ });
        break;
      case 'drafts-metadata':
        result = await gmailDraftsListMetadata({ maxResults: flags.max || 10 });
        break;
      case 'export-metadata-snapshot':
        result = await exportMetadataSnapshot({
          maxThreads: flags.max || 25,
          maxMessages: flags.maxMessages || 50,
          outputPath: flags.out,
        });
        break;
      case 'blocked':
        result = await invokeBlocked(flags._ || 'gmail.messages.getBody');
        break;
      default:
        console.error(`Unknown command: ${cmd}`);
        console.log(HELP);
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
