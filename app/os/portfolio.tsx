import { StyleSheet, Text, View } from 'react-native';
import { OsShell } from '../../src/components/os/OsShell';
import { colors, fonts } from '../../src/theme/colors';

const rows = [
  { client: 'Manufacturing QA', status: 'Live', value: 'Vision AI' },
  { client: 'Trade docs', status: 'Live', value: 'Orchestration' },
  { client: 'GovTech vault', status: 'Build', value: 'Doc intel' },
  { client: 'MediSync', status: 'Live', value: 'Interop' },
];

export default function OsPortfolioScreen() {
  return (
    <OsShell
      activeHref="/os/portfolio"
      title="Portfolio CRM"
      subtitle="Internal vault of client engagements and public case-study readiness."
    >
      <View style={styles.table}>
        <View style={[styles.row, styles.header]}>
          <Text style={[styles.cell, styles.headerText]}>Client</Text>
          <Text style={[styles.cell, styles.headerText]}>Status</Text>
          <Text style={[styles.cell, styles.headerText]}>Focus</Text>
        </View>
        {rows.map((row) => (
          <View key={row.client} style={styles.row}>
            <Text style={styles.cell}>{row.client}</Text>
            <Text style={[styles.cell, styles.status]}>{row.status}</Text>
            <Text style={[styles.cell, styles.muted]}>{row.value}</Text>
          </View>
        ))}
      </View>
    </OsShell>
  );
}

const styles = StyleSheet.create({
  table: {
    marginTop: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
  header: {
    borderTopWidth: 0,
    backgroundColor: colors.bgSoft,
  },
  cell: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 14,
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.text,
  },
  headerText: {
    fontFamily: fonts.mono,
    fontSize: 11,
    letterSpacing: 0.8,
    color: colors.muted,
  },
  status: {
    color: colors.green,
    fontFamily: fonts.bodySemi,
  },
  muted: {
    color: colors.muted,
  },
});
