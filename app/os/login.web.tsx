import { useState } from 'react';
import { router } from 'expo-router';
import { OsShell } from '../../src/components/os/OsShell';
import { useAuth } from '../../src/lib/auth/AuthProvider';

const css = `
.aikova-login-panel {
  margin-top: 16px;
  border-radius: 14px;
  border: 1px solid rgba(255,255,255,0.1);
  background: rgba(255,255,255,0.05);
  padding: 20px;
}
.aikova-login-label {
  font-family: ui-monospace, monospace;
  font-size: 11px;
  letter-spacing: 1px;
  color: #0EA5FF;
  margin: 0 0 8px;
}
.aikova-login-value {
  font-size: 15px;
  line-height: 22px;
  margin: 0 0 12px;
}
.aikova-login-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.aikova-login-input {
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 10px;
  padding: 12px 14px;
  color: #fff;
  background: #05070D;
  font-size: 14px;
}
.aikova-login-row { display: flex; flex-wrap: wrap; gap: 10px; }
.aikova-login-primary {
  background: #84FF3D;
  color: #05070D;
  border: 0;
  border-radius: 10px;
  padding: 12px 16px;
  font-weight: 600;
  cursor: pointer;
}
.aikova-login-google, .aikova-login-ghost {
  border: 1px solid rgba(255,255,255,0.1);
  background: transparent;
  color: #fff;
  border-radius: 10px;
  padding: 12px 16px;
  font-weight: 600;
  cursor: pointer;
}
.aikova-login-error { color: #F87171; font-size: 13px; margin: 0; }
.aikova-login-disabled { opacity: 0.5; pointer-events: none; }
.aikova-login-status {
  margin-top: 28px;
  padding: 20px;
  border-radius: 16px;
  border: 1px solid rgba(255,255,255,0.1);
  background: rgba(255,255,255,0.05);
}
.aikova-login-status h3 { margin: 0 0 8px; font-size: 18px; }
.aikova-login-status p { margin: 0 0 10px; color: #8B9BB4; font-size: 14px; line-height: 21px; }
.aikova-login-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 10px;
  background: #84FF3D;
}
`;

export default function OsLoginScreen() {
  const { configured, user, loading, signInWithPassword, signInWithGoogle, signOut } =
    useAuth();
  const [email, setEmail] = useState('admin@aikova.co.uk');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onEmailLogin = async () => {
    setBusy(true);
    setError(null);
    try {
      await signInWithPassword(email.trim(), password);
      router.replace('/os/crm');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Sign-in failed');
    } finally {
      setBusy(false);
    }
  };

  const onGoogle = async () => {
    setBusy(true);
    setError(null);
    try {
      await signInWithGoogle();
      router.replace('/os/crm');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Google sign-in failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <OsShell
      activeHref="/os/login"
      title="Login to OS"
      subtitle="Supabase Auth · email + Google (VPS exchange)"
    >
      <style>{css}</style>
      <div className="aikova-login-panel">
        <p className="aikova-login-label">SESSION</p>
        <p className="aikova-login-value">
          {loading
            ? 'Checking…'
            : user
              ? `Signed in as ${user.email ?? user.id}`
              : configured
                ? 'Ready — sign in below'
                : 'Waiting for Supabase credentials'}
        </p>

        {user ? (
          <div className="aikova-login-row">
            <button
              type="button"
              className="aikova-login-primary"
              onClick={() => router.replace('/os/crm')}
            >
              Open CRM
            </button>
            <button type="button" className="aikova-login-ghost" onClick={() => signOut()}>
              Sign out
            </button>
          </div>
        ) : (
          <div className={`aikova-login-form ${!configured || busy ? 'aikova-login-disabled' : ''}`}>
            <input
              className="aikova-login-input"
              autoCapitalize="none"
              autoComplete="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="aikova-login-input"
              type="password"
              autoComplete="current-password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error ? <p className="aikova-login-error">{error}</p> : null}
            <button type="button" className="aikova-login-primary" onClick={onEmailLogin}>
              {busy ? 'Signing in…' : 'Sign in with email'}
            </button>
            <button type="button" className="aikova-login-google" onClick={onGoogle}>
              Continue with Google
            </button>
          </div>
        )}
      </div>

      <div className="aikova-login-status">
        <p className="aikova-login-label">FOUNDATION · CREDENTIALS</p>
        <h3>Backend readiness</h3>
        <p>Supabase Auth and the CRM API are live on aikova.co.uk.</p>
        <p><span className="aikova-login-dot" />Supabase · READY</p>
        <p><span className="aikova-login-dot" />GitHub · READY</p>
        <p><span className="aikova-login-dot" />VPS / API · READY</p>
      </div>
    </OsShell>
  );
}
