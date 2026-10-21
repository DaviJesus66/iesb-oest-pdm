import { useMemo, useState } from 'react';
import { Alert, StyleSheet, TextInput, View, useColorScheme } from 'react-native';
import DespesaSaida from '../components/despesa/DespesaSaida';
import CategoriaFiltro from '../components/despesa/CategoriaFiltro';
import IconButton from '../components/IconButton';
import { CATEGORIES } from '../constants/categories';
import { getTheme } from '../constants/theme';
import useDebounce from '../hooks/useDebounce';
import { useExpenses } from '../store/expenses-context';

const ALL = 'Todas';

function TodasDespesas() {
  const theme = getTheme(useColorScheme());
  const { expenses, clearExpenses } = useExpenses();

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(ALL);
  const debouncedSearch = useDebounce(search, 300);

  // Busca (sem diferenciar maiúsculas) combinada com o filtro de categoria.
  const filteredExpenses = useMemo(() => {
    const term = debouncedSearch.trim().toLowerCase();
    return expenses
      .filter(
        (expense) =>
          (category === ALL || expense.category === category) &&
          expense.description.toLowerCase().includes(term)
      )
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [expenses, debouncedSearch, category]);

  function handleClearAll() {
    Alert.alert(
      'Limpar tudo',
      'Isso apaga todas as despesas. Deseja continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Limpar tudo', style: 'destructive', onPress: clearExpenses },
      ]
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.searchRow}>
        <TextInput
          style={[
            styles.search,
            { backgroundColor: theme.input, borderColor: theme.border, color: theme.text },
          ]}
          value={search}
          onChangeText={setSearch}
          placeholder="Buscar por descrição"
          placeholderTextColor={theme.textSecondary}
          autoCorrect={false}
        />
        {expenses.length > 0 && (
          <IconButton
            icon="trash-outline"
            size={24}
            color={theme.error}
            onPress={handleClearAll}
          />
        )}
      </View>

      <CategoriaFiltro
        categories={[ALL, ...CATEGORIES]}
        selected={category}
        onSelect={setCategory}
      />

      <DespesaSaida expenses={filteredExpenses} label="Total" />
    </View>
  );
}

export default TodasDespesas;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  search: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
});
