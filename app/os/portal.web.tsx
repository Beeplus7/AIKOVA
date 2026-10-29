import { useEffect } from 'react';
import { Link, router } from 'expo-router';
import { useAuth } from '../../src/lib/auth/AuthProvider';

const css = `
.aikova-portal {
  min-height: 100vh;
  background: #05070D;
  color: #fff;
  font-family: Inter, system-ui, sans-serif;
}
.aikova-portal-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 24px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}
.aikova-portal-brand {
  font-family: Sora, system-ui, sans-serif;
  font-weight: 800;
  font-size: 18px;
  color: #fff;
  text-decoration: none;
}
.aikova-portal-brand span { color: #84FF3D; }
.aikova-portal-nav a, .aikova-portal-nav button {
  color: #8B9BB4;
  background: none;
  border: 0;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
}
.aikova-portal-hero {
  padding: 36px 24px 18px;
  background: linear-gradient(180deg, rgba(14,165,255,0.12), transparent);
  border-bottom: 1px solid rgba(255,255,255,0.06);
}
.aikova-portal-kicker {
  font-family: ui-monospace, monospace;
  font-size: 11px;
  letter-spacing: 1.8px;
  color: #84FF3D;
  margin: 0 0 10px;
}
.aikova-portal-title {
  font-family: Sora, system-ui, sans-serif;
  font-weight: 800;
  font-size: clamp(28px, 5vw, 40px);
  letter-spacing: -0.04em;
  margin: 0 0 8px;
}
.aikova-portal-lede {
  max-width: 560px;
  color: #8B9BB4;
  font-size: 15px;
  line-height: 23px;
  margin: 0;
}
.aikova-portal-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
}
.aikova-portal-chip {
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.12);
  background: rgba(255,255,255,0.04);
  padding: 8px 12px;
}
.aikova-portal-chip b {
  display: block;
  font-size: 9px;
  letter-spacing: 1.2px;
  color: #64748B;
}
.aikova-portal-chip span {
  font-family: Sora, system-ui, sans-serif;
  font-weight: 700;
  font-size: 13px;
}
.aikova-portal-body {
  max-width: 980px;
  margin: 0 auto;
  padding: 24px 16px 48px;
}
.aikova-portal-session {
  border-radius: 18px;
  border: 1px solid rgba(255,255,255,0.1);
  background: rgba(255,255,255,0.04);
  padding: 18px;
  margin-bottom: 16px;
}
.aikova-portal-session p { margin: 0; }
.aikova-portal-session .label {
  font-family: ui-monospace, monospace;
  font-size: 11px;
  letter-spacing: 1.4px;
  color: #0EA5FF;
  margin-bottom: 6px;
}
.aikova-portal-session .email { color: #8B9BB4; font-size: 14px; margin-top: 4px; }
.aikova-portal-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 12px;
}
.aikova-portal-door {
  display: block;
  text-decoration: none;
  color: #fff;
  border-radius: 18px;
  border: 1px solid rgba(255,255,255,0.12);
  background: rgba(255,255,255,0.03);
  padding: 20px;
  min-height: 180px;
}
.aikova-portal-door.admin {
  background: linear-gradient(180deg, rgba(14,165,255,0.16), rgba(255,255,255,0.03));
  border-color: rgba(14,165,255,0.35);
}
.aikova-portal-door.user {
  background: linear-gradient(180deg, rgba(132,255,61,0.14), rgba(255,255,255,0.03));
  border-color: rgba(132,255,61,0.3);
}
.aikova-portal-door .n {
  font-family: ui-monospace, monospace;
  font-size: 11px;
  letter-spacing: 1.4px;
  color: #84FF3D;
  margin-bottom: 10px;
}
.aikova-portal-door h2 {
  font-family: Sora, system-ui, sans-serif;
  font-size: 24px;
  margin: 0 0 8px;
  letter-spacing: -0.03em;
}
.aikova-portal-door p {
  color: #8B9BB4;
  font-size: 14px;
  line-height: 21px;
  margin: 0 0 16px;
}
.aikova-portal-door .cta {
  display: inline-flex;
  align-items: center;
  border-radius: 12px;
  background: #84FF3D;
  color: #05070D;
  font-weight: 700;
  font-size: 13px;
  padding: 10px 14px;
}
.aikova-portal-door.admin .cta { background: #0EA5FF; }
`;

export default function OsPortalScreen() {
  const { user, loading, configured, signOut } = useAuth();

  useEffect(() => {
    if (!loading && (!configured || !user)) {
      router.replace('/os/login');
    }
  }, [loading, configured, user]);

  if (loading || !user) {
    return (
      <div className="aikova-portal">
        <style>{css}</style>
        <div className="aikova-portal-body" style={{ paddingTop: 80 }}>
          Loading portal…
        </div>
      </div>
    );
  }

  return (
    <div className="aikova-portal">
      <style>{css}</style>
      <nav className="aikova-portal-nav">
        <Link href="/" className="aikova-portal-brand">
          Ai<span>KOVA</span>
        </Link>
        <div style={{ display: 'flex', gap: 16 }}>
          <Link href="/">Marketing</Link>
          <button type="button" onClick={() => signOut().then(() => router.replace('/os/login'))}>
            Sign out
          </button>
        </div>
      </nav>

      <header className="aikova-portal-hero">
        <p className="aikova-portal-kicker">PORTAL · DUAL ACCESS</p>
        <h1 className="aikova-portal-title">Open the system.</h1>
        <p className="aikova-portal-lede">
          Same account. Two entrances — Admin entrance and Users entrance.
        </p>
        <div className="aikova-portal-chips">
          {[
            { k: 'ROOMS', v: '2' },
            { k: 'AUTH', v: 'ONE LOGIN' },
            { k: 'VAULT', v: 'DOS7' },
            { k: 'API', v: 'LIVE' },
          ].map((c) => (
            <div key={c.k} className="aikova-portal-chip">
              <b>{c.k}</b>
              <span>{c.v}</span>
            </div>
          ))}
        </div>
      </header>

      <div className="aikova-portal-body">
        <div className="aikova-portal-session">
          <p className="label">SIGNED IN</p>
          <p style={{ fontFamily: 'Sora, system-ui', fontWeight: 700, fontSize: 20 }}>
            {user.email?.split('@')[0] || 'Operator'}
          </p>
          <p className="email">{user.email}</p>
        </div>

        <div className="aikova-portal-grid">
          <Link href="/os/crm?role=admin" className="aikova-portal-door admin">
            <div className="n">01 · ADMIN ENTRANCE</div>
            <h2>Admin entrance</h2>
            <p>Captain CRM — leads, engagements, negotiations, tickets, evidence vault, billing.</p>
            <span className="cta">Enter Admin →</span>
          </Link>
          <Link href="/os/crm?role=user" className="aikova-portal-door user">
            <div className="n">02 · USERS ENTRANCE</div>
            <h2>Users entrance</h2>
            <p>Client portal — project status, tickets, chat with Captain.</p>
            <span className="cta">Enter Users →</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
