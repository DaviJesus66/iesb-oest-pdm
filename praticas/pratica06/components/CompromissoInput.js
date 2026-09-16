import { View, TextInput, Pressable, Text, StyleSheet } from "react-native";

// Componente controlado: quem guarda o estado do texto é o App.js (pai).
// Recebe value/onChangeText para controlar o TextInput, onAdd para
// disparar o cadastro, e labels (objeto) com os textos vindos de labels.js.
export default function CompromissoInput({ value, onChangeText, onAdd, labels }) {
  return (
    <View style={styles.row}>
      <TextInput
        style={styles.input}
        placeholder={labels.placeholderCompromisso}
        value={value}
        onChangeText={onChangeText}
      />

      <Pressable
        style={({ pressed }) => [
          styles.botao,
          pressed && styles.botaoPressionado,
        ]}
        android_ripple={{ color: "#1F5FA8" }}
        onPress={onAdd}
      >
        <Text style={styles.botaoTexto}>{labels.botaoAdicionar}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row", // input e botão lado a lado
    alignItems: "center", // alinha verticalmente no centro da linha
    marginBottom: 12,
  },
  input: {
    width: "68%", // demonstração de largura percentual (~70%)
    borderWidth: 1,
    borderColor: "#C9C9D1",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#FFFFFF",
    marginRight: 8,
  },
  botao: {
    flex: 1, // ocupa o espaço restante da linha (~28-30%)
    backgroundColor: "#2A6FDB",
    borderRadius: 8,
    paddingVertical: 10,
    justifyContent: "center", // centraliza o texto dentro do botão
    alignItems: "center",
  },
  botaoPressionado: {
    backgroundColor: "#1F5FA8",
  },
  botaoTexto: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
});
