import { useEffect, useMemo, useState } from 'react';
import { Redirect, useLocalSearchParams } from 'expo-router';
import AdminCrmApp from '../../src/crm/AdminCrmApp.web';
import { useAuth } from '../../src/lib/auth/AuthProvider';

/** Full Admin/User CRM OS (web). Requires Supabase session. No OS sidebar. */
export default function OsCrmScreen() {
  const { user, loading, configured } = useAuth();
  const params = useLocalSearchParams<{ role?: string }>();
  const [ready, setReady] = useState(false);

  const initialRole = useMemo<"admin" | "user">(() => {
    return params.role === 'user' ? 'user' : 'admin';
  }, [params.role]);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 50);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (!document.querySelector('script[data-aikova-crm-tw]')) {
      const s = document.createElement('script');
      s.src = 'https://cdn.tailwindcss.com';
      s.dataset.aikovaCrmTw = '1';
      document.head.appendChild(s);
    }
  }, []);

  if (loading || !ready) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          background: '#05070D',
          color: '#8B9BB4',
          fontFamily: 'Inter, system-ui, sans-serif',
        }}
      >
        Opening CRM…
      </div>
    );
  }

  if (!configured || !user) {
    return <Redirect href="/os/login" />;
  }

  return (
    <div style={{ minHeight: '100vh', background: '#05070D' }}>
      <AdminCrmApp key={initialRole} initialRole={initialRole} />
    </div>
  );
}
