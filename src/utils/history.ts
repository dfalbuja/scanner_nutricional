import AsyncStorage from '@react-native-async-storage/async-storage';

const HISTORY_KEY = 'scan_history';

export async function addToHistory(product: any, code: string) {
  try {
    const historyJSON = await AsyncStorage.getItem(HISTORY_KEY);
    const history = historyJSON ? JSON.parse(historyJSON) : [];

    // Agregamos el code al objeto que se guarda
    const productWithCode = {
      ...product,
      code,
    };

    const newHistory = [productWithCode, ...history].slice(0, 10); // guardar últimos 10
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
  } catch (e) {
    console.error('Error guardando historial', e);
  }
}


export async function getHistory(): Promise<any[]> {
  try {
    const historyJSON = await AsyncStorage.getItem(HISTORY_KEY);
    return historyJSON ? JSON.parse(historyJSON) : [];
  } catch (e) {
    console.error('Error obteniendo historial', e);
    return [];
  }
}
