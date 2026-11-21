import { Link } from 'expo-router';
import { useEffect, useState, type CSSProperties } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { marketingRoutes } from '../../navigation/routes';
import { colors, fonts } from '../../theme/colors';
import { MCLBotWidget } from '../../marketing/MCLBotWidget.web';

const BAR_HEIGHT = 56;

export type ArtefactPromo = {
  eyebrow: string;
  title: string;
  body: string;
  href: string;
  cta: string;
};

export function ArtefactFrame({
  activeHref,
  title,
  src,
  promo,
}: {
  activeHref: string;
  title: string;
  src: string;
  promo?: ArtefactPromo;
}) {
  const { width } = useWindowDimensions();
  const compact = width < 820;
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  useEffect(() => {
    if (!compact) setMenuOpen(false);
  }, [compact]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <View style={styles.root}>
      <View style={[styles.bar, compact && styles.barCompact]}>
        <View style={styles.barRow}>
          <Link href="/" asChild>
            <Pressable style={styles.brand} onPress={closeMenu}>
              <Text style={styles.logo}>AiKOVA</Text>
              {!compact ? (
                <Text style={styles.brandMeta}>ENGINEERING VAULT // OL8</Text>
              ) : null}
            </Pressable>
          </Link>

          {compact ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={menuOpen ? 'Close menu' : 'Open menu'}
              onPress={() => setMenuOpen((v) => !v)}
              style={[styles.burger, menuOpen && styles.burgerOpen]}
            >
              <View style={[styles.burgerLine, menuOpen && styles.burgerLineTop]} />
              <View style={[styles.burgerLine, menuOpen && styles.burgerLineMid]} />
              <View style={[styles.burgerLine, menuOpen && styles.burgerLineBot]} />
            </Pressable>
          ) : (
            <View style={styles.links}>
              {marketingRoutes.map((route) => {
                const active = route.href === activeHref;
                return (
                  <Link key={route.href} href={route.href as '/'} asChild>
                    <Pressable style={styles.linkItem}>
                      <Text style={[styles.linkLabel, active && styles.linkActive]}>
                        {route.label}
                      </Text>
                      {active ? <View style={styles.linkUnderline} /> : null}
                    </Pressable>
                  </Link>
                );
              })}
              <Link href="/os/portal" asChild>
                <Pressable style={styles.cta}>
                  <Text style={styles.ctaText}>Open Portal</Text>
                </Pressable>
              </Link>
            </View>
          )}
        </View>
      </View>

      {/* Slide-in / slide-out mobile drawer */}
      {compact ? (
        <>
          <Pressable
            style={[styles.scrim, menuOpen ? styles.scrimShow : styles.scrimHide]}
            onPress={closeMenu}
            accessibilityLabel="Close menu overlay"
          />
          <View
            style={[styles.drawer, menuOpen ? styles.drawerOpen : styles.drawerClosed]}
            accessibilityViewIsModal={menuOpen}
          >
            <Text style={styles.drawerKicker}>NAVIGATE</Text>
            {marketingRoutes.map((route) => {
              const active = route.href === activeHref;
              return (
                <Link key={route.href} href={route.href as '/'} asChild>
                  <Pressable style={styles.drawerItem} onPress={closeMenu}>
                    <Text
                      style={[styles.drawerLabel, active && styles.drawerLabelActive]}
                    >
                      {route.label}
                    </Text>
                    {active ? <View style={styles.drawerDot} /> : null}
                  </Pressable>
                </Link>
              );
            })}
            <Link href="/os/portal" asChild>
              <Pressable style={[styles.cta, styles.drawerCta]} onPress={closeMenu}>
                <Text style={styles.ctaText}>Open Portal</Text>
              </Pressable>
            </Link>
          </View>
        </>
      ) : null}

      {promo ? (
        <View style={[styles.promo, compact && styles.promoCompact]}>
          <View style={styles.promoCopy}>
            <Text style={styles.promoEyebrow}>{promo.eyebrow}</Text>
            <Text style={styles.promoTitle}>{promo.title}</Text>
            <Text style={styles.promoBody}>{promo.body}</Text>
          </View>
          <Link href={promo.href as '/'} asChild>
            <Pressable style={styles.promoCta}>
              <Text style={styles.promoCtaText}>{promo.cta}</Text>
            </Pressable>
          </Link>
        </View>
      ) : null}

      <View style={styles.frame}>
        <iframe title={title} src={src} style={iframeStyle} allow="fullscreen" />
      </View>

      <MCLBotWidget />
    </View>
  );
}

