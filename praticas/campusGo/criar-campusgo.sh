#!/bin/bash
# Cria os arquivos do CampusGo. Rode DENTRO da pasta do projeto Expo (onde estao package.json e app.json).
if [ ! -f package.json ] || [ ! -f app.json ]; then echo "ERRO: rode este script dentro da pasta do projeto Expo."; exit 1; fi
mkdir -p "app/(tabs)"
cat > "app/(tabs)/_layout.js" <<'EOF_ARQUIVO'
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

/** Gera a função de ícone de cada aba. */
const tabIcon = (name) => ({ color, size }) => (
  <Ionicons name={name} color={color} size={size} />
);

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#4757B8' }}>
      <Tabs.Screen
        name="index"
        options={{ title: 'Início', tabBarIcon: tabIcon('home') }}
      />
      <Tabs.Screen
        name="tasks"
        options={{ title: 'Tarefas', tabBarIcon: tabIcon('checkbox') }}
      />
      <Tabs.Screen
        name="wallet"
        options={{ title: 'Bolso', tabBarIcon: tabIcon('wallet') }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: 'Perfil', tabBarIcon: tabIcon('person') }}
      />
    </Tabs>
  );
}
EOF_ARQUIVO
mkdir -p "app/(tabs)"
cat > "app/(tabs)/index.js" <<'EOF_ARQUIVO'
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
EOF_ARQUIVO
mkdir -p "app/(tabs)"
cat > "app/(tabs)/profile.js" <<'EOF_ARQUIVO'
import { useEffect, useState } from 'react';
import { Alert, Button, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { pickImage, takePhoto } from '../../services/media';

const PHOTO_KEY = '@profile-photo';

export default function ProfileScreen() {
  const [photoUri, setPhotoUri] = useState(null);

  // Ao abrir a tela: relê a foto salva.
  useEffect(() => {
    AsyncStorage.getItem(PHOTO_KEY)
      .then((saved) => {
        if (saved) {
          setPhotoUri(saved);
        }
      })
      .catch((error) => console.warn('Erro ao ler a foto:', error));
  }, []);

  async function savePhoto(uri) {
    if (!uri) {
      return;
    }
    setPhotoUri(uri);
    try {
      await AsyncStorage.setItem(PHOTO_KEY, uri);
    } catch (error) {
      console.warn('Erro ao salvar a foto:', error);
    }
  }

  async function handleChangePhoto() {
    try {
      await savePhoto(await pickImage());
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível abrir a galeria.');
    }
  }

  async function handleTakePhoto() {
    try {
      await savePhoto(await takePhoto());
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível abrir a câmera.');
    }
  }

  const avatar = photoUri ? { uri: photoUri } : require('../../assets/icon.png');

  return (
    <View style={styles.screen}>
      <Pressable onPress={handleChangePhoto}>
        <Image source={avatar} style={styles.avatar} />
      </Pressable>
      <Text style={styles.name}>Maria Souza</Text>
      <Text style={styles.course}>Engenharia de Software</Text>
      <Text style={styles.hint}>Toque na foto para escolher da galeria</Text>

      <View style={styles.buttons}>
        <Button title="Galeria" onPress={handleChangePhoto} />
        <Button title="Câmera" onPress={handleTakePhoto} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#e0e0ff',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
  },
  course: {
    color: '#666',
    marginTop: 4,
  },
  hint: {
    color: '#888',
    fontSize: 12,
    marginTop: 12,
  },
  buttons: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 24,
  },
});
EOF_ARQUIVO
mkdir -p "app/(tabs)"
cat > "app/(tabs)/tasks.js" <<'EOF_ARQUIVO'
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
EOF_ARQUIVO
mkdir -p "app/(tabs)"
cat > "app/(tabs)/wallet.js" <<'EOF_ARQUIVO'
import { Alert, Button, Share, StyleSheet, Text, View } from 'react-native';
import { useExpenses } from '../../store/expenses-context';

export default function WalletScreen() {
  const { expenses, addExpense } = useExpenses();
  const total = expenses.reduce((sum, item) => sum + item.amount, 0);

  async function shareSummary() {
    try {
      await Share.share({ message: `Gastei R$ ${total.toFixed(2)} neste semestre.` });
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível compartilhar o resumo.');
    }
  }

  // Cria uma despesa de exemplo para ver o total mudar (e persistir).
  function addSample() {
    addExpense({
      description: 'Despesa de exemplo',
      amount: 32.5,
      date: new Date().toISOString(),
      category: 'Outros',
    });
  }

  return (
    <View style={styles.screen}>
      <Text style={styles.label}>Total gasto</Text>
      <Text style={styles.total}>R$ {total.toFixed(2)}</Text>
      <Text style={styles.count}>
        {expenses.length} {expenses.length === 1 ? 'despesa' : 'despesas'}
      </Text>

      <View style={styles.buttons}>
        <Button title="Compartilhar resumo" onPress={shareSummary} />
        <Button title="Adicionar despesa de exemplo (R$ 32.50)" onPress={addSample} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  label: {
    fontSize: 16,
    color: '#666',
  },
  total: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#4757B8',
    marginVertical: 8,
  },
  count: {
    fontSize: 14,
    color: '#666',
    marginBottom: 32,
  },
  buttons: {
    gap: 12,
  },
});
EOF_ARQUIVO
mkdir -p "app"
cat > "app/_layout.js" <<'EOF_ARQUIVO'
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ExpensesContextProvider } from '../store/expenses-context';

