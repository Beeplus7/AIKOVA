import { StyleSheet, Text, View } from 'react-native';
import { OsShell } from '../../src/components/os/OsShell';
import { colors, fonts } from '../../src/theme/colors';

/** Native placeholder — AI onboarding is web-first. */
export default function OsOnboardingNative() {
  return (
    <OsShell
      activeHref="/os/onboarding"
      title="AI Onboarding"
      subtitle="Open aikova.co.uk/os/onboarding on web for AVA Project Companion."
    >
      <View style={styles.panel}>
        <Text style={styles.text}>
          Conversational SaaS job prescription ships on web. Use the browser Users entrance.
        </Text>
      </View>
    </OsShell>
  );
}

const styles = StyleSheet.create({
  panel: {
    marginTop: 16,
    padding: 20,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  text: {
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 21,
    color: colors.muted,
  },
});
