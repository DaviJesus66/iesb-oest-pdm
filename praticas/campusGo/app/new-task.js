import { router } from 'expo-router';
import { Button, StyleSheet, Text, View } from 'react-native';

/** Modal de nova tarefa. */
export default function NewTaskScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Nova tarefa</Text>
      <Button title="Fechar" onPress={() => router.back()} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
});
