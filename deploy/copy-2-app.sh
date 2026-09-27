#!/usr/bin/env bash
set -euo pipefail

root=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)

for project in react-next-admin react-next-passport react-next-im; do
  printf '\n同步公共文件至 %s\n' "$project"
  (
    cd -- "$root/$project"
    npm run copy
  )
done
