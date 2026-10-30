import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

/** Cria o canal (Android) e pede permissão. Devolve true se foi concedida. */
async function ensurePermission() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Lembretes',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  const { granted } = await Notifications.requestPermissionsAsync();
  return granted;
}

/** Agenda uma notificação LOCAL daqui a "seconds" segundos. */
export async function scheduleReminder(title, seconds) {
  if (!(await ensurePermission())) {
    return false;
  }

  const { TIME_INTERVAL } = Notifications.SchedulableTriggerInputTypes;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'CampusGo',
      body: `Não esqueça: ${title}`,
    },
    trigger: { type: TIME_INTERVAL, seconds },
  });
  return true;
}
