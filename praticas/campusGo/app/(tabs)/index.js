import { ActivityIndicator, Alert, Button, FlatList, StyleSheet, Text, View } from 'react-native';
import { FadeIn } from '../../components/FadeIn';
import { useNotices } from '../../hooks/useNotices';
import { api } from '../../services/api';

export default function HomeScreen() {
  const { notices, isLoading, error, reload } = useNotices();

  // Bônus: cria um aviso (o JSONPlaceholder responde, mas não grava de verdade).
  async function handleCreate() {
    try {
      const created = await api.create('posts', {
        title: 'Novo aviso',
        body: 'Aviso criado pelo CampusGo.',
        userId: 1,
      });
      Alert.alert('Aviso criado', `A API devolveu o id ${created.id}.`);
    } catch (err) {
      Alert.alert('Erro', err.message);
    }
  }

  if (isLoading && notices.length === 0) {
    return <ActivityIndicator size="large" style={styles.loading} />;
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Não foi possível carregar: {error}</Text>
        <Button title="Tentar novamente" onPress={reload} />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.createButton}>
        <Button title="Criar aviso" onPress={handleCreate} />
      </View>
      <FlatList
        data={notices}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <NoticeCard notice={item} />}
        refreshing={isLoading}
        onRefresh={reload}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>Nenhum aviso.</Text>}
      />
    </View>
  );
}

/** Cartão simples para um aviso. */
function NoticeCard({ notice }) {
  return (
    <FadeIn>
      <View style={styles.card}>
        <Text style={styles.title}>{notice.title}</Text>
        <Text numberOfLines={2}>{notice.body}</Text>
      </View>
    </FadeIn>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  loading: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 24,
  },
  errorText: {
    textAlign: 'center',
  },
  createButton: {
    padding: 12,
  },
  list: {
    paddingHorizontal: 12,
    paddingBottom: 16,
    gap: 10,
  },
  card: {
    padding: 14,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e8',
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 6,
  },
  empty: {
    textAlign: 'center',
    marginTop: 32,
    color: '#666',
  },
});
