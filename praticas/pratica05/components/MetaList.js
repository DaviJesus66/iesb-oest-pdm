import { View, Text, Pressable, FlatList, StyleSheet } from "react-native";

// Recebe a lista de metas (metas), a função para remover uma meta pelo id
// (onDelete) e a função para marcar/desmarcar como concluída (onToggle -
// desafio opcional). A responsabilidade de MANIPULAR o array (filter/map)
// fica sempre no componente pai (App.js); aqui só disparamos os callbacks.
export default function MetaList({ metas, onDelete, onToggle }) {
  if (metas.length === 0) {
    return (
      <View style={styles.vazio}>
        <Text style={styles.vazioTexto}>
          Nenhuma meta cadastrada ainda. Adicione a primeira acima!
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={metas}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.lista}
      renderItem={({ item }) => (
        <View style={styles.item}>
          {/* Pressable no texto para marcar/desmarcar como concluída */}
          <Pressable
            style={styles.itemTextoContainer}
            android_ripple={{ color: "#E0E0E0" }}
            onPress={() => onToggle(item.id)}
          >
            <Text
              style={[
                styles.itemTexto,
                item.concluida && styles.itemTextoConcluido,
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
  );
}

const styles = StyleSheet.create({
  lista: {
    paddingBottom: 16,
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
  vazio: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  vazioTexto: {
    textAlign: "center",
    color: "#9A9A9A",
    fontSize: 14,
  },
});
