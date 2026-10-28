import { Alert, Button, Share, StyleSheet, Text, View } from 'react-native';
import { useExpenses } from '../../store/expenses-context';

export default function WalletScreen() {
  const { expenses, addExpense } = useExpenses();
  const total = expenses.reduce((sum, item) => sum + item.amount, 0);

  async function shareSummary() {
    try {
      await Share.share({ message: `Gastei R$ ${total.toFixed(2)} neste semestre.` });
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível compartilhar o resumo.');
    }
  }

  // Cria uma despesa de exemplo para ver o total mudar (e persistir).
  function addSample() {
    addExpense({
      description: 'Despesa de exemplo',
      amount: 32.5,
      date: new Date().toISOString(),
      category: 'Outros',
    });
  }

  return (
    <View style={styles.screen}>
      <Text style={styles.label}>Total gasto</Text>
      <Text style={styles.total}>R$ {total.toFixed(2)}</Text>
      <Text style={styles.count}>
        {expenses.length} {expenses.length === 1 ? 'despesa' : 'despesas'}
      </Text>

      <View style={styles.buttons}>
        <Button title="Compartilhar resumo" onPress={shareSummary} />
        <Button title="Adicionar despesa de exemplo (R$ 32.50)" onPress={addSample} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  label: {
    fontSize: 16,
    color: '#666',
  },
  total: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#4757B8',
    marginVertical: 8,
  },
  count: {
    fontSize: 14,
    color: '#666',
    marginBottom: 32,
  },
  buttons: {
    gap: 12,
  },
});
