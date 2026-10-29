import { Link } from 'expo-router';
import type { ReactNode } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { marketingRoutes } from '../../navigation/routes';
import { brandCopy, colors, fonts } from '../../theme/colors';

export function MarketingShell({
  children,
  activeHref = '/',
}: {
  children: ReactNode;
  activeHref?: string;
}) {
  const { width } = useWindowDimensions();
  const compact = width < 820;

  return (
    <View style={styles.root}>
      <View style={[styles.glow, styles.glowBlue]} />
      <View style={[styles.glow, styles.glowGreen]} />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.nav, compact && styles.navCompact]}>
          <Link href="/" asChild>
            <Pressable>
              <Text style={styles.logo}>AiKOVA</Text>
            </Pressable>
          </Link>
          <View style={[styles.navLinks, compact && styles.navLinksCompact]}>
            {marketingRoutes.map((route) => {
              const active = route.href === activeHref;
              return (
                <Link key={route.href} href={route.href as '/'} asChild>
                  <Pressable style={styles.navItem}>
                    <Text
                      style={[styles.navLabel, active && styles.navLabelActive]}
                    >
                      {route.label}
                    </Text>
                  </Pressable>
                </Link>
              );
            })}
            <Link href="/os/login" asChild>
              <Pressable style={styles.cta}>
                <Text style={styles.ctaText}>Login to OS</Text>
              </Pressable>
            </Link>
          </View>
        </View>

        {children}

        <View style={styles.footer}>
          <Text style={styles.footerBrand}>AiKOVA LTD</Text>
          <Text style={styles.footerMeta}>{brandCopy.compliance}</Text>
          <Text style={styles.footerMeta}>CONFIDENTIAL · CLIENT COPY</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
    overflow: 'hidden',
  },
  glow: {
    position: 'absolute',
    width: 420,
    height: 420,
    borderRadius: 420,
    opacity: 0.18,
    ...(Platform.OS === 'web' ? ({ filter: 'blur(80px)' } as object) : null),
  },
  glowBlue: {
    top: -120,
    right: -80,
    backgroundColor: colors.blue,
  },
  glowGreen: {
    bottom: 80,
    left: -160,
    backgroundColor: colors.green,
  },
  scroll: {
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 64,
    maxWidth: 1120,
    width: '100%',
    alignSelf: 'center',
  },
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 48,
    gap: 16,
  },
  navCompact: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  logo: {
    fontFamily: fonts.displayExtra,
    fontSize: 22,
    letterSpacing: -0.5,
    color: colors.text,
  },
  navLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  navLinksCompact: {
    width: '100%',
  },
  navItem: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  navLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    color: colors.muted,
  },
  navLabelActive: {
    color: colors.text,
  },
  cta: {
    marginLeft: 4,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surface2,
  },
  ctaText: {
    fontFamily: fonts.bodySemi,
    fontSize: 13,
    color: colors.green,
  },
  footer: {
    marginTop: 72,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 6,
  },
  footerBrand: {
    fontFamily: fonts.displaySemi,
    fontSize: 14,
    color: colors.text,
  },
  footerMeta: {
    fontFamily: fonts.mono,
    fontSize: 11,
    color: colors.textDim,
    letterSpacing: 0.6,
  },
});
