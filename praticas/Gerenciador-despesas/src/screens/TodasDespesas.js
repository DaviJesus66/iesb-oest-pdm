import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import DespesaSaida from '../components/despesa/DespesaSaida';
import CategoriaSeletor from '../components/despesa/CategoriaSeletor';
import { CATEGORIAS } from '../data/categorias';
import { useDespesas } from '../context/DespesasContext';

const TODAS = 'Todas';

// Retorna só as despesas da categoria escolhida (ou todas, se "Todas").
function filtrarPorCategoria(despesas, categoria) {
  if (categoria === TODAS) {
    return despesas;
  }
  return despesas.filter((despesa) => despesa.categoria === categoria);
}

function TodasDespesas() {
  const { despesas } = useDespesas();
  const [categoriaFiltro, setCategoriaFiltro] = useState(TODAS);

  const despesasFiltradas = filtrarPorCategoria(despesas, categoriaFiltro);
  const periodo = categoriaFiltro === TODAS ? 'Total' : categoriaFiltro;

  return (
    <View style={styles.container}>
      <View style={styles.filtro}>
        <CategoriaSeletor
          categorias={[TODAS, ...CATEGORIAS]}
          selecionada={categoriaFiltro}
          onSelecionar={setCategoriaFiltro}
        />
      </View>
      <DespesaSaida despesas={despesasFiltradas} periodo={periodo} />
    </View>
  );
}

export default TodasDespesas;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  filtro: {
    marginBottom: 12,
  },
});
