#!/usr/bin/env bash
# Post-edit reminder: run quick checks after product/script changes.
set -euo pipefail
input=$(cat)
file_path=$(echo "$input" | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{try{const j=JSON.parse(d);process.stdout.write(j.file_path||j.path||'');}catch{}})")

REMINDER='Post-edit guardrail: run npm run check:quick before claiming pass. Run npm run check before push for public UI changes. Prefer one-file edits on external storage.'

case "$file_path" in
  public/inbox-preview.*|\
  public/home-owner-mode.*|\
  public/ibal-owner-mode.*|\
  public/*owner-mode.*|\
  public/index.html|\
  scripts/*|\
  package.json)
    node -e "console.log(JSON.stringify({additional_context: process.argv[1]}))" "$REMINDER"
    ;;
  *)
    echo '{}'
    ;;
esac
