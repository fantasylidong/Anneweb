#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

ENV_FILE="$ROOT_DIR/docker/.env.stack"
if [ -f "$ENV_FILE" ]; then
    # shellcheck disable=SC1090
    set -a && source "$ENV_FILE" && set +a
fi

PROJECT_NAME="${PROJECT_NAME:-anneweb}"
NETWORK_NAME="${NETWORK_NAME:-${PROJECT_NAME}-net}"

APP_CONTAINER="${APP_CONTAINER:-${PROJECT_NAME}-app}"
QUEUE_CONTAINER="${QUEUE_CONTAINER:-${PROJECT_NAME}-queue}"
WEB_CONTAINER="${WEB_CONTAINER:-${PROJECT_NAME}-web}"
DB_CONTAINER="${DB_CONTAINER:-${PROJECT_NAME}-db}"
REDIS_CONTAINER="${REDIS_CONTAINER:-${PROJECT_NAME}-redis}"
MAILPIT_CONTAINER="${MAILPIT_CONTAINER:-${PROJECT_NAME}-mailpit}"

containers=(
    "$WEB_CONTAINER"
    "$QUEUE_CONTAINER"
    "$APP_CONTAINER"
    "$MAILPIT_CONTAINER"
    "$REDIS_CONTAINER"
    "$DB_CONTAINER"
)

for container in "${containers[@]}"; do
    if docker ps --format '{{.Names}}' | grep -Eq "^${container}$"; then
        echo "[stop-stack] 正在停止 ${container}"
        docker stop "$container" > /dev/null
    fi

    if docker ps -a --format '{{.Names}}' | grep -Eq "^${container}$"; then
        echo "[stop-stack] 移除容器 ${container}"
        docker rm "$container" > /dev/null
    fi
done

if docker network inspect "$NETWORK_NAME" > /dev/null 2>&1; then
    echo "[stop-stack] 保留网络 ${NETWORK_NAME}（如需删除请手动运行 \`docker network rm ${NETWORK_NAME}\`）"
fi

cat <<EOF

[stop-stack] 已停止所有 Anneweb 容器。
数据库、Composer/Node/Storage 等数据卷已保留，方便下次启动继续使用。

EOF
