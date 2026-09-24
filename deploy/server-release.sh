#!/usr/bin/env bash
set -Eeuo pipefail

help() {
  cat <<'HELP'
用法（Linux，sudo bash 本脚本）：
  prepare <发布包.tar.gz>  校验同名 .sha256，解包新版本并归档新旧资源；不切换站点
  configure <发布编号>     备份并安装包内 Nginx 配置，检查加载与冲突；不重载
  publish <发布编号>       原子切换四站，重载或首次启动 Nginx；失败恢复上一版
  rollback                恢复当前版本记录的上一版与 Nginx 配置；不删除数据
依赖：Bash、Python 3、GNU coreutils、rsync、flock、Nginx。
默认目录 /srv/sparrow；SPARROW_DEPLOY_ROOT 仅供隔离测试（不会改写 Nginx 路径）。
上线前核实包内 API/WS 端口；已有同名 Nginx 站点须人工停用，脚本不改其他配置。
HELP
}
fail() { printf '错误：%s\n' "$*" >&2; exit 1; }
[[ $# -gt 0 && $1 != --help && $1 != -h ]] || { help; exit 0; }
command_name=$1; shift
case "$command_name" in
  prepare|configure|publish) [[ $# == 1 ]] || { help; exit 1; } ;;
  rollback) [[ $# == 0 ]] || { help; exit 1; } ;;
  *) help; exit 1 ;;
esac
[[ $(id -u) == 0 ]] || fail '请通过 sudo bash 运行。'
for command in python3 realpath sha256sum install rsync flock nginx; do
  command -v "$command" >/dev/null || fail "缺少命令：$command"
done
base=${SPARROW_DEPLOY_ROOT:-/srv/sparrow}
[[ $base == /* && $base != / ]] || fail '发布根目录必须是绝对路径且不能是 /。'
base=$(realpath -m -- "$base")
[[ $base != / ]] || fail '发布根目录不能是 /。'
for directory in "$base/releases" "$base/assets"; do
  [[ ! -L $directory ]] || fail "管理目录不能是符号链接：$directory"
  [[ ! -e $directory || -d $directory ]] || fail "管理路径不是目录：$directory"
done
install -d -m 755 "$base" "$base/releases" "$base/assets"
exec 9>"$base/.deploy.lock"
flock -n 9 || fail '另一项发布操作正在执行。'
sites=(www admin im passport)
config_targets=(/etc/nginx/conf.d/sparrow-static.conf /etc/nginx/snippets/sparrow-static-locations.conf)

valid_id() { [[ $1 =~ ^[A-Za-z0-9][A-Za-z0-9._-]*$ && $1 != *..* ]]; }
release_path() {
  valid_id "$1" || fail '发布编号只允许字母、数字、点、下划线和连字符，且不能包含 ..。'
  printf '%s/releases/%s\n' "$base" "$1"
}
payload() {
  local dir=$1 site
  [[ -d $dir && ! -L $dir && $(realpath -e -- "$dir") == "$dir" ]] || fail "版本目录不合法：$dir"
  [[ -s $dir/manifest.json && -s $dir/nginx/sparrow-static.conf && -s $dir/nginx/static-locations.conf ]] || fail "缺少 manifest 或 Nginx 配置：$dir"
  for site in "${sites[@]}"; do
    [[ -s $dir/$site/index.html && -s $dir/$site/404.html && -s $dir/$site/en/index.html && -s $dir/$site/zh/index.html && -d $dir/$site/_next/static ]] || fail "静态产物不完整：$site"
  done
  [[ -s $dir/passport/cros-storage/index.html ]] || fail '缺少跨站存储页面。'
}
current_release() {
  if [[ ! -e $base/current && ! -L $base/current ]]; then printf '\n'; return; fi
  [[ -L $base/current ]] || fail 'current 必须是符号链接，请人工迁移现有普通目录。'
  local dir id
  dir=$(realpath -e -- "$base/current") || fail 'current 指向不存在的版本。'
  id=${dir##*/}
  [[ $(release_path "$id") == "$dir" ]] || fail 'current 必须指向本发布根目录的 releases/<编号>。'
  payload "$dir"
  printf '%s\n' "$dir"
}
snapshot_configs() {
  local backup=$1 target name
  [[ ! -e $backup ]] || fail "备份目录已存在：$backup"
  install -d -m 700 "$backup"
  for target in "${config_targets[@]}"; do
    name=${target##*/}
    if [[ -e $target || -L $target ]]; then
      [[ ! -d $target ]] || fail "配置路径不能是目录：$target"
      cp -a -- "$target" "$backup/$name"
    else
      : > "$backup/$name.absent"
    fi
  done
  : > "$backup/.complete"
}
restore_configs() {
  local backup=$1 target name temporary
  [[ -f $backup/.complete ]] || return 1
  for target in "${config_targets[@]}"; do
    name=${target##*/}
    if [[ -f $backup/$name.absent ]]; then
      [[ ! -e $target && ! -L $target ]] || unlink -- "$target" || return 1
    else
      temporary="$target.restore.$$"
      [[ ! -e $temporary && ! -L $temporary ]] || return 1
      cp -a -- "$backup/$name" "$temporary" || return 1
      mv -Tf -- "$temporary" "$target" || return 1
    fi
  done
}
nginx_check() {
  local log=$1 require_includes=${2:-no}
  nginx -t > "$log" 2>&1 || { cat "$log" >&2; return 1; }
  nginx -T >> "$log" 2>&1 || { cat "$log" >&2; return 1; }
  if grep -Eiq 'conflicting server name|duplicate.*server|duplicate default server' "$log"; then
    cat "$log" >&2
    printf '发现重复站点，请人工处理其他配置；脚本不会停用它们。\n' >&2
    return 1
  fi
  if [[ $require_includes == yes ]]; then
    local target
    for target in "${config_targets[@]}"; do
      grep -Fq "# configuration file $target:" "$log" || { printf 'Nginx 未实际加载：%s\n' "$target" >&2; return 1; }
    done
  fi
}
switch_current() {
  local target=$1 temporary="$base/.current.$$"
  [[ ! -e $temporary && ! -L $temporary ]] || return 1
  ln -s -- "$target" "$temporary"
  mv -Tf -- "$temporary" "$base/current"
}
activate_nginx() {
  local log=$1
  if nginx -s reload > "$log" 2>&1; then return 0; fi
  # Start only when reload explicitly reports a missing/stale PID, not any error.
  if grep -Eq 'invalid PID number|open\(\).*\.pid.*No such file|kill\(.*No such process' "$log"; then
    printf 'Nginx 尚未运行，执行首次启动。\n'
    nginx >> "$log" 2>&1 && return 0
  fi
  cat "$log" >&2
  return 1
}
compensate() {
  local status=$?
  trap - EXIT INT TERM HUP
  if (( status != 0 )); then
    if [[ -n $transaction_previous ]]; then
      switch_current "$transaction_previous" || printf '恢复 current 失败，请人工检查。\n' >&2
    elif [[ -L $base/current ]]; then
      unlink -- "$base/current" || printf '撤销首次 current 失败，请人工检查。\n' >&2
    fi
    if restore_configs "$transaction_backup"; then
      nginx_check "$transaction_log" && nginx -s reload >> "$transaction_log" 2>&1 || printf '已恢复磁盘配置；Nginx 恢复重载未成功，请检查恢复日志。\n' >&2
    else
      printf '恢复 Nginx 配置失败，请人工检查备份。\n' >&2
    fi
    if [[ -n $transaction_marker && -f $transaction_marker ]]; then unlink -- "$transaction_marker"; fi
    printf '操作未完成，已尝试恢复操作前版本。\n' >&2
  fi
  exit "$status"
}
begin_transaction() {
  transaction_previous=$1; transaction_backup=$2; transaction_log=$3; transaction_marker=${4:-}
  trap compensate EXIT
  trap 'exit 130' INT
  trap 'exit 143' TERM
  trap 'exit 129' HUP
}

case "$command_name" in
  prepare)
    archive=$(realpath -e -- "$1") || fail '发布包不存在。'
    [[ -f $archive && $archive == *.tar.gz && -f $archive.sha256 ]] || fail '需要 .tar.gz 发布包及同目录同名 .sha256 文件。'
    id=${archive##*/}; id=${id%.tar.gz}; dir=$(release_path "$id")
    [[ ! -e $dir && ! -L $dir ]] || fail "版本已存在，禁止覆盖：$id"
    previous=$(current_release)
    python3 - "$archive" "$id" "$dir" <<'PY'
import hashlib, json, os, pathlib, re, shutil, sys, tarfile
archive, release, destination = sys.argv[1:]
checksum = pathlib.Path(archive + '.sha256').read_text().strip()
match = re.fullmatch(r'([0-9a-fA-F]{64}) [ *](.+)', checksum)
if not match or match[2] != pathlib.Path(archive).name:
    raise SystemExit('SHA-256 文件必须只包含此发布包的校验记录。')
digest = hashlib.sha256()
with open(archive, 'rb') as source:
    for block in iter(lambda: source.read(1024 * 1024), b''): digest.update(block)
if digest.hexdigest() != match[1].lower(): raise SystemExit('SHA-256 校验失败。')
with tarfile.open(archive, 'r:gz') as bundle:
    entries, seen = [], set()
    for member in bundle.getmembers():
        name = member.name
        while name.startswith('./'): name = name[2:]
        if name in ('', '.') and member.isdir(): continue
        parts = name.rstrip('/').split('/')
        if (name.startswith('/') or any(p in ('', '.', '..') for p in parts)
                or any(ord(c) < 32 or ord(c) == 127 for c in name)
                or parts[0] not in ('www', 'admin', 'im', 'passport', 'nginx', 'tools', 'manifest.json')
                or not (member.isdir() or member.isfile())):
            raise SystemExit('发布包包含不安全路径或链接/特殊文件：' + repr(member.name))
        clean = '/'.join(parts)
        if clean in seen: raise SystemExit('发布包包含重复路径：' + clean)
        seen.add(clean); entries.append((member, clean))
    manifest = next((m for m, name in entries if name == 'manifest.json' and m.isfile()), None)
    if not manifest or json.load(bundle.extractfile(manifest)).get('release') != release:
        raise SystemExit('manifest 的发布编号与文件名不一致。')
    os.mkdir(destination, 0o755)  # Never extract over an existing release.
    for member, name in entries:
        target = pathlib.Path(destination, name)
        if member.isdir(): target.mkdir(parents=True, exist_ok=True); target.chmod(0o755)
        else:
            target.parent.mkdir(parents=True, exist_ok=True)
            with bundle.extractfile(member) as source, target.open('xb') as output:
                shutil.copyfileobj(source, output)
            target.chmod(0o644)
PY
    payload "$dir"
    for site in "${sites[@]}"; do
      archive_dir="$base/assets/$site/_next/static"
      for directory in "$base/assets/$site" "$base/assets/$site/_next" "$archive_dir"; do
        [[ ! -L $directory ]] || fail "资源归档目录不能是符号链接：$directory"
      done
      install -d -m 755 "$archive_dir"
      if [[ -n $previous ]]; then rsync -a --ignore-existing -- "$previous/$site/_next/static/" "$archive_dir/"; fi
      rsync -a --ignore-existing -- "$dir/$site/_next/static/" "$archive_dir/"
    done
    : > "$dir/.prepared"
    printf '准备完成：%s（尚未切换）\n' "$id"
    ;;
  configure)
    dir=$(release_path "$1"); payload "$dir"
    [[ -f $dir/.prepared ]] || fail '请先 prepare。'
    backup="$dir/nginx-before"
    if [[ ! -e $backup ]]; then snapshot_configs "$backup"; fi
    [[ -f $backup/.complete ]] || fail '配置备份不完整，请人工检查 nginx-before。'
    trap 'status=$?; if (( status != 0 )); then restore_configs "$backup" || true; printf "配置安装失败，已尝试恢复两份原配置；未重载。\n" >&2; fi' EXIT
    trap 'exit 130' INT
    trap 'exit 143' TERM
    trap 'exit 129' HUP
    install -d -m 755 /etc/nginx/conf.d /etc/nginx/snippets
    for index in 0 1; do
      source="$dir/nginx/sparrow-static.conf"
      [[ $index == 0 ]] || source="$dir/nginx/static-locations.conf"
      target=${config_targets[$index]}; temporary="$target.install.$$"
      [[ ! -e $temporary && ! -L $temporary ]] || fail "临时配置已存在：$temporary"
      install -m 644 "$source" "$temporary"
      mv -Tf -- "$temporary" "$target"
    done
    nginx_check "$backup/configure-check.log" yes
    : > "$dir/.configured"
    trap - EXIT INT TERM HUP
    printf '配置检查通过：%s（尚未重载；原配置在 nginx-before）\n' "$1"
    ;;
  publish)
    dir=$(release_path "$1"); payload "$dir"
    [[ -f $dir/.prepared && -f $dir/.configured ]] || fail '请先 prepare 和 configure。'
    cmp -s "$dir/nginx/sparrow-static.conf" "${config_targets[0]}" && cmp -s "$dir/nginx/static-locations.conf" "${config_targets[1]}" || fail '已安装配置与此版本不一致，请先 configure 此版本。'
    previous=$(current_release)
    [[ $previous != "$dir" ]] || fail '此版本已经是 current，无需重复发布。'
    [[ ! -e $dir/.published ]] || fail '此版本已发布过，请使用新的发布编号或 rollback。'
    nginx_check "$dir/publish-check.log" yes
    printf '%s\n' "$previous" > "$dir/previous-release.txt"
    begin_transaction "$previous" "$dir/nginx-before" "$dir/recovery.log" "$dir/.published"
    switch_current "$dir"
    activate_nginx "$dir/activate.log" || fail 'Nginx 激活失败，请检查 activate.log 与 recovery.log。'
    : > "$dir/.published"
    trap - EXIT INT TERM HUP
    printf '发布完成\ncurrent = %s\nprevious = %s\n' "$dir" "${previous:-无（首次上线）}"
    ;;
  rollback)
    current=$(current_release)
    [[ -n $current && -s $current/previous-release.txt ]] || fail '没有可回滚的上一版本（首次上线需人工恢复原站点）。'
    previous=$(cat "$current/previous-release.txt")
    [[ -n $previous && $(release_path "${previous##*/}") == "$previous" && $previous != "$current" ]] || fail '上一版本记录不合法。'
    payload "$previous"
    backup=$(mktemp -d "$current/.rollback-before.XXXXXX"); rmdir -- "$backup"
    snapshot_configs "$backup"
    begin_transaction "$current" "$backup" "$current/rollback-recovery.log"
    restore_configs "$current/nginx-before" || fail '恢复上一版配置失败。'
    nginx_check "$current/rollback-check.log" || fail '上一版配置校验失败。'
    switch_current "$previous"
    activate_nginx "$current/rollback-activate.log" || fail '回滚激活失败，请检查日志。'
    trap - EXIT INT TERM HUP
    printf '回滚完成：%s（保留全部发布目录与资源归档）\n' "$previous"
    ;;
esac
