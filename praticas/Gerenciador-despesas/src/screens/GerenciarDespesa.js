import { useState } from 'react';
import { Alert, Button, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import CategoriaSeletor from '../components/despesa/CategoriaSeletor';
import { CATEGORIAS } from '../data/categorias';
import { useDespesas } from '../context/DespesasContext';

function getDataFormatada(data) {
  return data.getDate() + '/' + (data.getMonth() + 1) + '/' + data.getFullYear();
}

function GerenciarDespesa({ navigation }) {
  const { adicionarDespesa } = useDespesas();

  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [data, setData] = useState(new Date());
  const [categoria, setCategoria] = useState('');
  const [showPicker, setShowPicker] = useState(false);

  // Aceita no máximo 2 casas decimais (aceita vírgula do teclado e converte para ponto).
  function alterarValor(texto) {
    const normalizado = texto.replace(',', '.');
    if (/^\d*\.?\d{0,2}$/.test(normalizado)) {
      setValor(normalizado);
    }
  }

  function onChangeData(evento, dataSelecionada) {
    setShowPicker(false);
    if (dataSelecionada) {
      setData(dataSelecionada);
    }
  }

  function salvar() {
    const valorNumerico = parseFloat(valor);

    if (descricao.trim() === '' || isNaN(valorNumerico) || valorNumerico <= 0 || categoria === '') {
      Alert.alert(
        'Dados inválidos',
        'Preencha a descrição, um valor maior que zero e escolha uma categoria.'
      );
      return;
    }

    adicionarDespesa({
      id: Date.now().toString(),
      descricao: descricao.trim(),
      valor: valorNumerico,
      data,
      categoria,
    });
    navigation.goBack();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.rotulo}>Descrição</Text>
      <TextInput
        style={styles.input}
        value={descricao}
        onChangeText={setDescricao}
        placeholder="Ex.: Supermercado"
      />

      <Text style={styles.rotulo}>Valor (R$)</Text>
      <TextInput
        style={styles.input}
        value={valor}
        onChangeText={alterarValor}
        keyboardType="decimal-pad"
        maxLength={10}
        placeholder="0.00"
      />

      <Text style={styles.rotulo}>Data</Text>
      <Pressable style={styles.input} onPress={() => setShowPicker(true)}>
        <Text>{getDataFormatada(data)}</Text>
      </Pressable>
      {showPicker && (
        <DateTimePicker value={data} mode="date" onChange={onChangeData} />
      )}

      <Text style={styles.rotulo}>Categoria</Text>
      <CategoriaSeletor
        categorias={CATEGORIAS}
        selecionada={categoria}
        onSelecionar={setCategoria}
      />

      <View style={styles.botao}>
        <Button title="Salvar" onPress={salvar} />
      </View>
    </View>
  );
}

export default GerenciarDespesa;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  rotulo: {
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d4d4d8',
    borderRadius: 6,
    padding: 10,
    backgroundColor: '#fff',
  },
  botao: {
    marginTop: 32,
  },
});
