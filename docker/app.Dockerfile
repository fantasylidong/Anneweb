# syntax=docker/dockerfile:1.7

FROM node:20-bullseye-slim AS node

FROM composer:2 AS composer

FROM php:8.2-fpm AS app

ARG UID=1000
ARG GID=1000

RUN rm -f /etc/apt/sources.list.d/*.list && \
    printf '%s\n' \
        'deb https://mirrors.ustc.edu.cn/debian bookworm main contrib non-free non-free-firmware' \
        'deb https://mirrors.ustc.edu.cn/debian bookworm-updates main contrib non-free non-free-firmware' \
        'deb https://mirrors.ustc.edu.cn/debian-security bookworm-security main contrib non-free non-free-firmware' \
    > /etc/apt/sources.list && \
    apt-get update && \
    apt-get install -y --no-install-recommends \
        bash \
        git \
        unzip \
        libicu-dev \
        libzip-dev \
        libpng-dev \
        libjpeg62-turbo-dev \
        libfreetype6-dev \
        zlib1g-dev \
        pkg-config \
        && \
    rm -rf /var/lib/apt/lists/*

COPY --from=composer /usr/bin/composer /usr/bin/composer
COPY --from=node /usr/local /usr/local

RUN groupadd --gid ${GID} app &&     useradd --uid ${UID} --gid app --create-home --shell /bin/bash app

WORKDIR /var/www/html

ENV COMPOSER_ALLOW_SUPERUSER=1     PATH="/usr/local/node/bin:$PATH"

COPY docker/php/conf.d/app.ini /usr/local/etc/php/conf.d/app.ini
COPY docker/php/php-fpm.d/zz-app.conf /usr/local/etc/php-fpm.d/zz-app.conf
COPY docker/app/entrypoint.sh /usr/local/bin/entrypoint.sh

COPY --chown=app:app portal/ /var/www/html/

RUN cp .env.example .env

RUN chmod +x /usr/local/bin/entrypoint.sh

USER app

RUN composer install --no-dev --optimize-autoloader --no-interaction && \
    npm install && \
    npm run build && \
    rm -rf node_modules && \
    php artisan key:generate --ansi --force && \
    php artisan storage:link || true

USER root

RUN chown -R app:app /var/www/html/storage /var/www/html/bootstrap/cache

USER app

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["php-fpm"]
