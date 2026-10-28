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
