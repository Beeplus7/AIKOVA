import { StyleSheet, Text, View } from 'react-native';
import { MarketingShell } from '../src/components/marketing/MarketingShell';
import { colors, fonts } from '../src/theme/colors';

/** Mirrors Portfolio OS Built product set (full UI is web: portfolio.web.tsx). */
const projects = [
  { title: 'VisaGuide OS', tag: 'Cloud OS' },
  { title: 'ReelStorm OS', tag: 'AI Production OS' },
  { title: 'Vexo Garage OS', tag: 'Industrial OS' },
  { title: 'TradeFlow OS', tag: 'FinTech OS' },
  { title: 'Arole Adjo OS', tag: 'Commerce' },
  { title: 'Road Angel OS', tag: 'Industrial OS' },
];

export default function PortfolioScreen() {
  return (
    <MarketingShell activeHref="/portfolio">
      <Text style={styles.kicker}>PORTFOLIO</Text>
      <Text style={styles.title}>Projects delivered</Text>
      <Text style={styles.support}>
        Public case studies auto-populate from CRM lead tags once Supabase is
        connected.
      </Text>
      <View style={styles.grid}>
        {projects.map((item) => (
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
    minWidth: 260,
    maxWidth: 360,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: 18,
    gap: 10,
  },
  tag: {
    fontFamily: fonts.mono,
    fontSize: 11,
    letterSpacing: 1,
    color: colors.green,
  },
  cardTitle: {
    fontFamily: fonts.headingSemi,
    fontSize: 16,
    lineHeight: 22,
    color: colors.text,
  },
});
