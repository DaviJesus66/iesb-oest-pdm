import { useState } from "react";
import { StyleSheet, Text, View, TextInput, Pressable, Switch, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  APP_TITLE,
  INPUT_PLACEHOLDER,
  BUTTON_TEXT,
  LIST_TITLE,
  SWITCH_LABEL,
} from "./labels";

const disciplinasIniciais = [
  { id: "1", nome: "Programação para Dispositivos Móveis" },
  { id: "2", nome: "Estrutura de Dados" },
  { id: "3", nome: "Banco de Dados II" },
  { id: "4", nome: "Engenharia de Software" },
];

export default function App() {
  const [textoDigitado, setTextoDigitado] = useState("");
  const [somenteObrigatorias, setSomenteObrigatorias] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Cabeçalho */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{APP_TITLE}</Text>
      </View>

      {/* Linha com TextInput + Botão (flexDirection: 'row') */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder={INPUT_PLACEHOLDER}
          value={textoDigitado}
          onChangeText={setTextoDigitado}
        />

        {/* Desafio opcional: Pressable no lugar de Button, com estilo
            diferente quando pressionado (usando função no style). */}
        <Pressable
          style={({ pressed }) => [
            styles.botao,
            pressed && styles.botaoPressionado,
          ]}
        >
          <Text style={styles.botaoTexto}>{BUTTON_TEXT}</Text>
        </Pressable>
      </View>

      {/* Desafio opcional: Switch "Mostrar apenas obrigatórias"
          (ainda sem lógica de filtro real, só guarda o estado). */}
      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>{SWITCH_LABEL}</Text>
        <Switch
          value={somenteObrigatorias}
          onValueChange={setSomenteObrigatorias}
        />
      </View>

      {/* Lista de disciplinas */}
      <Text style={styles.listTitle}>{LIST_TITLE}</Text>
      <View style={styles.list}>
        {disciplinasIniciais.map((disciplina) => (
          <View key={disciplina.id} style={styles.item}>
            <Text style={styles.itemTexto}>{disciplina.nome}</Text>
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    padding: 16,
    backgroundColor: "#F5F5F7",
  },

  header: {
    marginBottom: 16,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2B2D42",
  },

  inputRow: {
    flexDirection: "row", 
    alignItems: "center", 
    marginBottom: 12,
  },
  input: {
    width: "68%", 
    borderWidth: 1,
    borderColor: "#C9C9D1",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#FFFFFF",
    marginRight: 8,
  },
  botao: {
    flex: 1, 
    backgroundColor: "#3A86FF",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center", 
    justifyContent: "center",
  },
  botaoPressionado: {
    backgroundColor: "#2766D1", 
  },
  botaoTexto: {
    color: "#FFFFFF",
    fontWeight: "600",
  },

  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", 
    marginBottom: 16,
  },
  switchLabel: {
    fontSize: 14,
    color: "#2B2D42",
  },

  listTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#2B2D42",
  },
  list: {
    flex: 1, 
  },
  item: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  itemTexto: {
    fontSize: 15,
    color: "#2B2D42",
  },
});