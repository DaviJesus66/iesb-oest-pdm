import { useState, useEffect } from "react";
import { StyleSheet, Text, View, Image, Alert, StatusBar } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

import * as labels from "./labels";
import CompromissoInput from "./components/CompromissoInput";
import CompromissoList from "./components/CompromissoList";

const STORAGE_KEY = "@rotina_iesb_compromissos";

export default function App() {
  const [texto, setTexto] = useState("");

  const [compromissos, setCompromissos] = useState([]);

  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregarCompromissos() {
      try {
        const dados = await AsyncStorage.getItem(STORAGE_KEY);
        if (dados) {
          setCompromissos(JSON.parse(dados));
        }
      } catch (erro) {
        Alert.alert(
          "Erro ao carregar",
          "Não foi possível carregar seus compromissos salvos."
        );
      } finally {
        setCarregando(false);
      }
    }

    carregarCompromissos();
  }, []);

  useEffect(() => {
    if (carregando) return; 

    async function salvarCompromissos() {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(compromissos));
      } catch (erro) {
        Alert.alert(
          "Erro ao salvar",
          "Não foi possível salvar seus compromissos. Tente novamente."
        );
      }
    }

    salvarCompromissos();
  }, [compromissos, carregando]);

  function adicionarCompromisso() {
    const textoLimpo = texto.trim();

    if (textoLimpo.length === 0) {
      Alert.alert("Campo vazio", "Digite um compromisso antes de adicionar.");
      return;
    }

    const novoCompromisso = {
      id: Date.now().toString(), 
      texto: textoLimpo,
      criadoEm: new Date().toISOString(),
      concluido: false,
    };

    setCompromissos((atual) => [...atual, novoCompromisso]);
    setTexto("");
  }

  function removerCompromisso(id) {
    setCompromissos((atual) => atual.filter((item) => item.id !== id));
  }

  function alternarConcluido(id) {
    setCompromissos((atual) =>
      atual.map((item) =>
        item.id === id ? { ...item, concluido: !item.concluido } : item
      )
    );
  }

  const pendentes = compromissos.filter((item) => !item.concluido).length;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />

        {/* Cabeçalho: Image local + título + contador de pendentes */}
        <View style={styles.header}>
          <Image
            source={require("./assets/logo.png")}
            style={styles.logo}
          />
          <View>
            <Text style={styles.headerTitulo}>{labels.tituloApp}</Text>
            <Text style={styles.headerContador}>
              {pendentes} {labels.contadorPendentesSufixo}
            </Text>
          </View>
        </View>

        {/* Área de cadastro (row: TextInput + botão) */}
        <CompromissoInput
          value={texto}
          onChangeText={setTexto}
          onAdd={adicionarCompromisso}
          labels={labels}
        />

        {/* Área da lista (flex: 1, ocupa o restante da tela) */}
        <CompromissoList
          itens={compromissos}
          onDelete={removerCompromisso}
          onToggle={alternarConcluido}
          tituloLista={labels.tituloLista}
          listaVazia={labels.listaVazia}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F5F5F7",
  },
  header: {
    flexDirection: "row", 
    alignItems: "center", 
    marginBottom: 16,
  },
  logo: {
    width: 44,
    height: 44,
    borderRadius: 8,
    marginRight: 12,
  },
  headerTitulo: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2B2D42",
  },
  headerContador: {
    fontSize: 13,
    color: "#6B6B76",
    marginTop: 2,
  },
});
