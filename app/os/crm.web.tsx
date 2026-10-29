import { Component, useEffect, useMemo, useState, type ErrorInfo, type ReactNode } from 'react';
import { Redirect, useLocalSearchParams } from 'expo-router';
import AdminCrmApp from '../../src/crm/AdminCrmApp.web';
import UserDashboardApp from '../../src/crm/UserDashboardApp.web';
import { useAuth } from '../../src/lib/auth/AuthProvider';
import { isAdminUser } from '../../src/lib/auth/roles';

class CrmErrorBoundary extends Component<
  { children: ReactNode },
  { error: Error | null }
> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('CRM crash', error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            minHeight: '100vh',
            background: '#05070D',
            color: '#E6E8EF',
            fontFamily: 'Inter, system-ui, sans-serif',
            padding: 32,
          }}
        >
          <h1 style={{ fontFamily: 'Sora, system-ui', fontSize: 24, marginBottom: 8 }}>
            Admin CRM hit an error
          </h1>
          <p style={{ color: '#8B9BB4', marginBottom: 16 }}>
            {this.state.error.message}
          </p>
          <button
            type="button"
            onClick={() => {
              this.setState({ error: null });
              window.location.reload();
            }}
            style={{
              border: 0,
              borderRadius: 12,
              padding: '12px 16px',
              background: '#0EA5FF',
              color: '#05070D',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Reload Admin CRM
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

/** Full Admin/User CRM OS (web). Requires Supabase session. No OS sidebar. */
export default function OsCrmScreen() {
  const { user, loading, configured } = useAuth();
  const params = useLocalSearchParams<{ role?: string }>();
  const [ready, setReady] = useState(false);
  const isAdmin = isAdminUser(user);

  const requestedRole = useMemo<"admin" | "user">(() => {
    return params.role === 'user' ? 'user' : 'admin';
  }, [params.role]);

  // Non-admins can never open Admin entrance — force Users entrance.
  const initialRole = isAdmin ? requestedRole : 'user';

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 50);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    // Allow CRM to scroll (expo-reset sets body overflow:hidden)
    const html = document.documentElement;
    const body = document.body;
    const prevHtml = html.style.overflow;
    const prevBody = body.style.overflow;
    const prevBg = body.style.background;
    html.style.overflow = 'auto';
    body.style.overflow = 'auto';
    body.style.background = '#05070D';
    if (!document.querySelector('script[data-aikova-crm-tw]')) {
      const s = document.createElement('script');
      s.src = 'https://cdn.tailwindcss.com';
      s.dataset.aikovaCrmTw = '1';
      document.head.appendChild(s);
    }
    return () => {
      html.style.overflow = prevHtml;
      body.style.overflow = prevBody;
      body.style.background = prevBg;
    };
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

  if (!isAdmin && requestedRole === 'admin') {
    return <Redirect href="/os/portal" />;
  }

  return (
    <div style={{ minHeight: '100vh', width: '100%', background: '#05070D', color: '#E6E8EF' }}>
      <CrmErrorBoundary>
        {initialRole === 'user' ? (
          <UserDashboardApp key={`user-${user.id}`} />
        ) : (
          <AdminCrmApp
            key={`admin-${user.id}`}
            initialRole="admin"
            allowAdminView={isAdmin}
          />
        )}
      </CrmErrorBoundary>
    </div>
  );
}
