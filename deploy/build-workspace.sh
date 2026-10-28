#!/bin/bash
set -e

MVN_CMD="mvn clean install -Dmaven.test.skip -Dcheckstyle.skip"

# 按用户指定顺序，仅修正目录名拼写（paddport -> passport）
MODULES=(
    "sparrow-shell"
    "sparrow-messaging-gateway/bom"
    "sparrow-messaging-gateway"
    "sparrow-starter"
    "sparrow-file/bom"
    "sparrow-file"
    "sparrow-passport-ddd/bom"
    "sparrow-passport-ddd"
    "sparrow-security/bom"
    "sparrow-security"
    "sparrow-coder/bom"
    "sparrow-coder"
    "sparrow-chat/bom"
    "sparrow-chat"
    "sparrow-agent/agent-bom"
    "sparrow-agent"
    "sparrowzoo"
)

echo "=========================================="
echo "Sparrow 项目一键编译"
echo "命令: $MVN_CMD"
echo "=========================================="

for module in "${MODULES[@]}"; do
    echo ""
    echo ">>> 编译: $module"

    if [ ! -d "$module" ]; then
        echo "[跳过] 目录 $module 不存在"
        continue
    fi

    if [ ! -f "$module/pom.xml" ]; then
        echo "[跳过] $module/pom.xml 不存在"
        continue
    fi

    (
        cd "$module"
        $MVN_CMD
    )

    echo "[完成] $module"
done

echo ""
echo "=========================================="
echo "全部编译成功！"
echo "=========================================="
