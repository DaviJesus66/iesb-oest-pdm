import { StyleSheet, View } from 'react-native';
import DespesaSumario from './DespesaSumario';
import DespesaLista from './DespesaLista';

function DespesaSaida({ despesas, periodo }) {
  return (
    <View style={styles.container}>
      <DespesaSumario despesas={despesas} periodo={periodo} />
      <DespesaLista despesas={despesas} />
    </View>
  );
}

export default DespesaSaida;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
