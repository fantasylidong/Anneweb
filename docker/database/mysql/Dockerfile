FROM mysql:5.7.35

LABEL maintainer="morzlee" \
      description="Anneweb MySQL 5.7 tuned image with hostname authentication support"

# Copy optimized MySQL configuration (absolute path relative to build context root)
COPY docker/database/mysql/my.cnf /etc/mysql/conf.d/custom.cnf

# Ensure permissions
RUN chmod 0444 /etc/mysql/conf.d/custom.cnf

EXPOSE 3306

# Use default entrypoint/cmd provided by upstream mysql image
