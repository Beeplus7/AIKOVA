# Design references

Copied from Downloads for local fidelity while implementing React Native / web screens.

- `Aikova-Brand-Artefact-System.html` — identity, color, type, voice
- `Aikova-V2-Itransition-Inspired.html` — marketing site
- `Aikova-Portfolio-Crm-Dashboard.html` — portfolio CRM dashboard
- `aikova_x5f_portfolio_x5f_crm_x5f_dashboard.html` — CRM dashboard duplicate export
- `Aikova-Flowless-Tech-Hero.html` — Flowless Tech Hero landing (canonical design source)
- `portfolio-os/` — Portfolio OS Built (`App.tsx` + logo) from `Aikova+Portfolio+Os+Built.tar.gz`
- `Aikova-Ai-Receptionist-Contact.html` — AI receptionist contact (AVA)
- `Aikova-Comprehensive-Services.html` — comprehensive services map
- `solutions-playbook/` — Solutions + Industry Playbook (`App.tsx`)
- `industries-serve/` — Industries We Serve (`App.tsx`)

**Live web home:** `public/aikova-flowless-tech-hero.html` is wired as `/` via `app/index.web.tsx` (full-bleed iframe + nav bridge into Expo routes).

**Live web portfolio:** bundled to `public/portfolio-os/` and framed by `app/portfolio.web.tsx` (rebuild: `npx esbuild scripts/portfolio-os-entry.jsx --bundle --outfile=public/portfolio-os/app.js --format=iife --platform=browser --jsx=automatic --loader:.tsx=tsx --loader:.ts=ts --define:process.env.NODE_ENV=\"production\"`).

**Live web industries:** `public/industries-serve/` framed by `app/industries.web.tsx`.

**Live web solutions:** `public/solutions-playbook/` framed by `app/solutions.web.tsx`.

**Live web services:** `public/aikova-comprehensive-services.html` framed by `app/services.web.tsx`.

**Live web contact:** `public/aikova-ai-receptionist-contact.html` framed by `app/contact.web.tsx`.
