import { Link } from 'expo-router';
import { useEffect, type CSSProperties } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { marketingRoutes } from '../../navigation/routes';
import { colors, fonts } from '../../theme/colors';

const BAR_HEIGHT = 56;

export function ArtefactFrame({
  activeHref,
  title,
  src,
}: {
  activeHref: string;
  title: string;
  src: string;
}) {
  const { width } = useWindowDimensions();
  const compact = width < 820;

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  return (
    <View style={styles.root}>
      <View style={[styles.bar, compact && styles.barCompact]}>
        <Link href="/" asChild>
          <Pressable style={styles.brand}>
            <Text style={styles.logo}>AiKOVA</Text>
            {!compact ? (
              <Text style={styles.brandMeta}>ENGINEERING VAULT // OL8</Text>
            ) : null}
          </Pressable>
        </Link>

        <View style={[styles.links, compact && styles.linksCompact]}>
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
      </View>

      <View style={styles.frame}>
        <iframe title={title} src={src} style={iframeStyle} allow="fullscreen" />
      </View>
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
  },
  bar: {
    height: BAR_HEIGHT,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: 'rgba(5, 7, 13, 0.92)',
    zIndex: 20,
  },
  barCompact: {
    height: 'auto' as unknown as number,
    minHeight: BAR_HEIGHT,
    paddingVertical: 10,
    flexDirection: 'column',
    alignItems: 'flex-start',
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
  linksCompact: {
    width: '100%',
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
  frame: {
    flex: 1,
    width: '100%',
    minHeight: 0,
  },
});
