import { StyleSheet, Text, View } from 'react-native';
import { MarketingShell } from '../src/components/marketing/MarketingShell';
import { colors, fonts } from '../src/theme/colors';

/** Native fallback — full Solutions + Industry Playbook is web: solutions.web.tsx */
const playbook = [
  { title: 'VisaGuide OS', tag: 'Property & Immigration' },
  { title: 'Vexo Garage OS', tag: 'Garage & Automotive' },
  { title: 'TradeFlow OS', tag: 'FinTech / Trading' },
  { title: 'ReelStorm OS', tag: 'AI Production' },
  { title: 'Arole Adjo OS', tag: 'Cultural Commerce' },
  { title: 'Road Angel OS', tag: 'Logistics / Fleet' },
];

export default function SolutionsScreen() {
  return (
    <MarketingShell activeHref="/solutions">
      <Text style={styles.kicker}>SOLUTIONS + INDUSTRY PLAYBOOK</Text>
      <Text style={styles.title}>Solutions engineered for industries</Text>
      <Text style={styles.support}>
        Open on web for the full playbook — six industry OS maps, problem-type
        solutions, and intake assessment.
      </Text>
      <View style={styles.grid}>
        {playbook.map((item) => (
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
