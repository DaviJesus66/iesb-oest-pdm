import { View, Text, Pressable, FlatList, StyleSheet } from "react-native";

// Recebe itens (array de compromissos), onDelete e onToggle (callbacks),
// além de tituloLista e listaVazia (rótulos vindos de labels.js via App.js).
// Usa FlatList (recomendado nas aulas em vez de ScrollView + .map para
// listas, pois só renderiza os itens visíveis na tela) com
// ListEmptyComponent para o estado de lista vazia.
export default function CompromissoList({
  itens,
  onDelete,
  onToggle,
  tituloLista,
  listaVazia,
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>{tituloLista}</Text>

      <FlatList
        style={styles.lista}
        data={itens}
        keyExtractor={(item) => item.id} // key estável (id, nunca index)
        contentContainerStyle={itens.length === 0 && styles.vazioContainer}
        ListEmptyComponent={
          <Text style={styles.vazioTexto}>{listaVazia}</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Pressable
              style={styles.itemTextoContainer}
              android_ripple={{ color: "#E0E0E0" }}
              onPress={() => onToggle(item.id)}
            >
              <Text
                style={[
                  styles.itemTexto,
                  item.concluido && styles.itemTextoConcluido,
                ]}
              >
                {item.texto}
              </Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.botaoRemover,
                pressed && styles.botaoRemoverPressionado,
              ]}
              android_ripple={{ color: "#C0392B" }}
              onPress={() => onDelete(item.id)}
            >
              <Text style={styles.botaoRemoverTexto}>Remover</Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // a área da lista ocupa o restante da tela
  },
  titulo: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#2B2D42",
  },
  lista: {
    flex: 1,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    marginBottom: 8,
    overflow: "hidden", // necessário para o ripple respeitar o borderRadius
  },
  itemTextoContainer: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  itemTexto: {
    fontSize: 15,
    color: "#2B2D42",
  },
  itemTextoConcluido: {
    textDecorationLine: "line-through",
    color: "#9A9A9A",
  },
  botaoRemover: {
    backgroundColor: "#E74C3C",
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  botaoRemoverPressionado: {
    backgroundColor: "#C0392B",
  },
  botaoRemoverTexto: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 13,
  },
  vazioContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  vazioTexto: {
    textAlign: "center",
    color: "#9A9A9A",
    fontSize: 14,
    paddingHorizontal: 24,
  },
});
