import { StyleSheet, Text, View } from 'react-native';
import { FoundationStatus } from '../../src/components/FoundationStatus';
import { OsShell } from '../../src/components/os/OsShell';
import { colors, fonts } from '../../src/theme/colors';

const metrics = [
  { label: 'Open pipeline', value: '—' },
  { label: 'Active clients', value: '—' },
  { label: 'Case studies', value: '6' },
  { label: 'System', value: 'LIVE' },
];

export default function OsDashboard() {
  return (
    <OsShell
      activeHref="/os"
      title="Dashboard"
      subtitle="Portfolio CRM vault. Metrics hydrate when Supabase credentials arrive."
    >
      <View style={styles.grid}>
        {metrics.map((m) => (
          <View key={m.label} style={styles.card}>
            <Text style={styles.label}>{m.label}</Text>
            <Text style={styles.value}>{m.value}</Text>
          </View>
        ))}
      </View>
      <FoundationStatus />
    </OsShell>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 12,
  },
  card: {
    flexGrow: 1,
    minWidth: 140,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: 18,
    gap: 8,
  },
  label: {
    fontFamily: fonts.mono,
    fontSize: 11,
    letterSpacing: 0.8,
    color: colors.muted,
  },
  value: {
    fontFamily: fonts.displaySemi,
    fontSize: 28,
    color: colors.text,
  },
});
