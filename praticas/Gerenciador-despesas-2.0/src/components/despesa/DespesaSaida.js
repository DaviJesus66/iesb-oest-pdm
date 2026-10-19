import { StyleSheet, View } from 'react-native';
import DespesaSumario from './DespesaSumario';
import DespesaLista from './DespesaLista';

function DespesaSaida({ expenses, label }) {
  return (
    <View style={styles.container}>
      <DespesaSumario expenses={expenses} label={label} />
      <DespesaLista expenses={expenses} />
    </View>
  );
}

export default DespesaSaida;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
