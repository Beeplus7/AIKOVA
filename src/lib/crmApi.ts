import { env } from '../config/env';
import { getSupabase } from './supabase';

async function authHeader(): Promise<Record<string, string>> {
  const supabase = getSupabase();
  if (!supabase) return {};
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function actionsUrl(): string {
  const base = (env.apiBaseUrl || '').replace(/\/$/, '');
  // Same-origin in production (nginx proxies /actions → API)
  if (!base || typeof window !== 'undefined' && window.location.origin === base) {
    return '/actions';
  }
  return `${base}/actions`;
}

export async function crmAction<T = unknown>(
  action: string,
  args: Record<string, unknown> = {},
): Promise<T> {
  const res = await fetch(actionsUrl(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(await authHeader()),
    },
    body: JSON.stringify({ action, args }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.error) {
    throw new Error(json.error || `CRM action failed (${res.status})`);
  }
  return json.data as T;
}
