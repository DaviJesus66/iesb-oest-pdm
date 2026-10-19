#!/bin/bash
# Cria os arquivos do Gerenciador de Despesas 2.0. Rode DENTRO da pasta do projeto Expo.
if [ ! -f package.json ] || [ ! -f app.json ]; then echo "ERRO: rode este script dentro da pasta do projeto Expo (onde estao package.json e app.json)."; exit 1; fi
cat > "App.js" <<'EOF_ARQUIVO'
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import DespesasRecentes from './src/screens/DespesasRecentes';
import TodasDespesas from './src/screens/TodasDespesas';
import GerenciarDespesa from './src/screens/GerenciarDespesa';
import IconButton from './src/components/IconButton';
import { ExpensesContextProvider } from './src/store/expenses-context';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function BottomTabScreen() {
  return (
    <Tab.Navigator
      screenOptions={({ navigation }) => ({
        headerRight: ({ tintColor }) => (
          <IconButton
            icon="add"
            size={24}
            color={tintColor}
            onPress={() => navigation.navigate('GerenciarDespesa')}
          />
        ),
      })}
    >
      <Tab.Screen
        name="DespesasRecentes"
        component={DespesasRecentes}
        options={{
          title: 'Despesas Recentes',
          tabBarLabel: 'Recentes',
          tabBarLabelStyle: { fontSize: 12 },
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="hourglass" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="TodasDespesas"
        component={TodasDespesas}
        options={{
          title: 'Todas as Despesas',
          tabBarLabel: 'Todas',
          tabBarLabelStyle: { fontSize: 12 },
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="wallet-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const colorScheme = useColorScheme();

  return (
    <ExpensesContextProvider>
      <StatusBar style="auto" />
      <NavigationContainer theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack.Navigator>
          <Stack.Screen
            name="Despesas"
            component={BottomTabScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="GerenciarDespesa" component={GerenciarDespesa} />
        </Stack.Navigator>
      </NavigationContainer>
    </ExpensesContextProvider>
  );
}
EOF_ARQUIVO
mkdir -p "src/components"
cat > "src/components/IconButton.js" <<'EOF_ARQUIVO'
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

function IconButton({ icon, size, color, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => pressed && styles.pressed}
    >
      <View style={styles.buttonContainer}>
        <Ionicons name={icon} size={size} color={color} />
      </View>
    </Pressable>
  );
}

export default IconButton;

const styles = StyleSheet.create({
  buttonContainer: {
    padding: 10,
  },
  pressed: {
    opacity: 0.5,
  },
});
EOF_ARQUIVO
mkdir -p "src/components/despesa"
cat > "src/components/despesa/CategoriaFiltro.js" <<'EOF_ARQUIVO'
import { Pressable, ScrollView, StyleSheet, Text, useColorScheme } from 'react-native';
import { getTheme } from '../../constants/theme';

// Chips de categoria para filtrar a lista (bônus).
function CategoriaFiltro({ categories, selected, onSelect }) {
  const theme = getTheme(useColorScheme());

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.container}
      style={styles.scroll}
    >
      {categories.map((category) => {
        const active = category === selected;
        return (
          <Pressable
            key={category}
            onPress={() => onSelect(category)}
            style={({ pressed }) => [
              styles.chip,
              { backgroundColor: active ? theme.primary : theme.chip },
              pressed && styles.pressed,
            ]}
          >
            <Text
              style={[
                styles.text,
                { color: active ? theme.onPrimary : theme.chipText },
                active && styles.textActive,
              ]}
            >
              {category}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

export default CategoriaFiltro;

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 0,
    marginBottom: 12,
  },
  container: {
    gap: 8,
  },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 16,
  },
  pressed: {
    opacity: 0.6,
  },
  text: {
    fontSize: 13,
  },
  textActive: {
    fontWeight: 'bold',
  },
});
EOF_ARQUIVO
mkdir -p "src/components/despesa"
cat > "src/components/despesa/DespesaItem.js" <<'EOF_ARQUIVO'
import { Platform, Pressable, StyleSheet, Text, View, useColorScheme } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getTheme } from '../../constants/theme';
import { formatCurrency, formatDate } from '../../utils/format';

function DespesaItem({ id, description, amount, date, category }) {
  const navigation = useNavigation();
  const theme = getTheme(useColorScheme());

  function handlePress() {
    navigation.navigate('GerenciarDespesa', { expenseId: id });
  }

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: theme.card },
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.info}>
        <Text style={[styles.description, { color: theme.text }]}>{description}</Text>
        <View style={styles.row}>
          <Text style={[styles.date, { color: theme.textSecondary }]}>
            {formatDate(date)}
          </Text>
          <Text style={[styles.tag, { backgroundColor: theme.chip, color: theme.chipText }]}>
            {category}
          </Text>
        </View>
      </View>
      <Text style={[styles.amount, { color: theme.primary }]}>
        {formatCurrency(amount)}
      </Text>
    </Pressable>
  );
}

export default DespesaItem;

const styles = StyleSheet.create({
  card: {
    padding: 14,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  pressed: {
    opacity: 0.7,
  },
  info: {
    flex: 1,
    marginRight: 12,
  },
  description: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  date: {
    fontSize: 13,
  },
  tag: {
    fontSize: 12,
    paddingVertical: 2,
    paddingHorizontal: 10,
    borderRadius: 12,
    overflow: 'hidden',
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
EOF_ARQUIVO
mkdir -p "src/components/despesa"
cat > "src/components/despesa/DespesaLista.js" <<'EOF_ARQUIVO'
import { FlatList, StyleSheet, Text, View, useColorScheme, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DespesaItem from './DespesaItem';
import { getTheme } from '../../constants/theme';

function DespesaLista({ expenses }) {
  const theme = getTheme(useColorScheme());
  const { width } = useWindowDimensions();
  // Bônus: 2 colunas em tablet ou celular deitado.
  const numColumns = width > 600 ? 2 : 1;

  return (
    <FlatList
      key={numColumns}
      data={expenses}
      numColumns={numColumns}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={{ flex: 1 / numColumns, padding: 6 }}>
          <DespesaItem {...item} />
        </View>
      )}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.content}
      ListEmptyComponent={
        <View style={styles.empty}>
          <Ionicons name="receipt-outline" size={56} color={theme.textSecondary} />
          <Text style={[styles.emptyTitle, { color: theme.text }]}>Nenhuma despesa</Text>
          <Text style={[styles.emptyHint, { color: theme.textSecondary }]}>
            Toque em + para adicionar uma nova.
          </Text>
        </View>
      }
    />
  );
}

export default DespesaLista;

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    paddingTop: 6,
    paddingBottom: 16,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 48,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyHint: {
    fontSize: 14,
  },
});
EOF_ARQUIVO
mkdir -p "src/components/despesa"
cat > "src/components/despesa/DespesaSaida.js" <<'EOF_ARQUIVO'
import { StyleSheet, View } from 'react-native';
import DespesaSumario from './DespesaSumario';
import DespesaLista from './DespesaLista';

function DespesaSaida({ expenses, label }) {
  return (
    <View style={styles.container}>
      <DespesaSumario expenses={expenses} label={label} />
      <DespesaLista expenses={expenses} />
    </View>
  );
}

export default DespesaSaida;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
EOF_ARQUIVO
mkdir -p "src/components/despesa"
cat > "src/components/despesa/DespesaSumario.js" <<'EOF_ARQUIVO'
import { StyleSheet, Text, View, useColorScheme } from 'react-native';
import { getTheme } from '../../constants/theme';
import { formatCurrency } from '../../utils/format';

function DespesaSumario({ expenses, label }) {
  const theme = getTheme(useColorScheme());

  const total = expenses.reduce((acumulador, item) => acumulador + item.amount, 0);
  const quantidade = expenses.length;

  return (
    <View style={[styles.container, { backgroundColor: theme.summary }]}>
      <View>
        <Text style={[styles.label, { color: theme.summaryText }]}>{label}</Text>
        <Text style={[styles.count, { color: theme.summaryText }]}>
          {quantidade} {quantidade === 1 ? 'despesa' : 'despesas'}
        </Text>
      </View>
      <Text style={[styles.total, { color: theme.summaryText }]}>
        {formatCurrency(total)}
      </Text>
    </View>
  );
}

export default DespesaSumario;

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  count: {
    fontSize: 12,
    marginTop: 2,
  },
  total: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
EOF_ARQUIVO
mkdir -p "src/constants"
cat > "src/constants/categories.js" <<'EOF_ARQUIVO'
export const CATEGORIES = ['Alimentação', 'Transporte', 'Lazer', 'Contas'];
EOF_ARQUIVO
mkdir -p "src/constants"
cat > "src/constants/theme.js" <<'EOF_ARQUIVO'
export const lightTheme = {
  background: '#f4f4f8',
  card: '#ffffff',
  text: '#1f1f2e',
  textSecondary: '#6b6b80',
  primary: '#5b4fc4',
  onPrimary: '#ffffff',
  border: '#d4d4dc',
  error: '#d32f2f',
  input: '#ffffff',
  summary: '#e0e0ff',
  summaryText: '#3f3a8c',
  chip: '#e4e4e7',
  chipText: '#27272a',
  overlay: 'rgba(0, 0, 0, 0.4)',
};

export const darkTheme = {
  background: '#121218',
  card: '#1e1e2a',
  text: '#f2f2f7',
  textSecondary: '#a0a0b4',
  primary: '#9a90f5',
  onPrimary: '#121218',
  border: '#3a3a4a',
  error: '#ff6b6b',
  input: '#1e1e2a',
  summary: '#2a2850',
  summaryText: '#d6d3ff',
  chip: '#2c2c3a',
  chipText: '#e4e4ee',
  overlay: 'rgba(0, 0, 0, 0.6)',
};

// Recebe o valor de useColorScheme() ('light', 'dark' ou null).
export function getTheme(colorScheme) {
  return colorScheme === 'dark' ? darkTheme : lightTheme;
}
EOF_ARQUIVO
mkdir -p "src/hooks"
cat > "src/hooks/useDebounce.js" <<'EOF_ARQUIVO'
import { useEffect, useState } from 'react';

// Devolve o valor só depois que ele parar de mudar por "delay" milissegundos.
function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
EOF_ARQUIVO
mkdir -p "src/screens"
cat > "src/screens/DespesasRecentes.js" <<'EOF_ARQUIVO'
import { useMemo } from 'react';
import { StyleSheet, View, useColorScheme } from 'react-native';
import DespesaSaida from '../components/despesa/DespesaSaida';
import { getTheme } from '../constants/theme';
import { useExpenses } from '../store/expenses-context';
import { endOfDay, startOfDay } from '../utils/format';

function DespesasRecentes() {
  const theme = getTheme(useColorScheme());
  const { expenses } = useExpenses();

  // Últimos 7 dias, sem despesas futuras.
  const recentExpenses = useMemo(() => {
    const hoje = new Date();
    const limite = startOfDay(hoje);
    limite.setDate(limite.getDate() - 7);
    const fim = endOfDay(hoje);

    return expenses
      .filter((expense) => {
        const data = new Date(expense.date);
        return data >= limite && data <= fim;
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [expenses]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <DespesaSaida expenses={recentExpenses} label="Últimos 7 dias" />
    </View>
  );
}

export default DespesasRecentes;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
  },
});
EOF_ARQUIVO
mkdir -p "src/screens"
cat > "src/screens/GerenciarDespesa.js" <<'EOF_ARQUIVO'
import { useLayoutEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useColorScheme,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import IconButton from '../components/IconButton';
import { CATEGORIES } from '../constants/categories';
import { getTheme } from '../constants/theme';
import { useExpenses } from '../store/expenses-context';
import { endOfDay, formatDate } from '../utils/format';

// Devolve um objeto com uma mensagem para cada campo inválido.
function validate(values) {
  const errors = {};

  if (values.description.trim().length < 3) {
    errors.description = 'A descrição deve ter no mínimo 3 caracteres.';
  }

  const amount = parseFloat(values.amount);
  if (isNaN(amount) || amount <= 0) {
    errors.amount = 'O valor deve ser maior que zero.';
  }

  if (values.date > endOfDay(new Date())) {
    errors.date = 'A data não pode ser futura.';
  }

  if (!values.category) {
    errors.category = 'Escolha uma categoria.';
  }

  return errors;
}

function GerenciarDespesa({ navigation, route }) {
  const theme = getTheme(useColorScheme());
  const { expenses, addExpense, updateExpense, deleteExpense } = useExpenses();

  const expenseId = route.params?.expenseId;
  const isEditing = Boolean(expenseId);

  const [form, setForm] = useState(() => {
    const existing = expenses.find((expense) => expense.id === expenseId);
    if (existing) {
      return {
        description: existing.description,
        amount: String(existing.amount),
        date: new Date(existing.date),
        category: existing.category,
      };
    }
    return { description: '', amount: '', date: new Date(), category: '' };
  });
  const [errors, setErrors] = useState({});
  const [showPicker, setShowPicker] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  function handleChange(field, value) {
    const next = { ...form, [field]: value };
    setForm(next);

    // Se o campo já estava com erro, revalida: a mensagem some ao corrigir.
    if (errors[field]) {
      setErrors({ ...errors, [field]: validate(next)[field] });
    }
  }

  function handleAmountChange(text) {
    const normalized = text.replace(',', '.');
    if (/^\d*\.?\d{0,2}$/.test(normalized)) {
      handleChange('amount', normalized);
    }
  }

  function handleDateChange(event, selectedDate) {
    setShowPicker(Platform.OS === 'ios');
    if (selectedDate) {
      handleChange('date', selectedDate);
    }
  }

  function handleSave() {
    const foundErrors = validate(form);
    setErrors(foundErrors);
    if (Object.keys(foundErrors).length > 0) {
      return;
    }

    const data = {
      description: form.description.trim(),
      amount: parseFloat(form.amount),
      date: form.date.toISOString(),
      category: form.category,
    };

    if (isEditing) {
      updateExpense(expenseId, data);
    } else {
      addExpense(data);
    }
    navigation.goBack();
  }

  function handleDelete() {
    Alert.alert('Excluir despesa', 'Tem certeza que deseja excluir esta despesa?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () => {
          deleteExpense(expenseId);
          navigation.goBack();
        },
      },
    ]);
  }

  // Título dinâmico e botão de excluir (só no modo edição).
  useLayoutEffect(() => {
    navigation.setOptions({
      title: isEditing ? 'Editar despesa' : 'Nova despesa',
      headerRight: isEditing
        ? () => (
            <IconButton
              icon="trash-outline"
              size={24}
              color={theme.error}
              onPress={handleDelete}
            />
          )
        : undefined,
    });
  }, [navigation, isEditing]);

  function inputStyle(field) {
    return [
      styles.input,
      {
        backgroundColor: theme.input,
        borderColor: errors[field] ? theme.error : theme.border,
        color: theme.text,
      },
    ];
  }

  function renderError(field) {
    return errors[field] ? (
      <Text style={[styles.error, { color: theme.error }]}>{errors[field]}</Text>
    ) : null;
  }

  return (
    <KeyboardAvoidingView
      style={[styles.flex, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[styles.label, { color: theme.text }]}>Descrição</Text>
        <TextInput
          style={inputStyle('description')}
          value={form.description}
          onChangeText={(text) => handleChange('description', text)}
          placeholder="Ex.: Almoço"
          placeholderTextColor={theme.textSecondary}
        />
        {renderError('description')}

        <Text style={[styles.label, { color: theme.text }]}>Valor (R$)</Text>
        <TextInput
          style={inputStyle('amount')}
          value={form.amount}
          onChangeText={handleAmountChange}
          keyboardType="decimal-pad"
          maxLength={10}
          placeholder="0.00"
          placeholderTextColor={theme.textSecondary}
        />
        {renderError('amount')}

        <Text style={[styles.label, { color: theme.text }]}>Data</Text>
        <Pressable style={inputStyle('date')} onPress={() => setShowPicker(true)}>
          <Text style={{ color: theme.text }}>{formatDate(form.date)}</Text>
        </Pressable>
        {showPicker && (
          <DateTimePicker value={form.date} mode="date" onChange={handleDateChange} />
        )}
        {renderError('date')}

        <Text style={[styles.label, { color: theme.text }]}>Categoria</Text>
        <Pressable
          style={[inputStyle('category'), styles.selectRow]}
          onPress={() => setModalVisible(true)}
        >
          <Text style={{ color: form.category ? theme.text : theme.textSecondary }}>
            {form.category || 'Selecione uma categoria'}
          </Text>
          <Ionicons name="chevron-down" size={18} color={theme.textSecondary} />
        </Pressable>
        {renderError('category')}

        <Pressable
          onPress={handleSave}
          style={({ pressed }) => [
            styles.saveButton,
            { backgroundColor: theme.primary },
            pressed && styles.pressed,
          ]}
        >
          <Text style={[styles.saveText, { color: theme.onPrimary }]}>Salvar</Text>
        </Pressable>
      </ScrollView>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={[styles.overlay, { backgroundColor: theme.overlay }]}
          onPress={() => setModalVisible(false)}
        >
          <Pressable style={[styles.sheet, { backgroundColor: theme.card }]} onPress={() => {}}>
            <Text style={[styles.sheetTitle, { color: theme.text }]}>
              Escolha a categoria
            </Text>
            {CATEGORIES.map((category) => (
              <Pressable
                key={category}
                style={({ pressed }) => [styles.option, pressed && styles.pressed]}
                onPress={() => {
                  handleChange('category', category);
                  setModalVisible(false);
                }}
              >
                <Text style={{ color: theme.text, fontSize: 16 }}>{category}</Text>
                {form.category === category && (
                  <Ionicons name="checkmark" size={20} color={theme.primary} />
                )}
              </Pressable>
            ))}
          </Pressable>
        </Pressable>
      </Modal>
    </KeyboardAvoidingView>
  );
}

