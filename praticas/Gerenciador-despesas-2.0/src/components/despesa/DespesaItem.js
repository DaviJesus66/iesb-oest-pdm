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
