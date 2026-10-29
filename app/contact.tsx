import { StyleSheet, Text, View } from 'react-native';
import { MarketingShell } from '../src/components/marketing/MarketingShell';
import { colors, fonts } from '../src/theme/colors';

/** Native fallback — full AVA AI Receptionist UI is web: contact.web.tsx */
export default function ContactScreen() {
  return (
    <MarketingShell activeHref="/contact">
      <Text style={styles.kicker}>CONTACT — AVA AI RECEPTIONIST</Text>
      <Text style={styles.title}>Talk to Captain</Text>
      <Text style={styles.support}>
        Instant tech assessment with DOS7 evidence logging. On web, AVA (AiKOVA
        Virtual Assistant) handles intake — Open Calendly, copy assessment, or
        send to hello@aikova.co.uk.
      </Text>
      <View style={styles.panel}>
        <Text style={styles.panelLabel}>HQ</Text>
        <Text style={styles.panelValue}>London · 51.5074° N</Text>
        <Text style={styles.panelLabel}>Compliance</Text>
        <Text style={styles.panelValue}>ISO 27001 · PCI DSS · DOS7 LOT 1</Text>
        <Text style={styles.panelLabel}>Engagement</Text>
        <Text style={styles.panelValue}>
          Founders + principal engineers only — no bench handoff.
        </Text>
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
    fontSize: 16,
    lineHeight: 26,
    color: colors.muted,
    maxWidth: 640,
    marginBottom: 28,
  },
  panel: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: 24,
    gap: 8,
    maxWidth: 520,
  },
  panelLabel: {
    fontFamily: fonts.mono,
    fontSize: 11,
    letterSpacing: 1,
    color: colors.green,
    marginTop: 8,
  },
  panelValue: {
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 22,
    color: colors.text,
  },
});
