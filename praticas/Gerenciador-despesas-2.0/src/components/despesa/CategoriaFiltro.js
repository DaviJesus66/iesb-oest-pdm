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
