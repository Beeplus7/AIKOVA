#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
HOST="${VPS_HOST:-87.106.103.43}"
USER="${VPS_USER:-root}"
REMOTE="${VPS_DEPLOY_PATH:-/var/www/aikova}"

cd "$ROOT"

echo "==> Exporting web"
npx expo export --platform web

echo "==> Syncing to ${USER}@${HOST}:${REMOTE}"
ssh "${USER}@${HOST}" "mkdir -p '${REMOTE}/web' '${REMOTE}/server' '${REMOTE}/shared'"

rsync -az --delete \
  dist/ "${USER}@${HOST}:${REMOTE}/web/"

rsync -az \
  --exclude node_modules \
  --exclude data \
  server/ "${USER}@${HOST}:${REMOTE}/server/"

# Env for API only (never publish service role to web)
scp "$ROOT/.env" "${USER}@${HOST}:${REMOTE}/server/.env"

ssh "${USER}@${HOST}" bash -s <<EOF
set -euo pipefail
cd ${REMOTE}/server
npm install --omit=dev
pm2 delete aikova-crm-api >/dev/null 2>&1 || true
CRM_ALLOW_ANON=0 pm2 start index.js --name aikova-crm-api --cwd ${REMOTE}/server
pm2 save
EOF

echo "==> Deployed. Configure nginx + certbot if needed."
