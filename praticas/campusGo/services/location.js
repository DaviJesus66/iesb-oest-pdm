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