/** Layout raiz: pilha principal do app. */
export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ExpensesContextProvider>
        <Stack screenOptions={{ headerTintColor: '#4757B8' }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="task/[id]" options={{ title: 'Tarefa' }} />
          <Stack.Screen
            name="new-task"
            options={{ presentation: 'modal', title: 'Nova tarefa' }}
          />
        </Stack>
      </ExpensesContextProvider>
    </SafeAreaProvider>
  );
}
EOF_ARQUIVO
mkdir -p "app"
cat > "app/new-task.js" <<'EOF_ARQUIVO'
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
EOF_ARQUIVO
mkdir -p "app/task"
cat > "app/task/[id].js" <<'EOF_ARQUIVO'
import { router, useLocalSearchParams } from 'expo-router';
import { Button, StyleSheet, Text, View } from 'react-native';

/** Detalhe de uma tarefa a partir do id da URL. */
export default function TaskDetails() {
  const { id } = useLocalSearchParams();

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Tarefa número {id}</Text>
      <Button title="Voltar" onPress={() => router.back()} />
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
EOF_ARQUIVO
mkdir -p "components"
cat > "components/DoneIcon.js" <<'EOF_ARQUIVO'
import { useEffect } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from 'react-native-reanimated';

/** Ícone que "pulsa" toda vez que o valor de "trigger" aumenta. */
export function DoneIcon({ trigger, children }) {
  const scale = useSharedValue(1);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  useEffect(() => {
    if (trigger > 0) {
      scale.value = withSequence(withSpring(1.3), withSpring(1));
    }
  }, [trigger]);

  return <Animated.View style={style}>{children}</Animated.View>;
}
EOF_ARQUIVO
mkdir -p "components"
cat > "components/FadeIn.js" <<'EOF_ARQUIVO'
import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

/** Faz o conteúdo surgir aos poucos (opacidade de 0 a 1). */
export function FadeIn({ children }) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [opacity]);

  return <Animated.View style={{ opacity }}>{children}</Animated.View>;
}
EOF_ARQUIVO
mkdir -p "hooks"
cat > "hooks/useNotices.js" <<'EOF_ARQUIVO'
import { useCallback, useEffect, useState } from 'react';
import { api } from '../services/api';

