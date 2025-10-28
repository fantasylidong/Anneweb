#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT_DIR"

ENV_FILE="$ROOT_DIR/docker/.env.stack"
if [ -f "$ENV_FILE" ]; then
    # shellcheck disable=SC1090
    set -a && source "$ENV_FILE" && set +a
fi

PROJECT_NAME="${PROJECT_NAME:-anneweb}"
NETWORK_NAME="${NETWORK_NAME:-${PROJECT_NAME}-net}"

APP_IMAGE="${APP_IMAGE:-anneweb/app:local}"
APP_HTTP_PORT="${APP_HTTP_PORT:-8080}"

MYSQL_ROOT_PASSWORD="${MYSQL_ROOT_PASSWORD:-secret}"
MYSQL_DATABASE="${MYSQL_DATABASE:-anneweb}"
MYSQL_USER="${MYSQL_USER:-anneweb}"
MYSQL_PASSWORD="${MYSQL_PASSWORD:-anneweb}"
SOURCEBANS_DATABASE="${SOURCEBANS_DATABASE:-sourcebans}"
SOURCEBANS_USER="${SOURCEBANS_USER:-sourcebans}"
SOURCEBANS_PASSWORD="${SOURCEBANS_PASSWORD:-sourcebans}"
MYSQL_HOST_PORT="${MYSQL_HOST_PORT:-33060}"

REDIS_HOST_PORT="${REDIS_HOST_PORT:-63790}"
MAILPIT_HTTP_PORT="${MAILPIT_HTTP_PORT:-8025}"
MAILPIT_SMTP_PORT="${MAILPIT_SMTP_PORT:-1025}"

APP_ENV="${APP_ENV:-local}"
APP_DEBUG="${APP_DEBUG:-false}"
APP_URL="${APP_URL:-http://localhost:${APP_HTTP_PORT}}"
LOG_CHANNEL="${LOG_CHANNEL:-stack}"
QUEUE_CONNECTION="${QUEUE_CONNECTION:-redis}"

# Container names
APP_CONTAINER="${APP_CONTAINER:-${PROJECT_NAME}-app}"
WEB_CONTAINER="${WEB_CONTAINER:-${PROJECT_NAME}-web}"
QUEUE_CONTAINER="${QUEUE_CONTAINER:-${PROJECT_NAME}-queue}"
DB_CONTAINER="${DB_CONTAINER:-${PROJECT_NAME}-db}"
REDIS_CONTAINER="${REDIS_CONTAINER:-${PROJECT_NAME}-redis}"
MAILPIT_CONTAINER="${MAILPIT_CONTAINER:-${PROJECT_NAME}-mailpit}"

# Volumes
DB_VOLUME="${DB_VOLUME:-${PROJECT_NAME}-db-data}"
COMPOSER_VOLUME="${COMPOSER_VOLUME:-${PROJECT_NAME}-composer-cache}"
NODE_VOLUME="${NODE_VOLUME:-${PROJECT_NAME}-node-modules}"
STORAGE_VOLUME="${STORAGE_VOLUME:-${PROJECT_NAME}-storage}"

# Images for dependencies
DB_IMAGE="${DB_IMAGE:-mysql:5.7.35}"
REDIS_IMAGE="${REDIS_IMAGE:-redis:7.4-alpine}"
MAILPIT_IMAGE="${MAILPIT_IMAGE:-axllent/mailpit:v1.21}"
WEB_IMAGE="${WEB_IMAGE:-nginx:1.27-alpine}"

function ensure_network() {
    if ! docker network inspect "$NETWORK_NAME" > /dev/null 2>&1; then
        echo "[run-stack] 创建网络 ${NETWORK_NAME}"
        docker network create "$NETWORK_NAME"
    fi
}

function ensure_volume() {
    local volume=$1
    if ! docker volume inspect "$volume" > /dev/null 2>&1; then
        echo "[run-stack] 创建数据卷 ${volume}"
        docker volume create "$volume" > /dev/null
    fi
}

function ensure_app_image() {
    if ! docker image inspect "$APP_IMAGE" > /dev/null 2>&1; then
        echo "[run-stack] 未找到镜像 ${APP_IMAGE}，开始构建..."
        docker build -f docker/app.Dockerfile -t "$APP_IMAGE" .
    fi
}

function start_container() {
    local name=$1
    shift

    if docker ps --format '{{.Names}}' | grep -Eq "^${name}$"; then
        echo "[run-stack] 容器 ${name} 已在运行中，跳过。"
        return
    fi

    if docker ps -a --format '{{.Names}}' | grep -Eq "^${name}$"; then
        echo "[run-stack] 移除已存在但未运行的容器 ${name}"
        docker rm "$name" > /dev/null
    fi

    echo "[run-stack] 启动容器 ${name}"
    docker run -d --name "$name" "$@"
}

echo "[run-stack] 使用配置文件: ${ENV_FILE}"

ensure_network
ensure_volume "$DB_VOLUME"
ensure_volume "$COMPOSER_VOLUME"
ensure_volume "$NODE_VOLUME"
ensure_volume "$STORAGE_VOLUME"
ensure_app_image

# Database
start_container "$DB_CONTAINER" \
    --network "$NETWORK_NAME" \
    --platform linux/amd64 \
    -p "${MYSQL_HOST_PORT}:3306" \
    -e MYSQL_ROOT_PASSWORD="$MYSQL_ROOT_PASSWORD" \
    -e MYSQL_DATABASE="$MYSQL_DATABASE" \
    -e MYSQL_USER="$MYSQL_USER" \
    -e MYSQL_PASSWORD="$MYSQL_PASSWORD" \
    -v "${DB_VOLUME}:/var/lib/mysql" \
    "$DB_IMAGE" \
    --sql-mode="ALLOW_INVALID_DATES" \
    --explicit_defaults_for_timestamp=0

