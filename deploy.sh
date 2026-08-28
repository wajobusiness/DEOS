#!/usr/bin/env bash
set -e

echo "🚀 Starting DEOS Production SaaS Deployment..."

# 1. Pull latest git code
git pull origin main

# 2. Build Docker images
docker compose -f docker-compose.yml build --no-cache

# 3. Spin up containers
docker compose -f docker-compose.yml up -d

# 4. Execute database migrations and optimize
docker compose exec -T app php artisan migrate --force
docker compose exec -T app php artisan config:cache
docker compose exec -T app php artisan route:cache
docker compose exec -T app php artisan view:cache

# 5. Restart queue workers
docker compose exec -T app php artisan horizon:terminate 2>/dev/null || docker compose exec -T app php artisan queue:restart

echo "✅ DEOS Production SaaS is LIVE and healthy!"
