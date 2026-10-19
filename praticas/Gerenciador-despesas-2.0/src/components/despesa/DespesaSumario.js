import { StyleSheet, Text, View, useColorScheme } from 'react-native';
import { getTheme } from '../../constants/theme';
import { formatCurrency } from '../../utils/format';

function DespesaSumario({ expenses, label }) {
  const theme = getTheme(useColorScheme());

  const total = expenses.reduce((acumulador, item) => acumulador + item.amount, 0);
  const quantidade = expenses.length;

  return (
    <View style={[styles.container, { backgroundColor: theme.summary }]}>
      <View>
        <Text style={[styles.label, { color: theme.summaryText }]}>{label}</Text>
        <Text style={[styles.count, { color: theme.summaryText }]}>
          {quantidade} {quantidade === 1 ? 'despesa' : 'despesas'}
        </Text>
      </View>
      <Text style={[styles.total, { color: theme.summaryText }]}>
        {formatCurrency(total)}
      </Text>
    </View>
  );
}

export default DespesaSumario;

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  count: {
    fontSize: 12,
    marginTop: 2,
  },
  total: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
