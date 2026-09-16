import { View, TextInput, Pressable, Text, StyleSheet } from "react-native";

export default function MetaInput({ value, onChangeText, onAdd }) {
  return (
    <View style={styles.row}>
      <TextInput
        style={styles.input}
        placeholder="Digite sua meta de estudo"
        value={value}
        onChangeText={onChangeText}
      />

      <Pressable
        style={({ pressed }) => [
          styles.botao,
          pressed && styles.botaoPressionado,
        ]}
        android_ripple={{ color: "#2766D1" }}
        onPress={onAdd}
      >
        <Text style={styles.botaoTexto}>Adicionar</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#C9C9D1",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#FFFFFF",
    marginRight: 8,
  },
  botao: {
    backgroundColor: "#3A86FF",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  botaoPressionado: {
    backgroundColor: "#2766D1",
  },
  botaoTexto: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
});
