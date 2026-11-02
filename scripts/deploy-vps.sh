#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
# Load local deploy env if present (VPS_* + secrets for server/.env sync)
if [[ -f "$ROOT/.env" ]]; then
  set -a
  # shellcheck disable=SC1091
  source "$ROOT/.env"
  set +a
fi

HOST="${VPS_HOST:-87.106.103.43}"
USER="${VPS_USER:-root}"
REMOTE="${VPS_DEPLOY_PATH:-/var/www/aikova}"
PORT="${VPS_SSH_PORT:-22}"
KEY="${VPS_SSH_KEY_PATH:-$HOME/.ssh/aikova_receptionist_deploy}"

SSH=(ssh -p "$PORT")
RSYNC_SSH="ssh -p $PORT"
SCP=(scp -P "$PORT")
if [[ -n "$KEY" && -f "$KEY" ]]; then
  SSH=(ssh -p "$PORT" -i "$KEY" -o IdentitiesOnly=yes)
  RSYNC_SSH="ssh -p $PORT -i $KEY -o IdentitiesOnly=yes"
  SCP=(scp -P "$PORT" -i "$KEY" -o IdentitiesOnly=yes)
fi

cd "$ROOT"

echo "==> Exporting web"
npx expo export --platform web

# Ensure marketing artefact bundles from public/ survive export
mkdir -p dist/portfolio-os dist/solutions-playbook dist/industries-serve
cp -f public/aikova-flowless-tech-hero.html dist/aikova-flowless-tech-hero.html
cp -f public/portfolio-os/app.js public/portfolio-os/index.html dist/portfolio-os/ 2>/dev/null || true
cp -f public/solutions-playbook/app.js dist/solutions-playbook/ 2>/dev/null || true
[[ -f public/solutions-playbook/index.html ]] && cp -f public/solutions-playbook/index.html dist/solutions-playbook/ || true

echo "==> Syncing to ${USER}@${HOST}:${REMOTE}"
"${SSH[@]}" "${USER}@${HOST}" "mkdir -p '${REMOTE}/web' '${REMOTE}/server' '${REMOTE}/shared'"

rsync -az --delete -e "$RSYNC_SSH" \
  dist/ "${USER}@${HOST}:${REMOTE}/web/"

rsync -az -e "$RSYNC_SSH" \
  --exclude node_modules \
  --exclude data \
  server/ "${USER}@${HOST}:${REMOTE}/server/"

# Env for API only (never publish service role to web)
"${SCP[@]}" "$ROOT/.env" "${USER}@${HOST}:${REMOTE}/server/.env"

"${SSH[@]}" "${USER}@${HOST}" bash -s <<EOF
set -euo pipefail
cd ${REMOTE}/server
npm install --omit=dev
pm2 delete aikova-crm-api >/dev/null 2>&1 || true
CRM_ALLOW_ANON=0 pm2 start index.js --name aikova-crm-api --cwd ${REMOTE}/server
pm2 save
EOF

echo "==> Deployed. Configure nginx + certbot if needed."
