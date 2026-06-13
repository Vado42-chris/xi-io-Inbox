#!/usr/bin/env bash
# Post-edit reminder: run quick checks after product/script changes.
set -euo pipefail
input=$(cat)
file_path=$(echo "$input" | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{try{const j=JSON.parse(d);process.stdout.write(j.file_path||j.path||'');}catch{}})")

case "$file_path" in
  public/inbox-preview.*|scripts/*|package.json)
    echo '{"additional_context":"Post-edit guardrail: run npm run check:quick before claiming pass. Prefer one-file edits on external storage."}'
    ;;
  *)
    echo '{}'
    ;;
esac
