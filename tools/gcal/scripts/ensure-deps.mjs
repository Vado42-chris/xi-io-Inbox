import fs from 'node:fs';

if (!fs.existsSync('node_modules/googleapis')) {
  console.error('Calendar adapter dependencies missing.');
  console.error('Run from repo root: npm run setup:gcal');
  process.exit(1);
}
