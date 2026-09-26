#!/usr/bin/env bash
set -euo pipefail

SUPERVISORD=/usr/bin/supervisord
CONF=/root/supervisord/supervisord.conf
PIDFILE=/run/supervisord.pid

fail() { printf '错误：%s\n' "$*" >&2; exit 1; }

[[ -x $SUPERVISORD ]] || fail "找不到可执行的 supervisord：$SUPERVISORD"
[[ -f $CONF ]] || fail "找不到配置文件：$CONF"

# 优先从 pidfile 读取 PID，失效时回退到 pgrep 按进程名查找。
find_pid() {
  local pid
  if [[ -f $PIDFILE ]]; then
    pid=$(cat "$PIDFILE" 2>/dev/null || true)
    if [[ $pid =~ ^[0-9]+$ ]] && kill -0 "$pid" 2>/dev/null; then
      printf '%s\n' "$pid"
      return 0
    fi
  fi
  pid=$(pgrep -x supervisord 2>/dev/null | head -n1 || true)
  [[ -n $pid ]] && printf '%s\n' "$pid"
  return 0
}

pid=$(find_pid)
if [[ -n $pid ]]; then
  printf '停止 supervisord (pid=%s)...\n' "$pid"
  kill "$pid" 2>/dev/null || true
  for _ in $(seq 1 10); do
    kill -0 "$pid" 2>/dev/null || break
    sleep 1
  done
  if kill -0 "$pid" 2>/dev/null; then
    printf '10 秒内未退出，强制结束...\n' >&2
    kill -9 "$pid" 2>/dev/null || true
    sleep 1
  fi
else
  printf 'supervisord 未运行，跳过停止。\n'
fi

# 清理可能残留的 pidfile，避免启动时误判进程已在运行。
if [[ -f $PIDFILE ]]; then
  rm -f -- "$PIDFILE"
fi

printf '启动 supervisord...\n'
"$SUPERVISORD" -c "$CONF"
printf '完成。\n'
