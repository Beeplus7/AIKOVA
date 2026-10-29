import { Link } from 'expo-router';
import type { ReactNode } from 'react';
import { osRoutes } from '../../navigation/routes';

const css = `
.aikova-os-root {
  min-height: 100vh;
  background: #05070D;
  color: #fff;
  font-family: Inter, system-ui, sans-serif;
}
.aikova-os-frame {
  display: flex;
  max-width: 1280px;
  margin: 0 auto;
  min-height: 100vh;
}
.aikova-os-sidebar {
  width: 240px;
  padding: 24px;
  border-right: 1px solid rgba(255,255,255,0.1);
  background: #080A12;
  box-sizing: border-box;
}
.aikova-os-brand {
  font-family: Sora, system-ui, sans-serif;
  font-weight: 800;
  font-size: 20px;
  margin: 0 0 4px;
}
.aikova-os-brand-meta {
  font-family: ui-monospace, monospace;
  font-size: 10px;
  letter-spacing: 1px;
  color: #84FF3D;
  margin: 0 0 16px;
}
.aikova-os-nav a {
  display: block;
  padding: 10px 12px;
  border-radius: 10px;
  color: #8B9BB4;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 4px;
}
.aikova-os-nav a.active,
.aikova-os-nav a:hover {
  background: rgba(255,255,255,0.08);
  color: #fff;
}
.aikova-os-main {
  flex: 1;
  padding: 28px 28px 64px;
  box-sizing: border-box;
}
.aikova-os-kicker {
  font-family: ui-monospace, monospace;
  font-size: 11px;
  letter-spacing: 1.4px;
  color: #84FF3D;
  margin: 0 0 8px;
}
.aikova-os-title {
  font-family: Sora, system-ui, sans-serif;
  font-weight: 700;
  font-size: 32px;
  letter-spacing: -0.6px;
  margin: 0 0 8px;
}
.aikova-os-subtitle {
  font-size: 15px;
  line-height: 22px;
  color: #8B9BB4;
  margin: 0 0 16px;
}
@media (max-width: 899px) {
  .aikova-os-frame { flex-direction: column; }
  .aikova-os-sidebar {
    width: 100%;
    border-right: 0;
    border-bottom: 1px solid rgba(255,255,255,0.1);
  }
  .aikova-os-nav {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  .aikova-os-nav a { margin-bottom: 0; }
}
`;

export function OsShell({
  children,
  activeHref = '/os',
  title,
  subtitle,
}: {
  children: ReactNode;
  activeHref?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="aikova-os-root">
      <style>{css}</style>
      <div className="aikova-os-frame">
        <aside className="aikova-os-sidebar">
          <p className="aikova-os-brand">AiKOVA OS</p>
          <p className="aikova-os-brand-meta">PORTFOLIO CRM · VAULT</p>
          <nav className="aikova-os-nav">
            {osRoutes.map((route) => (
              <Link
                key={route.href}
                href={route.href as '/os'}
                className={route.href === activeHref ? 'active' : undefined}
              >
                {route.label}
              </Link>
            ))}
            <Link href="/">← Marketing</Link>
          </nav>
        </aside>
        <main className="aikova-os-main">
          <p className="aikova-os-kicker">SYSTEM LIVE</p>
          <h1 className="aikova-os-title">{title}</h1>
          {subtitle ? <p className="aikova-os-subtitle">{subtitle}</p> : null}
          {children}
        </main>
      </div>
    </div>
  );
}
