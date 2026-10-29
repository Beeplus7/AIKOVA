import { StyleSheet, Text, View } from 'react-native';
import { MarketingShell } from '../src/components/marketing/MarketingShell';
import { colors, fonts } from '../src/theme/colors';

/** Native fallback — full services UI is web: services.web.tsx */
const pillars = [
  {
    title: 'Cloud OS',
    body: 'AWS-native, serverless-first delivery from OL8 to global edge.',
  },
  {
    title: 'Payment OS',
    body: 'PCI DSS vaulted abstraction — one API, any processor.',
  },
  {
    title: 'Industrial OS',
    body: 'Garage OS, trade counters, workshop telemetry that ships.',
  },
  {
    title: 'AI Production OS',
    body: 'Claude MCP, DashScope, vector search — AI that earns its keep.',
  },
];

export default function ServicesScreen() {
  return (
    <MarketingShell activeHref="/services">
      <Text style={styles.kicker}>SERVICES</Text>
      <Text style={styles.title}>Comprehensive engineering vault</Text>
      <Text style={styles.support}>
        Open on web for the full comprehensive services map — cloud, payments,
        industrial, and AI production OS pillars.
      </Text>
      <View style={styles.grid}>
        {pillars.map((item) => (
          <View key={item.title} style={styles.card}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardBody}>{item.body}</Text>
          </View>
        ))}
      </View>
    </MarketingShell>
  );
}

const styles = StyleSheet.create({
  kicker: {
    fontFamily: fonts.mono,
    fontSize: 11,
    letterSpacing: 1.2,
    color: colors.blue,
    marginBottom: 8,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 36,
    letterSpacing: -0.8,
    color: colors.text,
    marginBottom: 12,
  },
  support: {
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 23,
    color: colors.muted,
    maxWidth: 560,
    marginBottom: 28,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    flexGrow: 1,
    minWidth: 240,
    maxWidth: 360,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: 18,
    gap: 8,
  },
  cardTitle: {
    fontFamily: fonts.headingSemi,
    fontSize: 16,
    color: colors.text,
  },
  cardBody: {
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 20,
    color: colors.muted,
  },
});
