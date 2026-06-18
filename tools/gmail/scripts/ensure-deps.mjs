import fs from 'node:fs';

if (!fs.existsSync('node_modules/googleapis')) {
  console.error('Gmail adapter dependencies missing.');
  console.error('Run from repo root: npm run setup:gmail');
  process.exit(1);
}
