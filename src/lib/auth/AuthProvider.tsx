import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { getSupabase } from '../supabase';
import { env, isSupabaseConfigured } from '../../config/env';
import { exchangeGoogleCredential, obtainGoogleIdToken } from './googleSignIn';

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  configured: boolean;
  signInWithPassword: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const configured = isSupabaseConfigured();

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) {
      setLoading(false);
      return;
    }

    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session ?? null);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      loading,
      configured,
      signInWithPassword: async (email, password) => {
        const supabase = getSupabase();
        if (!supabase) throw new Error('Supabase not configured');
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      },
      signInWithGoogle: async () => {
        const supabase = getSupabase();
        if (!supabase) throw new Error('Supabase not configured');
        const clientId =
          env.googleClientId ||
          process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID ||
          '';
        if (!clientId) {
          throw new Error(
            'Google Client ID missing. Set EXPO_PUBLIC_GOOGLE_CLIENT_ID and rebuild.',
          );
        }

        const idToken = await obtainGoogleIdToken(clientId);
        const tokens = await exchangeGoogleCredential(idToken);
        const { error } = await supabase.auth.setSession({
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
        });
        if (error) throw error;
      },
      signOut: async () => {
        const supabase = getSupabase();
        if (supabase) await supabase.auth.signOut();
      },
    }),
    [session, loading, configured],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
