import { useEffect, useState } from 'react';
import { Link, router } from 'expo-router';
import { claimAdmin, getAdminStatus } from '../../src/lib/adminApi';
import { getSupabase } from '../../src/lib/supabase';

const css = `
.aikova-claim { min-height:100vh; background:#05070D; color:#fff; font-family:Inter,system-ui,sans-serif; }
.aikova-claim-nav { display:flex; justify-content:space-between; align-items:center; padding:18px 24px; border-bottom:1px solid rgba(255,255,255,.08); }
.aikova-claim-nav a { color:#8B9BB4; text-decoration:none; font-weight:600; font-size:13px; }
.aikova-claim-brand { font-family:Sora,system-ui,sans-serif; font-weight:800; font-size:18px; color:#fff; text-decoration:none; }
.aikova-claim-brand span { color:#84FF3D; }
.aikova-claim-body { max-width:480px; margin:0 auto; padding:40px 16px; }
.aikova-claim-kicker { font-family:ui-monospace,monospace; font-size:11px; letter-spacing:1.6px; color:#84FF3D; }
.aikova-claim-title { font-family:Sora,system-ui,sans-serif; font-size:32px; letter-spacing:-.04em; margin:8px 0; }
.aikova-claim-lede { color:#8B9BB4; font-size:14px; line-height:21px; margin:0 0 20px; }
.aikova-claim-card { border:1px solid rgba(255,255,255,.1); background:rgba(255,255,255,.04); border-radius:18px; padding:22px; display:flex; flex-direction:column; gap:10px; }
.aikova-claim-input { border:1px solid rgba(255,255,255,.12); border-radius:12px; padding:12px 14px; background:#05070D; color:#fff; }
.aikova-claim-btn { border:0; border-radius:12px; padding:13px 16px; background:#84FF3D; color:#05070D; font-weight:700; cursor:pointer; }
.aikova-claim-error { color:#F87171; font-size:13px; margin:0; }
.aikova-claim-meta { color:#64748B; font-size:12px; }
`;

export default function ClaimAdminScreen() {
  const [email, setEmail] = useState('olabamiji.kolabalogun@gmail.com');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('AiKOVA Admin');
  const [claimSecret, setClaimSecret] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<{ claimed: boolean; count: number } | null>(null);

  useEffect(() => {
    getAdminStatus()
      .then((s) => setStatus(s))
      .catch(() => setStatus({ claimed: false, count: 0 }));
  }, []);

  const onClaim = async () => {
    setBusy(true);
    setError(null);
    try {
      const data = await claimAdmin({
        email: email.trim(),
        password,
        full_name: fullName.trim(),
        claim_secret: claimSecret.trim() || undefined,
      });
      const supabase = getSupabase();
      if (supabase) {
        await supabase.auth.setSession({
          access_token: data.access_token,
          refresh_token: data.refresh_token,
        });
      }
      router.replace('/os/admins');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Claim failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="aikova-claim">
      <style>{css}</style>
      <nav className="aikova-claim-nav">
        <Link href="/" className="aikova-claim-brand">
          Ai<span>KOVA</span>
        </Link>
        <Link href="/os/login">Sign in</Link>
      </nav>
      <div className="aikova-claim-body">
        <p className="aikova-claim-kicker">CLAIM ADMIN</p>
        <h1 className="aikova-claim-title">Create admin credentials.</h1>
        <p className="aikova-claim-lede">
          Bootstrap the first Admin entrance login, or use your claim secret to mint another
          founder admin. After this you can create credentials for other admin users.
        </p>
        <p className="aikova-claim-meta">
          {status
            ? status.claimed
              ? `${status.count} admin(s) already claimed — secret required.`
              : 'No admin claimed yet — you can take ownership now.'
            : 'Checking admin status…'}
        </p>
        <div className="aikova-claim-card">
          <input
            className="aikova-claim-input"
            placeholder="Full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <input
            className="aikova-claim-input"
            placeholder="Admin email"
            autoCapitalize="none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="aikova-claim-input"
            type="password"
            placeholder="Password (min 8 chars)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {status?.claimed ? (
            <input
              className="aikova-claim-input"
              type="password"
              placeholder="Claim secret"
              value={claimSecret}
              onChange={(e) => setClaimSecret(e.target.value)}
            />
          ) : null}
          {error ? <p className="aikova-claim-error">{error}</p> : null}
          <button type="button" className="aikova-claim-btn" disabled={busy} onClick={onClaim}>
            {busy ? 'Creating…' : 'Claim Admin entrance'}
          </button>
        </div>
      </div>
    </div>
  );
}
