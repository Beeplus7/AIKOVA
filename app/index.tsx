import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { FoundationStatus } from '../src/components/FoundationStatus';
import { MarketingShell } from '../src/components/marketing/MarketingShell';
import { brandCopy, colors, fonts } from '../src/theme/colors';

const caseStudies = [
  {
    title: 'AI vision for precision manufacturing QA',
    tone: 'from blue',
  },
  {
    title: 'Autonomous trade document orchestration',
    tone: 'from green',
  },
  {
    title: 'Secure GovTech document intelligence',
    tone: 'vault',
  },
  {
    title: 'Digital twin for supply chain resilience',
    tone: 'depth',
  },
];

export default function HomeScreen() {
  return (
    <MarketingShell activeHref="/">
      <View style={styles.hero}>
        <Text style={styles.live}>SYSTEM LIVE — LONDON</Text>
        <Text style={styles.brand}>AiKOVA</Text>
        <Text style={styles.headline}>{brandCopy.primary}</Text>
        <Text style={styles.support}>
          Boutique senior team. Industrial-grade delivery. The engineering vault
          for AI systems — ISO 27001 · PCI DSS · DOS7 LOT 1.
        </Text>
        <View style={styles.actions}>
          <Link href="/contact" asChild>
            <Pressable style={styles.primaryBtn}>
              <Text style={styles.primaryBtnText}>Book a 48h architecture map</Text>
            </Pressable>
          </Link>
          <Link href="/portfolio" asChild>
            <Pressable style={styles.ghostBtn}>
              <Text style={styles.ghostBtnText}>View portfolio</Text>
            </Pressable>
          </Link>
        </View>
      </View>

      <View style={styles.slogans}>
        {[brandCopy.secondary, brandCopy.tertiary, brandCopy.vault].map(
          (line) => (
            <View key={line} style={styles.sloganCard}>
              <Text style={styles.sloganText}>{line}</Text>
            </View>
          ),
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionKicker}>IDENTITY</Text>
        <Text style={styles.sectionTitle}>Mark construction</Text>
        <View style={styles.markRow}>
          <View style={styles.markCard}>
            <Text style={styles.markLabel}>{brandCopy.mark.ai}</Text>
            <Text style={styles.markBody}>
              Signal, models, and engineered intelligence that ships.
            </Text>
          </View>
          <View style={styles.markCard}>
            <Text style={styles.markLabel}>{brandCopy.mark.kova}</Text>
            <Text style={styles.markBody}>
              Secure containment — compliance-wrapped integrations.
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionKicker}>PROOF</Text>
        <Text style={styles.sectionTitle}>Projects delivered</Text>
        <View style={styles.grid}>
          {caseStudies.map((item) => (
            <View key={item.title} style={styles.card}>
              <View
                style={[
                  styles.cardAccent,
                  item.tone === 'from green' && { backgroundColor: colors.green },
                  item.tone === 'vault' && { backgroundColor: colors.darkGreen },
                  item.tone === 'depth' && { backgroundColor: colors.deep },
                ]}
              />
              <Text style={styles.cardTitle}>{item.title}</Text>
            </View>
          ))}
        </View>
      </View>

      <FoundationStatus />
    </MarketingShell>
  );
}

const styles = StyleSheet.create({
  hero: {
    gap: 14,
    marginBottom: 36,
    maxWidth: 760,
  },
  live: {
    fontFamily: fonts.mono,
    fontSize: 11,
    letterSpacing: 1.4,
    color: colors.green,
  },
  brand: {
    fontFamily: fonts.displayExtra,
    fontSize: 56,
    letterSpacing: -1.4,
    color: colors.text,
  },
  headline: {
    fontFamily: fonts.display,
    fontSize: 34,
    lineHeight: 42,
    letterSpacing: -0.6,
    color: colors.text,
  },
  support: {
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 26,
    color: colors.muted,
    maxWidth: 620,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 8,
  },
  primaryBtn: {
    backgroundColor: colors.blue,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 12,
  },
  primaryBtnText: {
    fontFamily: fonts.bodySemi,
    fontSize: 14,
    color: colors.text,
  },
  ghostBtn: {
    borderWidth: 1,
    borderColor: colors.borderStrong,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 12,
  },
  ghostBtnText: {
    fontFamily: fonts.bodySemi,
    fontSize: 14,
    color: colors.text,
  },
  slogans: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 48,
  },
  sloganCard: {
    flexGrow: 1,
    minWidth: 220,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: 16,
  },
  sloganText: {
    fontFamily: fonts.headingSemi,
    fontSize: 15,
    color: colors.textSoft,
  },
  section: {
    marginBottom: 40,
    gap: 10,
  },
  sectionKicker: {
    fontFamily: fonts.mono,
    fontSize: 11,
    letterSpacing: 1.2,
    color: colors.blue,
  },
  sectionTitle: {
    fontFamily: fonts.displaySemi,
    fontSize: 24,
    color: colors.text,
    marginBottom: 8,
  },
  markRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  markCard: {
    flexGrow: 1,
    minWidth: 240,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: 18,
    gap: 8,
  },
  markLabel: {
    fontFamily: fonts.bodySemi,
    fontSize: 14,
    color: colors.text,
  },
  markBody: {
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 20,
    color: colors.muted,
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
    gap: 12,
  },
  cardAccent: {
    width: 42,
    height: 4,
    borderRadius: 4,
    backgroundColor: colors.blue,
  },
  cardTitle: {
    fontFamily: fonts.headingSemi,
    fontSize: 16,
    lineHeight: 22,
    color: colors.text,
  },
});
