FROM redis:7.4-alpine

LABEL maintainer="morzlee" \
      description="Anneweb Redis 7 tuned image with persistence and safe defaults"

COPY docker/database/redis/redis.conf /usr/local/etc/redis/redis.conf

EXPOSE 6379

CMD ["redis-server", "/usr/local/etc/redis/redis.conf"]
