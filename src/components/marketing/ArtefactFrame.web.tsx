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
import { fonts } from '../../theme/colors';

const BAR_HEIGHT = 56;
/** Snow dim white — marketing page background */
const PAGE_BG = '#F0F2F5';
const PAGE_BORDER = 'rgba(11, 18, 32, 0.10)';
const TEXT = '#0B1220';
const TEXT_MUTED = '#5B6577';
const ELECTRIC = '#0EA5FF';
const NEON = '#84FF3D';

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
    const prevBg = document.body.style.background;
    const prevHtmlBg = document.documentElement.style.background;
    document.body.style.overflow = 'hidden';
    document.body.style.background = PAGE_BG;
    document.documentElement.style.background = PAGE_BG;
    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.background = prevBg;
      document.documentElement.style.background = prevHtmlBg;
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
  background: PAGE_BG,
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    width: '100%',
    height: '100%',
    minHeight: '100vh' as unknown as number,
    backgroundColor: PAGE_BG,
  },
  bar: {
    height: BAR_HEIGHT,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    borderBottomWidth: 1,
    borderBottomColor: PAGE_BORDER,
    backgroundColor: 'rgba(240, 242, 245, 0.94)',
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
    color: TEXT,
  },
  brandMeta: {
    fontFamily: fonts.mono,
    fontSize: 10,
    letterSpacing: 1.4,
    color: TEXT_MUTED,
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
    color: TEXT_MUTED,
  },
  linkActive: {
    color: ELECTRIC,
  },
  linkUnderline: {
    marginTop: 4,
    height: 2,
    width: 16,
    borderRadius: 2,
    backgroundColor: ELECTRIC,
  },
  cta: {
    marginLeft: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(132, 255, 61, 0.45)',
    backgroundColor: 'rgba(132, 255, 61, 0.14)',
  },
  ctaText: {
    fontFamily: fonts.bodySemi,
    fontSize: 12,
    color: NEON,
  },
  frame: {
    flex: 1,
    width: '100%',
    minHeight: 0,
    backgroundColor: PAGE_BG,
  },
});
