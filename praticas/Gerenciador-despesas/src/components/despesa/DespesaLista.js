import { FlatList, StyleSheet, Text } from 'react-native';
import DespesaItem from './DespesaItem';

function DespesaLista({ despesas }) {
  return (
    <FlatList
      data={despesas}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <DespesaItem {...item} />}
      ListEmptyComponent={
        <Text style={styles.vazio}>Nenhuma despesa encontrada.</Text>
      }
    />
  );
}

export default DespesaLista;

const styles = StyleSheet.create({
  vazio: {
    textAlign: 'center',
    marginTop: 24,
    color: '#71717a',
  },
});
