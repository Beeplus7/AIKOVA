import Constants from 'expo-constants';

/**
 * AiKOVA environment config.
 * Public values come from Expo extra / EXPO_PUBLIC_*.
 * Server-only secrets never enter the client; only readiness flags do.
 */

export type CredentialGroup = 'supabase' | 'github' | 'vps';

export type CredentialStatus = {
  group: CredentialGroup;
  label: string;
  ready: boolean;
  missing: string[];
};

type Extra = {
  supabaseUrl?: string;
  supabaseAnonKey?: string;
  apiBaseUrl?: string;
  appUrl?: string;
  googleClientId?: string;
  githubOwner?: string;
  githubRepo?: string;
  credentials?: {
    supabase?: boolean;
    github?: boolean;
    vps?: boolean;
  };
};

const extra = (Constants.expoConfig?.extra ??
  (Constants as { manifest?: { extra?: Extra } }).manifest?.extra ??
  {}) as Extra;

/** Keep direct process.env reads so Metro inlines EXPO_PUBLIC_* at export time. */
const PUBLIC_SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const PUBLIC_SUPABASE_ANON = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';
const PUBLIC_API_BASE = process.env.EXPO_PUBLIC_API_BASE_URL ?? '';
const PUBLIC_APP_URL = process.env.EXPO_PUBLIC_APP_URL ?? '';
const PUBLIC_GOOGLE_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID ?? '';

/** Public OAuth web client — safe fallback if export omits env inlining. */
const GOOGLE_WEB_CLIENT_FALLBACK =
  '770227496005-mnhg2n37tk2n1o4efmihoj2vlhpijhc8.apps.googleusercontent.com';

const pick = (...values: Array<string | undefined>) => {
  for (const value of values) {
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  return '';
};

export const env = {
  supabaseUrl: pick(PUBLIC_SUPABASE_URL, extra.supabaseUrl),
  supabaseAnonKey: pick(PUBLIC_SUPABASE_ANON, extra.supabaseAnonKey),
  apiBaseUrl: pick(PUBLIC_API_BASE, extra.apiBaseUrl, 'https://aikova.co.uk'),
  appUrl: pick(PUBLIC_APP_URL, extra.appUrl, 'https://aikova.co.uk'),
  googleClientId: pick(
    PUBLIC_GOOGLE_CLIENT_ID,
    extra.googleClientId,
    GOOGLE_WEB_CLIENT_FALLBACK,
  ),
  githubOwner: extra.githubOwner ?? '',
  githubRepo: extra.githubRepo ?? '',
} as const;

const flags = extra.credentials ?? {};

export function getCredentialStatuses(): CredentialStatus[] {
  const supabaseReady =
    flags.supabase ?? Boolean(env.supabaseUrl && env.supabaseAnonKey);
  const githubReady = flags.github ?? false;
  const vpsReady = flags.vps ?? false;

  return [
    {
      group: 'supabase',
      label: 'Supabase',
      ready: supabaseReady,
      missing: supabaseReady
        ? []
        : ['EXPO_PUBLIC_SUPABASE_URL', 'EXPO_PUBLIC_SUPABASE_ANON_KEY'],
    },
    {
      group: 'github',
      label: 'GitHub',
      ready: githubReady,
      missing: githubReady ? [] : ['GITHUB_OWNER', 'GITHUB_REPO'],
    },
    {
      group: 'vps',
      label: 'VPS / API',
      ready: vpsReady,
      missing: vpsReady
        ? []
        : ['VPS_HOST', 'VPS_USER', 'EXPO_PUBLIC_API_BASE_URL'],
    },
  ];
}

export function isFoundationReady(): boolean {
  return getCredentialStatuses().every((s) => s.ready);
}

export function isSupabaseConfigured(): boolean {
  return Boolean(env.supabaseUrl && env.supabaseAnonKey);
}
