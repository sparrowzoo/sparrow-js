#!/usr/bin/env bash
set -euo pipefail
export LC_ALL=C

root=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)
logs="$root/deploy/logs"
mkdir -p -- "$logs"

# 四个前端站点：端口 -> 源码目录
sites=(
  "3000 common"
  "3001 sparrow-passport"
  "3002 sparrow-admin"
  "3003 sparrow-chat"
)

command -v lsof >/dev/null 2>&1 || { printf '缺少 lsof 命令。\n' >&2; exit 1; }

mypgid=$(ps -o pgid= -p "$$" | tr -d '[:space:]')

kill_port() {
  local port=$1 pid pgid pids rest i
  pids=$(lsof -ti tcp:"$port" 2>/dev/null || true)
  [[ -n $pids ]] || return 0

  for pid in $pids; do
    pgid=$(ps -o pgid= -p "$pid" 2>/dev/null | tr -d '[:space:]' || true)
    if [[ $pgid =~ ^[0-9]+$ && $pgid -gt 1 && $pgid != "$mypgid" ]]; then
      kill -TERM -- "-$pgid" 2>/dev/null || true
    else
      kill -TERM -- "$pid" 2>/dev/null || true
    fi
  done

  for i in $(seq 1 10); do
    rest=$(lsof -ti tcp:"$port" 2>/dev/null || true)
    [[ -z $rest ]] && break
    sleep 1
  done

  rest=$(lsof -ti tcp:"$port" 2>/dev/null || true)
  if [[ -n $rest ]]; then
    printf '端口 %s 未在 10 秒内释放，强制结束…\n' "$port" >&2
    for pid in $rest; do
      kill -9 -- "$pid" 2>/dev/null || true
    done
    sleep 1
  fi
}

printf '==> 停止前端站点进程（3000-3003）…\n'
for entry in "${sites[@]}"; do
  read -r port _ <<< "$entry"
  kill_port "$port"
done
printf '==> 已停止。\n\n'

printf '==> 启动前端站点…\n'
for entry in "${sites[@]}"; do
  read -r port dir <<< "$entry"
  printf '  启动 %-20s (端口 %s)…\n' "$dir" "$port"
  (
    cd -- "$root/$dir"
    nohup npm run dev >"$logs/$dir.log" 2>&1 &
  )
done
printf '\n==> 等待端口就绪（最多 60 秒）…\n'

for i in $(seq 1 60); do
  all_ok=1
  for entry in "${sites[@]}"; do
    read -r port _ <<< "$entry"
    if ! lsof -ti tcp:"$port" >/dev/null 2>&1; then
      all_ok=0
      break
    fi
  done
  [[ $all_ok -eq 1 ]] && break
  sleep 1
done

printf '\n==> 结果：\n'
for entry in "${sites[@]}"; do
  read -r port dir <<< "$entry"
  if lsof -ti tcp:"$port" >/dev/null 2>&1; then
    printf '  ✔ %-20s http://localhost:%s\n' "$dir" "$port"
  else
    printf '  ✗ %-20s 端口 %s 未就绪，查看 %s/%s.log\n' "$dir" "$port" "$logs" "$dir"
  fi
done
printf '\n日志目录：%s\n' "$logs"
