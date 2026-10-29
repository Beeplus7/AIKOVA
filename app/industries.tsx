import { StyleSheet, Text, View } from 'react-native';
import { MarketingShell } from '../src/components/marketing/MarketingShell';
import { colors, fonts } from '../src/theme/colors';

/** Native fallback — full Industries We Serve UI is web: industries.web.tsx */
const industries = [
  { title: 'Heavy Industry / Manufacturing', tag: 'Twin SOP · MES' },
  { title: 'Prop Trading', tag: 'Guardian Risk · FinTech' },
  { title: 'Legal / MSA', tag: 'Evidence Vault' },
  { title: 'Logistics / Fleet', tag: 'Dispatch · IoT' },
  { title: 'Healthcare', tag: 'Interop · Compliance' },
  { title: 'Retail Supply', tag: 'Predictive Replenishment' },
];

export default function IndustriesScreen() {
  return (
    <MarketingShell activeHref="/industries">
      <Text style={styles.kicker}>INDUSTRIES WE SERVE</Text>
      <Text style={styles.title}>Where AI becomes infrastructure</Text>
      <Text style={styles.support}>
        Open on web for the full Industries We Serve map — problem → AI way → OS
        built, with tech and outcomes per vertical.
      </Text>
      <View style={styles.grid}>
        {industries.map((item) => (
          <View key={item.title} style={styles.card}>
            <Text style={styles.tag}>{item.tag}</Text>
            <Text style={styles.cardTitle}>{item.title}</Text>
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
  tag: {
    fontFamily: fonts.mono,
    fontSize: 10,
    letterSpacing: 0.8,
    color: colors.green,
  },
  cardTitle: {
    fontFamily: fonts.headingSemi,
    fontSize: 16,
    color: colors.text,
  },
});
