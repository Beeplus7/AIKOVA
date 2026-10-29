import { StyleSheet, Text, View } from 'react-native';
import { getCredentialStatuses } from '../config/env';
import { colors, fonts } from '../theme/colors';

/** Shows which deploy credentials are still waiting (Supabase / GitHub / VPS). */
export function FoundationStatus() {
  const statuses = getCredentialStatuses();

  return (
    <View style={styles.wrap}>
      <Text style={styles.kicker}>FOUNDATION · CREDENTIALS</Text>
      <Text style={styles.title}>Backend readiness</Text>
      <Text style={styles.body}>
        Supabase, GitHub, and VPS flags come from `.env`. Google OAuth also needs the
        provider enabled in the Supabase Auth dashboard for this project.
      </Text>
      {statuses.map((s) => (
        <View key={s.group} style={styles.row}>
          <View
            style={[
              styles.dot,
              { backgroundColor: s.ready ? colors.green : colors.blue },
            ]}
          />
          <View style={styles.rowText}>
            <Text style={styles.label}>
              {s.label} · {s.ready ? 'READY' : 'WAITING'}
            </Text>
            {!s.ready && s.missing.length > 0 ? (
              <Text style={styles.missing}>{s.missing.join(' · ')}</Text>
            ) : null}
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: 28,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    gap: 10,
  },
  kicker: {
    fontFamily: fonts.mono,
    fontSize: 11,
    letterSpacing: 1.2,
    color: colors.green,
  },
  title: {
    fontFamily: fonts.displaySemi,
    fontSize: 18,
    color: colors.text,
  },
  body: {
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 21,
    color: colors.muted,
    marginBottom: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
  },
  rowText: { flex: 1, gap: 2 },
  label: {
    fontFamily: fonts.bodySemi,
    fontSize: 14,
    color: colors.text,
  },
  missing: {
    fontFamily: fonts.mono,
    fontSize: 11,
    color: colors.textDim,
  },
});
