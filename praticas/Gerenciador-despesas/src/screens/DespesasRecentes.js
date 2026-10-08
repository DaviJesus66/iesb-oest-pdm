import { StyleSheet, View } from 'react-native';
import DespesaSaida from '../components/despesa/DespesaSaida';
import { useDespesas } from '../context/DespesasContext';

// Mantém só as despesas dos últimos 7 dias, sem despesas futuras.
function filtrarUltimosSeteDias(despesas) {
  const hoje = new Date();
  const limite = new Date();
  limite.setDate(hoje.getDate() - 7);

  return despesas.filter(
    (despesa) => despesa.data >= limite && despesa.data <= hoje
  );
}

function DespesasRecentes() {
  const { despesas } = useDespesas();

  return (
    <View style={styles.container}>
      <DespesaSaida
        despesas={filtrarUltimosSeteDias(despesas)}
        periodo="Últimos 7 dias"
      />
    </View>
  );
}

export default DespesasRecentes;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
