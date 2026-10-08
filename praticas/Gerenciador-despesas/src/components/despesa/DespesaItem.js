import { StyleSheet, Text, View } from 'react-native';

function getDataFormatada(data) {
  return data.getDate() + '/' + (data.getMonth() + 1) + '/' + data.getFullYear();
}

function DespesaItem({ descricao, valor, data, categoria }) {
  return (
    <View style={styles.item}>
      <View style={styles.info}>
        <Text style={styles.descricao}>{descricao}</Text>
        <View style={styles.linhaDetalhe}>
          <Text style={styles.data}>{getDataFormatada(data)}</Text>
          <Text style={styles.categoria}>{categoria}</Text>
        </View>
      </View>
      <View style={styles.valorContainer}>
        <Text style={styles.valor}>R$ {valor.toFixed(2)}</Text>
      </View>
    </View>
  );
}

export default DespesaItem;

const styles = StyleSheet.create({
  item: {
    padding: 12,
    marginVertical: 6,
    backgroundColor: '#5b4fc4',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 8,
  },
  info: {
    flex: 1,
  },
  descricao: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 6,
  },
  linhaDetalhe: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  data: {
    color: '#e0e0ff',
  },
  // Tag da categoria: fundo cinza claro e bordas arredondadas
  categoria: {
    backgroundColor: '#e4e4e7',
    color: '#27272a',
    fontSize: 12,
    paddingVertical: 2,
    paddingHorizontal: 10,
    borderRadius: 12,
    overflow: 'hidden',
  },
  valorContainer: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    borderRadius: 4,
    minWidth: 90,
    alignItems: 'center',
  },
  valor: {
    color: '#5b4fc4',
    fontWeight: 'bold',
  },
});
