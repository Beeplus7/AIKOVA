import { useCallback, useEffect, useState } from 'react';
import { Link, Redirect, router } from 'expo-router';
import { createAdmin, listAdmins } from '../../src/lib/adminApi';
import { useAuth } from '../../src/lib/auth/AuthProvider';

const css = `
.aikova-admins { min-height:100vh; background:#05070D; color:#fff; font-family:Inter,system-ui,sans-serif; }
.aikova-admins-nav { display:flex; justify-content:space-between; align-items:center; padding:18px 24px; border-bottom:1px solid rgba(255,255,255,.08); }
.aikova-admins-nav a, .aikova-admins-nav button { color:#8B9BB4; background:none; border:0; text-decoration:none; font-weight:600; font-size:13px; cursor:pointer; }
.aikova-admins-brand { font-family:Sora,system-ui,sans-serif; font-weight:800; font-size:18px; color:#fff; text-decoration:none; }
.aikova-admins-brand span { color:#84FF3D; }
.aikova-admins-body { max-width:860px; margin:0 auto; padding:28px 16px 48px; }
.aikova-admins-kicker { font-family:ui-monospace,monospace; font-size:11px; letter-spacing:1.6px; color:#84FF3D; }
.aikova-admins-title { font-family:Sora,system-ui,sans-serif; font-size:30px; letter-spacing:-.04em; margin:8px 0; }
.aikova-admins-lede { color:#8B9BB4; font-size:14px; line-height:21px; margin:0 0 18px; }
.aikova-admins-grid { display:grid; grid-template-columns:1.1fr .9fr; gap:14px; }
@media (max-width:800px){ .aikova-admins-grid { grid-template-columns:1fr; } }
.aikova-admins-card { border:1px solid rgba(255,255,255,.1); background:rgba(255,255,255,.04); border-radius:18px; padding:18px; }
.aikova-admins-card h2 { margin:0 0 12px; font-size:16px; }
.aikova-admins-form { display:flex; flex-direction:column; gap:10px; }
.aikova-admins-input { border:1px solid rgba(255,255,255,.12); border-radius:12px; padding:12px 14px; background:#05070D; color:#fff; }
.aikova-admins-btn { border:0; border-radius:12px; padding:12px 14px; background:#0EA5FF; color:#05070D; font-weight:700; cursor:pointer; }
.aikova-admins-error { color:#F87171; font-size:13px; }
.aikova-admins-ok { color:#84FF3D; font-size:13px; }
.aikova-admins-row { display:flex; justify-content:space-between; gap:10px; padding:10px 0; border-top:1px solid rgba(255,255,255,.08); font-size:13px; }
.aikova-admins-row:first-of-type { border-top:0; }
.aikova-admins-email { font-weight:600; }
.aikova-admins-muted { color:#8B9BB4; font-size:12px; }
`;

export default function AdminsScreen() {
  const { user, loading, configured, signOut } = useAuth();
  const [admins, setAdmins] = useState<
    Array<{ id: string; email: string; full_name: string; created_at?: string }>
  >([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const rows = await listAdmins();
    setAdmins(rows);
  }, []);

  useEffect(() => {
    if (!loading && user) {
      refresh().catch((e) => setError(e instanceof Error ? e.message : 'Failed to load admins'));
    }
  }, [loading, user, refresh]);

  if (!loading && (!configured || !user)) {
    return <Redirect href="/os/login" />;
  }

  const onCreate = async () => {
    setBusy(true);
    setError(null);
    setOk(null);
    try {
      const data = await createAdmin({
        email: email.trim(),
        password,
        full_name: fullName.trim(),
      });
      setOk(
        data.created
          ? `Created admin ${data.email}`
          : `Updated credentials for ${data.email}`,
      );
      setEmail('');
      setPassword('');
      setFullName('');
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Create failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="aikova-admins">
      <style>{css}</style>
      <nav className="aikova-admins-nav">
        <Link href="/os/portal" className="aikova-admins-brand">
          Ai<span>KOVA</span>
        </Link>
        <div style={{ display: 'flex', gap: 14 }}>
          <Link href="/os/portal">Portal</Link>
          <Link href="/os/crm?role=admin">Admin entrance</Link>
          <button type="button" onClick={() => signOut().then(() => router.replace('/os/login'))}>
            Sign out
          </button>
        </div>
      </nav>

      <div className="aikova-admins-body">
        <p className="aikova-admins-kicker">ADMIN CREDENTIALS</p>
        <h1 className="aikova-admins-title">Manage admin users.</h1>
        <p className="aikova-admins-lede">
          Create login credentials for other Admin entrance users. They can sign in with email +
          password and open the Admin CRM.
        </p>

        <div className="aikova-admins-grid">
          <div className="aikova-admins-card">
            <h2>Create admin credentials</h2>
            <div className="aikova-admins-form">
              <input
                className="aikova-admins-input"
                placeholder="Full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              <input
                className="aikova-admins-input"
                placeholder="Email"
                autoCapitalize="none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                className="aikova-admins-input"
                type="password"
                placeholder="Temporary password (min 8)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {error ? <p className="aikova-admins-error">{error}</p> : null}
              {ok ? <p className="aikova-admins-ok">{ok}</p> : null}
              <button type="button" className="aikova-admins-btn" disabled={busy} onClick={onCreate}>
                {busy ? 'Saving…' : 'Create / update admin'}
              </button>
            </div>
          </div>

          <div className="aikova-admins-card">
            <h2>Admin users ({admins.length})</h2>
            {admins.length === 0 ? (
              <p className="aikova-admins-muted">No admins loaded yet.</p>
            ) : (
              admins.map((a) => (
                <div key={a.id} className="aikova-admins-row">
                  <div>
                    <div className="aikova-admins-email">{a.email}</div>
                    <div className="aikova-admins-muted">{a.full_name || 'Admin'}</div>
                  </div>
                  <div className="aikova-admins-muted">
                    {a.created_at ? new Date(a.created_at).toLocaleDateString() : ''}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
