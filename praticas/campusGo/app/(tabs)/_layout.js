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
