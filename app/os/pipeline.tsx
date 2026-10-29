import { StyleSheet, Text, View } from 'react-native';
import { OsShell } from '../../src/components/os/OsShell';
import { colors, fonts } from '../../src/theme/colors';

const columns = [
  { title: 'Lead', items: ['Digital twin enquiry', 'DOS7 evidence request'] },
  { title: 'Discovery', items: ['48h architecture map'] },
  { title: 'Build', items: [] },
  { title: 'Delivered', items: ['MediSync clinical view'] },
];

export default function PipelineScreen() {
  return (
    <OsShell
      activeHref="/os/pipeline"
      title="Pipeline"
      subtitle="CRM lead tags feed portfolio case studies automatically."
    >
      <View style={styles.board}>
        {columns.map((col) => (
          <View key={col.title} style={styles.column}>
            <Text style={styles.columnTitle}>{col.title}</Text>
            {col.items.length === 0 ? (
              <Text style={styles.empty}>No cards</Text>
            ) : (
              col.items.map((item) => (
                <View key={item} style={styles.card}>
                  <Text style={styles.cardText}>{item}</Text>
                </View>
              ))
            )}
          </View>
        ))}
      </View>
    </OsShell>
  );
}

const styles = StyleSheet.create({
  board: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 16,
  },
  column: {
    flexGrow: 1,
    minWidth: 180,
    maxWidth: 260,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bgSoft,
    padding: 12,
    gap: 8,
    minHeight: 220,
  },
  columnTitle: {
    fontFamily: fonts.mono,
    fontSize: 11,
    letterSpacing: 1,
    color: colors.blue,
    marginBottom: 4,
  },
  empty: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.textDim,
    padding: 8,
  },
  card: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface2,
    padding: 12,
  },
  cardText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    lineHeight: 18,
    color: colors.text,
  },
});