export default GerenciarDespesa;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
  },
  selectRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  error: {
    fontSize: 12,
    marginTop: 4,
  },
  saveButton: {
    marginTop: 32,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  pressed: {
    opacity: 0.6,
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    padding: 16,
    paddingBottom: 32,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
});
EOF_ARQUIVO
mkdir -p "src/screens"
cat > "src/screens/TodasDespesas.js" <<'EOF_ARQUIVO'
import { useMemo, useState } from 'react';
import { Alert, StyleSheet, TextInput, View, useColorScheme } from 'react-native';
import DespesaSaida from '../components/despesa/DespesaSaida';
import CategoriaFiltro from '../components/despesa/CategoriaFiltro';
import IconButton from '../components/IconButton';
import { CATEGORIES } from '../constants/categories';
import { getTheme } from '../constants/theme';
import useDebounce from '../hooks/useDebounce';
import { useExpenses } from '../store/expenses-context';

const ALL = 'Todas';

function TodasDespesas() {
  const theme = getTheme(useColorScheme());
  const { expenses, clearExpenses } = useExpenses();

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(ALL);
  const debouncedSearch = useDebounce(search, 300);

  // Busca (sem diferenciar maiúsculas) combinada com o filtro de categoria.
  const filteredExpenses = useMemo(() => {
    const term = debouncedSearch.trim().toLowerCase();
    return expenses
      .filter(
        (expense) =>
          (category === ALL || expense.category === category) &&
          expense.description.toLowerCase().includes(term)
      )
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [expenses, debouncedSearch, category]);

  function handleClearAll() {
    Alert.alert(
      'Limpar tudo',
      'Isso apaga todas as despesas. Deseja continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Limpar tudo', style: 'destructive', onPress: clearExpenses },
      ]
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.searchRow}>
        <TextInput
          style={[
            styles.search,
            { backgroundColor: theme.input, borderColor: theme.border, color: theme.text },
          ]}
          value={search}
          onChangeText={setSearch}
          placeholder="Buscar por descrição"
          placeholderTextColor={theme.textSecondary}
          autoCorrect={false}
        />
        {expenses.length > 0 && (
          <IconButton
            icon="trash-outline"
            size={24}
            color={theme.error}
            onPress={handleClearAll}
          />
        )}
      </View>

      <CategoriaFiltro
        categories={[ALL, ...CATEGORIES]}
        selected={category}
        onSelect={setCategory}
      />

      <DespesaSaida expenses={filteredExpenses} label="Total" />
    </View>
  );
}

export default TodasDespesas;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  search: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
});
EOF_ARQUIVO
mkdir -p "src/store"
cat > "src/store/expenses-context.js" <<'EOF_ARQUIVO'
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
mkdir -p "src/utils"
cat > "src/utils/format.js" <<'EOF_ARQUIVO'
export function formatDate(date) {
  const d = new Date(date);
  const dia = String(d.getDate()).padStart(2, '0');
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  return `${dia}/${mes}/${d.getFullYear()}`;
}

export function formatCurrency(value) {
  return `R$ ${value.toFixed(2)}`;
}

export function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function endOfDay(date) {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}
EOF_ARQUIVO
sed -i 's/"userInterfaceStyle": *"light"/"userInterfaceStyle": "automatic"/' app.json
echo ""
echo "Pronto! Arquivos criados:"
find App.js src -type f | sort
