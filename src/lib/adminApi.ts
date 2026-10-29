import { env } from '../config/env';
import { getSupabase } from './supabase';

function apiBase(): string {
  const base = (env.apiBaseUrl || '').replace(/\/$/, '');
  if (!base && typeof window !== 'undefined') return window.location.origin;
  return base || 'https://aikova.co.uk';
}

async function authHeader(): Promise<Record<string, string>> {
  const supabase = getSupabase();
  if (!supabase) return {};
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${apiBase()}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(await authHeader()),
      ...(init?.headers || {}),
    },
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.error) {
    throw new Error(json.error || `Request failed (${res.status})`);
  }
  return json.data as T;
}

export function getAdminStatus() {
  return api<{ claimed: boolean; count: number; claimOpen: boolean }>(
    '/auth/admins/status',
  );
}

export function claimAdmin(input: {
  email: string;
  password: string;
  full_name?: string;
  claim_secret?: string;
}) {
  return api<{
    created: boolean;
    email: string;
    access_token: string;
    refresh_token: string;
    expires_in?: number;
    user?: unknown;
  }>('/auth/claim-admin', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function listAdmins() {
  return api<
    Array<{
      id: string;
      email: string;
      full_name: string;
      created_at?: string;
      last_sign_in_at?: string;
    }>
  >('/auth/admins');
}

export function createAdmin(input: {
  email: string;
  password: string;
  full_name?: string;
}) {
  return api<{ created: boolean; email: string }>('/auth/admins', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}
