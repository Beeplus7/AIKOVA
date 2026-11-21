import { StyleSheet, Text, View } from 'react-native';
import { MarketingShell } from '../src/components/marketing/MarketingShell';
import { colors, fonts } from '../src/theme/colors';

export default function WooCommerceScreen() {
  return (
    <MarketingShell activeHref="/woocommerce">
      <Text style={styles.kicker}>WOOCOMMERCE THEME</Text>
      <Text style={styles.title}>AiKOVA Multipurpose WooCommerce Theme</Text>
      <Text style={styles.support}>
        100+ prebuilt demos, visual theme builder, banners, cards and
        infographics. Open on web for the full landing experience.
      </Text>
      <View style={styles.card}>
        <Text style={styles.tag}>THEME + BUILDER</Text>
        <Text style={styles.cardTitle}>Every store. One theme.</Text>
        <Text style={styles.body}>
          Fashion · Electronics · Furniture · Beauty · Grocery · Jewelry · Litt
          Luxury — start finished, then customise with AiKOVA Builder.
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
    fontSize: 15,
    lineHeight: 23,
    color: colors.muted,
    maxWidth: 560,
    marginBottom: 28,
  },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: 18,
    gap: 10,
    maxWidth: 520,
  },
  tag: {
    fontFamily: fonts.mono,
    fontSize: 11,
    letterSpacing: 1,
    color: colors.green,
  },
  cardTitle: {
    fontFamily: fonts.headingSemi,
    fontSize: 18,
    color: colors.text,
  },
  body: {
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 21,
    color: colors.muted,
  },
});
