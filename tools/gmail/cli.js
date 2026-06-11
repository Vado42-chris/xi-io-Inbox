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
  gmailMessagesSearchMetadata,
  invokeBlocked,
} from './lib/adapter.js';

const HELP = `Gmail metadata adapter (GMAIL-001C)
Commands:
  status
  connect
  disconnect
  wipe
  profile
  labels
  labels-counts [--max N]
  drafts-metadata [--max N]
  search-metadata [--query Q] [--max N]
  blocked <method>   (test blocked escalation)
`;

async function main() {
  const [,, cmd, ...rest] = process.argv;
  if (!cmd || cmd === 'help' || cmd === '--help') {
    console.log(HELP);
    return;
  }

  const flags = {};
  for (let i = 0; i < rest.length; i += 1) {
    if (rest[i] === '--max') flags.max = Number(rest[++i]);
    else if (rest[i] === '--query') flags.query = rest[++i];
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
        result = await providerWipeLocalData();
        break;
      case 'profile':
        result = await gmailProfileGet();
        break;
      case 'labels':
        result = await gmailLabelsList();
        break;
      case 'labels-counts':
        result = await gmailLabelsCounts({ maxLabels: flags.max });
        break;
      case 'drafts-metadata':
        result = await gmailDraftsListMetadata({ maxResults: flags.max || 10 });
        break;
      case 'search-metadata':
        result = await gmailMessagesSearchMetadata({
          query: flags.query || 'in:inbox',
          maxResults: flags.max || 5,
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
