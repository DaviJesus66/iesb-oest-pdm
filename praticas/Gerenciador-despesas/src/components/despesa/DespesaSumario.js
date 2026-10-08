import { StyleSheet, Text, View } from 'react-native';

const LIMITE_ALERTA = 200;

function DespesaSumario({ despesas, periodo }) {
  const somaDespesas = despesas.reduce(
    (acumulador, item) => acumulador + item.valor,
    0
  );

  return (
    <View style={styles.container}>
      <Text style={styles.periodo}>{periodo}</Text>
      <Text style={[styles.soma, somaDespesas > LIMITE_ALERTA && styles.somaAlta]}>
        R$ {somaDespesas.toFixed(2)}
      </Text>
    </View>
  );
}

export default DespesaSumario;

const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: '#e0e0ff',
    borderRadius: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  periodo: {
    fontSize: 14,
    color: '#3f3a8c',
  },
  soma: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3f3a8c',
  },
  // Desafio extra: acima de R$ 200,00 o valor fica vermelho
  somaAlta: {
    color: 'red',
  },
});
