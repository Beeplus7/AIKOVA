# AiKOVA — Credentials Checklist

Values live in `.env` (from `.env.example`). Never commit secrets.

## 1. Supabase

| Variable | Where |
|---|---|
| `EXPO_PUBLIC_SUPABASE_URL` | Project URL |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | `anon` / `public` key |
| `SUPABASE_SERVICE_ROLE_KEY` | `service_role` (server only) |
| `SUPABASE_PROJECT_REF` | Project ref |

Project: `vkegwslnabbgjucxxrmn`

### Google provider (manual)

1. Supabase Dashboard → Authentication → Providers → Google → Enable  
2. Client ID / Secret from Google Cloud OAuth client  
3. Redirect already set in Google:  
   `https://vkegwslnabbgjucxxrmn.supabase.co/auth/v1/callback`

Optional SQL for cloud CRM tables: `supabase/migrations/001_crm_records.sql`  
(CRM records currently persist on the VPS SQLite API.)

## 2. GitHub

| Variable | Purpose |
|---|---|
| `GITHUB_OWNER` | `Beeplus7` |
| `GITHUB_REPO` | `AIKOVA` |
| `GITHUB_TOKEN` | PAT for push / CI (optional if `gh` is logged in) |

Remote: `https://github.com/Beeplus7/AIKOVA`

## 3. VPS

| Variable | Purpose |
|---|---|
| `VPS_HOST` | `87.106.103.43` |
| `VPS_USER` | `root` |
| `VPS_DEPLOY_PATH` | `/var/www/aikova` |
| `EXPO_PUBLIC_API_BASE_URL` | `https://aikova.co.uk` |
| `EXPO_PUBLIC_APP_URL` | `https://aikova.co.uk` |
| `CRM_API_PORT` | `3015` |

## Admin bootstrap

Email user created via Auth Admin API:

- `admin@aikova.co.uk` (set password in chat / rotate after first login)
