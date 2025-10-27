#!/usr/bin/env bash
set -e

APP_DIR="/var/www/html"
cd "$APP_DIR"

export COMPOSER_HOME="/tmp/composer"
export PATH="/usr/local/bin:/usr/local/node/bin:$PATH"

if [ -f composer.json ] && [ ! -f vendor/autoload.php ]; then
    echo "[entrypoint] Installing composer dependencies..."
    composer install --no-interaction --prefer-dist --ansi
fi

if [ -f package.json ] && [ ! -d node_modules ]; then
    echo "[entrypoint] Installing npm dependencies..."
    npm install
fi

exec "$@"
