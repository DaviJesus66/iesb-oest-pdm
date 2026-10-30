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
