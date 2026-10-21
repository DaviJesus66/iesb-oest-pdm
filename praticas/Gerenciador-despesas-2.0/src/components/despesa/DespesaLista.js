import { FlatList, StyleSheet, Text, View, useColorScheme, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DespesaItem from './DespesaItem';
import { getTheme } from '../../constants/theme';

function DespesaLista({ expenses }) {
  const theme = getTheme(useColorScheme());
  const { width } = useWindowDimensions();
  // Bônus: 2 colunas em tablet ou celular deitado.
  const numColumns = width > 600 ? 2 : 1;

  return (
    <FlatList
      key={numColumns}
      data={expenses}
      numColumns={numColumns}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={{ flex: 1 / numColumns, padding: 6 }}>
          <DespesaItem {...item} />
        </View>
      )}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.content}
      ListEmptyComponent={
        <View style={styles.empty}>
          <Ionicons name="receipt-outline" size={56} color={theme.textSecondary} />
          <Text style={[styles.emptyTitle, { color: theme.text }]}>Nenhuma despesa</Text>
          <Text style={[styles.emptyHint, { color: theme.textSecondary }]}>
            Toque em + para adicionar uma nova.
          </Text>
        </View>
      }
    />
  );
}

export default DespesaLista;

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    paddingTop: 6,
    paddingBottom: 16,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 48,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyHint: {
    fontSize: 14,
  },
});
