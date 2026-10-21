import { Appearance } from 'react-native';

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

// Botão de tema: alterna entre claro e escuro, valendo para o app inteiro.
// (useColorScheme passa a devolver o modo escolhido em todas as telas.)
export function toggleColorScheme(colorScheme) {
  Appearance.setColorScheme(colorScheme === 'dark' ? 'light' : 'dark');
}