const iframeStyle: CSSProperties = {
  border: 'none',
  width: '100%',
  height: '100%',
  display: 'block',
  background: colors.bg,
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    width: '100%',
    height: '100%',
    minHeight: '100vh' as unknown as number,
    backgroundColor: colors.bg,
    position: 'relative',
    overflow: 'hidden',
  },
  bar: {
    height: BAR_HEIGHT,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: 'rgba(5, 7, 13, 0.92)',
    zIndex: 40,
  },
  barCompact: {
    height: BAR_HEIGHT,
  },
  barRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    minHeight: BAR_HEIGHT,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logo: {
    fontFamily: fonts.displayExtra,
    fontSize: 18,
    letterSpacing: -0.4,
    color: colors.text,
  },
  brandMeta: {
    fontFamily: fonts.mono,
    fontSize: 10,
    letterSpacing: 1.4,
    color: colors.textDim,
  },
  links: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 4,
  },
  linkItem: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    alignItems: 'center',
  },
  linkLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    color: colors.muted,
  },
  linkActive: {
    color: colors.text,
  },
  linkUnderline: {
    marginTop: 4,
    height: 2,
    width: 16,
    borderRadius: 2,
    backgroundColor: colors.blue,
  },
  cta: {
    marginLeft: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(132, 255, 61, 0.35)',
    backgroundColor: 'rgba(132, 255, 61, 0.1)',
  },
  ctaText: {
    fontFamily: fonts.bodySemi,
    fontSize: 12,
    color: colors.green,
  },
  burger: {
    width: 42,
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: 'rgba(255,255,255,0.04)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  burgerOpen: {
    borderColor: 'rgba(14, 165, 255, 0.45)',
    backgroundColor: 'rgba(14, 165, 255, 0.1)',
  },
  burgerLine: {
    width: 18,
    height: 2,
    borderRadius: 2,
    backgroundColor: colors.text,
  },
  burgerLineTop: {
    transform: [{ translateY: 7 }, { rotate: '45deg' }],
  },
  burgerLineMid: {
    opacity: 0,
  },
  burgerLineBot: {
    transform: [{ translateY: -7 }, { rotate: '-45deg' }],
  },
  scrim: {
    position: 'absolute',
    top: BAR_HEIGHT,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.55)',
    zIndex: 35,
    ...( { transition: 'opacity 0.28s ease' } as object),
  },
  scrimShow: {
    opacity: 1,
    ...( { pointerEvents: 'auto' } as object),
  },
  scrimHide: {
    opacity: 0,
    ...( { pointerEvents: 'none' } as object),
  },
  drawer: {
    position: 'absolute',
    top: BAR_HEIGHT,
    right: 0,
    bottom: 0,
    width: 300,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 28,
    backgroundColor: '#0B1020',
    borderLeftWidth: 1,
    borderLeftColor: colors.border,
    zIndex: 36,
    gap: 4,
    ...( {
      transition: 'transform 0.32s cubic-bezier(0.16, 1, 0.3, 1)',
    } as object),
  },
  drawerOpen: {
    transform: [{ translateX: 0 }],
  },
  drawerClosed: {
    transform: [{ translateX: 320 }],
  },
  drawerKicker: {
    fontFamily: fonts.mono,
    fontSize: 10,
    letterSpacing: 1.6,
    color: colors.blue,
    marginBottom: 12,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  drawerLabel: {
    fontFamily: fonts.bodySemi,
    fontSize: 16,
    color: colors.muted,
  },
  drawerLabelActive: {
    color: colors.text,
  },
  drawerDot: {
    width: 8,
    height: 8,
    borderRadius: 8,
    backgroundColor: colors.green,
  },
  drawerCta: {
    marginLeft: 0,
    marginTop: 18,
    alignSelf: 'flex-start',
  },
  frame: {
    flex: 1,
    width: '100%',
    minHeight: 0,
  },
  promo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(14, 165, 255, 0.35)',
    backgroundColor: 'rgba(11, 16, 32, 0.96)',
    zIndex: 18,
  },
  promoCompact: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  promoCopy: {
    flex: 1,
    gap: 4,
    maxWidth: 760,
  },
  promoEyebrow: {
    fontFamily: fonts.mono,
    fontSize: 10,
    letterSpacing: 1.4,
    color: colors.blue,
  },
  promoTitle: {
    fontFamily: fonts.displaySemi,
    fontSize: 16,
    letterSpacing: -0.2,
    color: colors.text,
  },
  promoBody: {
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 19,
    color: colors.muted,
  },
  promoCta: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(132, 255, 61, 0.4)',
    backgroundColor: 'rgba(132, 255, 61, 0.12)',
  },
  promoCtaText: {
    fontFamily: fonts.bodySemi,
    fontSize: 12,
    color: colors.green,
  },
});
