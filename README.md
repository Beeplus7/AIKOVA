# AiKOVA

React web + mobile app (Expo Router) for **AiKOVA** — Engineered Intelligence. Delivered.

## Surfaces

- **Marketing site** — Home, Solutions, Industries, Portfolio, Contact (Itransition-inspired V2)
- **Portfolio CRM OS** — Dashboard, Pipeline, Portfolio CRM, Login

Brand tokens come from `design/Aikova-Brand-Artefact-System.html` → `src/theme/colors.ts`.

## Run

```bash
cd AiKOVA
cp .env.example .env   # fill after deployment file arrives
npm start              # Expo
npm run web            # web
npm run ios            # iOS
npm run android        # Android
```

## Credentials

Copy `.env.example` → `.env`. Live checklist: `docs/CREDENTIALS.md`.

- Supabase Auth (email) wired; Google needs provider enabled in the dashboard
- CRM API: `server/` (SQLite on VPS, proxied at `/actions`)
- Admin CRM UI: `/os/crm` (web)
- Deploy: `scripts/deploy-vps.sh` + `deploy/nginx-aikova.conf`

## Design sources

| File | Role |
|---|---|
| `design/Aikova-Brand-Artefact-System.html` | Brand OS |
| `design/Aikova-V2-Itransition-Inspired.html` | Marketing reference |
| `design/Aikova-Portfolio-Crm-Dashboard.html` | CRM OS reference |
| `design/portfolio-os/` | Marketing portfolio OS (6 products) — live at `/portfolio` |
| `design/Aikova-Ai-Receptionist-Contact.html` | AVA AI receptionist contact — live at `/contact` |
| `design/Aikova-Comprehensive-Services.html` | Comprehensive services — live at `/services` |
| `design/solutions-playbook/` | Solutions + Industry Playbook — live at `/solutions` |
| `design/industries-serve/` | Industries We Serve — live at `/industries` |
