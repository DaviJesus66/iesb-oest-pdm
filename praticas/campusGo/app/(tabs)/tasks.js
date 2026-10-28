import { useState } from 'react';
import { Alert, Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { DoneIcon } from '../../components/DoneIcon';
import { getCurrentPlace } from '../../services/location';
import { scheduleReminder } from '../../services/notifications';

export default function TasksScreen() {
  const [label, setLabel] = useState('Sem check-in');
  const [doneCount, setDoneCount] = useState(0);

  async function handleCheckIn() {
    try {
      const place = await getCurrentPlace();
      if (!place) {
        Alert.alert('Sem localização', 'Permissão negada.');
        return;
      }
      setLabel(place.label);
    } catch (error) {
      Alert.alert('Sem localização', 'Não foi possível obter o local agora.');
    }
  }

  async function handleReminder() {
    try {
      const scheduled = await scheduleReminder('Estudar', 10);
      if (scheduled) {
        Alert.alert('Lembrete agendado', 'Você será avisado em cerca de 10 segundos.');
      } else {
        Alert.alert('Sem permissão', 'Libere as notificações para receber lembretes.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível agendar o lembrete.');
    }
  }

  async function handleComplete() {
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      // Sem vibração (ex.: emulador): segue normalmente.
    }
    setDoneCount((count) => count + 1);
    Alert.alert('Tarefa concluída');
  }

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <Text style={styles.section}>Tarefas</Text>
      <Link href="/new-task" style={styles.link}>
        + Nova tarefa
      </Link>
      <Link href="/task/42" style={styles.link}>
        Abrir tarefa 42
      </Link>

      <Text style={styles.section}>Check-in</Text>
      <Button title="Estudei aqui" onPress={handleCheckIn} />
      <Text style={styles.result}>{label}</Text>

      <Text style={styles.section}>Lembrete</Text>
      <Button title="Lembrar em 10 s" onPress={handleReminder} />

      <Text style={styles.section}>Concluir</Text>
      <View style={styles.row}>
        <Button title="Concluir" onPress={handleComplete} />
        <DoneIcon trigger={doneCount}>
          <Ionicons name="checkmark-circle" size={40} color="#2e7d32" />
        </DoneIcon>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    padding: 20,
    gap: 12,
  },
  section: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 12,
  },
  link: {
    color: '#4757B8',
    fontSize: 16,
    paddingVertical: 4,
  },
  result: {
    color: '#444',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
});