# Redis
start_container "$REDIS_CONTAINER" \
    --network "$NETWORK_NAME" \
    -p "${REDIS_HOST_PORT}:6379" \
    "$REDIS_IMAGE"

# Mailpit
start_container "$MAILPIT_CONTAINER" \
    --network "$NETWORK_NAME" \
    -p "${MAILPIT_HTTP_PORT}:8025" \
    -p "${MAILPIT_SMTP_PORT}:1025" \
    "$MAILPIT_IMAGE"

# App (PHP-FPM)
start_container "$APP_CONTAINER" \
    --network "$NETWORK_NAME" \
    --add-host host.docker.internal:host-gateway \
    -v "${ROOT_DIR}/portal:/var/www/html" \
    -v "${COMPOSER_VOLUME}:/tmp/composer" \
    -v "${NODE_VOLUME}:/var/www/html/node_modules" \
    -v "${STORAGE_VOLUME}:/var/www/html/storage" \
    -e APP_ENV="$APP_ENV" \
    -e APP_DEBUG="$APP_DEBUG" \
    -e APP_URL="$APP_URL" \
    -e LOG_CHANNEL="$LOG_CHANNEL" \
    -e DB_CONNECTION=mysql \
    -e DB_HOST="$DB_CONTAINER" \
    -e DB_PORT=3306 \
    -e DB_DATABASE="$MYSQL_DATABASE" \
    -e DB_USERNAME="$MYSQL_USER" \
    -e DB_PASSWORD="$MYSQL_PASSWORD" \
    -e SOURCEBANS_DB_CONNECTION=sourcebans \
    -e SOURCEBANS_DB_HOST="$DB_CONTAINER" \
    -e SOURCEBANS_DB_PORT=3306 \
    -e SOURCEBANS_DB_DATABASE="$SOURCEBANS_DATABASE" \
    -e SOURCEBANS_DB_USERNAME="$SOURCEBANS_USER" \
    -e SOURCEBANS_DB_PASSWORD="$SOURCEBANS_PASSWORD" \
    -e QUEUE_CONNECTION="$QUEUE_CONNECTION" \
    -e REDIS_HOST="$REDIS_CONTAINER" \
    -e MAIL_MAILER=smtp \
    -e MAIL_HOST="$MAILPIT_CONTAINER" \
    -e MAIL_PORT="$MAILPIT_SMTP_PORT" \
    -e MAIL_USERNAME= \
    -e MAIL_PASSWORD= \
    -e MAIL_FROM_ADDRESS="hello@example.com" \
    -e MAIL_FROM_NAME="Anne Control" \
    "$APP_IMAGE"

# Queue worker
start_container "$QUEUE_CONTAINER" \
    --network "$NETWORK_NAME" \
    --add-host host.docker.internal:host-gateway \
    -v "${ROOT_DIR}/portal:/var/www/html" \
    -v "${COMPOSER_VOLUME}:/tmp/composer" \
    -v "${NODE_VOLUME}:/var/www/html/node_modules" \
    -v "${STORAGE_VOLUME}:/var/www/html/storage" \
    -e APP_ENV="$APP_ENV" \
    -e APP_DEBUG="$APP_DEBUG" \
    -e APP_URL="$APP_URL" \
    -e LOG_CHANNEL="$LOG_CHANNEL" \
    -e DB_CONNECTION=mysql \
    -e DB_HOST="$DB_CONTAINER" \
    -e DB_PORT=3306 \
    -e DB_DATABASE="$MYSQL_DATABASE" \
    -e DB_USERNAME="$MYSQL_USER" \
    -e DB_PASSWORD="$MYSQL_PASSWORD" \
    -e SOURCEBANS_DB_CONNECTION=sourcebans \
    -e SOURCEBANS_DB_HOST="$DB_CONTAINER" \
    -e SOURCEBANS_DB_PORT=3306 \
    -e SOURCEBANS_DB_DATABASE="$SOURCEBANS_DATABASE" \
    -e SOURCEBANS_DB_USERNAME="$SOURCEBANS_USER" \
    -e SOURCEBANS_DB_PASSWORD="$SOURCEBANS_PASSWORD" \
    -e QUEUE_CONNECTION="$QUEUE_CONNECTION" \
    -e REDIS_HOST="$REDIS_CONTAINER" \
    "$APP_IMAGE" \
    php artisan queue:listen --tries=1

# Web (Nginx)
start_container "$WEB_CONTAINER" \
    --network "$NETWORK_NAME" \
    -p "${APP_HTTP_PORT}:80" \
    -v "${ROOT_DIR}/portal:/var/www/html" \
    -v "${ROOT_DIR}/docker/nginx/default.conf:/etc/nginx/conf.d/default.conf:ro" \
    "$WEB_IMAGE"

cat <<EOF

[run-stack] 所有容器已启动：
  - 应用:        ${APP_CONTAINER}
  - 队列:        ${QUEUE_CONTAINER}
  - Web(Nginx): ${WEB_CONTAINER}  -> http://localhost:${APP_HTTP_PORT}
  - MySQL:      ${DB_CONTAINER}   -> 端口 ${MYSQL_HOST_PORT}
  - Redis:      ${REDIS_CONTAINER} -> 端口 ${REDIS_HOST_PORT}
  - Mailpit:    ${MAILPIT_CONTAINER} -> Web UI http://localhost:${MAILPIT_HTTP_PORT}

如需停止所有容器，可运行:
  docker/scripts/stop-stack.sh

EOF
