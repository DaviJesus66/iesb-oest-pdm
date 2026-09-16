import { useState, useEffect } from "react";
import { StyleSheet, Text, View, Image, Alert, StatusBar } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

import MetaInput from "./components/MetaInput";
import MetaList from "./components/MetaList";

const STORAGE_KEY = "@metas_semestre";

export default function App() {
  const [texto, setTexto] = useState("");

  const [metas, setMetas] = useState([]);

  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregarMetas() {
      try {
        const dados = await AsyncStorage.getItem(STORAGE_KEY);
        if (dados) {
          setMetas(JSON.parse(dados));
        }
      } catch (erro) {
        Alert.alert(
          "Erro ao carregar",
          "Não foi possível carregar suas metas salvas."
        );
      } finally {
        setCarregando(false);
      }
    }

    carregarMetas();
  }, []);

  useEffect(() => {
    if (carregando) return;

    async function salvarMetas() {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(metas));
      } catch (erro) {
        Alert.alert(
          "Erro ao salvar",
          "Não foi possível salvar suas metas. Tente novamente."
        );
      }
    }

    salvarMetas();
  }, [metas, carregando]);

  function adicionarMeta() {
    const textoLimpo = texto.trim();

    if (textoLimpo.length === 0) {
      Alert.alert("Campo vazio", "Digite uma meta antes de adicionar.");
      return;
    }

    const novaMeta = {
      id: Date.now().toString(), // id único e estável (não usar index!)
      texto: textoLimpo,
      criadaEm: new Date().toISOString(),
      concluida: false,
    };

    setMetas((metasAtuais) => [...metasAtuais, novaMeta]);
    setTexto("");
  }

  function removerMeta(id) {
    setMetas((metasAtuais) => metasAtuais.filter((meta) => meta.id !== id));
  }

  function alternarConcluida(id) {
    setMetas((metasAtuais) =>
      metasAtuais.map((meta) =>
        meta.id === id ? { ...meta, concluida: !meta.concluida } : meta
      )
    );
  }

  const pendentes = metas.filter((meta) => !meta.concluida).length;
  const concluidas = metas.filter((meta) => meta.concluida).length;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />

        {/* Cabeçalho com imagem local + título + contador */}
        <View style={styles.header}>
          <Image
            source={require("./assets/icon.png")}
            style={styles.headerImage}
          />
          <View>
            <Text style={styles.headerTitle}>Metas do Semestre</Text>
            <Text style={styles.headerContador}>
              {pendentes} pendentes / {concluidas} concluídas
            </Text>
          </View>
        </View>

        <MetaInput value={texto} onChangeText={setTexto} onAdd={adicionarMeta} />

        <Text style={styles.listTitle}>Minhas metas</Text>
        <MetaList
          metas={metas}
          onDelete={removerMeta}
          onToggle={alternarConcluida}
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
  headerImage: {
    width: 44,
    height: 44,
    borderRadius: 8,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2B2D42",
  },
  headerContador: {
    fontSize: 13,
    color: "#6B6B76",
    marginTop: 2,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#2B2D42",
  },
});
