#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'HELP'
用法：bash deploy/build-static.sh
需要 Node.js 22+、npm、tar，并已安装各子站的 npm 依赖。
依次同步公共代码、执行 npm run build，全部校验成功后生成：
  artifacts/yyyyMMddHHmmss.tar.gz（使用本机时间）
压缩包顶层目录及内容：
  admin/    <- react-next-admin/out/
  im/       <- react-next-im/out/
  passport/ <- react-next-passport/out/
  www/      <- common/out/
打包完成后清理暂存文件；保留已有压缩包，同名时停止并报错。
HELP
}

if [[ $# -gt 0 ]]; then
  if [[ $# -eq 1 && ( $1 == --help || $1 == -h ) ]]; then
    usage
    exit 0
  fi
  usage >&2
  exit 1
fi

root=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)
target="$root/artifacts"
projects=(common react-next-admin react-next-im react-next-passport)
sites=(www admin im passport)

for command in node npm tar; do
  command -v "$command" >/dev/null || { printf '缺少命令：%s\n' "$command" >&2; exit 1; }
done
node -e 'if (Number(process.versions.node.split(".")[0]) < 22) { console.error("需要 Node.js 22 或更新版本"); process.exit(1); }'

if [[ -L $target || ( -e $target && ! -d $target ) ]]; then
  printf '产物路径必须是普通目录：%s\n' "$target" >&2
  exit 1
fi

export NEXT_TELEMETRY_DISABLED=1
for project in "${projects[@]}"; do
  printf '\n构建 %s\n' "$project"
  (
    cd -- "$root/$project"
    if [[ $project != common ]]; then
      npm run copy
    fi
    npm run build
  )
done

for project in "${projects[@]}"; do
  if [[ ! -s $root/$project/out/index.html ]]; then
    printf '静态产物不完整：%s/out/index.html\n' "$project" >&2
    exit 1
  fi
done

# 四站构建和校验通过后，在临时目录中按站点名称整理 out 内容。
mkdir -p -- "$target"
temporary=$(mktemp -d "$target/.build-static.XXXXXX")
trap 'rm -rf -- "$temporary"' EXIT
trap 'exit 130' INT
trap 'exit 143' TERM
trap 'exit 129' HUP
mkdir -- "$temporary/sites"
for index in "${!projects[@]}"; do
  project=${projects[$index]}
  site=${sites[$index]}
  printf '打包 %s/out/ -> %s/\n' "$project" "$site"
  cp -R -- "$root/$project/out" "$temporary/sites/$site"
done

# 显式列出四个目录，压缩包内不包含暂存目录或额外的 out 层。
archive="$target/$(date +%Y%m%d%H%M%S).tar.gz"
if [[ -e $archive || -L $archive ]]; then
  printf '压缩包路径已存在：%s\n' "$archive" >&2
  exit 1
fi
COPYFILE_DISABLE=1 tar --no-xattrs --exclude=.DS_Store -czf "$temporary/release.tar.gz" \
  -C "$temporary/sites" admin im passport www
# 暂存与产物位于同一文件系统；硬链接只发布完整压缩包，且拒绝覆盖同名文件。
ln -- "$temporary/release.tar.gz" "$archive"

printf '\n构建打包完成：%s\n' "$archive"
