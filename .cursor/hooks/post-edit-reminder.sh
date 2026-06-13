#!/usr/bin/env bash
# Post-edit reminder: run checks after product/script/provider changes.
set -euo pipefail
input=$(cat)
file_path=$(echo "$input" | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{try{const j=JSON.parse(d);process.stdout.write(j.file_path||j.path||'');}catch{}})")
repo_root=$(git rev-parse --show-toplevel 2>/dev/null || pwd)

case "$file_path" in
  "$repo_root"/*) file_path=${file_path#"$repo_root"/} ;;
  ./*) file_path=${file_path#./} ;;
esac

case "$file_path" in
  tools/gmail/*|*/tools/gmail/*)
    echo '{"additional_context":"Post-edit guardrail: run npm run check:gmail before claiming pass. Prefer one-file edits on external storage."}'
    ;;
  public/inbox-preview.*|*/public/inbox-preview.*|scripts/*|*/scripts/*|package.json|*/package.json)
    echo '{"additional_context":"Post-edit guardrail: run npm run check:quick before claiming pass. Prefer one-file edits on external storage."}'
    ;;
  *)
    echo '{}'
    ;;
esac
