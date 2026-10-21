import { useMemo } from 'react';
import { StyleSheet, View, useColorScheme } from 'react-native';
import DespesaSaida from '../components/despesa/DespesaSaida';
import { getTheme } from '../constants/theme';
import { useExpenses } from '../store/expenses-context';
import { endOfDay, startOfDay } from '../utils/format';

function DespesasRecentes() {
  const theme = getTheme(useColorScheme());
  const { expenses } = useExpenses();

  // Últimos 7 dias, sem despesas futuras.
  const recentExpenses = useMemo(() => {
    const hoje = new Date();
    const limite = startOfDay(hoje);
    limite.setDate(limite.getDate() - 7);
    const fim = endOfDay(hoje);

    return expenses
      .filter((expense) => {
        const data = new Date(expense.date);
        return data >= limite && data <= fim;
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [expenses]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <DespesaSaida expenses={recentExpenses} label="Últimos 7 dias" />
    </View>
  );
}

export default DespesasRecentes;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
  },
});
