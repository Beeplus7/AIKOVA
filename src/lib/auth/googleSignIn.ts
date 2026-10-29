import { Platform } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';
import { env } from '../../config/env';

WebBrowser.maybeCompleteAuthSession();

function apiBase(): string {
  const base = (env.apiBaseUrl || '').replace(/\/$/, '');
  if (!base && typeof window !== 'undefined') return window.location.origin;
  return base || 'https://aikova.co.uk';
}

function loadGis(): Promise<void> {
  if (typeof window === 'undefined') return Promise.reject(new Error('web only'));
  const w = window as Window & { google?: any };
  if (w.google?.accounts?.id) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-aikova-gis]');
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('GIS load failed')));
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.dataset.aikovaGis = '1';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('GIS load failed'));
    document.head.appendChild(script);
  });
}

/** Web: Google Identity Services → id_token (needs JS origin only). */
async function googleIdTokenWeb(clientId: string): Promise<string> {
  await loadGis();
  const google = (window as Window & { google: any }).google;
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Google sign-in timed out')), 120000);
    let host: HTMLDivElement | null = null;
    const cleanup = () => {
      if (host) host.remove();
      host = null;
    };
    google.accounts.id.initialize({
      client_id: clientId,
      callback: (response: { credential?: string }) => {
        clearTimeout(timeout);
        cleanup();
        if (!response?.credential) {
          reject(new Error('No Google credential returned'));
          return;
        }
        resolve(response.credential);
      },
      auto_select: false,
      cancel_on_tap_outside: true,
    });
    google.accounts.id.prompt((notification: {
      isNotDisplayed?: () => boolean;
      isSkippedMoment?: () => boolean;
    }) => {
      if (notification?.isNotDisplayed?.() || notification?.isSkippedMoment?.()) {
        host = document.createElement('div');
        host.style.position = 'fixed';
        host.style.inset = '0';
        host.style.background = 'rgba(0,0,0,0.55)';
        host.style.display = 'flex';
        host.style.alignItems = 'center';
        host.style.justifyContent = 'center';
        host.style.zIndex = '99999';
        const card = document.createElement('div');
        card.style.background = '#111';
        card.style.padding = '24px';
        card.style.borderRadius = '12px';
        const btn = document.createElement('div');
        card.appendChild(btn);
        const cancel = document.createElement('button');
        cancel.textContent = 'Cancel';
        cancel.style.marginTop = '12px';
        cancel.style.width = '100%';
        cancel.onclick = () => {
          clearTimeout(timeout);
          cleanup();
          reject(new Error('Google sign-in cancelled'));
        };
        card.appendChild(cancel);
        host.appendChild(card);
        document.body.appendChild(host);
        google.accounts.id.renderButton(btn, {
          theme: 'outline',
          size: 'large',
          width: 280,
          text: 'continue_with',
        });
      }
    });
  });
}

export async function exchangeGoogleCredential(idToken: string) {
  const res = await fetch(`${apiBase()}/auth/google`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id_token: idToken }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.error) {
    throw new Error(json.error || `Google exchange failed (${res.status})`);
  }
  return json.data as {
    access_token: string;
    refresh_token: string;
    expires_in?: number;
    expires_at?: number;
    user?: unknown;
  };
}

/**
 * Obtain a Google ID token then exchange it for a Supabase session via the VPS API.
 * Web uses GIS (authorized JavaScript origins already set). Native uses AuthSession.
 */
export async function obtainGoogleIdToken(clientId: string): Promise<string> {
  if (Platform.OS === 'web') {
    return googleIdTokenWeb(clientId);
  }

  // Native path — requires matching iOS/Android client IDs in Google Cloud for production builds.
  const redirectUri = makeRedirectUri({ scheme: 'aikova', path: 'os/login' });
  const discovery = {
    authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenEndpoint: 'https://oauth2.googleapis.com/token',
    revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
  };
  // Dynamic import pattern avoided; use AuthRequest via providers helper by constructing request.
  const AuthSession = await import('expo-auth-session');
  const request = new AuthSession.AuthRequest({
    clientId,
    redirectUri,
    scopes: ['openid', 'profile', 'email'],
    responseType: AuthSession.ResponseType.IdToken,
    usePKCE: false,
    extraParams: { nonce: String(Date.now()) },
  });
  const result = await request.promptAsync(discovery);
  if (result.type !== 'success') {
    throw new Error('Google sign-in cancelled');
  }
  const idToken = (result.params as { id_token?: string }).id_token;
  if (!idToken) throw new Error('No id_token from Google');
  return idToken;
}

// Keep Google provider import referenced for Metro tree (native builds).
void Google;
