import type { User } from '@supabase/supabase-js';

/** True when Supabase app/user metadata marks the account as Admin entrance. */
export function isAdminUser(user: User | null | undefined): boolean {
  if (!user) return false;
  const app = (user.app_metadata || {}) as Record<string, unknown>;
  const meta = (user.user_metadata || {}) as Record<string, unknown>;
  const roles = []
    .concat((app.roles as string[]) || [])
    .concat((meta.roles as string[]) || [])
    .map((r) => String(r).toLowerCase());
  return (
    app.role === 'admin' ||
    meta.role === 'admin' ||
    roles.includes('admin') ||
    app.access === 'admin'
  );
}
