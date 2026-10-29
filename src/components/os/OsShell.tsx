import { Link } from 'expo-router';
import type { ReactNode } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { osRoutes } from '../../navigation/routes';
import { colors, fonts } from '../../theme/colors';

export function OsShell({
  children,
  activeHref = '/os',
  title,
  subtitle,
}: {
  children: ReactNode;
  activeHref?: string;
  title: string;
  subtitle?: string;
}) {
  const { width } = useWindowDimensions();
  const sideNav = width >= 900;

  return (
    <View style={styles.root}>
      <View style={[styles.frame, !sideNav && styles.frameStack]}>
        <View style={[styles.sidebar, !sideNav && styles.sidebarCompact]}>
          <Text style={styles.brand}>AiKOVA OS</Text>
          <Text style={styles.brandMeta}>PORTFOLIO CRM · VAULT</Text>
          <View style={[styles.nav, !sideNav && styles.navRow]}>
            {osRoutes.map((route) => {
              const active = route.href === activeHref;
              return (
                <Link key={route.href} href={route.href as '/os'} asChild>
                  <Pressable
                    style={[styles.navItem, active && styles.navItemActive]}
                  >
                    <Text
                      style={[styles.navLabel, active && styles.navLabelActive]}
                    >
                      {route.label}
                    </Text>
                  </Pressable>
                </Link>
              );
            })}
            <Link href="/" asChild>
              <Pressable style={styles.navItem}>
                <Text style={styles.navLabel}>← Marketing</Text>
              </Pressable>
            </Link>
          </View>
        </View>

        <ScrollView
          style={styles.main}
          contentContainerStyle={styles.mainContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.kicker}>SYSTEM LIVE</Text>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
          {children}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  frame: {
    flex: 1,
    flexDirection: 'row',
    maxWidth: 1280,
    width: '100%',
    alignSelf: 'center',
  },
  frameStack: {
    flexDirection: 'column',
  },
  sidebar: {
    width: 240,
    padding: 24,
    borderRightWidth: 1,
    borderRightColor: colors.border,
    backgroundColor: colors.bgLift,
    gap: 8,
  },
  sidebarCompact: {
    width: '100%',
    borderRightWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  brand: {
    fontFamily: fonts.displayExtra,
    fontSize: 20,
    color: colors.text,
  },
  brandMeta: {
    fontFamily: fonts.mono,
    fontSize: 10,
    letterSpacing: 1,
    color: colors.green,
    marginBottom: 16,
  },
  nav: {
    gap: 4,
  },
  navRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  navItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  navItemActive: {
    backgroundColor: colors.surface2,
  },
  navLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    color: colors.muted,
  },
  navLabelActive: {
    color: colors.text,
  },
  main: {
    flex: 1,
  },
  mainContent: {
    padding: 28,
    paddingBottom: 64,
    gap: 8,
  },
  kicker: {
    fontFamily: fonts.mono,
    fontSize: 11,
    letterSpacing: 1.4,
    color: colors.green,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 32,
    letterSpacing: -0.6,
    color: colors.text,
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 22,
    color: colors.muted,
    marginBottom: 12,
  },
});
