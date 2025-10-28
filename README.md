# Anneweb

一个基于 **Laravel 12 + Inertia.js (React)** 的管理门户，用于整合 SourceBans 管理、Left 4 Dead 2 服务器统计、举报/申诉审核以及捐赠续期等功能。项目默认通过 Docker Compose 启动，支持与现有的 MySQL 5.7 SourceBans 数据库复用或平滑迁移，并预置 GitHub Actions 推送镜像到 Docker Hub。

## 架构总览

- **Laravel 应用 (`portal/`)**：提供 API、后台管理、前台展示、捐赠接口等业务逻辑。前端使用 Inertia.js 将 React 组件嵌入到 Blade 布局中，统一风格。
- **队列与后台任务**：`queue` 服务复用应用镜像，运行 `php artisan queue:listen` 处理异步任务（例如续期记录）。
- **MySQL 5.7**：既保存 Laravel 本身数据，也通过独立连接 `sourcebans` 访问原来的 SourceBans、聊天记录以及 L4D2 插件统计表。
- **Redis**：作为缓存与队列驱动（提供自定义调优镜像 `morzlee/database:redis-7.4-tuned`）。
- **Mailpit**：本地开发时的邮件收发测试。
- **Nginx**：静态资源与 PHP-FPM 之间的反向代理。
- **CI/CD**：`.github/workflows/docker.yml` 使用 Buildx 构建多架构镜像并推送到 `morzlee/anneweb`。

项目主要目录：

| 目录 / 文件 | 说明 |
| --- | --- |
| `portal/` | Laravel 主工程（路由、控制器、React 页面、资源）。 |
| `docker/app.Dockerfile` | PHP-FPM + Node + Composer 多阶段镜像定义，支持 `DEBIAN_MIRROR` 加速构建。 |
| `docker/nginx/` | Nginx 虚拟主机配置。 |
| `docker/php/` | PHP INI 与 FPM Pool 定制。 |
| `docker/app/entrypoint.sh` | 容器入口脚本，自动安装 Composer / NPM 依赖。 |
| `docker-compose.yml` | 本地开发编排文件，包含 app/web/queue/db/redis/mailpit。 |
| `docker/database/mysql/` | MySQL 5.7 调优镜像 Dockerfile 与配置（默认启用域名认证）。 |
| `docker/database/redis/` | Redis 7.4 调优镜像 Dockerfile 与配置。 |
| `.github/workflows/docker.yml` | GitHub Actions 构建并推送应用与数据库镜像。 |
| `database.sql` | 聚合 SourceBans + L4D2 统计 + 聊天记录的建表脚本，可一键导入。 |

## 使用指南

### 先决条件

- Docker 与 Docker Compose（Mac M 系列已在 MySQL 服务中显式声明 `platform: linux/amd64`）。
- 可选：GitHub Actions 访问 Docker Hub 的凭据。

### 第一次启动

1. **准备环境变量**
   ```bash
   cp portal/.env.example portal/.env
   ```
   根据下文“必须调整的配置”修改 `.env` 内容。

2. **导入旧数据库**
   - 使用仓库根目录提供的 `database.sql` 可一次性创建 SourceBans 主表、管理员续期、L4D2 统计、RPG/Lilac 插件以及新的 `chat_log` 聊天记录表：
     ```bash
     mysql -h 127.0.0.1 -P33060 -u root -psecret < database.sql
     ```
     （端口、账号、密码请按实际修改。）
   - 迁移旧环境数据时，可对需要的表执行 `mysqldump --no-create-info` 导出纯数据，再导入到 `sourcebans` 库。例如：
     ```bash
     mysqldump -h old-host -u user -p --skip-lock-tables chat chat_log > chat_log_data.sql
     mysql -h 127.0.0.1 -P33060 -u root -psecret sourcebans < chat_log_data.sql
     ```
     同理可对 `players`、`maps`、`RPG` 等插件表重复上述流程。

3. **启动容器**
   ```bash
   docker compose up --build
   ```
   - 首次构建可加入 `--build-arg DEBIAN_MIRROR=mirrors.ustc.edu.cn` 等参数（例如：`docker compose build --build-arg DEBIAN_MIRROR=mirrors.ustc.edu.cn`）来使用本地镜像源。
   - 构建完成后访问 <http://localhost:8080>。

   如果你不想依赖 Docker Compose，可使用仓库提供的脚本通过 `docker run` 方式一键启动：
   ```bash
   # 首次执行会自动构建镜像并创建网络/数据卷
   docker/scripts/run-stack.sh
   # 停止所有容器
   docker/scripts/stop-stack.sh
   ```
   - `docker/.env.stack` 保存了脚本所需的默认变量（端口、数据库密码等），可以按需修改或在命令前自行导出环境变量覆盖。
   - 脚本会启动 `anneweb-app/queue/web/db/redis/mailpit` 六个容器，其中数据库和缓存使用调优镜像 `morzlee/database:mysql-5.7-tuned` 与 `morzlee/database:redis-7.4-tuned`。

   如需单独运行数据库镜像，可按以下方式启动：
   ```bash
   # MySQL（支持域名授权，自带 my.cnf 调优）
   docker run -d --name anneweb-db \
     -p 33060:3306 \
     -e MYSQL_ROOT_PASSWORD=secret \
     -e MYSQL_DATABASE=anneweb \
     -v anneweb-db-data:/var/lib/mysql \
     morzlee/database:mysql-5.7-tuned

   # Redis（AOF 持久化 + LRU 淘汰）
   docker run -d --name anneweb-redis \
     -p 63790:6379 \
     -v anneweb-redis-data:/data \
     morzlee/database:redis-7.4-tuned
   ```
   - MySQL 镜像默认启用 `skip-name-resolve=0`，因此可以使用域名作为授权主机，例如：
     ```sql
     GRANT ALL ON anneweb.* TO 'anneweb'@'%.anne.example.com' IDENTIFIED BY 'super-secret';
     FLUSH PRIVILEGES;
     ```

