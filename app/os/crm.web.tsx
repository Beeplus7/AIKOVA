import { Redirect } from 'expo-router';
import AdminCrmApp from '../../src/crm/AdminCrmApp.web';
import { useAuth } from '../../src/lib/auth/AuthProvider';

/** Full Admin CRM OS (web). Requires Supabase session. */
export default function OsCrmScreen() {
  const { user, loading, configured } = useAuth();

  if (loading) {
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
        Loading CRM…
      </div>
    );
  }

  if (!configured || !user) {
    return <Redirect href="/os/login" />;
  }

  return <AdminCrmApp />;
}
