import { Redirect } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import AdminCrmApp from '../../src/crm/AdminCrmApp.web';
import { useAuth } from '../../src/lib/auth/AuthProvider';
import { colors } from '../../src/theme/colors';

/** Full Admin CRM OS (web). Requires Supabase session. */
export default function OsCrmScreen() {
  const { user, loading, configured } = useAuth();

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.green} />
      </View>
    );
  }

  if (!configured || !user) {
    return <Redirect href="/os/login" />;
  }

  return <AdminCrmApp />;
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg,
  },
});
