import { StyleSheet, Text, View } from 'react-native';
import { OsShell } from '../../src/components/os/OsShell';
import { colors, fonts } from '../../src/theme/colors';

/** Native placeholder — Admin CRM is web-first. */
export default function OsCrmNative() {
  return (
    <OsShell
      activeHref="/os/crm"
      title="Admin CRM"
      subtitle="Open aikova.co.uk/os/crm on web for the full Admin CRM OS."
    >
      <View style={styles.panel}>
        <Text style={styles.text}>
          The Admin + User CRM ships as a web console. Use the browser build for
          leads, pipeline, tickets, and vault.
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
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
  },
});
