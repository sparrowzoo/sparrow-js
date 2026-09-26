#!/usr/bin/env bash
set -euo pipefail
export LC_ALL=C

usage() {
  cat <<'HELP'
用法：bash deploy/deploy.sh [deploy|rollback]
  deploy    上线时间戳最新的压缩包（默认操作）
  rollback  上线时间戳第二新的压缩包

压缩包名称：yyyyMMddHHmmss.tar.gz，顶层包含 admin、im、passport、www。
ARTIFACTS_DIR 默认是本脚本所在目录的 ../artifacts。
DEPLOY_DIR 默认是 /workspace/deploy，可通过环境变量修改。
先解压并校验，再删除、替换部署目录下的四个站点；保留其他文件和历史压缩包。

示例：
  bash deploy/deploy.sh
  bash deploy/deploy.sh rollback
  DEPLOY_DIR=/workspace/deploy ARTIFACTS_DIR=/workspace/artifacts bash deploy/deploy.sh
HELP
}

fail() { printf '错误：%s\n' "$*" >&2; exit 1; }
[[ $# -le 1 ]] || { usage >&2; exit 1; }
action=${1:-deploy}
case "$action" in
  deploy|rollback) ;;
  -h|--help) usage; exit 0 ;;
  *) usage >&2; exit 1 ;;
esac

script_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)
artifacts=${ARTIFACTS_DIR:-"$script_dir/../artifacts"}
target=${DEPLOY_DIR:-/workspace/deploy}
sites=(admin im passport www)
command -v tar >/dev/null || fail '缺少 tar 命令。'
[[ -d $artifacts ]] || fail "压缩包目录不存在：$artifacts"
artifacts=$(cd -- "$artifacts" && pwd -P)
[[ $target == /* && $target != / ]] || fail '部署目录必须是绝对路径，且不能是 /。'
[[ ! -L $target && ( ! -e $target || -d $target ) ]] || fail "部署路径必须是普通目录：$target"

# 固定长度的时间戳按文件名升序排列，不依赖上传时改变的修改时间。
latest=
previous=
shopt -s nullglob
for archive in "$artifacts"/*.tar.gz; do
  [[ -f $archive && ${archive##*/} =~ ^[0-9]{14}\.tar\.gz$ ]] || continue
  previous=$latest
  latest=$archive
done
[[ -n $latest ]] || fail '没有找到 yyyyMMddHHmmss.tar.gz 格式的压缩包。'
archive=$latest
if [[ $action == rollback ]]; then
  [[ -n $previous ]] || fail '回滚至少需要两个时间戳压缩包。'
  archive=$previous
fi

mkdir -p -- "$target"
target=$(cd -- "$target" && pwd -P)
[[ $target != / ]] || fail '部署目录不能解析为 /。'
# 避免清理站点目录时连同源压缩包目录一起删除。
for site in "${sites[@]}"; do
  case "$artifacts/" in
    "$target/$site/"*) fail "压缩包目录不能放在待替换的站点内：$artifacts" ;;
  esac
done

temporary=$(mktemp -d "$target/.deploy.XXXXXX")
trap 'rm -rf -- "$temporary"' EXIT
trap 'exit 130' INT
trap 'exit 143' TERM
trap 'exit 129' HUP
mkdir -- "$temporary/sites"
printf '使用压缩包：%s\n部署目录：%s\n' "$archive" "$target"

# 在修改现有站点前，拒绝越界路径、链接和特殊文件，并完整解压验证。
tar --no-xattrs -tzf "$archive" > "$temporary/paths"
while IFS= read -r entry; do
  case "$entry" in
    /*|../*|*/../*|*/..|..) fail "压缩包包含越界路径：$entry" ;;
  esac
  case "$entry" in
    admin/|admin/*|im/|im/*|passport/|passport/*|www/|www/*) ;;
    *) fail "压缩包包含非站点路径：$entry" ;;
  esac
done < "$temporary/paths"
tar -tvzf "$archive" > "$temporary/entries"
while IFS= read -r entry; do
  case "${entry:0:1}" in
    -|d) ;;
    *) fail '压缩包只能包含普通文件和目录。' ;;
  esac
done < "$temporary/entries"
tar -xzf "$archive" -C "$temporary/sites" --no-same-owner --no-same-permissions
for site in "${sites[@]}"; do
  [[ -s $temporary/sites/$site/index.html ]] || fail "压缩包缺少 $site/index.html。"
done

# 暂存目录位于部署目录内，解压成功后通过同盘移动安装站点。
for site in "${sites[@]}"; do
  rm -rf -- "$target/$site"
  mv -- "$temporary/sites/$site" "$target/$site"
done

printf '\n%s完成：%s -> %s\n' "$action" "${archive##*/}" "$target"
