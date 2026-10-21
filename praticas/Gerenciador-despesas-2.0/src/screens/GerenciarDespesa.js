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