/** Busca avisos e controla carregamento e erro. */
export function useNotices() {
  const [notices, setNotices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      setNotices(await api.list('posts?_limit=10'));
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { notices, isLoading, error, reload: load };
}
EOF_ARQUIVO
mkdir -p "services"
cat > "services/api.js" <<'EOF_ARQUIVO'
const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

/** Faz uma requisição JSON e trata erros HTTP. */
async function request(path, options = {}) {
  if (!BASE_URL) {
    throw new Error('EXPO_PUBLIC_API_URL não está definida no .env.');
  }

  const response = await fetch(`${BASE_URL}/${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  // fetch não lança erro em 404/500: precisamos verificar.
  if (!response.ok) {
    throw new Error(`Erro HTTP ${response.status}`);
  }
  return response.json();
}

const send = (method, body) => ({ method, body: JSON.stringify(body) });

export const api = {
  list: (resource) => request(resource),
  create: (resource, body) => request(resource, send('POST', body)),
  update: (resource, id, body) => request(`${resource}/${id}`, send('PUT', body)),
  remove: (resource, id) => request(`${resource}/${id}`, { method: 'DELETE' }),
};
EOF_ARQUIVO
mkdir -p "services"
cat > "services/location.js" <<'EOF_ARQUIVO'
import * as Location from 'expo-location';

/** Retorna coordenadas e endereço aproximado do usuário (ou null sem permissão). */
export async function getCurrentPlace() {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    return null;
  }

  const { coords } = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });

  const [address] = await Location.reverseGeocodeAsync({
    latitude: coords.latitude,
    longitude: coords.longitude,
  });

  const label = address
    ? [address.street, address.district].filter(Boolean).join(' - ')
    : '';

  return {
    latitude: coords.latitude,
    longitude: coords.longitude,
    label: label || 'Local desconhecido',
  };
}
EOF_ARQUIVO
mkdir -p "services"
cat > "services/media.js" <<'EOF_ARQUIVO'
import * as ImagePicker from 'expo-image-picker';
import { Alert, Linking } from 'react-native';

/** Abre a galeria e devolve a URI da imagem (ou null se desistiu). */
export async function pickImage() {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    quality: 0.7,
  });
  return result.canceled ? null : result.assets[0].uri;
}

/** Pede permissão, abre a câmera e devolve a URI da foto (ou null). */
export async function takePhoto() {
  const { granted } = await ImagePicker.requestCameraPermissionsAsync();
  if (!granted) {
    Alert.alert('Permissão negada', 'Libere a câmera.', [
      { text: 'Agora não', style: 'cancel' },
      { text: 'Abrir ajustes', onPress: () => Linking.openSettings() },
    ]);
    return null;
  }
  const shot = await ImagePicker.launchCameraAsync({ quality: 0.7 });
  return shot.canceled ? null : shot.assets[0].uri;
}
EOF_ARQUIVO
mkdir -p "services"
cat > "services/notifications.js" <<'EOF_ARQUIVO'
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
EOF_ARQUIVO
mkdir -p "store"
cat > "store/expenses-context.js" <<'EOF_ARQUIVO'
import { createContext, useContext, useEffect, useReducer, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@expenses';

const ExpensesContext = createContext(null);

// Sempre devolve um NOVO array (sem push, splice ou alteração direta).
function expensesReducer(state, action) {
  switch (action.type) {
    case 'ADD':
      return [action.payload, ...state];
    case 'UPDATE':
      return state.map((expense) =>
        expense.id === action.payload.id
          ? { ...expense, ...action.payload.data }
          : expense
      );
    case 'DELETE':
      return state.filter((expense) => expense.id !== action.payload);
    case 'SET':
      return action.payload;
    default:
      return state;
  }
}

export function ExpensesContextProvider({ children }) {
  const [expenses, dispatch] = useReducer(expensesReducer, []);
  const [isLoaded, setIsLoaded] = useState(false);

  // Ao iniciar: carrega os dados salvos.
  useEffect(() => {
    async function loadExpenses() {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored !== null) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            dispatch({ type: 'SET', payload: parsed });
          }
        }
      } catch (error) {
        console.warn('Erro ao carregar as despesas:', error);
      } finally {
        setIsLoaded(true);
      }
    }
    loadExpenses();
  }, []);

  // A cada alteração: salva (só depois de carregar, para não apagar os dados).
  useEffect(() => {
    if (!isLoaded) {
      return;
    }
    async function saveExpenses() {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
      } catch (error) {
        console.warn('Erro ao salvar as despesas:', error);
      }
    }
    saveExpenses();
  }, [expenses, isLoaded]);

  function addExpense(data) {
    dispatch({ type: 'ADD', payload: { id: Date.now().toString(), ...data } });
  }

  function updateExpense(id, data) {
    dispatch({ type: 'UPDATE', payload: { id, data } });
  }

  function deleteExpense(id) {
    dispatch({ type: 'DELETE', payload: id });
  }

  function clearExpenses() {
    dispatch({ type: 'SET', payload: [] });
  }

  // Evita mostrar a lista vazia por um instante antes de ler o AsyncStorage.
  if (!isLoaded) {
    return null;
  }

  const value = { expenses, addExpense, updateExpense, deleteExpense, clearExpenses };

  return (
    <ExpensesContext.Provider value={value}>
      {children}
    </ExpensesContext.Provider>
  );
}

export function useExpenses() {
  const context = useContext(ExpensesContext);
  if (context === null) {
    throw new Error('useExpenses deve ser usado dentro de um ExpensesContextProvider.');
  }
  return context;
}
EOF_ARQUIVO
cat > .env.example <<'EOF_ARQUIVO'
EXPO_PUBLIC_API_URL=https://jsonplaceholder.typicode.com
EOF_ARQUIVO
[ -f .env ] || cp .env.example .env
# Expo Router: "main" no package.json e "scheme" no app.json
node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
pkg.main = 'expo-router/entry';
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
const app = JSON.parse(fs.readFileSync('app.json', 'utf8'));
app.expo.scheme = 'campusgo';
fs.writeFileSync('app.json', JSON.stringify(app, null, 2) + '\n');
"
# Remove os arquivos do template que o Expo Router substitui
rm -f App.js index.js
# O .env nunca vai para o repositório
grep -qx '.env' .gitignore 2>/dev/null || printf '\n# Variaveis de ambiente locais\n.env\n' >> .gitignore
echo ""
echo "Pronto! Arquivos criados:"
find app components hooks services store .env.example -type f | sort
echo ""
echo "package.json main:  $(node -p "require('./package.json').main")"
echo "app.json scheme:    $(node -p "require('./app.json').expo.scheme")"