4. **执行迁移与资产构建**
   ```bash
   docker compose exec app php artisan migrate --force
   docker compose exec app php artisan migrate --database=sourcebans --path=database/migrations/2024_12_26_000000_add_expiration_to_sb_admins_table.php
   docker compose exec app php artisan storage:link
   docker compose exec app npm run build
   ```
   - 第一个命令初始化 Laravel 自带表（用户、队列、捐赠等）。
   - 第二个命令在 `sourcebans` 连接上补充 `sb_admins.expires_at` 和续期记录表。
   - 若已有 `storage` 绑定卷，可跳过 `storage:link`。

5. **登录后台**
   - 在 `users` 表手动插入或通过 seeder 创建管理员账号。
   - 登录后即可在管理后台查看封禁、禁言、举报、申诉、捐赠与服务器面板。

### 常用命令

```bash
# 进入应用容器
docker compose exec app bash

# 运行单元测试
docker compose exec app php artisan test

# 启动一次性队列消费者
docker compose exec app php artisan queue:work --once

# 清理并重新安装前端依赖
docker compose exec app npm ci && npm run build
```

## GitHub Actions 与镜像发布

`Build and Publish Docker Image` workflow 会在推送到 `main` 分支或发布 `v*` 标签时触发，步骤包括：

1. 使用 Buildx 构建 `docker/app.Dockerfile`；
2. 推送到 `morzlee/anneweb:latest` 与 `morzlee/anneweb:<commit>`；
3. 需要在仓库 Secrets 中配置 `DOCKERUSER` 与 `DOCKERPASSWORD`。

如果你的 Docker Hub 命名空间不同，请同步更新：

- `.github/workflows/docker.yml` → `tags` 列表；
- （可选）`docker-compose.yml` 中各服务的镜像引用；
- 生产部署脚本。

## 必须调整的配置

1. **环境变量 (`portal/.env`)**
   - `APP_NAME`、`APP_URL`：站点标题与对外地址。
   - `APP_KEY`：执行 `php artisan key:generate` 后写入。
   - `DB_*`：Laravel 默认数据库（保存用户、捐赠、后台设置）。
   - `SOURCEBANS_DB_*`：指向现有 SourceBans 数据库，保持 `utf8mb4` 与 `InnoDB`。
   - `CACHE_DRIVER` / `QUEUE_CONNECTION`：如果生产 Redis 单独部署，更新主机与凭据。
   - `MAIL_*`：生产环境邮件服务（本地开发沿用 Mailpit 即可）。
   - `FILESYSTEM_DISK`：根据 OSS / COS 等存储方案调整。

2. **Nginx / 反向代理**
   - 生产环境请根据域名、HTTPS 需求，在 `docker/nginx/default.conf` 或外部网关中调整。
   - 若通过 CDN/OAuth，需要同步 Laravel `TrustedProxy` 与 `SESSION_DOMAIN` 设置。

3. **前端文案与资产**
   - `portal/resources/js/Pages` 内的 React 组件包含首页、服务器列表、统计图表、后台管理表格等内容，可按品牌需求修改。
   - `portal/public` 中的静态资源（Logo、Favicons）需替换。

4. **捐赠接口**
   - 后台手动确认捐赠时可以写入续期天数；如需对接微信个人收款码或其它支付网关，需要补充真正的支付回调、订单校验逻辑。
   - 目前没有自动化生成微信收款码，请在 `resources/js/Pages/Donations` 中自定义。

5. **管理账号与权限**
   - 现阶段后台使用 Laravel `users` 表登录；确保启用必要的密码强度与双因素认证（可集成 Laravel Fortify / Breeze 方案）。
   - SourceBans 管理员有效期新增字段 `expires_at`，请根据业务确定默认值与续期策略。

6. **安全与日志**
   - 根据生产需要开启 HTTPS 与 HSTS。
   - 配置 `LOG_CHANNEL`（如 `stack` + `errorlog` / `daily`），确保日志路径具备写权限。

## 后续改进建议

- **自动化测试**：补充针对封禁/禁言解除、捐赠续期服务的功能测试与前端端到端测试。
- **监控与告警**：接入 Prometheus、Sentry 或其他可观测性方案。
- **容器瘦身**：生产镜像可在 CI 中执行 `composer install --no-dev`+`npm ci --omit=dev` 并仅保留构建产物。
- **多语言**：目前界面以中文为主，可在 `resources/lang` 中增补英文等语言包。
- **插件 SQL 升级**：已有 MySQL 8 兼容的 schema，若 SourceBans 或 L4D2 插件仍在 MySQL 5.7 上运行，迁移前请先验证兼容性。

---

如需根据线上环境进一步定制，请结合上方“必须调整的配置”逐项落实；有任何部署或功能问题，欢迎在项目 issue 中反馈。祝使用顺利！💡
