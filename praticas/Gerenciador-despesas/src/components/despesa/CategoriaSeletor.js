import { Pressable, StyleSheet, Text, View } from 'react-native';

// Chips de categoria lado a lado (usado no formulário e no filtro).
function CategoriaSeletor({ categorias, selecionada, onSelecionar }) {
  return (
    <View style={styles.container}>
      {categorias.map((categoria) => {
        const ativa = categoria === selecionada;
        return (
          <Pressable
            key={categoria}
            onPress={() => onSelecionar(categoria)}
            style={({ pressed }) => [
              styles.chip,
              ativa && styles.chipAtivo,
              pressed && styles.pressed,
            ]}
          >
            <Text style={[styles.texto, ativa && styles.textoAtivo]}>
              {categoria}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export default CategoriaSeletor;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#e4e4e7',
  },
  chipAtivo: {
    backgroundColor: '#5b4fc4',
  },
  texto: {
    color: '#27272a',
    fontSize: 13,
  },
  textoAtivo: {
    color: '#fff',
    fontWeight: 'bold',
  },
  pressed: {
    opacity: 0.6,
  },
});
