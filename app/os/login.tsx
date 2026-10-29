import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { FoundationStatus } from '../../src/components/FoundationStatus';
import { OsShell } from '../../src/components/os/OsShell';
import { useAuth } from '../../src/lib/auth/AuthProvider';
import { colors, fonts } from '../../src/theme/colors';

export default function OsLoginScreen() {
  const { configured, user, loading, signInWithPassword, signInWithGoogle, signOut } =
    useAuth();
  const [email, setEmail] = useState('admin@aikova.co.uk');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onEmailLogin = async () => {
    setBusy(true);
    setError(null);
    try {
      await signInWithPassword(email.trim(), password);
      router.replace('/os/crm');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Sign-in failed');
    } finally {
      setBusy(false);
    }
  };

  const onGoogle = async () => {
    setBusy(true);
    setError(null);
    try {
      await signInWithGoogle();
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : 'Google sign-in failed. Enable Google provider in Supabase Auth.',
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <OsShell
      activeHref="/os/login"
      title="Login to OS"
      subtitle="Supabase Auth · email ready · Google after provider enable"
    >
      <View style={styles.panel}>
        <Text style={styles.label}>SESSION</Text>
        <Text style={styles.value}>
          {loading
            ? 'Checking…'
            : user
              ? `Signed in as ${user.email ?? user.id}`
              : configured
                ? 'Ready — sign in below'
                : 'Waiting for Supabase credentials'}
        </Text>

        {user ? (
          <View style={styles.row}>
            <Pressable
              style={styles.primary}
              onPress={() => router.replace('/os/crm')}
            >
              <Text style={styles.primaryText}>Open CRM</Text>
            </Pressable>
            <Pressable style={styles.ghost} onPress={() => signOut()}>
              <Text style={styles.ghostText}>Sign out</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="Email"
              placeholderTextColor={colors.textDim}
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              style={styles.input}
              secureTextEntry
              placeholder="Password"
              placeholderTextColor={colors.textDim}
              value={password}
              onChangeText={setPassword}
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <Pressable
              style={[styles.primary, (!configured || busy) && styles.disabled]}
              disabled={!configured || busy}
              onPress={onEmailLogin}
            >
              {busy ? (
                <ActivityIndicator color="#05070D" />
              ) : (
                <Text style={styles.primaryText}>Sign in with email</Text>
              )}
            </Pressable>
            <Pressable
              style={[styles.google, (!configured || busy) && styles.disabled]}
              disabled={!configured || busy}
              onPress={onGoogle}
            >
              <Text style={styles.googleText}>Continue with Google</Text>
            </Pressable>
          </View>
        )}
      </View>
      <FoundationStatus />
    </OsShell>
  );
}

const styles = StyleSheet.create({
  panel: {
    marginTop: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: 20,
    gap: 12,
  },
  label: {
    fontFamily: fonts.mono,
    fontSize: 11,
    letterSpacing: 1,
    color: colors.blue,
  },
  value: {
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 22,
    color: colors.text,
  },
  form: { gap: 10, marginTop: 4 },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: colors.text,
    fontFamily: fonts.body,
    backgroundColor: colors.bg,
  },
  row: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  primary: {
    backgroundColor: colors.green,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  primaryText: {
    fontFamily: fonts.bodySemi,
    color: '#05070D',
    fontSize: 14,
  },
  google: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  googleText: {
    fontFamily: fonts.bodySemi,
    color: colors.text,
    fontSize: 14,
  },
  ghost: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  ghostText: { fontFamily: fonts.body, color: colors.muted },
  error: { fontFamily: fonts.body, color: '#F87171', fontSize: 13 },
  disabled: { opacity: 0.5 },
});
