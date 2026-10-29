import { useEffect, useState } from 'react';
import { Link, router } from 'expo-router';
import { useAuth } from '../../src/lib/auth/AuthProvider';

const css = `
.aikova-auth {
  min-height: 100vh;
  background: #05070D;
  color: #fff;
  font-family: Inter, system-ui, sans-serif;
  display: flex;
  flex-direction: column;
}
.aikova-auth-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 24px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}
.aikova-auth-brand {
  font-family: Sora, system-ui, sans-serif;
  font-weight: 800;
  font-size: 18px;
  letter-spacing: -0.02em;
  color: #fff;
  text-decoration: none;
}
.aikova-auth-brand span { color: #84FF3D; }
.aikova-auth-nav a {
  color: #8B9BB4;
  text-decoration: none;
  font-size: 13px;
  font-weight: 600;
}
.aikova-auth-body {
  flex: 1;
  display: grid;
  place-items: center;
  padding: 32px 16px 48px;
}
.aikova-auth-card {
  width: min(440px, 100%);
  border-radius: 20px;
  border: 1px solid rgba(255,255,255,0.1);
  background: rgba(255,255,255,0.04);
  padding: 28px;
}
.aikova-auth-kicker {
  font-family: ui-monospace, monospace;
  font-size: 11px;
  letter-spacing: 1.6px;
  color: #84FF3D;
  margin: 0 0 10px;
}
.aikova-auth-title {
  font-family: Sora, system-ui, sans-serif;
  font-weight: 700;
  font-size: 30px;
  letter-spacing: -0.04em;
  margin: 0 0 8px;
}
.aikova-auth-lede {
  color: #8B9BB4;
  font-size: 14px;
  line-height: 21px;
  margin: 0 0 22px;
}
.aikova-auth-form { display: flex; flex-direction: column; gap: 10px; }
.aikova-auth-input {
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 12px;
  padding: 13px 14px;
  background: #05070D;
  color: #fff;
  font-size: 14px;
}
.aikova-auth-primary {
  background: #84FF3D;
  color: #05070D;
  border: 0;
  border-radius: 12px;
  padding: 13px 16px;
  font-weight: 700;
  cursor: pointer;
}
.aikova-auth-google {
  border: 1px solid rgba(255,255,255,0.14);
  background: transparent;
  color: #fff;
  border-radius: 12px;
  padding: 13px 16px;
  font-weight: 700;
  cursor: pointer;
}
.aikova-auth-or {
  text-align: center;
  color: #64748B;
  font-size: 12px;
  margin: 4px 0;
}
.aikova-auth-error { color: #F87171; font-size: 13px; margin: 0; }
.aikova-auth-disabled { opacity: 0.55; pointer-events: none; }
.aikova-auth-doors {
  display: grid;
  gap: 10px;
  margin-top: 8px;
}
.aikova-auth-door {
  display: block;
  text-decoration: none;
  border-radius: 14px;
  border: 1px solid rgba(255,255,255,0.12);
  background: rgba(255,255,255,0.03);
  padding: 16px;
  color: #fff;
}
.aikova-auth-door strong { display: block; font-size: 15px; margin-bottom: 4px; }
.aikova-auth-door span { color: #8B9BB4; font-size: 12px; line-height: 18px; }
.aikova-auth-door.admin { border-color: rgba(14,165,255,0.35); }
.aikova-auth-door.user { border-color: rgba(132,255,61,0.35); }
.aikova-auth-meta { margin-top: 14px; color: #64748B; font-size: 12px; }
.aikova-auth-ghost {
  margin-top: 12px;
  border: 1px solid rgba(255,255,255,0.12);
  background: transparent;
  color: #fff;
  border-radius: 12px;
  padding: 12px 16px;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
}
`;

export default function OsLoginScreen() {
  const { configured, user, loading, signInWithPassword, signInWithGoogle, signOut } =
    useAuth();
  const [email, setEmail] = useState('admin@aikova.co.uk');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && user) {
      // Land on dual-entrance portal, not nested OS shell
      router.replace('/os/portal');
    }
  }, [loading, user]);

  const onEmailLogin = async () => {
    setBusy(true);
    setError(null);
    try {
      await signInWithPassword(email.trim(), password);
      router.replace('/os/portal');
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
      router.replace('/os/portal');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Google sign-in failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="aikova-auth">
      <style>{css}</style>
      <nav className="aikova-auth-nav">
        <Link href="/" className="aikova-auth-brand">
          Ai<span>KOVA</span>
        </Link>
        <Link href="/">← Marketing</Link>
      </nav>

      <div className="aikova-auth-body">
        <div className="aikova-auth-card">
          <p className="aikova-auth-kicker">PORTAL · DUAL ACCESS</p>
          <h1 className="aikova-auth-title">Sign in.</h1>
          <p className="aikova-auth-lede">
            One login. Two entrances — Admin entrance and Users entrance.
          </p>

          {loading ? (
            <p className="aikova-auth-meta">Checking session…</p>
          ) : user ? (
            <>
              <p className="aikova-auth-meta">Signed in as {user.email ?? user.id}</p>
              <div className="aikova-auth-doors">
                <Link href="/os/crm?role=admin" className="aikova-auth-door admin">
                  <strong>01 · Admin entrance</strong>
                  <span>Captain CRM — leads, pipeline, tickets, DOS7 evidence.</span>
                </Link>
                <Link href="/os/crm?role=user" className="aikova-auth-door user">
                  <strong>02 · Users entrance</strong>
                  <span>Client portal — projects, tickets, chat with Captain.</span>
                </Link>
              </div>
              <button type="button" className="aikova-auth-ghost" onClick={() => signOut()}>
                Sign out
              </button>
            </>
          ) : (
            <div className={`aikova-auth-form ${!configured || busy ? 'aikova-auth-disabled' : ''}`}>
              <button type="button" className="aikova-auth-google" onClick={onGoogle}>
                Continue with Google
              </button>
              <p className="aikova-auth-or">or email</p>
              <input
                className="aikova-auth-input"
                autoCapitalize="none"
                autoComplete="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                className="aikova-auth-input"
                type="password"
                autoComplete="current-password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {error ? <p className="aikova-auth-error">{error}</p> : null}
              <button type="button" className="aikova-auth-primary" onClick={onEmailLogin}>
                {busy ? 'Signing in…' : 'Sign in with email'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
